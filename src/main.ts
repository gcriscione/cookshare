import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { auth } from '@/firebase';


// Wait for Firebase to finish initializing and verify the user's authentication state
auth.onAuthStateChanged(() => {
    createApp(App).use(store).use(router).mount('#app')
  });