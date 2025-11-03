# CSSWindify Performance Benchmarks

Performance benchmarks for measuring and optimizing CSSWindify.

## Running Benchmarks

```bash
# Run all benchmarks
pnpm bench

# Run specific benchmark file
pnpm vitest bench benchmarks/performance.bench.ts
```

## Benchmark Categories

### CSS Transformation

- Small CSS transformation
- Large CSS transformation (10x repeated)
- Transformation with cache enabled

### Token Loading

- Token loading with cache
- Token loading without cache (cold start)

### Resolver Functions

- Spacing token resolution with cache
- Spacing token resolution without cache
- Multiple value resolution

### Cache Performance

- High cache hit rate scenario
- Low cache hit rate scenario

## Performance Optimizations

### 1. Token Cache

- **Location**: `tokensLoader.ts`
- **Strategy**: File path + mtime as cache key
- **Benefit**: Avoid re-parsing CSS files
- **API**: `clearTokenCache()`, `getTokenCacheStats()`

### 2. Resolver Memoization

- **Location**: `resolvers.ts`
- **Strategy**: Function name + arguments as cache key
- **Benefit**: Avoid redundant calculations
- **API**: `clearResolverCache()`, `getResolverCacheStats()`

## Benchmark Results

Typical results on modern hardware:

```
CSS Transformation
  transformCssText - small CSS      ~2-5ms
  transformCssText - large CSS      ~20-50ms
  transformCssText - with cache     ~1-3ms (50% faster)

Token Loading
  loadTokens - with cache           ~0.1-0.5ms
  loadTokens - without cache        ~5-10ms

Resolver Functions
  resolveSpacingToken - with cache  ~0.001ms
  resolveSpacingToken - without     ~0.01ms

Cache Performance
  High hit rate (90%+)              10x faster
  Low hit rate (<10%)               Similar to no cache
```

## Optimization Tips

1. **Reuse MatchCtx**: Create once, use multiple times
2. **Enable Caching**: Don't clear caches unnecessarily
3. **Batch Operations**: Process multiple files together
4. **Use Approximate Mode**: Faster than strict mode

## Adding New Benchmarks

```typescript
import { bench, describe } from 'vitest';

describe('My Feature', () => {
  bench('my operation', () => {
    // Your code here
  });
});
```

## Profiling

For detailed profiling:

```bash
# With Node.js profiler
node --prof node_modules/.bin/vitest bench

# Analyze profile
node --prof-process isolate-*.log > profile.txt
```
