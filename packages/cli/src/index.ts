#!/usr/bin/env node

/**
 * CSSWindify CLI
 * A command-line tool for converting CSS to Tailwind CSS
 */

import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import { transformCssText, summarize, sortClasses } from '@css-windify/core';
import type { MatchCtx } from '@css-windify/core';

interface ApproximationThresholds {
  spacingPx?: number;
  fontPx?: number;
  radiiPx?: number;
}

const program = new Command();

program.name('css-windify').description('Convert CSS to Tailwind CSS classes').version('0.0.1');

program
  .argument('[files...]', 'CSS files to process (or use stdin if omitted)')
  .option('--strict', 'Enable strict mode (no approximation)', false)
  .option('--approximate', 'Enable approximation mode', false)
  .option('--thresholds.spacing <px>', 'Spacing approximation threshold in px', '2')
  .option('--thresholds.font <px>', 'Font size approximation threshold in px', '1')
  .option('--thresholds.radii <px>', 'Border radius approximation threshold in px', '2')
  .option('--version <version>', 'Tailwind version (auto|v3|v4)', 'auto')
  .option('--screens <screens>', 'Custom breakpoints (e.g., sm:640,md:768)', '')
  .option('--report <format>', 'Report format (json|markdown)', 'markdown')
  .option('--output <file>', 'Write output to file instead of stdout')
  .option(
    '--min-coverage <percentage>',
    'Minimum coverage percentage required (exit code 1 if not met)',
    '0'
  )
  .action(async (files: string[], options) => {
    try {
      // Parse thresholds
      const thresholds: ApproximationThresholds = {
        spacingPx: parseInt(options.thresholdsSpacing || '2', 10),
        fontPx: parseInt(options.thresholdsFont || '1', 10),
        radiiPx: parseInt(options.thresholdsRadii || '2', 10),
      };

      // Parse screens
      const screens: Record<string, number> = {};
      if (options.screens) {
        const screenPairs = options.screens.split(',');
        for (const pair of screenPairs) {
          const [name, value] = pair.split(':');
          if (name && value) {
            screens[name.trim()] = parseInt(value.trim(), 10);
          }
        }
      }

      // Create match context
      const ctx: MatchCtx = {
        theme: {},
        tokens: undefined,
        version: options.version === 'v3' || options.version === 'v4' ? options.version : 'v3',
        opts: {
          strict: options.strict,
          approximate: options.approximate,
          thresholds,
          screens:
            Object.keys(screens).length > 0
              ? screens
              : {
                  sm: 640,
                  md: 768,
                  lg: 1024,
                  xl: 1280,
                  '2xl': 1536,
                },
        },
      };

      let cssContent = '';
      let inputFiles: string[] = [];

      // Read from stdin or files
      if (files.length === 0) {
        // Read from stdin
        cssContent = await readStdin();
        inputFiles = ['<stdin>'];
      } else {
        // Expand glob patterns and read files
        for (const pattern of files) {
          const matches = await glob(pattern);
          inputFiles.push(...matches);
        }

        if (inputFiles.length === 0) {
          console.error(chalk.red('Error: No files found matching the pattern(s)'));
          process.exit(1);
        }

        // Read and concatenate all files
        const contents = inputFiles.map((file) => {
          try {
            return readFileSync(file, 'utf-8');
          } catch (err) {
            console.error(chalk.red(`Error reading file ${file}:`), err);
            process.exit(1);
          }
        });
        cssContent = contents.join('\n\n');
      }

      // Transform CSS
      const result = transformCssText(cssContent, ctx);

      // Generate summary
      const allResults = Object.values(result.bySelector);
      const summary = summarize(allResults);

      // Format output based on report type
      let output: string;
      if (options.report === 'json') {
        output = formatJson(result, summary, inputFiles);
      } else {
        output = formatMarkdown(result, summary, inputFiles, ctx);
      }

      // Write to file or stdout
      if (options.output) {
        try {
          writeFileSync(options.output, output, 'utf-8');
          console.error(chalk.green(`✓ Output written to ${options.output}`));
        } catch (err) {
          console.error(chalk.red(`Error writing to file ${options.output}:`), err);
          process.exit(1);
        }
      } else {
        console.log(output);
      }

      // Check minimum coverage and exit accordingly
      const minCoverage = parseFloat(options.minCoverage || '0');
      if (minCoverage > 0) {
        const actualCoverage = summary.stats.totals.percentage;
        if (actualCoverage < minCoverage) {
          console.error(
            chalk.red(`✗ Coverage ${actualCoverage.toFixed(1)}% is below minimum ${minCoverage}%`)
          );
          process.exit(1);
        } else {
          console.error(
            chalk.green(`✓ Coverage ${actualCoverage.toFixed(1)}% meets minimum ${minCoverage}%`)
          );
        }
      }
    } catch (err) {
      console.error(chalk.red('Error:'), err);
      process.exit(1);
    }
  });

program.parse();

/**
 * Read from stdin
 */
async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');

    process.stdin.on('data', (chunk) => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      resolve(data);
    });

    process.stdin.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Format results as JSON
 */
function formatJson(result: any, summary: any, inputFiles: string[]): string {
  const output = {
    meta: {
      files: inputFiles,
      timestamp: new Date().toISOString(),
    },
    results: Object.entries(result.bySelector).map(([selector, res]: [string, any]) => ({
      selector,
      classes: sortClasses(res.classes).join(' '),
      warnings: res.warnings,
      coverage: res.coverage,
    })),
    summary: {
      text: summary.text,
      stats: summary.stats,
    },
  };

  return JSON.stringify(output, null, 2);
}

/**
 * Format results as Markdown
 */
function formatMarkdown(result: any, summary: any, inputFiles: string[], ctx: MatchCtx): string {
  const lines: string[] = [];

  lines.push('# CSSWindify Conversion Report\n');

  // Input info
  lines.push('## Input');
  lines.push(`Files: ${inputFiles.join(', ')}`);
  lines.push(`Mode: ${ctx.opts.strict ? 'Strict' : 'Approximate'}`);
  lines.push(
    `Thresholds: spacing=${ctx.opts.thresholds.spacingPx}px, font=${ctx.opts.thresholds.fontPx}px, radii=${ctx.opts.thresholds.radiiPx}px`
  );
  lines.push('');

  // Results by selector
  lines.push('## Results by Selector\n');

  for (const [selector, res] of Object.entries(result.bySelector) as [string, any][]) {
    lines.push(`### ${selector}`);

    const orderedClasses = sortClasses(res.classes).join(' ');
    lines.push(`**Classes:** ${orderedClasses}`);

    if (res.warnings.length > 0) {
      lines.push('\n**Warnings:**');
      res.warnings.slice(0, 3).forEach((w: string) => {
        lines.push(`  - ${w}`);
      });
      if (res.warnings.length > 3) {
        lines.push(`  ... and ${res.warnings.length - 3} more`);
      }
    }

    lines.push(
      `\n*Coverage: ${res.coverage.percentage}% (${res.coverage.matched}/${res.coverage.total})*`
    );
    lines.push('');
  }

  // Summary
  lines.push('## Summary\n');
  lines.push(summary.text);

  return lines.join('\n');
}
