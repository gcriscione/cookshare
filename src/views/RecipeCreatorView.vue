<template>
    <main>
        <button class="btn btn-secondary mb-4" @click="changeShowDiv">
            {{ showDiv ? 'Nascondi' : 'Crea Nuova Ricetta' }}
        </button>
        <div v-show="showDiv" class="container">
            <h2 class="mb-4">Crea una nuova ricetta</h2>
            <form @submit.prevent="createRecipe">
                <div class="mb-3">
                    <label for="title" class="form-label">Titolo</label>
                    <input type="text" class="form-control" id="title" v-model="newRecipe.title" maxlength="50" required />
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label">Descrizione</label>
                    <textarea class="form-control" id="description" v-model="newRecipe.description" rows="3" maxlength="1000" required></textarea>
                </div>

                <div class="mb-3">
                    <label for="ingredients" class="form-label">Ingredienti</label>
                    <textarea class="form-control" id="ingredients" v-model="ingredientsInput" @input="onInput('ingredients')" rows="3" maxlength="300" required></textarea>
                    <small class="form-text text-muted">Inserisci gli ingredienti separati da una virgola</small>
                </div>

                <div class="mb-3">
                    <label for="prepTime" class="form-label">Tempo di preparazione (minuti)</label>
                    <input type="number" class="form-control" id="prepTime" v-model.number="newRecipe.prepTime" min="1" max="360" required />
                </div>

                <div class="mb-3">
                    <label for="servings" class="form-label">Porzioni</label>
                    <input type="number" class="form-control" id="servings" v-model.number="newRecipe.servings" min="1" max="30" required />
                </div>

                <div class="mb-3">
                    <label for="tags" class="form-label">Tags</label>
                    <input type="text" class="form-control" id="tags" v-model="tagsInput" @input="onInput('tags')" maxlength="100" required />
                    <small class="form-text text-muted">Inserisci i tag separati da una virgola</small>
                </div>

                <div class="mb-3">
                    <label for="image" class="form-label">Carica immagine</label>
                    <input type="file" class="form-control" id="image" @change="uploadImage" accept="image/*" required />
                </div>

                <button type="submit" class="btn btn-primary" :disabled="isLoading">Crea ricetta</button>
            </form>
        </div>

        <br>
        <hr/>
        <hr/>
        <br>

        <h3>Lista Ricette Pubblicate</h3>
        <RecipeCard
            v-for="(recipe, id) in recipes"
            :key="id"
            :recipe="recipe"
            :recipeId="id"
        ></RecipeCard>

        <div v-if="isLoading" class="loading-spinner-container">
            <div class="loading-spinner"></div>
        </div>
    </main>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import RecipeCard from '@/components/RecipeCard.vue';
import { useStore } from 'vuex';
import { Recipe, createRecipe } from '@/recipe';
import { storage } from '@/firebase/index';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Options({
  components: {
    RecipeCard
  },
})
export default class RecipeCreatorView extends Vue {
    private store = useStore();
    private newRecipe: Recipe = createRecipe('', [], '', '', '', 1, 1, [], '', new Date());
    private showDiv = false;
    private ingredientsInput = '';
    private tagsInput = '';
    private imageFile= null as File | null;
    private isLoading = false;

    created(){
        this.getRecipes();
    }

    getRecipes = () => {
        this.store.dispatch('getRecipes');
    }

    createRecipe = async () => {
        this.isLoading = true;
        try {
            // Controlla se un'immagine è stata caricata
            if (!this.imageFile) {
                alert("Seleziona un'immagine");
                return;
            }

            // carica l'immagine su firebase storage e prende il riferimento
            try {
                // Aggiungi il codice per caricare l'immagine su Firebase Storage e ottenere il suo URL di download
                const storageRef = ref(storage, `imagesRecipes/${this.imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, this.imageFile);
                const downloadURL = await getDownloadURL(snapshot.ref);
    
                // Memorizza l'URL di download nell'apposito campo imageURL
                this.newRecipe.imageURL = downloadURL;
            } catch (error) {
                console.error("Errore durante il caricamento dell'immagine su firebase storage:", error);
                alert("Si è verificato un errore durante il caricamento dell'immagine sul database. Riprova.");
                this.isLoading = false;
                return;
            }


            this.newRecipe.date = new Date();
            this.newRecipe.email_author = this.email_user;
            this.newRecipe.idUser = this.id_user;

            await this.store.dispatch('addRecipe', this.newRecipe);

            this.newRecipe = createRecipe('', [], '', '', '', 1, 1, [], '', new Date());
            this.ingredientsInput = '';
            this.tagsInput = '';
            this.showDiv = false;
            this.imageFile = null;
            alert("Nuova ricetta creata");
                
        } catch (error) {
            console.error("Errore durante il caricamento della nuova ricetta nel database:", error);
            alert("Si è verificato un errore durante il caricamento della nuova ricetta nel database. Riprova.");
        }
        finally {
            this.isLoading = false;
        }
    };

    changeShowDiv = () =>{
        this.showDiv = !this.showDiv
    }

    onInput(property: 'ingredients' | 'tags') {

        if (property === 'ingredients') {
            this.newRecipe.ingredients = this.ingredientsInput.split(',').map(item => item.trim()).filter(item => item.length > 0);
        } else if (property === 'tags') {
            this.newRecipe.tags = this.tagsInput.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
    }

    async uploadImage(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.imageFile = file;
        }
    }

    get recipes() {
        return this.store.getters.GET_RECIPES;
    }

    get email_user(){
        return this.store.getters.GET_EMAIL;
    }

    get id_user(){
        return this.store.getters.GET_ID_USER;
    }
}
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #3f51b5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
