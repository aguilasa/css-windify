import { transformDeclarations, TransformResult, CssDeclaration, MatchCtx } from 'css-windify-core';

// Teste de tipos
const declarations: CssDeclaration[] = [
  { prop: 'margin', value: '1rem' },
  { prop: 'padding', value: '2rem' },
];

const ctx: MatchCtx = {
  theme: {},
  opts: {
    strict: false,
    approximate: true,
  },
};

const result: TransformResult = transformDeclarations(declarations, ctx);

// Verificar se os tipos estão corretos
console.log(`Classes: ${result.classes.join(', ')}`);
console.log(`Warnings: ${result.warnings.join(', ')}`);
console.log(`Coverage: ${result.coverage.matched}/${result.coverage.total}`);
