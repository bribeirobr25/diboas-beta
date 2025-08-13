# DNS Configuration for diBoaS Subdomains

## Required DNS Records

Configure these records in your domain provider's DNS settings (where you manage `diboas.com`):

### A Records (GitHub Pages IPs)
```
diboas.com                  A    185.199.108.153
diboas.com                  A    185.199.109.153  
diboas.com                  A    185.199.110.153
diboas.com                  A    185.199.111.153
```

### CNAME Records (Subdomains)
```
dapp.diboas.com            CNAME    bribeirobr25.github.io
docs.diboas.com            CNAME    bribeirobr25.github.io
learn.diboas.com           CNAME    bribeirobr25.github.io
mascots.diboas.com         CNAME    bribeirobr25.github.io
investors.diboas.com       CNAME    bribeirobr25.github.io
b2b.diboas.com             CNAME    bribeirobr25.github.io
```

## DNS Provider Instructions

### Cloudflare
1. Go to Cloudflare dashboard
2. Select your `diboas.com` domain
3. Go to **DNS > Records**
4. Add the A records and CNAME records above
5. Set Proxy status to **Proxied** (orange cloud)

### GoDaddy
1. Go to GoDaddy DNS Management
2. Select your domain
3. Add A records pointing to GitHub Pages IPs
4. Add CNAME records for each subdomain

### Namecheap
1. Go to Domain List > Manage
2. Select **Advanced DNS**
3. Add A Records and CNAME records as shown above

### Google Domains
1. Go to DNS settings
2. Add Custom records
3. Create A records and CNAME records

## Verification

After configuring DNS (wait 10-15 minutes for propagation):

```bash
# Test DNS resolution
dig diboas.com
dig dapp.diboas.com
dig docs.diboas.com
dig learn.diboas.com
dig mascots.diboas.com  
dig investors.diboas.com
dig b2b.diboas.com

# Or use online tools:
# https://whatsmydns.net/
```

## GitHub Pages Configuration

After DNS is configured, enable GitHub Pages for each repository:

1. Go to each repository settings
2. Navigate to **Pages** section
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Custom domain: **Enter the subdomain** (e.g., `dapp.diboas.com`)
6. Check **Enforce HTTPS** (after domain verification)

## Timeline

- **DNS propagation**: 5-60 minutes
- **GitHub Pages activation**: 10-15 minutes
- **SSL certificate**: 15-30 minutes after domain verification
- **Total time**: 30-90 minutes

## Troubleshooting

### Subdomain not working
- Check DNS propagation: `dig subdomain.diboas.com`
- Verify CNAME file exists in repository
- Check GitHub Pages settings

### SSL certificate issues
- Wait for domain verification to complete
- Make sure DNS points to GitHub Pages
- Check repository settings > Pages > Custom domain

### 404 errors
- Verify `index.html` exists in repository root
- Check GitHub Actions deployment logs
- Ensure repository is public

## Alternative: Cloudflare Pages

If GitHub Pages gives you trouble, you can use Cloudflare Pages:

1. Connect each GitHub repository to Cloudflare Pages
2. Set custom domains directly in Cloudflare
3. Automatic SSL and CDN
4. Better performance than GitHub Pages