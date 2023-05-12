<template>
  <div>
    <h1>Pagina Profilo utente</h1>
    <h4 @click="showAlert">{{ email_user }}</h4>
  </div>
  <div  class="container">
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useStore } from 'vuex';

export default class ProfileView extends Vue{
  private store = useStore();
  
  showAlert() {
    this.$swal({
      title: 'Benvenuto',
      text: this.email_user,
      icon: 'success',
    });
  }

  get email_user(){
    return this.store.getters.GET_EMAIL;
  }
}
</script>
