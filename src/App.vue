<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Login </router-link>
    <p v-if="$store.state.user">!-- Login Effettuato --!</p> |
    <button v-if="$store.state.user" @click="$store.dispatch('logout')">Logout</button>
  </nav>
  <router-view/>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, onBeforeMount } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    
    onBeforeMount(() => {
      store.dispatch('fetchUser');
    });

    return {};
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
