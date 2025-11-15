# Deploying EcareBots to Vercel

This guide will walk you through deploying the EcareBots application to Vercel and configuring the custom domain.

## Prerequisites

- A Vercel account
- Access to your domain registrar (Cloudflare in this case)
- GitHub repository cloned

## Option 1: Deploy via Vercel Web UI (Recommended)

1. **Connect your GitHub repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." > "Project"
   - Select the "ecarebots" repository
   - Vercel will automatically detect the Vite configuration

2. **Configure project settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

3. **Configure environment variables**:
   - Add `ELEVENLABS_API_KEY` with your ElevenLabs API key

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

5. **Add a custom domain**:
   - In your project, go to "Settings" > "Domains"
   - Add your domain: `ecarebots.com`
   - Vercel will provide DNS records to add to your Cloudflare configuration

6. **Configure Cloudflare DNS**:
   - Go to your Cloudflare dashboard
   - Add the DNS records provided by Vercel:
     - CNAME record: `www.ecarebots.com` pointing to `cname.vercel-dns.com`
     - A record: `ecarebots.com` pointing to Vercel's IP address
   - Set SSL/TLS to "Full" or "Flexible" based on your needs

## Option 2: Deploy via Vercel CLI

If you prefer using the command line:

1. **Install Vercel CLI**:
   ```
   npm i -g vercel
   ```

2. **Login**:
   ```
   vercel login
   ```

3. **Deploy**:
   ```
   cd ecarebots
   vercel --prod
   ```

4. **Configure environment variables**:
   ```
   vercel env add ELEVENLABS_API_KEY
   ```

5. **Add domain**:
   ```
   vercel domains add ecarebots.com
   ```

## Automating Future Deployments

- Vercel will automatically deploy when you push to the main branch
- You can configure preview deployments for pull requests in the Vercel settings

## Troubleshooting

- If the deployment fails, check the build logs in the Vercel dashboard
- Ensure all dependencies are correctly installed
- Verify that your environment variables are set correctly
- For domain issues, ensure DNS records are correctly configured and DNS has propagated

## Additional Resources

- [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel documentation](https://vercel.com/docs)
- [Cloudflare DNS setup guide](https://developers.cloudflare.com/dns/manage-dns-records/)