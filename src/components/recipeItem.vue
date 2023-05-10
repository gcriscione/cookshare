<template>
  <div class="col">
    <div class="card">
      <img :src="recipe.imageURL" :alt="recipe.title" class="card-img-top img-fluid custom-image" />
      <div class="card-body">
        <h5 class="card-title"><strong>{{ recipe.title }}</strong></h5>
        <p class="card-text">{{ recipe.description }}</p>

        <div class="container">
          <div class="row">
            <div class="col-md-6 text-end">Email Autore:</div>
            <div class="col-md-6 text-start">
              <strong>
                <a :href="'mailto:' + email_author">
                  {{ recipe.email_author }}
                </a>
              </strong>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 text-end">Data pubblicazione:</div>
            <div class="col-md-6 text-start"><strong>{{ formatDate(recipe.date) }}</strong></div>
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

        <br>

        <div class="col text-center">
          <h6><strong>Ingredienti</strong></h6>
          <ul class="list-unstyled d-flex flex-wrap justify-content-center">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="ingredient" class="font-monospace mb-2">
              {{ ingredient }}<span v-if="index < recipe.ingredients.length - 1">&nbsp;-&nbsp;</span>
            </li>
          </ul>
        </div>

        <div class="col text-center">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Recipe } from '@/recipe';
import { Timestamp } from 'firebase/firestore';

export default defineComponent({
  name: 'RecipeItem',
  props: {
    recipe: {
      type: Object as () => Recipe,
      required: true,
    },
  },
  methods: {
    formatDate(timestamp: Timestamp): string {
      const date = timestamp.toDate();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
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


