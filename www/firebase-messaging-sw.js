// Importa os scripts do Firebase para o plano de fundo (Service Worker)
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDRIwmrRhv0k88UYu69UkdVqG3hUib4Nq0",
    authDomain: "free-talk-a4f07.firebaseapp.com",
    projectId: "free-talk-a4f07",
    storageBucket: "free-talk-a4f07.firebasestorage.app",
    messagingSenderId: "179521983087",
    appId: "1:179521983087:web:aa61e03e9b8b3f09d7b39a"
});

const messaging = firebase.messaging();

// Opcional: manipular notificações em segundo plano quando o app estiver fechado
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensagem recebida em segundo plano: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/883/883397.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});