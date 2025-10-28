# Tailwindify Playground

An interactive environment for testing the Tailwindify core conversion engine. This app allows you to input CSS code and see the resulting Tailwind CSS classes in real-time.

## Getting Started

### Installation

```bash
# From the root of the monorepo
pnpm install
```

### Running the Playground

```bash
# From the root of the monorepo
cd apps/Playground
pnpm dev
```

## Usage

1. When the Playground starts, you'll see a prompt in your terminal
2. Enter CSS code in one of two formats:
   - **Inline CSS**: `margin: 1rem; padding: 2rem; color: #3b82f6;`
   - **CSS Rule Block**:
     ```css
     .my-class {
       margin: 1rem;
       padding: 2rem;
       color: #3b82f6;
     }
     ```
3. Press Enter twice (empty line) to process the input
4. View the resulting Tailwind classes and conversion metrics
5. Enter more CSS or press Ctrl+C to exit

## Example Input/Output

### Input (Inline CSS)
```
margin: 1rem; padding: 1rem 2rem; color: #3b82f6;
```

### Output
```
✅ Tailwind Classes:
  m-4 py-4 px-8 text-blue-500

⚠️ Warnings:
  - Used arbitrary value for 'margin: 1rem'

📊 Coverage: 3/3 (100%)
```

### Input (CSS Rule Block)
```
.card {
  display: flex;
  padding: 1rem;
  margin: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Output
```
🔸 Rule: .card

✅ Tailwind Classes:
  flex p-4 m-8 bg-white rounded-lg shadow-sm

⚠️ Warnings:
  - Selector '.card' was converted but may need manual adjustment

📊 Coverage: 6/6 (100%)
```

## Configuration

The Playground uses the default Tailwind theme and configuration. To customize the behavior, you can modify the context options in `src/index.ts`:

```typescript
const ctx = { 
  theme, 
  opts: { 
    strict: false,  // Set to true to disable approximation
    approximate: true  // Set to false to use only exact matches
  } 
};
```
