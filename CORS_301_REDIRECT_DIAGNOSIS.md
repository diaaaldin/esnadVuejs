# CORS 301 Redirect Diagnosis and Fix

## Current Problem
- **Error**: `POST https://cp.esnad.cloud/api/User/UserLogin net::ERR_FAILED 301 (Moved Permanently)`
- **CORS Error**: No 'Access-Control-Allow-Origin' header is present
- **Root Cause**: The backend (or a reverse proxy) is redirecting API requests, which breaks CORS

## Why 301 Redirects Break CORS

When a POST request gets a 301 redirect:
1. Browser automatically follows the redirect
2. **POST method becomes GET** (browser standard behavior)
3. CORS preflight fails because method changed
4. Request fails with CORS error

## Possible Causes

### 1. Backend HTTPS Redirection Middleware (Most Likely)
Your `Program.cs` has a custom HTTPS redirection middleware that might be redirecting API requests.

### 2. Reverse Proxy (nginx, IIS, etc.)
If you have nginx, IIS, or another reverse proxy in front of your backend, it might be redirecting HTTP to HTTPS.

### 3. Load Balancer
A load balancer might be configured to redirect HTTP to HTTPS.

## Step-by-Step Diagnosis

### Step 1: Check Backend Program.cs

Look for the HTTPS redirection middleware. It should look like this:

```csharp
app.Use(async (context, next) =>
{
    // Skip HTTPS redirection for:
    // 1. OPTIONS requests (CORS preflight)
    // 2. API endpoints (paths starting with /api)  ← MUST HAVE THIS
    // 3. Localhost in development
    if (context.Request.Method == "OPTIONS" || 
        context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase) ||
        context.Request.Host.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
    {
        await next();
        return;
    }
    
    // Only redirect non-API, non-localhost HTTP requests to HTTPS
    if (!context.Request.IsHttps)
    {
        var httpsUrl = $"https://{context.Request.Host}{context.Request.PathBase}{context.Request.Path}{context.Request.QueryString}";
        context.Response.Redirect(httpsUrl, permanent: true);
        return;
    }
    await next();
});
```

**CRITICAL**: The line `context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase)` MUST be present.

### Step 2: Check for Reverse Proxy (nginx)

If you're using nginx, check your nginx configuration file (usually `/etc/nginx/sites-available/default` or similar):

```nginx
# BAD - This redirects ALL requests including API
server {
    listen 80;
    server_name cp.esnad.cloud;
    return 301 https://$server_name$request_uri;
}

# GOOD - Skip API endpoints
server {
    listen 80;
    server_name cp.esnad.cloud;
    
    # Don't redirect API endpoints
    location /api {
        proxy_pass https://backend_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Redirect everything else to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}
```

### Step 3: Check IIS Configuration

If using IIS, check the URL Rewrite rules. You might have a rule that redirects HTTP to HTTPS for all requests.

**Fix**: Add a condition to exclude `/api` paths:

```xml
<rule name="Redirect HTTP to HTTPS" stopProcessing="true">
    <match url=".*" />
    <conditions>
        <add input="{HTTPS}" pattern="off" />
        <!-- Exclude API endpoints -->
        <add input="{REQUEST_URI}" pattern="^/api" negate="true" />
    </conditions>
    <action type="Redirect" url="https://{HTTP_HOST}{REQUEST_URI}" redirectType="Permanent" />
</rule>
```

### Step 4: Check Load Balancer (AWS, Azure, etc.)

If using a cloud load balancer:
- AWS ALB/ELB: Check listener rules
- Azure Load Balancer: Check rules
- Cloudflare: Check Page Rules (might be redirecting)

## Quick Test

To verify what's causing the redirect, test directly with curl:

```bash
# Test if backend redirects
curl -I -X POST https://cp.esnad.cloud/api/User/UserLogin

# If you see "301 Moved Permanently", something is redirecting
# Check the Location header to see where it's redirecting to
```

## Complete Backend Fix

Update your `Program.cs` middleware pipeline to this exact order:

```csharp
var app = builder.Build();

// ... (your existing code for Swagger, logging, etc.) ...

app.ConfigureExceptionHandler(Log.Logger, app.Environment);

// Security headers middleware - must be early in pipeline
app.UseMiddleware<SecurityHeadersMiddleware>();

// CRITICAL: CORS must be FIRST, before any redirects
app.UseCors("CorsPolicy");

// HTTPS redirection - MUST skip API endpoints
app.Use(async (context, next) =>
{
    // Skip HTTPS redirection for:
    // 1. OPTIONS requests (CORS preflight)
    // 2. API endpoints (paths starting with /api)  ← CRITICAL
    // 3. Localhost in development
    if (context.Request.Method == "OPTIONS" || 
        context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase) ||
        context.Request.Host.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
    {
        await next();
        return;
    }
    
    // Only redirect non-API, non-localhost HTTP requests to HTTPS
    if (!context.Request.IsHttps)
    {
        var httpsUrl = $"https://{context.Request.Host}{context.Request.PathBase}{context.Request.Path}{context.Request.QueryString}";
        context.Response.Redirect(httpsUrl, permanent: true);
        return;
    }
    await next();
});

// Additional HTTPS enforcement for production (backup)
// BUT this should also not redirect API endpoints
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection(); // This might also need to be conditional
}

app.UseRouting();

// ... rest of your middleware ...
```

## After Applying Fix

1. **Restart your backend server**
2. **Restart any reverse proxy (nginx, IIS)**
3. **Clear browser cache**
4. **Test with curl first**:
   ```bash
   curl -I -X POST https://cp.esnad.cloud/api/User/UserLogin
   ```
   Should return `200 OK` or `401 Unauthorized`, NOT `301 Moved Permanently`

5. **Test from frontend** - The CORS error should be resolved

## If Still Not Working

If you still see 301 redirects after applying all fixes:

1. **Check server logs** - See what's handling the request
2. **Test backend directly** - Bypass any reverse proxy
3. **Check DNS/CDN** - Cloudflare or other CDN might be redirecting
4. **Contact hosting provider** - They might have redirect rules at infrastructure level

