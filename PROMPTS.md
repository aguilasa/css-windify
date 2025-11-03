# Prompts Detalhados - CSSWindify Development

**Data:** 3 de novembro de 2025
**Baseado em:** TODO.md v2.0

Este arquivo contém prompts detalhados para implementar cada item do roadmap.

---

## 🎯 v1.0 - Documentação Básica

### Prompt 1: README Badges e Exemplos

```
Atualizar o README.md principal do projeto CSSWindify com:

1. Badges no topo:
   - Build status (GitHub Actions)
   - Coverage (Codecov)
   - NPM version
   - License (MIT)
   - TypeScript badge

2. Seção "Quick Start" com exemplo básico:
   - Instalação via npm/pnpm
   - Exemplo de uso com transformCssText()
   - Exemplo de uso com CLI
   - Output esperado

3. Seção "Features" destacando:
   - Suporte v3 e v4 Tailwind
   - 100+ matchers implementados
   - Strict e approximate modes
   - Plugin system
   - Performance otimizada (cache)

4. Link para documentação completa

Manter o README conciso e focado. Usar exemplos práticos e reais.

Após completar, marcar como completo no TODO.md:
- [x] Adicionar badges (build status, coverage, version, license)
- [x] Adicionar exemplos de uso básico
- [x] Adicionar quick start guide
- [x] Adicionar link para documentação completa
```

### Prompt 2: Package.json Metadata

```
Atualizar metadata nos package.json de todos os pacotes:

1. Root package.json:
   - Adicionar keywords: ["tailwind", "css", "converter", "utility-first", "css-to-tailwind"]
   - Adicionar repository: { type: "git", url: "..." }
   - Adicionar homepage e bugs URLs
   - Verificar license: "MIT"

2. packages/core/package.json:
   - Adicionar description detalhada
   - Keywords específicas do core
   - Adicionar exports para ESM/CJS
   - Verificar dependencies e peerDependencies

3. packages/cli/package.json:
   - Description focada no CLI
   - Keywords para CLI tools
   - Bin configuration correta

Garantir que todos os campos estejam preenchidos para publicação no NPM.

Após completar, marcar como completo no TODO.md:
- [x] Adicionar keywords para npm
- [x] Adicionar repository URLs
- [x] Adicionar homepage e bugs URLs
- [x] Verificar license
```

---

## 🚀 v1.1 - Web App Interface

### Prompt 3: Monaco Editor Integration

````
Implementar integração do Monaco Editor no web app:

Contexto:
- Projeto: apps/web (Vite + React + TypeScript)
- Editor: @monaco-editor/react
- Objetivo: Editor CSS com syntax highlighting

Tarefas:

1. Instalar dependências:
   ```bash
   cd apps/web
   pnpm add @monaco-editor/react monaco-editor
````

2. Criar componente Editor.tsx em apps/web/src/components/:
   - Usar @monaco-editor/react
   - Configurar language: "css"
   - Theme: "vs-dark" e "vs-light" (toggle)
   - Auto-complete básico para propriedades CSS
   - Line numbers e minimap
   - Props: value, onChange, theme

3. Configurar syntax highlighting:
   - Registrar CSS language
   - Custom tokens para Tailwind classes (opcional)

4. Adicionar controles:
   - Theme switcher (dark/light)
   - Font size control
   - Word wrap toggle

5. Criar testes básicos com Vitest + Testing Library

Referência: https://github.com/suren-atoyan/monaco-react

Após completar, marcar como completo no TODO.md:

- [x] Instalar @monaco-editor/react
- [x] Criar componente Editor.tsx
- [x] Configurar syntax highlighting CSS
- [x] Adicionar auto-complete básico
- [x] Configurar theme (dark/light)

```

### Prompt 4: Web Worker Implementation

```

Implementar Web Worker para execução do core CSSWindify:

Contexto:

- Evitar bloqueio da UI durante transformação
- Core já está em packages/core
- Comunicação via postMessage

Tarefas:

1. Criar apps/web/src/worker.ts:
   - Importar transformCssText do core
   - Listener para mensagens do tipo "transform"
   - Processar CSS e retornar resultado
   - Tratamento de erros robusto

2. Criar apps/web/src/hooks/useWorker.ts:
   - Hook React para gerenciar worker
   - Estados: idle, processing, success, error
   - Função transform(css, options)
   - Cleanup no unmount

3. Tipos TypeScript:

   ```typescript
   type WorkerMessage = {
     type: 'transform';
     payload: { css: string; options: MatchCtx };
   };

   type WorkerResponse = {
     type: 'success' | 'error';
     payload: TransformResult | Error;
   };
   ```

4. Loading states:
   - Spinner durante processamento
   - Progress bar (se possível)
   - Cancelamento de operação

5. Testes:
   - Mock do worker
   - Testar comunicação
   - Testar error handling

Referência: Web Workers API MDN

```

### Prompt 5: UI Components Complete

```

Implementar componentes completos da UI do web app:

Contexto:

- Layout: Split view com panels
- Framework: React + TailwindCSS
- State: React Context ou Zustand

Componentes a criar em apps/web/src/components/:

1. InputPanel.tsx:
   - Monaco Editor integrado
   - Toolbar com ações (clear, format, examples)
   - Character count
   - Syntax errors display

2. OutputPanel.tsx:
   - Display de classes Tailwind geradas
   - Syntax highlighting para classes
   - Copy button (copy all)
   - Individual class copy buttons
   - Search/filter classes

3. SidePanel.tsx:
   - Tabs: Warnings, Coverage, Settings
   - Warnings list com categorias
   - Coverage metrics (pie chart ou progress bars)
   - Collapsible sections

4. SettingsPanel.tsx:
   - Toggle strict/approximate mode
   - Threshold sliders (spacing, font, radii)
   - Version selector (v3/v4/auto)
   - Theme toggle
   - Export format selector

5. ExportButton.tsx:
   - Dropdown com opções
   - Copy to clipboard
   - Download as JSON
   - Download as Markdown
   - Share URL (encode CSS)

6. Layout.tsx:
   - Split view resizable (react-split)
   - Responsive (mobile: stack vertical)
   - Header com logo e links
   - Footer com créditos

7. ExamplesModal.tsx:
   - Modal com exemplos pré-carregados
   - Categorias: Button, Card, Form, Layout
   - Load example ao clicar

State Management:

- Context para CSS input
- Context para transform result
- Context para settings
- Local storage para persistir settings

Usar shadcn/ui para componentes base (Button, Select, Slider, etc.)

Após completar, marcar como completo no TODO.md:

- [x] Input panel (CSS editor)
- [x] Output panel (Tailwind classes)
- [x] Side panel (warnings/coverage stats)
- [x] Settings panel (strict/approximate, thresholds)
- [x] Export button (copy, download)
- [x] Split view resizable

```

### Prompt 6: Web App Features Adicionais

```

Implementar features avançadas do web app:

1. Shareable URLs:
   - Encoder CSS em base64 ou LZ-string
   - Adicionar ao URL hash: #css=...
   - Decoder ao carregar página
   - Copy share link button
   - Limite de tamanho (URL max length)

2. Local Storage:
   - Salvar último CSS editado
   - Salvar settings (mode, thresholds, theme)
   - Salvar histórico (últimos 5 CSS)
   - Clear history button

3. Exemplos Pré-carregados:
   - Criar apps/web/src/examples.ts com:
     - Button component
     - Card component
     - Form component
     - Grid layout
     - Flex layout
   - Load example modal
   - Preview de cada exemplo

4. Theme Switcher:
   - Dark/Light mode
   - Persistir preferência
   - Sync com Monaco editor theme
   - Smooth transition

5. Responsive Design:
   - Mobile: stack vertical
   - Tablet: side-by-side
   - Desktop: split view com sidebar
   - Touch-friendly controls

6. Keyboard Shortcuts:
   - Ctrl/Cmd + Enter: Transform
   - Ctrl/Cmd + K: Clear
   - Ctrl/Cmd + /: Toggle settings
   - Esc: Close modals

Usar React Router para navegação (se necessário)
Adicionar analytics (opcional): Plausible ou similar

Após completar, marcar como completo no TODO.md:

- [x] Shareable URLs (encode CSS in URL)
- [x] Local storage para salvar última sessão
- [x] Exemplos pré-carregados
- [x] Theme switcher (dark/light)
- [x] Responsive design

```

### Prompt 7: TypeDoc API Documentation

```

Configurar e gerar documentação automática com TypeDoc:

1. Instalar TypeDoc:

   ```bash
   pnpm add -D typedoc typedoc-plugin-markdown
   ```

2. Criar typedoc.json na raiz:

   ```json
   {
     "entryPoints": ["packages/core/src/index.ts"],
     "out": "docs/api",
     "plugin": ["typedoc-plugin-markdown"],
     "readme": "none",
     "excludePrivate": true,
     "excludeInternal": true
   }
   ```

3. Melhorar JSDoc nos arquivos principais:
   - packages/core/src/index.ts
   - packages/core/src/core/matchers/\*.ts
   - packages/core/src/core/resolvers.ts
   - packages/core/src/plugins/index.ts

   Adicionar:
   - @example com código funcional
   - @param com descrições detalhadas
   - @returns com tipos e descrições
   - @see para referências cruzadas

4. Gerar docs:

   ```bash
   pnpm typedoc
   ```

5. Publicar no GitHub Pages:
   - Criar .github/workflows/docs.yml
   - Build e deploy automático
   - URL: https://username.github.io/css-windify/

6. Adicionar link no README principal

Após completar, marcar como completo no TODO.md:

- [x] Configurar TypeDoc
- [x] Gerar documentação automática
- [x] Adicionar exemplos em JSDoc
- [x] Publicar em GitHub Pages ou similar

```

### Prompt 8: Migration Guide v3→v4

```

Criar guia completo de migração Tailwind v3 para v4:

Criar MIGRATION.md na raiz com:

1. Introdução:
   - Diferenças entre v3 e v4
   - Por que migrar
   - Quando migrar

2. Detecção Automática:
   - Como CSSWindify detecta a versão
   - Forçar versão específica
   - Fallback behavior

3. Tokens vs Theme:
   - v3: tailwind.config.js
   - v4: CSS custom properties
   - Exemplos lado a lado

4. Passo a Passo:

   ````markdown
   ## Migração Passo a Passo

   ### 1. Preparar CSS Tokens

   Criar arquivo com tokens v4:

   ```css
   :root {
     --spacing-0: 0;
     --spacing-1: 0.25rem;
     --color-blue-500: #3b82f6;
   }
   ```
   ````

   ### 2. Atualizar Código

   ```typescript
   // Antes (v3)
   const tokens = await loadTokens({ configPath: './tailwind.config.js' });

   // Depois (v4)
   const tokens = await loadTokens({ cssPath: './tokens.css' });
   ```

   ### 3. Testar
   - Rodar testes
   - Verificar warnings
   - Comparar resultados

   ```

   ```

5. Troubleshooting:
   - Token não encontrado
   - Fallback para v3
   - Warnings v4
   - Performance

6. Exemplos Completos:
   - Projeto pequeno
   - Projeto grande
   - Monorepo

7. FAQ:
   - Posso usar v3 e v4 juntos?
   - Como migrar gradualmente?
   - Breaking changes?

Após completar, marcar como completo no TODO.md:

- [x] Criar MIGRATION.md
- [x] Guia v3 → v4 Tailwind
- [x] Exemplos de migração
- [x] Troubleshooting comum
- [x] Breaking changes (se houver)

### Prompt 9: Contributing Guide

Criar guia completo para contribuidores:

Criar CONTRIBUTING.md na raiz com:

1. Welcome Section:
   - Agradecer interesse
   - Tipos de contribuições aceitas
   - Code of Conduct

2. Setup do Ambiente:

   ````markdown
   ## Desenvolvimento Local

   ### Pré-requisitos

   - Node.js 18+
   - pnpm 8+

   ### Clone e Install

   ```bash
   git clone https://github.com/user/css-windify
   cd css-windify
   pnpm install
   ```
   ````

   ### Estrutura do Projeto
   - packages/core: Core library
   - packages/cli: CLI tool
   - apps/web: Web interface
   - apps/playground: Development playground

   ```

   ```

3. Como Rodar Testes:

   ```bash
   # Todos os testes
   pnpm test

   # Watch mode
   pnpm test:watch

   # Coverage
   pnpm test:coverage

   # Benchmarks
   pnpm bench
   ```

4. Como Adicionar Novos Matchers:
   - Passo a passo detalhado
   - Template de matcher
   - Como adicionar testes
   - Como documentar

5. Code Style:
   - ESLint rules
   - Prettier config
   - Naming conventions
   - File organization

6. Commit Guidelines:
   - Conventional commits
   - Exemplos de mensagens
   - Quando fazer squash

7. Pull Request Process:
   - Fork e branch
   - Checklist antes de PR
   - Review process
   - Merge requirements

8. Onde Pedir Ajuda:
   - GitHub Discussions
   - Issues
   - Discord (se houver)

```

### Prompt 10: Tutoriais Práticos

```

Criar tutoriais práticos em docs/tutorials/:

1. Tutorial: Converter Componente React
   Arquivo: docs/tutorials/react-component.md

   Conteúdo:
   - Componente React com CSS inline
   - Extrair CSS
   - Converter para Tailwind
   - Aplicar classes
   - Antes e depois
   - Código completo funcional

2. Tutorial: Usar no CI/CD
   Arquivo: docs/tutorials/ci-cd.md

   Conteúdo:
   - GitHub Actions workflow
   - Validar coverage mínimo
   - Fail build se coverage baixo
   - Gerar relatório
   - Exemplos: GitHub, GitLab, CircleCI

3. Tutorial: Criar Plugin Customizado
   Arquivo: docs/tutorials/custom-plugin.md

   Conteúdo:
   - Estrutura de plugin
   - Implementar handler customizado
   - Usar lifecycle hooks
   - Testar plugin
   - Publicar plugin
   - Exemplo completo: Animation plugin

4. Tutorial: Casos de Uso Reais
   Arquivo: docs/tutorials/real-world.md

   Conteúdo:
   - Migrar Bootstrap para Tailwind
   - Converter CSS legacy
   - Refatorar codebase grande
   - Manter consistência
   - Dicas e truques

Cada tutorial deve:

- Ser completo e funcional
- Incluir código copiável
- Ter screenshots (se aplicável)
- Listar pré-requisitos
- Ter seção de troubleshooting

Após completar, marcar como completo no TODO.md:

- [x] Tutorial: Converter um componente React
- [x] Tutorial: Usar no CI/CD
- [x] Tutorial: Criar plugins customizados
- [x] Exemplos de casos de uso reais

```

---

## 🔧 v1.1 - CI/CD e Publicação

### Prompt 11: GitHub Actions Workflows

```

Criar workflows completos do GitHub Actions:

1. .github/workflows/ci.yml - Testes e Build:

   ```yaml
   name: CI

   on: [push, pull_request]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm lint
         - run: pnpm test
         - run: pnpm build

     coverage:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v3
         - run: pnpm install
         - run: pnpm test:coverage
         - uses: codecov/codecov-action@v3
   ```

2. .github/workflows/release.yml - Automated Releases:
   - Usar semantic-release
   - Gerar changelog automático
   - Publicar no NPM
   - Criar GitHub release
   - Tag automático

3. .github/workflows/docs.yml - Deploy Docs:
   - Build TypeDoc
   - Deploy para GitHub Pages
   - Trigger em push para main

4. .github/dependabot.yml:
   - Auto-update dependencies
   - Weekly schedule
   - Group updates

Configurar secrets necessários no GitHub:

- NPM_TOKEN
- CODECOV_TOKEN

Após completar, marcar como completo no TODO.md:

- [x] Workflow de testes (CI)
- [x] Workflow de build
- [x] Coverage report (Codecov)
- [x] Automated releases
- [x] Dependabot setup

```

### Prompt 12: NPM Publishing Setup

```

Configurar publicação automática no NPM:

1. Preparar packages para publicação:

   packages/core/package.json:
   - Adicionar "files": ["dist", "README.md"]
   - Configurar "main", "module", "types"
   - Adicionar "publishConfig": { "access": "public" }

   packages/cli/package.json:
   - Similar ao core
   - Adicionar "bin": { "css-windify": "./dist/index.js" }

2. Criar .npmignore em cada package:

   ```
   src/
   tests/
   *.test.ts
   tsconfig.json
   vitest.config.ts
   ```

3. Scripts de publicação:

   package.json (root):

   ```json
   {
     "scripts": {
       "prepublish": "pnpm build && pnpm test",
       "publish:core": "cd packages/core && npm publish",
       "publish:cli": "cd packages/cli && npm publish",
       "publish:all": "pnpm publish:core && pnpm publish:cli"
     }
   }
   ```

4. Semantic Versioning:
   - Instalar semantic-release
   - Configurar .releaserc.json
   - Conventional commits
   - Changelog automático

5. Pre-publish Checks:
   - Lint
   - Tests
   - Build
   - Size check
   - Dependency audit

6. Publicar primeira versão:
   ```bash
   npm login
   pnpm publish:all
   ```

Após completar, marcar como completo no TODO.md:

- [x] Configurar npm publish
- [x] Semantic versioning
- [x] Changelog automático
- [x] Pre-publish checks
- [x] Publish @css-windify/core
- [x] Publish @css-windify/cli

````

### Prompt 13: Quality Checks e Linting

...
Configurar quality checks completos:

1. ESLint Setup:

   .eslintrc.json:

   ```json
   {
     "extends": [
       "eslint:recommended",
       "plugin:@typescript-eslint/recommended",
       "plugin:@typescript-eslint/recommended-requiring-type-checking",
       "prettier"
     ],
     "rules": {
       "no-console": "warn",
       "@typescript-eslint/no-explicit-any": "error",
       "@typescript-eslint/explicit-function-return-type": "warn"
     }
   }
````

2. Prettier Setup:

   .prettierrc:

   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100
   }
   ```

3. Husky Pre-commit Hooks:

   ```bash
   pnpm add -D husky lint-staged
   npx husky install
   ```

   .husky/pre-commit:

   ```bash
   #!/bin/sh
   pnpm lint-staged
   ```

   package.json:

   ```json
   {
     "lint-staged": {
       "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
       "*.{json,md}": ["prettier --write"]
     }
   }
   ```

4. Commitlint:

   ```bash
   pnpm add -D @commitlint/cli @commitlint/config-conventional
   ```

   .commitlintrc.json:

   ```json
   {
     "extends": ["@commitlint/config-conventional"]
   }
   ```

5. Scripts no package.json:
   ```json
   {
     "scripts": {
       "lint": "eslint . --ext .ts,.tsx",
       "lint:fix": "eslint . --ext .ts,.tsx --fix",
       "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
       "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\""
     }
   }
   ```

Rodar todos os checks antes de commit e push.

```

---

## 🚀 v1.2+ - Features Avançadas

### Prompt 14: VS Code Extension

```

Criar extensão VS Code para CSSWindify:

Estrutura:

```
css-windify-vscode/
├── package.json
├── src/
│   ├── extension.ts
│   ├── commands/
│   │   ├── convertInline.ts
│   │   ├── convertFile.ts
│   │   └── convertSelection.ts
│   ├── providers/
│   │   ├── hoverProvider.ts
│   │   └── codeActionProvider.ts
│   └── utils/
└── README.md
```

Features:

1. Command: Convert CSS to Tailwind
   - Selecionar CSS
   - Cmd+Shift+P → "Convert to Tailwind"
   - Substituir seleção

2. Hover Provider:
   - Hover sobre classe CSS
   - Mostrar equivalente Tailwind
   - Link para documentação

3. Code Actions (Quick Fixes):
   - Detectar CSS inline
   - Sugerir conversão
   - Apply fix automático

4. Settings:
   - Strict/approximate mode
   - Thresholds
   - Auto-convert on save

5. Status Bar:
   - Mostrar coverage
   - Click para detalhes

Publicar no VS Code Marketplace.

Após completar, marcar como completo no TODO.md (v1.2+):

- [x] Criar extensão VS Code
- [x] Inline CSS → Tailwind conversion
- [x] Hover para preview
- [x] Code actions (quick fixes)

```

### Prompt 15: Advanced Matchers

```

Implementar matchers avançados para CSS moderno:

1. Container Queries (@container):

   Arquivo: packages/core/src/core/matchers/container.ts

   ```typescript
   export function matchContainerQuery(query: string, ctx: MatchCtx): string[] {
     // Parse @container (min-width: 400px)
     // Retornar: @container/name
     // Suporte para container-type, container-name
   }
   ```

2. CSS Custom Properties (--var):

   Detectar uso de variáveis:

   ```css
   color: var(--primary-color);
   ```

   Converter para:

   ```
   text-[var(--primary-color)]
   ```

3. CSS Functions (calc, clamp, min, max):

   ```typescript
   export function matchCssFunction(value: string, property: string, ctx: MatchCtx): string {
     // Parse calc(100% - 2rem)
     // Parse clamp(1rem, 5vw, 3rem)
     // Retornar arbitrary value
   }
   ```

4. Advanced Grid (subgrid, masonry):

   ```css
   grid-template-rows: subgrid;
   grid-template-rows: masonry;
   ```

5. Advanced Animations (@keyframes):

   Parser completo de @keyframes
   Converter para arbitrary animations

Adicionar testes abrangentes para cada matcher.
Documentar no SPEC.md.

Após completar, marcar como completo no TODO.md (v1.2+):

- [x] CSS Grid advanced (subgrid, masonry)
- [x] Container queries (@container)
- [x] CSS custom properties (--var)
- [x] CSS functions (calc, clamp, min, max)
- [x] Advanced animations (@keyframes)

```

---

## 📝 Notas de Uso

Cada prompt é:
- ✅ Autocontido e completo
- ✅ Inclui contexto necessário
- ✅ Tem exemplos de código
- ✅ Lista arquivos específicos
- ✅ Inclui comandos executáveis
- ✅ Menciona testes quando aplicável

Para usar:
1. Copie o prompt completo
2. Cole no chat com o AI assistant
3. Revise o código gerado
4. Execute testes
5. Faça commit

Ordem recomendada:
1. v1.0: Prompts 1-2 (documentação básica)
2. v1.1: Prompts 11-13 (CI/CD primeiro)
3. v1.1: Prompts 7-10 (documentação)
4. v1.1: Prompts 3-6 (web app)
5. v1.2+: Prompts 14-15 (features avançadas)
```
