<template>
  <main class="home">
    <h1>Home</h1>
    <h2>
      Ciao {{user}}
    </h2>
    <button  @click="getRecipes">Scarica ricette</button>
    <button  @click="addRecipe">Crea ricetta</button>
    <RecipeList :recipes="recipes"/>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import { Recipe, createRecipe } from '@/recipe';
import RecipeList from '@/components/RecipeList.vue';

@Options({
  components: {
    RecipeList
  },
})
export default class HomeView extends Vue {
  private store = useStore();

  created(){
    this.getRecipes();
  }

  getRecipes = () => {
    this.store.dispatch('getRecipes');
  }

  addRecipe = () => {
    alert("carica");
    let newRecipe : Recipe = createRecipe(
      "Pasta al pomodoro",
      ["pasta", "pomodoro", "aglio"],
      "Una deliziosa pasta con un sugo di pomodoro semplice ma saporito",
      "Mario Rossi",
      30,
      4,
      ["pasta", "cucina italiana"],
      "http://www.gettyimages.com/detail/121306641",
      new Date()
    );
    this.store.dispatch('addRecipe', newRecipe);
  }

  get user(){
    return this.store.getters.GET_EMAIL;
  }

  get recipes(){
    return this.store.getters.GET_RECIPES;
  }
}
</script>
