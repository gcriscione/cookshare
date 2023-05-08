<template>
  <div class="recipe-list">
    <h2>
        RecipeList
    </h2>
    <div class="row row-cols-1 row-cols-md-2 g-4">
      <recipe-item
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      ></recipe-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Recipes } from '@/recipe';
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
        },
        email_user: {
            type: String,
            required: true,
        }, 
    },
});
</script>

<style scoped>
</style>