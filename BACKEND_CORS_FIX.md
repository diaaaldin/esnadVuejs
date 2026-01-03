# Backend CORS Fix for Program.cs

## Problem
CORS requests from `http://localhost:5173` to `https://cp.esnad.cloud` are being blocked because:
1. **301 Redirect Issue**: API requests are getting 301 (Moved Permanently) redirects, which breaks CORS. When a POST request gets redirected, browsers convert it to GET, causing CORS failures.
2. OPTIONS preflight requests are not being handled correctly
3. CORS middleware order might be interfering with authentication
4. HTTPS redirection is redirecting API endpoints, which should never be redirected

## Solution
Update your `Program.cs` file with the following changes:

### 1. Move CORS Middleware Before Authentication
The CORS middleware MUST be placed before authentication middleware to handle preflight requests.

### 2. Ensure OPTIONS Requests Are Handled
The custom HTTPS redirection middleware should skip OPTIONS requests (which it already does), but we need to ensure CORS handles them.

### 3. Updated Program.cs Section

Replace the middleware configuration section (around lines where you configure the pipeline) with this:

```csharp
var app = builder.Build();

// Only enable developer tools in development
//if (app.Environment.IsDevelopment())
//{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "EsnadApi v1"));
//}

// Logging configuration
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Minute)
    .CreateLogger();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<EsnadApiDbContext>();
    SeedData.SeedRolesAndSuperAdmin(context);
}

// Swagger configuration (only in development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "swagger/{documentName}/swagger.json";
        c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
        {
            swaggerDoc.Servers = new List<OpenApiServer>
            {
                new OpenApiServer { Url = $"{builder.Configuration.GetSection("Domain").Value}" }
            };
        });
    });
}

app.ConfigureExceptionHandler(Log.Logger, app.Environment);

// Security headers middleware - must be early in pipeline
app.UseMiddleware<SecurityHeadersMiddleware>();

// IMPORTANT: CORS must be applied BEFORE authentication and routing
// This ensures OPTIONS preflight requests are handled correctly
app.UseCors("CorsPolicy");

// HTTPS redirection - CRITICAL: Skip API endpoints and OPTIONS requests
// API endpoints should NEVER be redirected as this breaks CORS
app.Use(async (context, next) =>
{
    // Skip HTTPS redirection for:
    // 1. OPTIONS requests (CORS preflight)
    // 2. API endpoints (paths starting with /api)
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
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=600");
        
        // Add security headers to static files
        ctx.Context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        ctx.Context.Response.Headers.Append("X-Frame-Options", "DENY");
        
        // Only add HSTS to static files if HTTPS
        if (ctx.Context.Request.IsHttps && !app.Environment.IsDevelopment())
        {
            ctx.Context.Response.Headers.Append("Strict-Transport-Security", 
                "max-age=31536000; includeSubDomains; preload");
        }
    }
});

app.UseMiddleware<CaptureIpMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.UseEndpoints(endpoints =>
{
    //endpoints.MapHub<CallHub>("/api/NotificationMessage");
    endpoints.MapFallbackToFile("index.html"); // Redirect to index.html for unknown routes
});

app.Run();
```

### Key Changes:
1. **Moved `app.UseCors("CorsPolicy")` BEFORE `app.UseRouting()`** - This is critical for CORS to work properly
2. The CORS middleware now handles OPTIONS preflight requests before authentication kicks in
3. **CRITICAL FIX: HTTPS redirection now skips API endpoints** - API requests (`/api/*`) should NEVER be redirected, as this causes 301 redirects that break CORS
4. The HTTPS redirection middleware skips:
   - OPTIONS requests (CORS preflight)
   - API endpoints (paths starting with `/api`)
   - Localhost requests (development)

### 4. Verify CORS Configuration
Make sure your CORS policy configuration (earlier in the file) includes:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(
                "https://esnad.cloud", "https://www.esnad.cloud", "https://cp.esnad.cloud",
                "http://localhost:5173", "http://localhost:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()  // Important for withCredentials: true
            .WithExposedHeaders("Content-Disposition")
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});
```

### 5. Why 301 Redirects Break CORS

When a POST request to `/api/User/UserLogin` gets a 301 redirect:
1. Browser follows the redirect
2. **POST becomes GET** (browser behavior)
3. CORS preflight fails because the method changed
4. Request fails with CORS error

**Solution**: Never redirect API endpoints. The fix above ensures `/api/*` paths are never redirected.

### 6. Test the Fix
After applying these changes:
1. Restart your backend server
2. Clear browser cache
3. Test the API calls from `http://localhost:5173`
4. Check browser Network tab - you should NOT see 301 redirects for API requests

The CORS errors and 301 redirects should be resolved.

