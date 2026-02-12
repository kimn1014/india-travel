'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered, scope:', registration.scope);

          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowUpdate(true);
          }

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setShowUpdate(true);
                }
              });
            }
          });

          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-14 md:top-18 left-1/2 -translate-x-1/2 z-[60] animate-toast-in">
      <div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-3 text-sm border border-neutral-200 dark:border-neutral-700">
        <span>새 버전이 있습니다</span>
        <button
          onClick={handleUpdate}
          className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors"
        >
          업데이트
        </button>
        <button
          onClick={() => setShowUpdate(false)}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
