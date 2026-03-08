import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Download, X, WifiOff } from "lucide-react";
import { isAppInstalled, promptInstall } from "../utils/pwa";

export function PWABanner() {
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // Check if already installed
    const installed = isAppInstalled();
    setIsInstalled(installed);
    console.log('[PWABanner] App installed:', installed);

    // Show install banner if not installed
    if (!installed) {
      const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
      console.log('[PWABanner] Banner dismissed before:', !!bannerDismissed);
      if (!bannerDismissed) {
        // Show banner after 3 seconds
        console.log('[PWABanner] Scheduling banner to show in 3 seconds...');
        setTimeout(() => {
          console.log('[PWABanner] Showing install banner now');
          setShowInstallBanner(true);
        }, 3000);
      }
    }

    // Network status
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = () => {
    promptInstall();
    setShowInstallBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  return (
    <>
      {/* Install Banner */}
      {showInstallBanner && !isInstalled && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top">
          <Card className="border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">
                    Install AL EBREIZ App
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Install our app for quick access and offline functionality!
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleInstall}
                      className="bg-amber-600 hover:bg-amber-700"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant="outline"
                      size="sm"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Offline Indicator */}
      {!online && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
          <Card className="border-red-600 bg-red-50">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  You're offline. Some features may be limited.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

