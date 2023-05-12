<template>
    <main>    
        <div class="container recipe-card">
            <br>
            <form>
              <div class="mb-3">
                  <label for="imageURL" class="form-label">Immagine</label>
                  <img
                    id="image" 
                    :src="recipe.imageURL"
                    :alt="recipe.title"
                    class="card-img-top img-fluid custom-image"
                  />
              </div>

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
                  <label for="author" class="form-label">Email Autore</label>
                  <input
                    type="text"
                    class="form-control"
                    id="author"
                    v-model="localRecipe.email_author"
                    maxlength="50"
                    disabled
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

              <button :disabled="isUnchanged()" @click.prevent="editRecipe" class="btn btn-warning">Modifica</button>
              <button @click.prevent="resetRecipe" class="btn btn-success">Ripristina</button>
              <button @click.prevent="deleteRecipe" class="btn btn-danger">Elimina</button>
            </form>
            <br>
        </div>
        <br><br><br>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Recipe } from '@/recipe';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

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
      this.$emit('loading-state-changed', true);
      try {
        await this.store.dispatch('editRecipe', { 'recipeId': this.recipeId, 'updatedRecipe': this.localRecipe });
        // Mostra un messaggio di successo
        this.showToast('Ricetta modificata con successo');
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.showErrorAlert(error.message);
          console.log("Errore nella modifica della ricetta:\n" + error.message);
        } else {
          this.showErrorAlert("Errore sconosciuto durante la modifica della ricetta");
          console.log("Errore sconosciuto nella modifica della ricetta:\n" + error);
        }
      }
      this.$emit('loading-state-changed', false);
    },

    async deleteRecipe() {
      this.$emit('loading-state-changed', true);
      try {
        await this.store.dispatch('removeRecipe', this.recipeId);

        this.showToast('Ricetta eliminata con successo');
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.showErrorAlert(error.message);
          console.log("Errore nell'eliminazione della ricetta:\n"+error.message);
        } else {
          this.showErrorAlert("Errore sconosciuto durante l'eliminazione della ricetta");
          console.log("Errore sconosciuto durante l'eliminazione della ricetta:\n"+error);
        }
      }
      this.$emit('loading-state-changed', false);
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
    },
    
    showErrorAlert(message: string) {
      this.$swal({
        title: 'Si è verificato un problema',
        text: message,
        icon: 'error',
      });
    },

    showToast(title: string) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });

        Toast.fire({
            icon: "success",
            title: title,
        });
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

<style scoped>
.recipe-card{
  background-color: #FFD8A9;
  border-radius: 3%;
  box-shadow: 5px 5px 10px 1px #E38B29;
}

.btn{
  margin: 1rem;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.445);
}

.custom-image {
  max-height: 150px;
  object-fit: cover;
}
</style>
