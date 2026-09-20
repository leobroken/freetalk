importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBQv3TDnOAZq783UPVKwmsjyGOBE678IrE",
    authDomain: "free-talk-a4f07.firebaseapp.com",
    projectId: "free-talk-a4f07",
    storageBucket: "free-talk-a4f07.firebasestorage.app",
    messagingSenderId: "179521983087",
    appId: "1:179521983087:web:aa61e03e9b8b3f09d7b39a",
});

const messaging = firebase.messaging();

// Captura notificações push quando o app está fechado ou em segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Mensagem recebida em segundo plano:', payload);
    
    const titulo = payload.notification?.title || "🚨 HORA DO REMÉDIO!";
    const corpo = payload.notification?.body || "Está na hora de tomar o seu medicamento.";

    const opcoes = {
        body: corpo,
        icon: "https://cdn-icons-png.flaticon.com/512/883/883397.png",
        vibrate: [1000, 500, 1000, 500],
        tag: "alerta-remedio",
        renotify: true,
        requireInteraction: true
    };

    self.registration.showNotification(titulo, opcoes);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});