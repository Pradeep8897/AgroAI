// apiConfig.js - Dynamically determine the backend API base URL
// Priority order:
//   1. User-saved URL in localStorage (Settings page)
//   2. AndroidBridge.getBackendUrl() from Kotlin (real device / APK)
//   3. VITE_API_BASE environment variable (web / dev builds)
//   4. Deployed Render backend (ultimate fallback)

const RENDER_BACKEND = 'https://agroai-backend-tu07.onrender.com/api';

const ensureApiSuffix = (url) => {
  if (!url) return RENDER_BACKEND;
  const trimmed = url.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const getApiBase = () => {
  // 1. User-configured URL from Settings (highest priority)
  try {
    const savedUrl = localStorage.getItem('agroai_backend_url');
    if (savedUrl && savedUrl.trim() !== '') {
      return ensureApiSuffix(savedUrl);
    }
  } catch (e) {
    console.error('Failed to read backend URL from localStorage:', e);
  }

  // 2. Native Android bridge (Kotlin getBackendUrl) — works on real APK installs
  if (window.AndroidBridge && typeof window.AndroidBridge.getBackendUrl === 'function') {
    try {
      const bridgeUrl = window.AndroidBridge.getBackendUrl();
      if (bridgeUrl && bridgeUrl.startsWith('http') && !bridgeUrl.includes('YOUR_DEPLOYED_URL')) {
        return ensureApiSuffix(bridgeUrl);
      }
    } catch (e) {
      console.error('Failed to fetch backend URL from Android Bridge:', e);
    }
  }

  // 3. Vite build-time environment variable (web production / dev builds)
  const envBase = import.meta.env.VITE_API_BASE;
  if (envBase) {
    return ensureApiSuffix(envBase);
  }

  // 4. Deployed Render backend — ultimate fallback for all environments
  return RENDER_BACKEND;
};

// NOTE: getApiBase() is called dynamically via this object's toString() method
// so the AndroidBridge (which loads async in WebView) is ready when the call is made.
export const API_BASE = {
  toString() {
    return getApiBase();
  }
};

