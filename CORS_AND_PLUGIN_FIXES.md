# CORS and Vue Plugin Fixes

## Issues Fixed

### 1. ✅ Vue Plugin Warning Fixed
**Problem:** `[Vue warn]: A plugin must either be a function or an object with an "install" function.`

**Root Cause:** 
- `vue-axios` was being used incorrectly for Vue 3
- The store was using Vue 2 syntax (`new Vuex.Store()` and creating an app instance in store file)

**Fixes Applied:**

#### Frontend Changes:

1. **src/main.js:**
   - Removed `vue-axios` import and usage
   - Using axios directly via `app.config.globalProperties` (Vue 3 way)
   - Added `app.provide('axios', axios)` for dependency injection support

2. **store/index.js:**
   - Changed from `import Vuex from "vuex"` and `new Vuex.Store()` to `import { createStore } from "vuex"` and `createStore()`
   - Removed unnecessary `createApp()` and `app.use(Vuex)` calls (Vue 2 leftovers)

3. **src/apis/Api.js:**
   - Added `withCredentials: true` to ensure credentials are sent with CORS requests
   - Added `timeout: 30000` for better error handling

### 2. ✅ CORS Configuration

**Problem:** `Access to XMLHttpRequest at 'https://cp.esnad.cloud/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Root Cause:** 
- CORS middleware was placed after authentication middleware
- OPTIONS preflight requests were not being handled correctly

**Solution:**
See `BACKEND_CORS_FIX.md` for detailed backend changes. The key fix is:
- Move `app.UseCors("CorsPolicy")` **BEFORE** `app.UseRouting()` and authentication middleware
- This ensures OPTIONS preflight requests are handled before authentication

## Files Modified

### Frontend:
- ✅ `src/main.js` - Removed vue-axios, fixed plugin usage
- ✅ `store/index.js` - Updated to Vue 3 Vuex syntax
- ✅ `src/apis/Api.js` - Added withCredentials and timeout

### Backend (Instructions Provided):
- See `BACKEND_CORS_FIX.md` for Program.cs changes

## Testing

After applying these fixes:

1. **Frontend:** Restart your dev server (`npm run dev`)
2. **Backend:** Apply the CORS fix from `BACKEND_CORS_FIX.md` and restart your backend server
3. **Browser:** Clear cache and test API calls from `http://localhost:5173`

## Notes

- `vue-axios` is no longer needed in Vue 3 - axios can be used directly
- Components can still access axios via `this.$http` or `this.$axios` (backward compatible)
- The store now uses Vue 3's `createStore` API instead of Vue 2's `new Vuex.Store()`

