# Vercel Deployment Guide

This project has been configured for deployment on Vercel with multi-tenant functionality.

## What's Included

### 1. Static Landing Page (`src/index.html`)
- Main dashboard showing all 5 applications
- Responsive design with modern UI
- Links to individual applications

### 2. Serverless Functions (`api/`)
- `health.js` - Health check endpoint
- `rent.js` - Serves the rent application
- `job.js` - Serves the job application  
- `social.js` - Serves the social application
- `deepfake-detector.js` - Serves the deepfake detector application
- `accelerator.js` - Serves the accelerator application

### 3. Vercel Configuration (`vercel.json`)
- Routes configuration for multi-tenant routing
- Build settings for static files and serverless functions
- Function timeout settings

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy to Vercel
```bash
vercel
```

### 3. Follow the prompts:
- Link to existing project or create new
- Set project name
- Confirm deployment settings

## URL Structure

After deployment, your applications will be available at:

- **Main Dashboard**: `https://your-project.vercel.app/`
- **Rent App**: `https://your-project.vercel.app/rent`
- **Job App**: `https://your-project.vercel.app/job`
- **Social App**: `https://your-project.vercel.app/social`
- **Deepfake Detector**: `https://your-project.vercel.app/deepfake-detector`
- **Accelerator**: `https://your-project.vercel.app/accelerator`
- **Health Check**: `https://your-project.vercel.app/health`

## Custom Domain Setup

To use your custom domain (e.g., `mornscience.com`):

1. **Add Domain in Vercel Dashboard**
   - Go to your project settings
   - Add domain: `mornscience.com`

2. **Configure DNS Records**
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to `your-project.vercel.app`

3. **Subdomain Routing** (Optional)
   - For subdomain routing, you'll need to deploy each app as a separate Vercel project
   - Or use Vercel's edge functions for more complex routing

## Limitations

### What Works on Vercel:
- ✅ Static file serving
- ✅ Serverless functions
- ✅ Basic routing
- ✅ Health checks

### What Doesn't Work on Vercel:
- ❌ Persistent server processes (like your Express server)
- ❌ WebSocket connections
- ❌ Redis connections (unless using external Redis service)
- ❌ Custom port configurations

## Alternative Deployment Options

If you need full server functionality:

1. **Heroku** - Supports Node.js apps with persistent processes
2. **DigitalOcean** - VPS with full control
3. **AWS EC2** - Cloud server with complete control
4. **Railway** - Modern platform supporting full-stack apps

## Environment Variables

Set these in Vercel dashboard if needed:
- `NODE_ENV=production`
- Any API keys or configuration

## Monitoring

- Check Vercel dashboard for function logs
- Monitor function execution times
- Set up alerts for errors

## Cost Considerations

- Vercel has generous free tier
- Serverless functions are pay-per-use
- Static hosting is free
- Custom domains may have costs 