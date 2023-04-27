import { createStore } from 'vuex';
import router from "@/router";
import { auth } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut 
} from 'firebase/auth';


export default createStore({
  state: {

    user: null     //riferimento all'utente

  },
  getters: {

    GET_USER(state){
      return state.user;
    }

  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },

    CLEAR_USER(state) {
      state.user = null;
    }
  },
  actions: {

    //login utente con email e password
    async login({commit}, details){

      //prende email e password dai parametri
      const { email, password } = details;

      //prova ad eseguire l'autenticazione con firebase
      await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

        //se non ci sono eccezioni aggiorna lo stato utente ed effettua un router alla home
        commit('SET_USER', userCredential.user);
        router.push('/');
      })
      .catch((error) => {
        //gestione degli errori
        switch(error.code){
          case "auth/user-not-found":
            alert("Email non trovata\nSicuro di esserti registrato con questa email?");
            break;
          case "auth/invalid-email":
            alert("Email non valida");
            break;
          case "auth/wrong-password":
            alert("Password errata");
            break;
          case "auth/user-disabled":
            alert("Utente disabilitato");
            break;
          default:
            alert("Errore sconosciuto:"+error);
            break;
        }
      });
    },

    //login utente con account google
    async loginWithGoogle({commit}){

      const provider = new GoogleAuthProvider();

      //esegue l'accesso tramite popup con account google
      signInWithPopup(auth, provider)
        .then((result) => {
          //se non ci sono eccezioni aggiorna lo stato utente ed effettua un router alla home
          commit('SET_USER', result.user);
          router.push('/');
        })
        .catch((error) => {
          //gestione dei codici di errore
          switch(error.code){
          case "auth/account-exists-with-different-credential":
            alert("L'account esiste con credenziali diverse");
            break;
          case "auth/cancelled-popup-request":
            alert("Autenticazione annullata");
            break;
          case "auth/popup-blocked":
            alert("il browser ha bloccato la finestra popup di autenticazione");
            break;
          case "auth/popup-closed-by-user":
            alert("Autenticazione interrotta");
            break;
          case "auth/internal-error":
            alert("Errore di rete");
            break;
          case "auth/unauthorized-domain":
            alert("Dominio non autorizzato per l'utilizzo delle API Firebase");
            break;
          default:
            alert("Errore sconosciuto:"+error);
            break;
        }
        });
    },

    //registrazione utente con email e password
    async register({commit}, details){
      const { email, password } = details;

      //registra un utente presso Firebase
      await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {

        //se non ci sono eccezioni aggiorna lo stato utente ed effettua un router alla home
        alert("Registrazione avvenuta con successo");
        commit('SET_USER', userCredential.user);
        router.push('/');
      })
      .catch((error) => {
        //gestione dei codici di errore
        switch(error.code){
          case "auth/email-already-in-use":
            alert("Questa email è già associata ad un account registrata");
            break;
          case "auth/invalid-email":
            alert("Email non valida");
            break;
          case "auth/operation-not-allowed":
            alert("utente non autorizzato");
            break;
          case "auth/weak-password":
            alert("Password non sufficientemente sicura");
            break;
          case "auth/network-request-failed":
            alert("errore di rete");
            break;
          default:
            alert("Errore sconosciuto:\n"+error);
            break;
        }
      });
    },

    //logout di un utente
    async logout({commit}){

      //effettua logout
      await signOut(auth).then(()=>{

        //se non ci sono errori
        commit('CLEAR_USER');
        router.push('/login');
      }).catch( (error) => {
        // gestione dei codici di errore
        switch (error.code) {
          case "auth/network-request-failed":
            alert("Errore di rete durante la richiesta di logout.");
            break;
          case "auth/too-many-requests":
            alert("Troppe richieste di logout effettuate.");
            break;
          case "auth/user-token-expired":
            alert("Il token dell'utente è scaduto.");
            break;
          case "auth/user-not-found":
            alert("Utente non trovato.");
            break;
          default:
            alert("Errore sconosciuto durante il logout.");
        }
      });

    },

    //funzione che monitora quando l'utente cambia stato (Login/Logout)
    fetchUser({commit}){
      auth.onAuthStateChanged(async user => {
        if(user === null){
          commit('CLEAR_USER');
        }
        else{
          commit('SET_USER', user);
        }
      });
    }

  },
  modules: {
  }
})
