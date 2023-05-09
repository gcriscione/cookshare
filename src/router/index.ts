import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { auth } from '@/firebase';

const routes: Array<RouteRecordRaw> = [
  { //path login
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  { //path home
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/creator',
    name: 'creator',
    component: () => import('../views/RecipeCreatorView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  // Route catch-all per gestire gli URL non validi
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Variable to keep track of whether the app has been initialized
let appInitialized = false;

// Set up an observer for when the authentication state changes (e.g., user logs in or out)
// This helps ensure that the app is aware of the current user's authentication status
auth.onAuthStateChanged(() => {
  appInitialized = true;
});

// middleware di navigazione per controllore che l'utente che naviga abbia i permessi
// per accedere a determinate pagine 
router.beforeEach((to, from, next)=>{

  const waitForFirebase = () => {
    // Check if the app is initialized
    if (appInitialized) {
      // If a logged-in user tries to go to the login page, redirect them to the home page
      if (to.name === 'login' && auth.currentUser) {
        next('/');
        return;
      }

      // If a non-logged-in user tries to go to a page that requires login, redirect them to the login page
      if(to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser){
        next('/login');
        return;
      }

      // Otherwise, proceed with the navigation as normal
      next();
    } 
    else {
      // If the app is not initialized yet, wait for 50 milliseconds and then check again
      setTimeout(waitForFirebase, 50);
    }
  };

  // Call the 'waitForFirebase' function to handle the navigation based on the current authentication state
  waitForFirebase();
});

export default router
