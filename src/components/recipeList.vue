<template>
  <div class="recipe-list">
    <div class="d-flex justify-content-end mb-3">
      <select class="form-select me-2" v-model="sortBy">
        <option value="date">Data</option>
        <option value="title">Titolo</option>
        <option value="prepTime">Tempo di preparazione</option>
        <option value="servings">Numero di porzioni</option>
      </select>
      <button class="btn btn-secondary" @click="toggleSortOrder()">
        {{ sortOrder === 1 ? 'decrescente' : 'crescente' }}
      </button>
    </div>
    <br>

    <div class="row row-cols-1 row-cols-md-2 g-4">
      <recipe-item
        v-for="recipe in sortedRecipes"
        :key="recipe.id"
        :recipe="recipe"
      ></recipe-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Recipe, Recipes } from '@/recipe';
import RecipeItem from './RecipeItem.vue';

export default defineComponent({
  name: 'RecipeList',
  components: {
      RecipeItem,
  },
  props: {
      recipes: {
          type: Object as () => Recipes,
          required: true,
      }
  },
  computed: {
    sortedRecipes(): Array<Recipe> {
      const recipesArray = Object.values(this.recipes);
      recipesArray.sort((a, b) => { // Utilizza una arrow function qui
        const dataA = a[this.sortBy];
        const dataB = b[this.sortBy];

        let comparison = 0;
        if (dataA > dataB) {
          comparison = 1;
        } else if (dataA < dataB) {
          comparison = -1;
        }
        return ( comparison * this.sortOrder);
      });
      return recipesArray;
    },
  },
  methods: {
    toggleSortOrder() {
      this.sortOrder = this.sortOrder * -1;
    },
  },
  data() {
    return {
      sortOrder: -1,
      sortBy: 'date' as keyof Recipe
    };
  },
});
</script>

<style scoped>
.btn{
    background-color: #E38B29;
    border: 0px;
    color: white;
    font-weight: 800;
    padding: 0.6rem;
}

.btn:active {
  background-color: rgb(180, 117, 0);
  border: 0px;
  color: white;
  font-weight: 800;
  padding: 0.6rem;
}
</style>