// Importa os scripts do Firebase para o Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBQv3TDnOAZq783UPVKwmsjyGOBE678IrE",
    projectId: "free-talk-a4f07",
    messagingSenderId: "179521983087",
    appId: "1:179521983087:web:aa61e03e9b8b3f09d7b39a"
});

const messaging = firebase.messaging();

// Interceta mensagens push recebidas em segundo plano ou com app fechado
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Mensagem recebida em segundo plano: ', payload);

    const titulo = payload.notification ? payload.notification.title : "🚨 HORA DO REMÉDIO!";
    const corpo = payload.notification ? payload.notification.body : "Está na hora de tomar o seu medicamento.";

    const opcoes = {
        body: corpo,
        icon: 'https://cdn-icons-png.flaticon.com/512/883/883397.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/883/883397.png',
        vibrate: [1000, 500, 1000, 500, 1000],
        tag: 'alarme-remedio-urgente',
        renotify: true,
        requireInteraction: true, // Mantém a notificação no ecrã até que o idoso interaja
        actions: [
            { action: 'tomar', title: '✔️ JÁ TOMEI' }
        ]
    };

    self.registration.showNotification(titulo, opcoes);
});

// Ação ao clicar na notificação ou no botão dela
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