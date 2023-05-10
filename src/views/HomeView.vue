<template>
  <main class="home">
    <h1>Home</h1>
    <h2>
      Utente {{email_user}}
    </h2>
    <button  @click="getSocialRecipes">Aggiorna</button>
    <RecipeList :recipes="SocialRecipes"/>
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

  created(){
    this.getSocialRecipes();
  }

  getSocialRecipes = async () => {
    try {
      await this.store.dispatch('getSocialRecipes');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Errore caricamento ricette\n"+error.message);
        console.error("Errore nel caricamento delle ricette della home\n"+error.message);
      } else {
        console.error("Errore nel caricamento delle ricette della home\n"+error);
      }
    }
  }

  get email_user(){
    return this.store.getters.GET_EMAIL;
  }

  get SocialRecipes(){
    return this.store.getters.GET_SOCIAL_RECIPES;
  }
}
</script>
