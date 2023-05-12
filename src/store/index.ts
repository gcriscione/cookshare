import { createStore } from 'vuex';
import router from "@/router";
import { auth, db, storage } from '@/firebase';
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
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  FirestoreError
} from 'firebase/firestore';
import { 
  ref,
  deleteObject
} from 'firebase/storage';
import { Recipe, Recipes } from '@/recipe';

// Interfaccia dello stato
interface MyState {
  user: User | null;
  recipes: Recipes;
  socialRecipes: Recipes;
}

export default createStore({
  state: {

    user: null,           // user reference
    recipes: {},          // user's personal recipes
    socialRecipes: {}     // shared recipes of other users

  },
  getters: {

    GET_USER(state: MyState) : User | null{
      return state.user;
    },

    GET_ID_USER(state: MyState){
      return state.user?.uid ?? "";
    },

    GET_EMAIL(state: MyState){
      return state.user?.email ?? "email non disponibile";
    },

    GET_RECIPES(state: MyState) : Recipes{
      return state.recipes;
    },

    GET_SOCIAL_RECIPES(state: MyState) : Recipes{
      return state.socialRecipes;
    }

  },
  mutations: {
    SET_USER(state: MyState, user: User){
      state.user = user;
    },

    SET_RECIPES(state: MyState, recipes: Recipes) {
      state.recipes = recipes;
    },

    SET_SOCIAL_RECIPES(state: MyState, socialRecipes: Recipes) {
      state.socialRecipes = socialRecipes;
    },

    CLEAR_USER(state: MyState) {
      state.user = null;
      state.recipes = {};
      state.socialRecipes = {}
    }
  },
  actions: {

    //login utente con email e password
    async login({commit}, details){

      //prende email e password dai parametri
      const { email, password } = details;

      //prova ad eseguire l'autenticazione con firebase
      await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {

        //se non ci sono eccezioni aggiorna lo stato utente ed effettua un router alla home
        commit('SET_USER', userCredential.user);
        await this.dispatch('getRecipes');
        await this.dispatch('getSocialRecipes');
        router.push('/');
      })
      .catch((error) => {
        //gestione degli errori
        switch(error.code){
          case "auth/user-not-found":
            throw new Error("Email non trovata\nSicuro di esserti registrato con questa email?");
          case "auth/invalid-email":
            throw new Error("Email non valida");
          case "auth/wrong-password":
            throw new Error("Password errata");
          case "auth/user-disabled":
            throw new Error("Utente disabilitato");
          default:
            throw new Error("Errore sconosciuto:"+error);
        }
      });
    },

    //login utente con account google
    async loginWithGoogle({commit}){

      const provider = new GoogleAuthProvider();

      //esegue l'accesso tramite popup con account google
      signInWithPopup(auth, provider)
        .then(async (result) => {
          //se non ci sono eccezioni aggiorna lo stato utente ed effettua un router alla home
          commit('SET_USER', result.user);
          await this.dispatch('getRecipes');
          await this.dispatch('getSocialRecipes');
          router.push('/');
        })
        .catch((error) => {
          //gestione dei codici di errore
          switch(error.code){
          case "auth/account-exists-with-different-credential":
            throw new Error("L'account esiste con credenziali diverse");
          case "auth/cancelled-popup-request":
            console.log("Autenticazione annullata");
            break;
          case "auth/popup-blocked":
            throw new Error("il browser ha bloccato la finestra popup di autenticazione");
          case "auth/popup-closed-by-user":
            console.log("Autenticazione interrotta");
            break;
          case "auth/internal-error":
            throw new Error("Errore di rete");
          case "auth/unauthorized-domain":
            throw new Error("Dominio non autorizzato per l'utilizzo delle API Firebase");
          default:
            throw new Error("Errore sconosciuto:"+error);
        }
        });
    },

    //registrazione utente con email e password
    async register({commit}, details: { email: string, password: string }){
      const { email, password } = details;

      //registra un utente presso Firebase
      await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {

        //se non ci sono eccezioni aggiorna lo stato utente ed effettua un router alla home
        commit('SET_USER', userCredential.user);
        router.push('/');
      })
      .catch((error) => {
        //gestione dei codici di errore
        switch(error.code){
          case "auth/email-already-in-use":
            throw new Error("Questa email è già associata ad un account registrata");
          case "auth/invalid-email":
            throw new Error("Email non valida");
          case "auth/operation-not-allowed":
            throw new Error("utente non autorizzato");
          case "auth/weak-password":
            throw new Error("Password non sufficientemente sicura");
          case "auth/network-request-failed":
            throw new Error("errore di rete");
          case "auth/admin-restricted-operation":
            throw new Error("Operazione non consentita");
          default:
            throw new Error("Errore sconosciuto:\n"+error);
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
            throw new Error("Errore di rete durante la richiesta di logout.");
          case "auth/too-many-requests":
            throw new Error("Troppe richieste di logout effettuate.");
          case "auth/user-token-expired":
            throw new Error("Il token dell'utente è scaduto.");
          case "auth/user-not-found":
            throw new Error("Utente non trovato.");
          default:
            throw new Error("Errore sconosciuto durante il logout.");
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
          await this.dispatch('getSocialRecipes');
        }
      });
    },

    // Action about recipe ------------------------------------------------------------------------
    // Funzione per prelevare le ricette riferite all'utente corrente nel database 
    async getRecipes({ commit }): Promise<void> {
      // verifica che l'utente sia autenticato
      if(!this.state.user){
        throw new Error("utente non loggato");
      }

      try {
        // crea un riferimento alla collezione "user" del database
        const recipesRef = collection(db, "recipes");

        // filtra i documenti dove il campo "idUtente" corrisponde all'ID dell'utente attualmente loggato
        const userRecipesQuery = query(
          recipesRef,
          where("idUser", "==", this.state.user.uid)
        );

        const recipes: Recipes = {};

        // recupera tutti i documenti degli utenti
        const recipeDocs = await getDocs(userRecipesQuery);
        recipeDocs.forEach((doc) => {
          recipes[doc.id] = (doc.data() as Recipe);
        });

        commit('SET_RECIPES', recipes);
      } catch (error) {
        if (error instanceof FirestoreError) {
          // Controlla il codice dell'errore
          if (error.code === "permission-denied") {
            // Errore 403: le regole di sicurezza di Firebase hanno impedito l'accesso
            throw new Error("Accesso negato: Non hai il permesso per scaricare queste ricette");
          } else if (error.code === "unavailable" || error.code === "deadline-exceeded") {
            // Problema di connessione o timeout
            throw new Error("Problema di connessione: Si è verificato un problema di connessione durante lo scaricamento delle ricette personali. Si prega di riprovare.");
          } else {
            throw new Error(`Errore scaricamento ricette personali dal database:\n${error.message}`);
          }
        } else {
          throw new Error(`Errore scaricamento ricette personali:\n${error}`);
        }
      }
    },
    
    // Funzione per prelevare le ricette degli altri utenti nel database
    async getSocialRecipes({ commit }): Promise<void> {
      // verifica che l'utente sia autenticato
      if(!this.state.user){
        throw new Error("utente non loggato");
      }

      try {
        // crea un riferimento alla collezione "user" del database
        const recipesRef = collection(db, "recipes");

        const socialRecipes: Recipes = {};

        // recupera tutti i documenti degli utenti
        const recipeDocs = await getDocs(recipesRef);
        recipeDocs.forEach((doc) => {
          socialRecipes[doc.id] = (doc.data() as Recipe);
        });
        
        commit('SET_SOCIAL_RECIPES', socialRecipes);
      } catch (error) {
        if (error instanceof FirestoreError) {
          // Controlla il codice dell'errore
          if (error.code === "permission-denied") {
            // Errore 403: le regole di sicurezza di Firebase hanno impedito l'accesso
            throw new Error("Accesso negato: Non hai il permesso per scaricare le ricette degli altri utenti.");
          } else if (error.code === "unavailable" || error.code === "deadline-exceeded") {
            // Problema di connessione o timeout
            throw new Error("Problema di connessione: Si è verificato un problema di connessione durante lo scaricamento ricette degli altri utenti. Si prega di riprovare.");
          } else {
            throw new Error(`Errore scaricamento ricette degli altri utenti nel database:\n${error.message}`);
          }
        } else {
          throw new Error(`Errore scaricamento ricette degli altri utenti:\n${error}`);
        }
      }
    },

    // Funzione per salvare una ricetta nel database riferite all'utente corrente
    async addRecipe(_, newRecipe: Recipe ) :Promise<void> {
      try {
        // verifica che l'utente sia autenticato
        if(!this.state.user){
          throw new Error("Utente non loggato");
        } 

        // crea un riferimento collezione che contiene tutti i documenti delle ricette dell'utente corrente
        const userRecipesRef = collection(db, "recipes");

        // aggiunge alla collezione recipes il documento che contiene la nuova ricetta
        await addDoc(userRecipesRef, newRecipe);        

        // invoca la funzione 'getRecipes' per aggiornare lo stato delle ricette con i nuovi dati
        await this.dispatch('getRecipes');
        await this.dispatch('getSocialRecipes');
      } catch (error) {
        if (error instanceof FirestoreError) {
          // Controlla il codice dell'errore
          if (error.code === "permission-denied") {
            // Errore 403: le regole di sicurezza di Firebase hanno impedito l'accesso
            throw new Error("Accesso negato: Non hai il permesso per creare questa ricetta.");
          } else if (error.code === "unavailable" || error.code === "deadline-exceeded") {
            // Problema di connessione o timeout
            throw new Error("Problema di connessione: Si è verificato un problema di connessione durante la creazione della ricetta. Si prega di riprovare.");
          } else {
            throw new Error(`Errore salvataggio nuova ricetta nel database:\n${error.message}`);
          }
        } else {
          throw new Error(`Errore salvataggio nuova ricetta:\n${error}`);
        }
      }
    },

    // Funzione per modificare una ricetta
    async editRecipe(_, { recipeId, updatedRecipe }: { recipeId: string; updatedRecipe: Recipe }) :Promise<void> {
      try {
        // verifica che l'utente sia autenticato
        if (!this.state.user) {
          throw new Error(`utente non loggato`);
        }
        
        // crea un riferimento al documento della ricetta che si desidera modificare (users/USER_ID/recipes/RECIPE_ID)
        const recipeDocRef = doc(db, "recipes", recipeId);

        // aggiorna il documento con i nuovi dati della ricetta
        await updateDoc(recipeDocRef, { ...updatedRecipe });

        // invoca la funzione 'getRecipes' per aggiornare lo stato delle ricette con i nuovi dati
        await this.dispatch('getRecipes');
        await this.dispatch('getSocialRecipes');
      } catch (error) {
        if (error instanceof FirestoreError) {
          // Controlla il codice dell'errore
          if (error.code === "permission-denied") {
            // Errore 403: le regole di sicurezza di Firebase hanno impedito l'accesso
            throw new Error("Accesso negato: Non hai il permesso per modificare questa ricetta.");
          } else if (error.code === "unavailable" || error.code === "deadline-exceeded") {
            // Problema di connessione o timeout
            throw new Error("Problema di connessione: Si è verificato un problema di connessione durante la modifica della ricetta. Si prega di riprovare.");
          } else {
            throw new Error(`Errore modifica ricetta nel database:\n${error.message}`);
          }
        } else {
          throw new Error(`Errore modifica ricetta:\n${error}`);
        }
      }
    },

    // Funzione per eliminare una ricetta
    async removeRecipe(_, recipeId: string) :Promise<void> {
      try {
        // verifica che l'utente sia autenticato
        if (!this.state.user) {
          throw new Error("Utente non loggato");
        }

        // crea un riferimento alla collezione delle ricette dell'utente corrente (users/USER_ID/recipes/)
        const userRecipesRef = collection(db, "recipes");

        // crea un riferimento al documento della ricetta che si desidera eliminare
        const recipeDocRef = doc(userRecipesRef, recipeId);

        // ottieni il documento della ricetta per accedere all'URL dell'immagine
        const recipeDoc = await getDoc(recipeDocRef);
        const recipeData = recipeDoc.data();

        // elimina l'immagine dal Firebase Storage utilizzando l'URL dell'immagine
        if (recipeData && recipeData.imageURL) {
          const imageRef = ref(storage, recipeData.imageURL);
          await deleteObject(imageRef);
        }

        // elimina il documento della ricetta utilizzando deleteDoc
        await deleteDoc(recipeDocRef);

        // invoca la funzione 'getRecipes' per aggiornare lo stato delle ricette dopo l'eliminazione
        await this.dispatch('getRecipes');
        await this.dispatch('getSocialRecipes');
      } catch (error) {
        if (error instanceof FirestoreError) {
          // Controlla il codice dell'errore
          if (error.code === "permission-denied") {
            // Errore 403: le regole di sicurezza di Firebase hanno impedito l'accesso
            throw new Error("Accesso negato: Non hai il permesso per cancellazione questa ricetta.");
          } else if (error.code === "unavailable" || error.code === "deadline-exceeded") {
            // Problema di connessione o timeout
            throw new Error("Problema di connessione: Si è verificato un problema di connessione durante la cancellazione della ricetta. Si prega di riprovare.");
          } else {
            throw new Error(`Errore cancellazione ricetta nel database:\n${error.message}`);
          }
        } else {
          throw new Error(`Errore cancellazione ricetta nel database:\n${error}`);
        }
      }
    }

  },
  modules: {
  }
})
