# Quick Fix Guide - 301 Redirect CORS Issue

## The Problem
Your backend is returning `301 Moved Permanently` for API requests, which breaks CORS.

## Immediate Action Required

### Option 1: Fix Backend (RECOMMENDED - Permanent Solution)

**Update your `Program.cs` file** - Find the HTTPS redirection middleware and add this check:

```csharp
app.Use(async (context, next) =>
{
    // CRITICAL: Skip redirecting API endpoints
    if (context.Request.Method == "OPTIONS" || 
        context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase) ||
        context.Request.Host.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
    {
        await next();
        return;
    }
    
    // Only redirect non-API requests
    if (!context.Request.IsHttps)
    {
        var httpsUrl = $"https://{context.Request.Host}{context.Request.PathBase}{context.Request.Path}{context.Request.QueryString}";
        context.Response.Redirect(httpsUrl, permanent: true);
        return;
    }
    await next();
});
```

**The key line is**: `context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase)`

This prevents API requests from being redirected.

### Option 2: Check Reverse Proxy (nginx/IIS)

If you have nginx or IIS in front of your backend, they might be redirecting.

**For nginx**, update your config to not redirect `/api`:
```nginx
location /api {
    proxy_pass https://your_backend;
    # Don't redirect
}
```

**For IIS**, exclude `/api` from URL rewrite rules.

### Option 3: Temporary Development Workaround

If you can't fix the backend immediately, you can use a Vite proxy for development:

1. Open `vite.config.js`
2. Uncomment the proxy section in the `server` config
3. Update `config.js` to use relative URLs:

```javascript
// In src/config/config.js
export const Urls = {
  cpSite: '', // Use relative URL when proxy is enabled
};
```

**Note**: This only works in development. Production still needs the backend fix.

## Verification

After applying the fix, test with:

```bash
curl -I -X POST https://cp.esnad.cloud/api/User/UserLogin
```

Should return `200 OK` or `401 Unauthorized`, **NOT** `301 Moved Permanently`.

## Still Having Issues?

See `CORS_301_REDIRECT_DIAGNOSIS.md` for detailed troubleshooting steps.

