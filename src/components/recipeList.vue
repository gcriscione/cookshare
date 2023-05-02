<template>
  <div>
    <h2>Le mie ricette</h2>
    <div v-if="user">
      <router-link :to="{ name: 'NewRecipe' }">Aggiungi ricetta</router-link>
    </div>
    <ul>
      <recipe-item v-for="(recipe, index) in recipes" :key="index" :recipe="recipe" @edit="editRecipe" @delete="deleteRecipe" />
    </ul>
  </div>
</template>

<script lang="ts">
/*
import { Component, Vue, Prop } from 'vue-property-decorator';
import RecipeItem from './RecipeItem.vue';

@Component({
  components: {
    RecipeItem
  }
})
export default class RecipeList extends Vue {
  @Prop({ required: true })
  private user!: any;

  @Prop({ required: true })
  private recipes!: any[];

  private editRecipe(recipe: any) {
    this.$router.push({ name: 'EditRecipe', params: { id: recipe.id } });
  }

  private deleteRecipe(recipe: any) {
    if (confirm('Sei sicuro di voler eliminare questa ricetta?')) {
      this.$emit('delete', recipe);
    }
  }
}
*/
</script>