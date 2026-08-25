# Deployment Recipes

This page adds host-specific notes and common deployment scenarios beyond the
basics in the root `DEPLOYMENT.md`. If you are deploying BlockTrust for the first
time, start with `DEPLOYMENT.md`; come here when you need the details for a
specific host or a specific situation. All recipes assume you are deploying
from a clean checkout and that you bump `CACHE_NAME` in `sw.js` with each
release.

---

## GitHub Pages from a `docs/` subfolder

If you prefer to keep the app under `docs/` rather than the repository root
(for example, to keep root-level community files separate from the app), the
relative paths in `index.html` still work because they are relative to the
served folder. In **Settings → Pages**, set the folder to `/docs`. No code
change is needed as long as the entire app tree (`index.html`, `css/`, `js/`,
`assets/`, `sw.js`, `manifest.json`) lives under `docs/`.

---

## GitHub Pages with a custom domain

In **Settings → Pages → Custom domain**, enter your domain and enable *Enforce
HTTPS*. Add the DNS records GitHub instructs. Because BlockTrust uses only
relative paths and a manifest with a relative start URL, it works under a custom
domain without modification. Wait for the certificate to provision (can take up
to an hour) before verifying the service worker.

---

## Netlify with form-handling disabled

BlockTrust has no forms that post to a server, but Netlify's form detection can
occasionally intercept a form element. If the post-creation modal behaves oddly
on a Netlify deploy, add `data-netlify="false"` to the `<form>` in `index.html`
or add a `netlify.toml` with form detection disabled. This is rare but worth
knowing if you see unexpected behaviour.

A minimal `netlify.toml`:

```toml
[build]
  publish = "."
```

No build command is needed.

---

## Vercel with clean URLs

Vercel auto-detects static sites. Import the repo and set the output directory
to the root. If you want clean URLs and custom headers (e.g. for caching), add
a `vercel.json`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

BlockTrust has no server routes, so no rewrites are needed. Bump `CACHE_NAME`
per release as usual.

---

## S3 + CloudFront

1. Create an S3 bucket, disable public access blocking for static hosting (or
   use CloudFront Origin Access Control for a more secure setup), and enable
   static website hosting with `index.html` as the index document.
2. Upload all files with the correct content types. The AWS CLI preserves
   extensions, which usually suffices. Verify `.svg` is served as
   `image/svg+xml`.
3. Create a CloudFront distribution with the S3 bucket as the origin, the
   default root object set to `index.html`, and HTTPS viewers required.
4. After each release, invalidate the CloudFront cache (`/*`) so new visitors
   get the fresh files immediately, and bump `CACHE_NAME` so the service worker
   updates for returning visitors.

---

## nginx

A minimal server block:

```nginx
server {
    listen 80;
    server_name blocktrust.example.com;
    root /var/www/blocktrust;
    index index.html;
    try_files $uri /index.html;

    location ~* \.(svg|js|css|json)$ {
        expires 1h;
        add_header Cache-Control "public";
    }
}
```

Add TLS via Certbot or your preferred method. The `try_files` line ensures deep
links resolve to the app shell. The short cache TTL on assets means updates
propagate quickly; the service worker cache provides offline support regardless.

---

## Apache

Drop the files in the document root. An optional `.htaccess`:

```apache
FallbackResource /index.html
```

ensures deep links resolve. Ensure `mod_headers` is enabled if you want to set
cache headers. As always, serve over HTTPS for the service worker to function.

---

## Running behind a reverse proxy or subpath

BlockTrust uses relative paths, so it works under a subpath
(e.g. `https://example.com/apps/blocktrust/`) without modification as long as
the entire tree is served from that subpath. Ensure the reverse proxy does not
rewrite the asset paths. The manifest's start URL is relative, so installation
points to the correct origin and path.

---

## Verifying a deployment

Regardless of host, after deploying, open the site in a fresh browser profile
and run through the checklist in `DEPLOYMENT.md`: no console errors, both themes
work, posts persist, all six tabs function, the app is installable, and offline
works. If anything fails, first rule out a stale service worker before
investigating the code — it is the most common culprit.

---

## Rollback

Every deploy is a static file set tied to a commit. To roll back, redeploy the
previous commit through whatever mechanism your host provides (redeploy a
previous Pages commit, revert the push, re-upload the previous files, or
invalidate CloudFront after swapping files). There is no database to restore.
