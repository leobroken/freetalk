self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Mantém o Service Worker ativo e reage a mensagens de segundo plano
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'MANTER_ATIVO') {
        console.log('[sw.js] Sinal de app ativo recebido.');
    }
});

// Ouve disparos push vindos do servidor ou alarmes agendados
self.addEventListener('push', (event) => {
    const titulo = "🚨 HORA DO REMÉDIO!";
    const opcoes = {
        body: "Está na hora de tomar o seu medicamento. Toque em qualquer lugar da tela para confirmar.",
        icon: 'https://cdn-icons-png.flaticon.com/512/883/883397.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/883/883397.png',
        vibrate: [1000, 500, 1000, 500, 1000],
        tag: 'alarme-remedio-urgente',
        renotify: true,
        requireInteraction: true
    };

    event.waitUntil(
        self.registration.showNotification(titulo, opcoes)
    );
});

// Ação ao tocar na notificação: abre o app e dá foco imediato
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});