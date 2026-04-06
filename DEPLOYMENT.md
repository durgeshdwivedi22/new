# Deployment Guide

## Vercel Deployment

### Automatic Deployment
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite project and deploy

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
npm run deploy:vercel
```

### Environment Variables (Vercel)
- Go to your Vercel project dashboard
- Navigate to Settings → Environment Variables
- Add any required variables from `.env.example`

## Netlify Deployment

### Automatic Deployment
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Manual Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to production
npm run deploy:netlify
```

### Environment Variables (Netlify)
- Go to your Netlify site dashboard
- Navigate to Site settings → Build & deploy → Environment
- Add any required variables from `.env.example`

## Build Configuration

The project is optimized for deployment with:

- **Code Splitting**: Vendor, charts, and icons are split into separate chunks
- **Optimized Build**: Source maps disabled for production
- **Security Headers**: XSS protection, content type options, frame options
- **Caching**: Static assets cached for 1 year
- **Compression**: Gzip compression enabled
- **Node Version**: Requires Node.js 18+

## Pre-deployment Checklist

- [ ] Run `npm run build` locally to ensure build succeeds
- [ ] Test the build with `npm run preview`
- [ ] Set environment variables if needed
- [ ] Ensure `engines` field in package.json matches your target platform
- [ ] Check that all assets are properly referenced

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Run `npm install` to ensure dependencies are up to date
- Check for any syntax errors in the code

### Deploy Fails
- Verify build command and output directory
- Check environment variables
- Ensure all files are committed to git

### Runtime Errors
- Check browser console for errors
- Verify all API endpoints are accessible
- Check that environment variables are properly set

## Performance Optimization

The build includes:
- **Code Splitting**: Reduces initial bundle size
- **Tree Shaking**: Removes unused code
- **Minification**: Compresses JavaScript and CSS
- **Asset Optimization**: Optimizes images and other assets

Expected bundle sizes:
- Main bundle: ~30KB (gzipped)
- Vendor chunk: ~60KB (gzipped)
- Charts chunk: ~95KB (gzipped)
- Total: ~185KB (gzipped)
