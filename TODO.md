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

- [x] Criar função parseCustomProperties(cssContent: string)
- [x] Extrair tokens de :root
- [x] Suporte para cascade layers (@layer)
- [x] Extrair spacing tokens (--spacing-0, --spacing-0\.5, --spacing-1, etc.)
- [x] Extrair font sizes (--font-size-sm, --font-size-base, etc.)
- [x] Extrair line-heights (--leading-normal, --leading-tight, etc.)
- [x] Extrair colors (--color-slate-900, --color-blue-500, etc.)
- [x] Extrair screens (--screen-sm: 640px, etc.)

**Arquivo:** `packages/core/src/core/tokensLoader.ts` ✅ **COMPLETO**

#### loadTokens() Enhancement

- [x] Implementar leitura de arquivo CSS quando cssPath fornecido
- [x] Integrar parseCustomProperties()
- [x] Fallback para v3 theme quando tokens não encontrados
- [x] Emitir warning 'v3-fallback' quando apropriado
- [x] Adicionar testes com fixtures v4 reais

**Arquivo:** `packages/core/src/core/tokensLoader.ts` ✅ **COMPLETO**

#### Resolvers v4

- [x] Atualizar resolveSpacingToken() para preferir tokens v4
- [x] Atualizar resolveColorToken() para preferir tokens v4
- [x] Atualizar resolveFontSizeToken() para preferir tokens v4
- [x] Atualizar resolveLineHeightToken() para preferir tokens v4
- [x] Emitir 'token-miss' quando token esperado não encontrado

**Arquivo:** `packages/core/src/core/resolvers.ts` ✅ **COMPLETO**

#### Testes v4

- [x] Criar fixture com CSS v4 completo (tokens em :root)
- [x] Testar extração de spacing tokens
- [x] Testar extração de color tokens
- [x] Testar extração de font tokens
- [x] Testar extração de screens
- [x] Testar fallback v3
- [x] Testar warnings v4 (token-miss, v3-fallback)

**Arquivo:** `packages/core/src/core/tokensLoader.test.ts` ✅ **COMPLETO**

---

### 4. CLI Enhancements

#### Output para Arquivo

- [x] Adicionar flag --output <file>
- [x] Escrever resultado em arquivo quando especificado
- [x] Suporte para JSON e Markdown
- [x] Adicionar teste

**Arquivo:** `packages/cli/src/index.ts` ✅ **COMPLETO**

#### Exit Codes

- [x] Adicionar flag --min-coverage <percentage>
- [x] Exit code 0 se coverage >= min-coverage
- [x] Exit code 1 se coverage < min-coverage
- [x] Adicionar teste

**Arquivo:** `packages/cli/src/index.ts` ✅ **COMPLETO**

#### Testes CLI

- [x] Verificar se test/cli.test.sh funciona
- [x] Adicionar testes para stdin
- [x] Adicionar testes para glob patterns
- [x] Adicionar testes para flags
- [x] Adicionar testes para output JSON/Markdown
- [x] Adicionar testes para --output flag
- [x] Adicionar testes para --min-coverage flag

**Arquivo:** `packages/cli/test/cli.test.sh` ✅ **COMPLETO**

---

## 🟡 PRIORIDADE MÉDIA (Importante para v1.0)

### 5. Transforms Matchers

#### translate

- [x] Implementar matchTranslate()
- [x] Suporte para translateX, translateY
- [x] Mapear valores de spacing quando possível
- [x] Fallback para arbitrary
- [x] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts` ✅ **COMPLETO**

#### scale

- [x] Implementar matchScale()
- [x] Suporte para scaleX, scaleY
- [x] Mapear valores comuns (0, 50, 75, 90, 95, 100, 105, 110, 125, 150)
- [x] Fallback para arbitrary
- [x] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts` ✅ **COMPLETO**

#### rotate

- [x] Implementar matchRotate()
- [x] Mapear valores comuns (0, 1, 2, 3, 6, 12, 45, 90, 180)
- [x] Fallback para arbitrary
- [x] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts` ✅ **COMPLETO**

#### skew

- [x] Implementar matchSkew()
- [x] Suporte para skewX, skewY
- [x] Mapear valores comuns (0, 1, 2, 3, 6, 12)
- [x] Fallback para arbitrary
- [x] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts` ✅ **COMPLETO**

#### transform property

- [x] Implementar matchTransform() para propriedade transform
- [x] Parse de múltiplas funções (translate + rotate + scale)
- [x] Gerar múltiplas classes Tailwind
- [x] Adicionar testes

**Arquivo:** `packages/core/src/core/matchers/transforms.ts`

---

### 6. Grid Template Areas

- [x] Implementar matchGridTemplateAreas()
- [x] Sempre usar arbitrary [grid-template-areas:"..."]
- [x] Adicionar testes
- [x] Adicionar ao propertyHandlers

**Arquivo:** `packages/core/src/core/matchers/flexGrid.ts` ✅ **COMPLETO**

---

### 7. Media Query Parsing

#### Parser de @media

- [x] Extrair min-width de @media queries
- [x] Mapear para breakpoints (sm/md/lg/xl/2xl)
- [x] Tolerância de 1px em approximate mode
- [x] Suporte para max-width
- [x] Suporte para orientation
- [x] Suporte para prefers-color-scheme (dark:)

**Arquivo:** `packages/core/src/parsers/cssRules.ts` ✅ **COMPLETO**

#### Aplicação de Variants

- [x] Aplicar variants responsivos automaticamente
- [x] Preservar ordem de variants
- [x] Adicionar testes

**Arquivo:** `packages/core/src/parsers/cssRules.ts` ✅ **COMPLETO**

---

### 8. Component Fixtures

#### Button Fixture

- [x] Criar fixture completo de button
- [x] Testar em strict mode
- [x] Testar em approximate mode
- [x] Snapshot de classes geradas
- [x] Verificar warnings

**Arquivo:** `packages/core/src/fixtures/button.test.ts` ✅ **COMPLETO**

#### Card Fixture

- [x] Criar fixture completo de card
- [x] Incluir box-shadow
- [x] Testar strict e approximate
- [x] Snapshot de resultados

**Arquivo:** `packages/core/src/fixtures/card.test.ts` ✅ **COMPLETO**

#### Grid Layout Fixture

- [x] Criar fixture de grid layout
- [x] Incluir grid-template-columns/rows
- [x] Incluir gap
- [x] Testar strict e approximate

**Arquivo:** `packages/core/src/fixtures/grid.test.ts` ✅ **COMPLETO**

#### Complex Layout Fixture

- [x] Criar fixture de layout complexo
- [x] Incluir flexbox + grid
- [x] Incluir responsive
- [x] Incluir variants (hover, focus)

**Arquivo:** `packages/core/src/fixtures/layout.test.ts` ✅ **COMPLETO**

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
