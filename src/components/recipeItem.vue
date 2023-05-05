<template>
  <div class="recipe-card">
    <hr>
    <img :src="recipe.imageURL" :alt="recipe.title" />
    <h3>{{ recipe.title }}</h3>
    <p>{{ recipe.description }}</p>
    <p>Autore: {{ recipe.author }}</p>
    <p>Tempo di preparazione: {{ recipe.prepTime }} minuti</p>
    <p>Porzioni: {{ recipe.servings }}</p>
    <ul>
      <li v-for="tag in recipe.tags" :key="tag">{{ tag }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Recipe } from '@/recipe';

export default defineComponent({
  name: 'RecipeItem',
  props: {
    recipe: {
      type: Object as () => Recipe,
      required: true,
    },
  },
});
</script>

<style scoped>
</style>


