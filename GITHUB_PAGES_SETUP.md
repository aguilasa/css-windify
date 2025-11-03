# GitHub Pages Setup Guide

## 📚 Enable GitHub Pages for Documentation

Before the documentation workflow can deploy, you need to enable GitHub Pages in your repository.

### Step-by-Step Instructions

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click on **Settings** (top menu)

2. **Navigate to Pages**
   - In the left sidebar, scroll down to **Pages**
   - Click on **Pages**

3. **Configure Source**
   - Under **Build and deployment**
   - In **Source**, select **GitHub Actions** from the dropdown
   - Click **Save** (if button appears)

4. **Verify Permissions**
   - Go to **Settings** → **Actions** → **General**
   - Scroll to **Workflow permissions**
   - Ensure **Read and write permissions** is selected
   - Check **Allow GitHub Actions to create and approve pull requests**
   - Click **Save**

5. **Re-run the Workflow**
   - Go to **Actions** tab
   - Find the failed "Deploy Documentation" workflow
   - Click **Re-run all jobs**

### Expected Result

After setup, the workflow will:

- ✅ Build the documentation
- ✅ Deploy to GitHub Pages
- ✅ Provide a URL like: `https://yourusername.github.io/css-windify/`

### Troubleshooting

**Error: "Resource not accessible by integration"**

- Make sure you followed step 4 (Workflow permissions)
- Ensure you're a repository admin or have proper permissions

**Error: "Get Pages site failed"**

- Make sure you followed step 3 (Configure Source)
- Wait a few minutes and try again

**Pages not showing up**

- Check if the workflow completed successfully
- Visit the Pages URL (shown in workflow output)
- It may take a few minutes for the first deployment

### Manual Alternative

If automatic deployment doesn't work, you can:

1. Generate docs locally:

   ```bash
   pnpm docs:generate
   ```

2. The documentation will be in `docs/api/`

3. You can serve it locally:
   ```bash
   pnpm docs:serve
   # Open http://localhost:8080
   ```

---

**Need help?** Open an issue on GitHub with the error message.
