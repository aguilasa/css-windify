import { Tailwindify } from 'tailwindify-core';

// Simple demo of the Tailwindify core library
function runDemo() {
  console.log('Initializing Tailwindify Playground...');

  const tailwindify = new Tailwindify({ prefix: 'tw-' });

  const input = 'button';
  const output = tailwindify.process(input);

  console.log(`Input: "${input}"`);
  console.log(`Output: "${output}"`);
  console.log('Playground ready');
}

// Run the demo
runDemo();
