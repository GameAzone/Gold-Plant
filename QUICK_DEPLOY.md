# Quick Reference: Hostinger Deployment

## 🚀 Quick Deploy Steps

1. **Build the app**
   ```bash
   npm install
   npm run build
   ```
   OR run `build.bat` (Windows) or `bash build.sh` (Mac/Linux)

2. **Get FTP credentials from Hostinger**
   - Login to hpanel.hostinger.com
   - Go to Files → FTP Accounts
   - Copy: hostname, username, password

3. **Upload via FileZilla**
   - Host: your-ftp-hostname
   - Username: your-ftp-username
   - Password: your-ftp-password
   - Port: 21
   - Upload ALL files from `dist/` to `public_html/`

4. **Upload .htaccess**
   - Upload `/public/.htaccess` to `public_html/.htaccess`

5. **Enable SSL**
   - Hostinger Panel → Security → SSL
   - Enable Free SSL (Let's Encrypt)
   - Wait 5-10 minutes

6. **Test**
   - Visit your domain
   - Test installation on mobile

## 📂 What to Upload

```
FROM local 'dist/' → TO Hostinger 'public_html/'
├── index.html
├── manifest.json
├── service-worker.js
├── assets/ (entire folder)
└── icons/ (create and upload icons)

FROM 'public/.htaccess' → TO 'public_html/.htaccess'
```

## ⚠️ Common Issues

**404 on page refresh?**
→ Upload .htaccess file

**Not installable?**
→ Enable SSL/HTTPS in Hostinger

**Icons missing?**
→ Create icons and upload to public_html/icons/

## 🔗 Important Links

- Hostinger Panel: https://hpanel.hostinger.com
- FileZilla Download: https://filezilla-project.org
- Icon Generator: https://realfavicongenerator.net

## 📱 Required Icon Sizes

Create a 512x512px icon, then generate:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

Use: https://www.pwabuilder.com/imageGenerator

## ✅ Pre-Launch Checklist

- [ ] Build completed (`npm run build`)
- [ ] All files uploaded to public_html/
- [ ] .htaccess uploaded
- [ ] Icons created and uploaded
- [ ] SSL enabled
- [ ] Domain works
- [ ] PWA installable
- [ ] All pages load correctly

---

For detailed instructions, see: **HOSTINGER_DEPLOYMENT_GUIDE.md**
