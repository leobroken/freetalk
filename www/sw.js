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

// Captura mensagens push se houver
messaging.onBackgroundMessage((payload) => {
    const titulo = payload.notification?.title || "🚨 HORA DO REMÉDIO!";
    const corpo = payload.notification?.body || "Está na hora de tomar o seu medicamento.";
    mostrarAlertaNativo(titulo, corpo);
});

function mostrarAlertaNativo(titulo, corpo) {
    const opcoes = {
        body: corpo,
        icon: "https://cdn-icons-png.flaticon.com/512/883/883397.png",
        vibrate: [1000, 500, 1000, 500, 1000, 500],
        tag: "alerta-remedio-urgente",
        renotify: true,
        requireInteraction: true,
        actions: [
            { action: 'tomar', title: '✔️ JÁ TOMEI' }
        ]
    };
    self.registration.showNotification(titulo, opcoes);
}

// Escuta disparos de sincronização em segundo plano ou alarmes do sistema
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'verificar-remedios-alarmes') {
        event.waitUntil(verificarHorariosPendentesNoBackground());
    }
});

async function verificarHorariosPendentesNoBackground() {
    // Acorda o worker para verificar o IndexedDB ou Cache se houver remédios no minuto atual
    console.log("[sw.js] Verificação periódica em segundo plano executada.");
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});