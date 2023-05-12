// src/notificationMixin.ts
import { ComponentOptionsMixin } from 'vue';

const notificationMixin: ComponentOptionsMixin = {
  methods: {
    async requestNotificationPermission(): Promise<void> {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const hasShownWelcomeNotification = localStorage.getItem('hasShownWelcomeNotification');
        if (!hasShownWelcomeNotification) {
          this.showNotification('CookShare', 'Ora puoi ricevere notifiche dal nostro sito');
          localStorage.setItem('hasShownWelcomeNotification', 'true');
        }
      } else {
        console.error('Permesso notifiche non concesso');
      }
    },

    showNotification(title: string, body: string): void {
      const options = {
        body,
        'vibrate': [200, 100, 200]
      };
      new Notification(title, options);
    },
  },
  mounted() {
    if ('Notification' in window) {
      this.requestNotificationPermission();
    } else {
      console.error('Questo browser non supporta le notifiche push');
    }
  },
};

export default notificationMixin;