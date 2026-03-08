import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";
import { registerServiceWorker, setupInstallPrompt, setupNetworkStatus } from "./utils/pwa";

export default function App() {
  useEffect(() => {
    // Register PWA features
    registerServiceWorker();
    setupInstallPrompt();
    setupNetworkStatus();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}