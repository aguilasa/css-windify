# TODO - Itens Faltantes para Completar SPEC.md

## 🔴 PRIORIDADE ALTA (Bloqueadores para v1.0)

### 1. Effects Matchers

#### box-shadow

- [x] Implementar matcher para box-shadow com tokens
- [x] Mapear: shadow-none, shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl
- [x] Fallback para arbitrary quando não houver match
- [x] Adicionar testes unitários
- [x] Adicionar ao propertyHandlers em rulesEngine.ts

**Arquivo:** `packages/core/src/core/matchers/misc.ts` ✅ **COMPLETO**

#### filter

- [x] Implementar matchFilter() básico
- [x] Suporte para blur(), brightness(), contrast(), grayscale(), etc.
- [x] Fallback para arbitrary [filter:...]
- [x] Adicionar testes
- [x] Adicionar ao propertyHandlers

**Arquivo:** `packages/core/src/core/matchers/misc.ts` ✅ **COMPLETO**

#### mix-blend-mode

- [x] Implementar matchMixBlendMode()
- [x] Mapear: multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, hue, saturation, color, luminosity
- [x] Fallback para arbitrary
- [x] Adicionar testes
- [x] Adicionar ao propertyHandlers

**Arquivo:** `packages/core/src/core/matchers/misc.ts` ✅ **COMPLETO**

#### isolation

- [x] Implementar matchIsolation()
- [x] Mapear: isolate, isolation-auto
- [x] Adicionar testes
- [x] Adicionar ao propertyHandlers

**Arquivo:** `packages/core/src/core/matchers/misc.ts` ✅ **COMPLETO**

---

### 2. Layout Matchers Faltantes

#### object-position

- [x] Implementar matchObjectPosition()
- [x] Mapear: center, top, right, bottom, left, top-left, top-right, bottom-left, bottom-right
- [x] Fallback para arbitrary object-[pos]
- [x] Adicionar testes
- [x] Adicionar ao propertyHandlers

**Arquivo:** `packages/core/src/core/matchers/layout.ts` ✅ **COMPLETO**

#### aspect-ratio

- [x] Implementar matchAspectRatio()
- [x] Mapear: 1/1 → aspect-square, 16/9 → aspect-video
- [x] Fallback para arbitrary aspect-[value]
- [x] Adicionar testes
- [x] Adicionar ao propertyHandlers

**Arquivo:** `packages/core/src/core/matchers/layout.ts` ✅ **COMPLETO**

---

### 3. Tailwind v4 Token Loading

#### CSS Custom Properties Parser

- [ ] Criar função parseCustomProperties(cssContent: string)
- [ ] Extrair tokens de :root
- [ ] Suporte para cascade layers (@layer)
- [ ] Extrair spacing tokens (--spacing-0, --spacing-0\.5, --spacing-1, etc.)
- [ ] Extrair font sizes (--font-size-sm, --font-size-base, etc.)
- [ ] Extrair line-heights (--leading-normal, --leading-tight, etc.)
- [ ] Extrair colors (--color-slate-900, --color-blue-500, etc.)
- [ ] Extrair screens (--screen-sm: 640px, etc.)

**Arquivo:** `packages/core/src/core/tokensLoader.ts`

#### loadTokens() Enhancement

- [ ] Implementar leitura de arquivo CSS quando cssPath fornecido
- [ ] Integrar parseCustomProperties()
- [ ] Fallback para v3 theme quando tokens não encontrados
- [ ] Emitir warning 'v3-fallback' quando apropriado
- [ ] Adicionar testes com fixtures v4 reais

**Arquivo:** `packages/core/src/core/tokensLoader.ts`

#### Resolvers v4

- [ ] Atualizar resolveSpacingToken() para preferir tokens v4
- [ ] Atualizar resolveColorToken() para preferir tokens v4
- [ ] Atualizar resolveFontSizeToken() para preferir tokens v4
- [ ] Atualizar resolveLineHeightToken() para preferir tokens v4
- [ ] Emitir 'token-miss' quando token esperado não encontrado

**Arquivo:** `packages/core/src/core/resolvers.ts`

#### Testes v4

- [ ] Criar fixture com CSS v4 completo (tokens em :root)
- [ ] Testar extração de spacing tokens
- [ ] Testar extração de color tokens
- [ ] Testar extração de font tokens
- [ ] Testar extração de screens
- [ ] Testar fallback v3
- [ ] Testar warnings v4 (token-miss, v3-fallback)

**Arquivo:** `packages/core/src/core/tokensLoader.test.ts`

---

### 4. CLI Enhancements

#### Output para Arquivo

- [ ] Adicionar flag --output <file>
- [ ] Escrever resultado em arquivo quando especificado
- [ ] Suporte para JSON e Markdown
- [ ] Adicionar teste

**Arquivo:** `packages/cli/src/index.ts`

#### Exit Codes

- [ ] Adicionar flag --min-coverage <percentage>
- [ ] Exit code 0 se coverage >= min-coverage
- [ ] Exit code 1 se coverage < min-coverage
- [ ] Adicionar teste

**Arquivo:** `packages/cli/src/index.ts`

#### Testes CLI

- [ ] Verificar se test/cli.test.sh funciona
- [ ] Adicionar testes para stdin
- [ ] Adicionar testes para glob patterns
- [ ] Adicionar testes para flags
- [ ] Adicionar testes para output JSON/Markdown

**Arquivo:** `packages/cli/test/cli.test.sh`

---

## 🟡 PRIORIDADE MÉDIA (Importante para v1.0)

### 5. Transforms Matchers

#### translate

- [ ] Implementar matchTranslate()
- [ ] Suporte para translateX, translateY
- [ ] Mapear valores de spacing quando possível
- [ ] Fallback para arbitrary
- [ ] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts` (criar)

#### scale

- [ ] Implementar matchScale()
- [ ] Suporte para scaleX, scaleY
- [ ] Mapear valores comuns (0, 50, 75, 90, 95, 100, 105, 110, 125, 150)
- [ ] Fallback para arbitrary
- [ ] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts`

#### rotate

- [ ] Implementar matchRotate()
- [ ] Mapear valores comuns (0, 1, 2, 3, 6, 12, 45, 90, 180)
- [ ] Fallback para arbitrary
- [ ] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts`

#### skew

- [ ] Implementar matchSkew()
- [ ] Suporte para skewX, skewY
- [ ] Mapear valores comuns (0, 1, 2, 3, 6, 12)
- [ ] Fallback para arbitrary
- [ ] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts`

#### transform property

- [ ] Implementar matchTransform() para propriedade transform
- [ ] Parse de múltiplas funções (translate + rotate + scale)
- [ ] Gerar múltiplas classes Tailwind
- [ ] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts`

---

### 6. Grid Template Areas

- [ ] Implementar matchGridTemplateAreas()
- [ ] Sempre usar arbitrary [grid-template-areas:"..."]
- [ ] Adicionar testes
- [ ] Adicionar ao propertyHandlers

**Arquivo:** `packages/core/src/core/matchers/flexGrid.ts`

---

### 7. Media Query Parsing

#### Parser de @media

- [ ] Extrair min-width de @media queries
- [ ] Mapear para breakpoints (sm/md/lg/xl/2xl)
- [ ] Tolerância de 1px em approximate mode
- [ ] Suporte para max-width
- [ ] Suporte para orientation
- [ ] Suporte para prefers-color-scheme (dark:)

**Arquivo:** `packages/core/src/parsers/cssRules.ts`

#### Aplicação de Variants

- [ ] Aplicar variants responsivos automaticamente
- [ ] Preservar ordem de variants
- [ ] Adicionar testes

**Arquivo:** `packages/core/src/core/cssTransformer.ts`

---

### 8. Component Fixtures

#### Button Fixture

- [ ] Criar fixture completo de button
- [ ] Testar em strict mode
- [ ] Testar em approximate mode
- [ ] Snapshot de classes geradas
- [ ] Verificar warnings

**Arquivo:** `packages/core/src/fixtures/button.test.ts` (criar)

#### Card Fixture

- [ ] Criar fixture completo de card
- [ ] Incluir box-shadow
- [ ] Testar strict e approximate
- [ ] Snapshot de resultados

**Arquivo:** `packages/core/src/fixtures/card.test.ts` (criar)

#### Grid Layout Fixture

- [ ] Criar fixture de grid layout
- [ ] Incluir grid-template-columns/rows
- [ ] Incluir gap
- [ ] Testar strict e approximate

**Arquivo:** `packages/core/src/fixtures/grid.test.ts` (criar)

#### Complex Layout Fixture

- [ ] Criar fixture de layout complexo
- [ ] Incluir flexbox + grid
- [ ] Incluir responsive
- [ ] Incluir variants (hover, focus)

**Arquivo:** `packages/core/src/fixtures/layout.test.ts` (criar)

---

### 9. Advanced Reporting

#### Export para Arquivo

- [ ] Função exportReport(result, format, filepath)
- [ ] Suporte para JSON
- [ ] Suporte para Markdown
- [ ] Suporte para HTML (opcional)

**Arquivo:** `packages/core/src/core/reporter.ts`

#### Comparação Strict vs Approximate

- [ ] Função compareResults(strictResult, approximateResult)
- [ ] Mostrar diferenças em coverage
- [ ] Mostrar diferenças em warnings
- [ ] Mostrar diferenças em classes geradas

**Arquivo:** `packages/core/src/core/reporter.ts`

#### Visualização de Diffs

- [ ] Mostrar CSS original vs Tailwind gerado
- [ ] Highlight de diferenças
- [ ] Formato texto ou HTML

**Arquivo:** `packages/core/src/core/reporter.ts`

---

## 🟢 PRIORIDADE BAIXA (Nice to have)

### 10. Web App

#### Setup Básico

- [ ] Configurar Vite + React
- [ ] Configurar TailwindCSS
- [ ] Estrutura de componentes

**Arquivo:** `apps/web/`

#### Monaco Editor

- [ ] Integrar Monaco editor
- [ ] Syntax highlighting CSS
- [ ] Auto-complete

**Arquivo:** `apps/web/src/components/Editor.tsx`

#### Worker Execution

- [ ] Criar Web Worker para core
- [ ] Comunicação com worker
- [ ] Loading states

**Arquivo:** `apps/web/src/worker.ts`

#### UI Components

- [ ] Input panel (CSS)
- [ ] Output panel (Tailwind)
- [ ] Side panel (warnings/coverage)
- [ ] Settings panel (options)
- [ ] Export button

**Arquivo:** `apps/web/src/components/`

---

### 11. Advanced Configuration

#### Plugin System

- [ ] Interface Plugin
- [ ] Registro de plugins
- [ ] Lifecycle hooks
- [ ] Documentação

**Arquivo:** `packages/core/src/plugins/` (criar)

#### Custom Handlers

- [ ] API para registrar handlers customizados
- [ ] Override de handlers existentes
- [ ] Documentação

**Arquivo:** `packages/core/src/core/rulesEngine.ts`

#### Configurações Avançadas

- [ ] Base font size configurável
- [ ] Shadow similarity threshold
- [ ] Custom color matching
- [ ] Custom spacing scale

**Arquivo:** `packages/core/src/types.ts`

---

### 12. Performance

#### Cache de Tokens

- [ ] Implementar cache em memória
- [ ] Cache key: file mtime + path
- [ ] Invalidação de cache
- [ ] Testes de performance

**Arquivo:** `packages/core/src/core/tokensLoader.ts`

#### Memoization

- [ ] Memoizar resolvers
- [ ] Memoizar matchers
- [ ] Benchmarks

**Arquivo:** `packages/core/src/core/resolvers.ts`

#### Benchmarks

- [ ] Suite de benchmarks
- [ ] Comparação de performance
- [ ] Relatório de performance

**Arquivo:** `packages/core/benchmarks/` (criar)

---

## 📝 Documentação Faltante

### README Enhancements

- [ ] Adicionar exemplos de uso
- [ ] Adicionar screenshots
- [ ] Adicionar badges (CI, coverage, npm)
- [ ] Melhorar seção de instalação

### API Documentation

- [ ] Documentar todas as APIs públicas
- [ ] Exemplos de código
- [ ] TypeDoc ou similar

### Migration Guide

- [ ] Guia de migração v3 → v4
- [ ] Exemplos práticos
- [ ] Troubleshooting

### Contributing Guide

- [ ] Criar CONTRIBUTING.md
- [ ] Guia de setup
- [ ] Guia de testes
- [ ] Code style

---

## 🧪 Testes Adicionais Necessários

### Unit Tests

- [ ] Testes para box-shadow matcher
- [ ] Testes para filter matcher
- [ ] Testes para mix-blend-mode matcher
- [ ] Testes para isolation matcher
- [ ] Testes para object-position matcher
- [ ] Testes para aspect-ratio matcher
- [ ] Testes para transforms matchers
- [ ] Testes para grid-template-areas matcher

### Integration Tests

- [ ] Testes de fixtures de componentes
- [ ] Testes de v4 com CSS variables
- [ ] Testes de media query parsing
- [ ] Testes de CLI end-to-end

### Performance Tests

- [ ] Benchmarks de parsing
- [ ] Benchmarks de matching
- [ ] Benchmarks de resolvers
- [ ] Testes com arquivos CSS grandes

---

## 📊 Métricas de Progresso

**Total de Itens:** ~100+

**Por Prioridade:**

- 🔴 Alta: ~30 itens
- 🟡 Média: ~30 itens
- 🟢 Baixa: ~40 itens

**Estimativa de Tempo:**

- Alta: 2-3 semanas
- Média: 2-3 semanas
- Baixa: 4-6 semanas

**Total:** 8-12 semanas para 100% de conformidade com SPEC.md
