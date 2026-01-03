# Console Errors Fix Guide

## Issues Fixed

### 1. ✅ X-Frame-Options Meta Tag Warning
**Error:** `X-Frame-Options may only be set via an HTTP header sent along with a document. It may not be set inside <meta>.`

**Fix Applied:**
- Removed `X-Frame-Options` from meta tags in `index.html`
- This header MUST be set on the server side (see server configuration below)

**Server Configuration Required:**
Add `X-Frame-Options: DENY` header to your web server configuration.

### 2. ⚠️ Vue Plugin Warning
**Error:** `[Vue warn]: A plugin must either be a function or an object with an "install" function.`

**Status:** Added error handling for VueAxios plugin. If this error persists, you may need to:
- Update `vue-axios` to the latest version
- Or remove vue-axios and use axios directly (already available via `this.$http`)

### 3. ⚠️ Boolean Props Warning (Widespread Issue)
**Error:** `Invalid prop: type check failed for prop "swipeClose". Expected Boolean, got String with value "true".`

**Problem:** Throughout the codebase, boolean props for `moshaToast` are being passed as strings (`'true'`, `'false'`) instead of actual booleans (`true`, `false`).

**Files Affected:** 27 files with 1257+ instances

**Pattern to Fix:**
```javascript
// ❌ WRONG (current):
this.$moshaToast('Message', {
    hideProgressBar: 'false',  // String
    showIcon: 'true',          // String
    swipeClose: 'true',        // String
    type: 'success',
    timeout: 3000,
});

// ✅ CORRECT:
this.$moshaToast('Message', {
    hideProgressBar: false,    // Boolean
    showIcon: true,            // Boolean
    swipeClose: true,          // Boolean
    type: 'success',
    timeout: 3000,
});
```

**Files Already Fixed:**
- `src/Views/User/Login.vue`
- `src/Views/Main/Reports.vue`

**Remaining Files to Fix:**
- `src/Views/Main/Reports/DestinationsBenefitsReport.vue`
- `src/Views/Main/Reports/DestinationsReport.vue`
- `src/Views/Main/Reports/ItemsReport.vue`
- `src/Views/Main/Reports/FundersReport.vue`
- `src/Views/Main/Reports/GeneralReport.vue`
- `src/Views/Main/PeopleManagement.vue`
- `src/Views/Main/Profile.vue`
- `src/Views/Main/ProjectsManagement.vue`
- `src/Views/Main/Financial/Incoms.vue`
- `src/Views/Main/Financial/FinancialSummary.vue`
- `src/Views/Main/Financial/Outcoms.vue`
- `src/Views/Main/Users/TeamMempers.vue`
- `src/Views/Main/Users/TeamLeaders.vue`
- `src/Views/Main/Users/Teams.vue`
- `src/Views/Main/Users/Admins.vue`
- `src/Views/Main/Financial/Wallets.vue`
- `src/Views/Main/Code/FundWays.vue`
- `src/Views/Main/Code/Currencies.vue`
- `src/Views/Main/Code/Destinations.vue`
- `src/Views/Main/Code/Items.vue`
- `src/Views/Main/Code/ItemsMountTypes.vue`
- `src/Views/Main/Code/Photographers.vue`
- `src/Views/Main/Code/Projects.vue`
- `src/Views/Main/Code/Funders.vue`
- `src/Views/Main/ProjectsPeopleManagement.vue`

## Quick Fix Script

You can use find-and-replace in your IDE to fix all instances:

**Find:**
```regex
hideProgressBar:\s*['"]false['"]
showIcon:\s*['"]true['"]
swipeClose:\s*['"]true['"]
```

**Replace with:**
```javascript
hideProgressBar: false
showIcon: true
swipeClose: true
```

Or use this PowerShell script (run from project root):
```powershell
Get-ChildItem -Path "src/Views" -Recurse -Filter "*.vue" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace "hideProgressBar:\s*['""]false['""]", "hideProgressBar: false"
    $content = $content -replace "showIcon:\s*['""]true['""]", "showIcon: true"
    $content = $content -replace "swipeClose:\s*['""]true['""]", "swipeClose: true"
    Set-Content -Path $_.FullName -Value $content -NoNewline
}
```

## Tracking Prevention Warnings

**Warning:** `Tracking Prevention blocked access to storage for <URL>`

**Explanation:** This is a browser privacy feature (Microsoft Edge/Chrome) that blocks third-party storage access. This is normal and doesn't affect functionality. It's related to:
- Browser privacy settings
- Third-party cookies/storage policies
- Not a code error

**Action:** No action needed - this is expected browser behavior.

## Next Steps

1. ✅ X-Frame-Options - Fixed (remove from meta, add to server)
2. ⚠️ Vue Plugin - Added error handling
3. ⚠️ Boolean Props - Fix remaining files using the pattern above
4. ℹ️ Tracking Prevention - No action needed

## Server Configuration for X-Frame-Options

### IIS (web.config):
```xml
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <add name="X-Frame-Options" value="DENY" />
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

### Nginx:
```nginx
add_header X-Frame-Options "DENY" always;
```

### Apache (.htaccess):
```apache
Header set X-Frame-Options "DENY"
```

