# Deploying AL EBREIZ PWA to Hostinger

## 📋 Prerequisites

- Hostinger account with hosting plan
- FTP/SFTP access credentials (from Hostinger panel)
- FileZilla or similar FTP client installed

## 🚀 Step-by-Step Deployment

### Step 1: Export Your Project from Figma Make

1. Download all project files from Figma Make
2. Save to a folder on your computer (e.g., `al-ebreiz-app`)

### Step 2: Set Up Node.js Locally

Open terminal/command prompt and navigate to your project folder:

```bash
cd al-ebreiz-app
```

Install dependencies:
```bash
npm install
```

### Step 3: Build for Production

Build the optimized production version:

```bash
npm run build
```

This creates a `dist` folder with all compiled files ready for deployment.

### Step 4: Get Hostinger FTP Credentials

1. Log in to **Hostinger Control Panel** (hpanel.hostinger.com)
2. Go to **Files** → **FTP Accounts**
3. Note down:
   - FTP Hostname (e.g., ftp.yourdomain.com)
   - FTP Username
   - FTP Password
   - Port (usually 21)

### Step 5: Upload Files via FTP

#### Option A: Using FileZilla (Recommended)

1. **Download FileZilla** from https://filezilla-project.org/
2. **Open FileZilla** and connect:
   - Host: Your FTP hostname
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Click **Quickconnect**
4. Navigate to `public_html` folder on the right side (remote server)
5. On the left side (local), navigate to your `dist` folder
6. Select ALL files inside the `dist` folder
7. Right-click → **Upload**
8. Wait for upload to complete

#### Option B: Using Hostinger File Manager

1. Go to **Hostinger Control Panel**
2. Click **File Manager**
3. Navigate to `public_html` folder
4. Click **Upload Files**
5. Select all files from your `dist` folder
6. Upload them

### Step 6: Configure .htaccess for React Router

Create or edit `.htaccess` file in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/manifest+json "access plus 1 week"
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Service Worker must have correct MIME type
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/manifest+json .json
</IfModule>
```

### Step 7: Upload App Icons

Make sure you create and upload app icons to `/public_html/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### Step 8: Test Your Deployment

1. Open your domain in browser (e.g., www.yourdomain.com)
2. Check if the app loads correctly
3. Test navigation (Dashboard, Trade, Wallet, etc.)
4. Test PWA installation:
   - On mobile: Look for "Install app" prompt
   - On desktop: Look for install icon in address bar

### Step 9: Verify PWA Functionality

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check:
   - ✅ Manifest loads correctly
   - ✅ Service Worker is registered
   - ✅ Icons are accessible
4. Run Lighthouse audit:
   - DevTools → Lighthouse → Select "Progressive Web App"
   - Click "Generate report"
   - Should score 90+ for PWA

## 🔧 Troubleshooting

### Issue: Pages show 404 error when refreshed
**Solution**: Make sure `.htaccess` file is properly uploaded and mod_rewrite is enabled on your Hostinger account.

### Issue: Service Worker not registering
**Solution**: 
1. Check browser console for errors
2. Ensure all paths in manifest.json are correct
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Icons not showing
**Solution**: 
1. Upload icons to `/public_html/icons/` folder
2. Check file permissions (should be 644)
3. Verify icon paths in manifest.json

### Issue: Install prompt not appearing
**Solution**:
1. App must be served over HTTPS (Hostinger provides free SSL)
2. Enable SSL in Hostinger panel: Security → SSL → Enable
3. Wait a few minutes for SSL to activate

## 📱 Enable SSL/HTTPS (Required for PWA)

PWAs MUST run on HTTPS. To enable:

1. Go to **Hostinger Control Panel**
2. Click **Security** → **SSL**
3. Enable **Free SSL Certificate** (Let's Encrypt)
4. Wait 5-10 minutes for activation
5. Enable **Force HTTPS** to redirect all traffic to HTTPS

## 🔄 Updating Your App

When you make changes:

1. Run `npm run build` locally
2. Upload only changed files from `dist` folder via FTP
3. Or upload everything to overwrite

**Important**: Users may need to refresh or reinstall the app to see updates. The service worker will auto-update on next visit.

## 📊 File Structure on Hostinger

```
public_html/
├── index.html
├── manifest.json
├── service-worker.js
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── .htaccess
```

## ✅ Post-Deployment Checklist

- [ ] App loads at your domain
- [ ] All pages work (Dashboard, Trade, Wallet, Transactions, Marketplace)
- [ ] Navigation works correctly
- [ ] HTTPS/SSL is enabled
- [ ] Service worker registers successfully
- [ ] Manifest.json loads
- [ ] Icons are visible
- [ ] Install prompt appears on mobile
- [ ] App can be installed to home screen
- [ ] Offline mode works

## 🎉 Success!

Your AL EBREIZ app is now live and installable as a PWA!

Share your domain with users and they can install it on their phones just like a native app.

## 💡 Quick Deploy Script (Optional)

Save this as `deploy.sh` to automate future deployments:

```bash
#!/bin/bash
echo "Building production..."
npm run build

echo "Deployment ready! Upload the 'dist' folder contents to Hostinger via FTP."
echo "Contents are in: ./dist/"
```

Run with: `bash deploy.sh`

## 📞 Support

If you encounter issues:
1. Check Hostinger documentation: https://support.hostinger.com
2. Contact Hostinger support via live chat
3. Check browser console for JavaScript errors
