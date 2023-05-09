<template>
  <div class="col">
    <div class="card">
      <img :src="recipe.imageURL" :alt="recipe.title" class="card-img-top img-fluid custom-image" />
      <div class="card-body">
        <h5 class="card-title"><strong>{{ recipe.title }}</strong></h5>
        <p class="card-text">{{ recipe.description }}</p>

        <div class="container">
          <div class="row">
            <div class="col-md-6 text-end">Autore:</div>
            <div class="col-md-6 text-start"><strong>{{ recipe.author }}</strong></div>
          </div>
          <div class="row">
            <div class="col-md-6 text-end">Tempo di preparazione:</div>
            <div class="col-md-6 text-start"><strong>{{ recipe.prepTime }} minuti</strong></div>
          </div>
          <div class="row">
            <div class="col-md-6 text-end">Porzioni:</div>
            <div class="col-md-6 text-start"><strong>{{ recipe.servings }}</strong></div>
          </div>
        </div>
        
        <div class="container">
          <div class="row">
            <div class="col text-center">
              <br>
              <h6><strong>Tags</strong></h6>
              <ul class="list-unstyled d-flex flex-wrap justify-content-center">
                <li v-for="(tag, index) in recipe.tags" :key="tag" class="font-monospace mb-2">
                  {{ tag }}<span v-if="index < recipe.tags.length - 1">&nbsp;-&nbsp;</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  .custom-image {
    max-height: 300px;
    object-fit: cover;
  }
</style>


