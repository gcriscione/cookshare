<template>
  <li>
    <h4>{{ recipe.title }}</h4>
    <p>{{ recipe.description }}</p>
    <img :src="recipe.imageUrl" :alt="recipe.title" v-if="recipe.imageUrl">
    <div>
      <button @click="editRecipe">Modifica</button>
      <button @click="deleteRecipe">Elimina</button>
    </div>
  </li>
</template>

<script lang="ts">
/*
import { Component, Vue, Prop } from 'vue-class-component';

@Component
export default class RecipeItem extends Vue {
  @Prop({ required: true })
  private recipe!: any;

  private editRecipe() {
    this.$emit('edit', this.recipe);
  }

  private deleteRecipe() {
    this.$emit('delete', this.recipe);
  }
}
*/
</script>