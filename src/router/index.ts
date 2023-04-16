import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { auth } from '@/firebase';

const routes: Array<RouteRecordRaw> = [
  { //path home
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  { //path about
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  { //path login
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


// middleware di navigazione per controllore che l'utente che naviga abbia i permessi
// per accedere a determinate pagine 
router.beforeEach((to, from, next)=>{
  
  // se un'utente loggato cerca di andare alla pagina di login, viene mandato alla pagine home
  if(to.path === '/login' && auth.currentUser){
    alert("sei già loggato!");
    next('/');
    return;
  }

  // se un utente non loggato cerca di andare in una pagina che richiede il login, viene mandato al login
  if(to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser){
    alert("devi loggarti!");
    next('/login');
    return;
  }

  // altrimenti la navigazione prosegue normalmente
  next();
});

export default router
