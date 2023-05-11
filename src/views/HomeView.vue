<template>
  <main class="home">
    <h1>Home Page</h1>
    <button class="btn btn-primary" @click="getSocialRecipes">Aggiorna</button>
    <br><br><br>
    <RecipeList :recipes="SocialRecipes"/>

    <div v-if="isLoading" class="loading-spinner-container">
      <div class="loading-spinner"></div>
    </div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import RecipeList from '@/components/RecipeList.vue';

@Options({
  components: {
    RecipeList
  },
})
export default class HomeView extends Vue {
  private store = useStore();
  private isLoading = false;

  created(){
    this.getSocialRecipes();
  }

  getSocialRecipes = async () => {
    this.isLoading = true;
    try {
      await this.store.dispatch('getSocialRecipes');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Errore caricamento ricette\n"+error.message);
        console.error("Errore nel caricamento delle ricette della home\n"+error.message);
      } else {
        console.error("Errore nel caricamento delle ricette della home\n"+error);
      }
    }finally{
      this.isLoading = false;
    }
  }

  get SocialRecipes(){
    return this.store.getters.GET_SOCIAL_RECIPES;
  }
}
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

.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #F1A661;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
