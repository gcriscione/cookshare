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
                    <label for="author" class="form-label">Autore</label>
                    <input type="text" class="form-control" id="author" v-model="newRecipe.author" maxlength="50" required />
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
                    <label for="imageURL" class="form-label">URL dell'immagine</label>
                    <input type="url" class="form-control" id="imageURL" v-model="newRecipe.imageURL" required />
                </div>

                <button type="submit" class="btn btn-primary">Crea ricetta</button>
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
    </main>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import RecipeCard from '@/components/RecipeCard.vue';
import { useStore } from 'vuex';
import { Recipe, createRecipe } from '@/recipe';

@Options({
  components: {
    RecipeCard
  },
})
export default class RecipeCreatorView extends Vue {
    private store = useStore();
    private newRecipe: Recipe = createRecipe('', [], '', '', 1, 1, [], '', new Date());
    private showDiv = false;
    private ingredientsInput = '';
    private tagsInput = '';

    created(){
        this.getRecipes();
    }

    getRecipes = () => {
        this.store.dispatch('getRecipes');
    }

    createRecipe = async () =>{
        this.newRecipe.date = new Date();

        await this.store.dispatch('addRecipe', this.newRecipe);

        this.newRecipe = createRecipe('', [], '', '', 1, 1, [], '', new Date());
        this.ingredientsInput = '';
        this.tagsInput = '';
        this.showDiv = false;
        alert("Creata");
    }

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

    get recipes() {
        return this.store.getters.GET_RECIPES;
    }
}
</script>

<style scoped>

</style>
