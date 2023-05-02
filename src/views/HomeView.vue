<template>
  <main class="home">
    <h1>Home</h1>
    <h3>
      Ciao {{user}}
    </h3>

  </main>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useStore } from 'vuex';

export default class HomeView extends Vue {
  private store = useStore();

  get user(){
    return this.store.getters.GET_EMAIL;
  }
}
</script>
