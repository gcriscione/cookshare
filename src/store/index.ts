import { createStore } from 'vuex';
import router from "@/router";
import { auth, db } from '@/firebase';
import { User } from '@firebase/auth'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut 
} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { Recipe, Recipes } from '@/recipe';

// Interfaccia dello stato
interface MyState {
  user: User | null;
  recipes: Recipes;
}

export default createStore({
  state: {

    user: null,
    recipes: {}

  },
  getters: {

    GET_USER(state: MyState) : User | null{
      return state.user;
    },

    GET_EMAIL(state: MyState){
      return state.user?.email ?? "email non disponibile";
    },

    GET_RECIPES(state: MyState) : Recipes{
      return state.recipes ?? {};
    }

  },
  mutations: {
    SET_USER(state: MyState, user: User){
      state.user = user;
    },

    SET_RECIPES(state: MyState, recipes: Recipes) {
      state.recipes = recipes;
    },

    CLEAR_USER(state: MyState) {
      state.user = null;
      state.recipes = {};
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
            console.log("Autenticazione annullata");
            break;
          case "auth/popup-blocked":
            alert("il browser ha bloccato la finestra popup di autenticazione");
            break;
          case "auth/popup-closed-by-user":
            console.log("Autenticazione interrotta");
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
    async register({commit}, details: { email: string, password: string }){
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
          case "auth/admin-restricted-operation":
            alert("Operazione non consentita");
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
          // invoca la funzione 'getRecipes' per aggiornare lo stato delle ricette con i nuovi dati
          await this.dispatch('getRecipes');
        }
      });
    },

    
    // Funzione per salvare una ricetta nel database riferite all'utente corrente
    async addRecipe(_, newRecipe: Recipe ) :Promise<void> {
      try {
        // verifica che l'utente sia autenticato
        if(!this.state.user){
          console.error("utente non loggato");
          return ;
        }

        // ottiene l'ID dell'utente corrente
        const userId = this.state.user.uid; 

        // crea un riferimento collezione che contiene tutti i documenti delle ricette dell'utente corrente (users/USER_ID/recipes/)
        const userRecipesRef = collection(db, "user", userId, "recipes");

        // aggiunge alla collezione recipes il documento che contiene la nuova ricetta
        await addDoc(userRecipesRef, newRecipe);        

        // invoca la funzione 'getRecipes' per aggiornare lo stato delle ricette con i nuovi dati
        await this.dispatch('getRecipes');
        } catch (error) {
          console.error("addRecipe:\nError saving recipe to database\n"+error);
        }
    },

    // Funzione per prelevare le ricette nel database riferite all'utente corrente
    async getRecipes({ commit }): Promise<void> {
      // verifica che l'utente sia autenticato
      if(!this.state.user){
        console.error("utente non loggato");
        return ;
      }

      // ottiene l'ID dell'utente corrente
      const userId = this.state.user.uid; 

      // crea un riferimento collezione che contiene tutti i documenti delle ricette dell'utente corrente (users/USER_ID/recipes/)
      const userRecipesRef = collection(db, "user", userId, "recipes");
      
      // recupera tutti i documenti delle ricette dell'utente corrente
      const userRecipesDocs = await getDocs(userRecipesRef);
      const recipes : Recipes = {};
      userRecipesDocs.forEach((doc) => {
        recipes[doc.id] = (doc.data() as Recipe);
      });

      commit('SET_RECIPES', recipes);
    },

    // Funzione per modificare una ricetta
    async editRecipe(_, { recipeId, updatedRecipe }: { recipeId: string; updatedRecipe: Recipe }) :Promise<void> {
      try {
        // verifica che l'utente sia autenticato
        if (!this.state.user) {
          console.error("utente non loggato");
          return;
        }

        // ottiene l'ID dell'utente corrente
        const userId = this.state.user.uid;

        // crea un riferimento al documento della ricetta che si desidera modificare (users/USER_ID/recipes/RECIPE_ID)
        const recipeDocRef = doc(db, "user", userId, "recipes", recipeId);

        // aggiorna il documento con i nuovi dati della ricetta
        await updateDoc(recipeDocRef, { ...updatedRecipe });

        // invoca la funzione 'getRecipes' per aggiornare lo stato delle ricette con i nuovi dati
        await this.dispatch('getRecipes');
      } catch (error) {
        console.error("editRecipe:\nError updating recipe in database\n" + error);
      }
    },

    // Funzione per eliminare una ricetta
    async removeRecipe(_, recipeId: string) :Promise<void> {
      try {
        // verifica che l'utente sia autenticato
        if (!this.state.user) {
          console.error("utente non loggato");
          return;
        }

        // ottiene l'ID dell'utente corrente
        const userId = this.state.user.uid;

        // crea un riferimento alla collezione delle ricette dell'utente corrente (users/USER_ID/recipes/)
        const userRecipesRef = collection(db, "user", userId, "recipes");

        // crea un riferimento al documento della ricetta che si desidera eliminare
        const recipeDocRef = doc(userRecipesRef, recipeId);

        // elimina il documento della ricetta utilizzando deleteDoc
        await deleteDoc(recipeDocRef);

        // invoca la funzione 'getRecipes' per aggiornare lo stato delle ricette dopo l'eliminazione
        await this.dispatch('getRecipes');
      } catch (error) {
        console.error("removeRecipe:\nError removing recipe from database\n" + error);
      }
    }

  },
  modules: {
  }
})
