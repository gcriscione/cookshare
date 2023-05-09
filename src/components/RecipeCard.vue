<template>
    <main>    
        <div class="container">
            <form>
              <div class="mb-3">
                  <label for="title" class="form-label">Titolo</label>
                  <input 
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="localRecipe.title"
                    maxlength="50"
                    :readonly="editableElementId !== 'title'"
                    @dblclick="makeEditable"
                  required />
              </div>

              <div class="mb-3">
                  <label for="ingredients" class="form-label">Ingredienti</label>
                  <textarea 
                    class="form-control"
                    id="ingredients"
                    v-model="localRecipe.ingredients"
                    rows="3" maxlength="300"
                    :readonly="editableElementId !== 'ingredients'"
                    @dblclick="makeEditable"
                  required></textarea>
                  <small class="form-text text-muted">Inserisci gli ingredienti separati da una virgola</small>
              </div>

              <div class="mb-3">
                  <label for="description" class="form-label">Descrizione</label>
                  <textarea 
                    class="form-control" 
                    id="description" 
                    v-model="localRecipe.description"
                    rows="3"
                    maxlength="1000"
                    :readonly="editableElementId !== 'description'"
                    @dblclick="makeEditable"
                  required></textarea>
              </div>

              <div class="mb-3">
                  <label for="author" class="form-label">Autore</label>
                  <input
                    type="text"
                    class="form-control"
                    id="author"
                    v-model="localRecipe.author"
                    maxlength="50"
                    :readonly="editableElementId !== 'author'"
                    @dblclick="makeEditable"
                  required />
              </div>

              <div class="mb-3">
                  <label for="prepTime" class="form-label">Tempo di preparazione (minuti)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="prepTime"
                    v-model.number="localRecipe.prepTime"
                    min="1"
                    max="360"
                    :readonly="editableElementId !== 'prepTime'"
                    @dblclick="makeEditable"
                  required />
              </div>

              <div class="mb-3">
                  <label for="servings" class="form-label">Porzioni</label>
                  <input
                    type="number"
                    class="form-control"
                    id="servings"
                    v-model.number="localRecipe.servings"
                    min="1"
                    max="30"
                    :readonly="editableElementId !== 'servings'"
                    @dblclick="makeEditable"
                  required />
              </div>

              <div class="mb-3">
                  <label for="tags" class="form-label">Tags</label>
                  <input
                    type="text"
                    class="form-control"
                    id="tags"
                    v-model="localRecipe.tags"
                    maxlength="100"
                    :readonly="editableElementId !== 'tags'"
                    @dblclick="makeEditable"
                  required />
                  <small class="form-text text-muted">Inserisci i tag separati da una virgola</small>
              </div>

              <div class="mb-3">
                  <label for="imageURL" class="form-label">URL dell'immagine</label>
                  <input
                    type="url"
                    class="form-control"
                    id="imageURL"
                    v-model="localRecipe.imageURL"
                  required />
              </div>

              <button :disabled="isUnchanged()" @click.prevent="editRecipe" class="btn btn-warning">Modifica</button>
              <button @click.prevent="resetRecipe" class="btn btn-success">Ripristina</button>
              <button @click.prevent="deleteRecipe" class="btn btn-danger">Elimina</button>
            </form>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Recipe } from '@/recipe';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object as () => Recipe,
      required: true,
    },
    recipeId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async editRecipe() {
      await this.store.dispatch('editRecipe', { 'recipeId': this.recipeId, 'updatedRecipe': this.localRecipe });
    },
    async deleteRecipe() {
      await this.store.dispatch('removeRecipe', this.recipeId);
    },
    resetRecipe(){
      this.localRecipe = {...this.copieRecipe },
      this.editableElementId = null;
    },
    makeEditable(event: Event) {
      const target = event.target as HTMLInputElement;
      this.editableElementId = target.id;
    },
    isUnchanged() {
      return JSON.stringify(this.localRecipe) === JSON.stringify(this.copieRecipe);
    }
  },
  data() {
    return {
      localRecipe: { ...this.recipe },
      copieRecipe: {...this.recipe},
      editableElementId: null as string | null,
      store: useStore()
    };
  },
});
</script>


