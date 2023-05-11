<template>
  <div>
    <h3>Pagina Profilo utente</h3>
    <h6>{{ email_user }}</h6>
  </div>
  <div  class="container">
    <button>Elimina Account</button>
    <button>Cambia Password</button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useStore } from 'vuex';

export default class ProfileView extends Vue{
  private store = useStore();
  

  get email_user(){
    return this.store.getters.GET_EMAIL;
  }
}
</script>
