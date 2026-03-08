// Service Worker Registration
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('[PWA] Attempting to register service worker...');
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New service worker available');
                  // New service worker available, prompt user to refresh
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    });
  } else {
    console.warn('[PWA] Service Workers not supported in this browser');
  }
}

// Check if app is installed
export function isAppInstalled() {
  const installed = window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
  console.log('[PWA] App installed check:', installed);
  return installed;
}

// Prompt for installation
let deferredPrompt: any = null;

export function setupInstallPrompt() {
  console.log('[PWA] Setting up install prompt listener...');
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt event fired - app is installable');
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Update UI to notify the user they can install the PWA
    console.log('[PWA] Install prompt ready to show');
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;
  });
}

export function promptInstall() {
  console.log('[PWA] Prompt install called, deferredPrompt:', !!deferredPrompt);
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    console.warn('[PWA] No deferred prompt available - PWA may not be installable');
  }
}

// Network status
export function setupNetworkStatus() {
  console.log('[PWA] Setting up network status listeners...');
  
  window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    // Trigger sync if needed
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration: any) => {
        return registration.sync.register('sync-transactions');
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Gone offline');
  });
}

// Check network status
export function isOnline() {
  return navigator.onLine;
}
