<template>
  <main>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand">CookShare</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/" active-class="active">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about" active-class="active">About</router-link>
            </li>
            <li class="nav-item" v-if="(!$store.state.user)">
              <router-link class="nav-link" to="/login" active-class="active">Login</router-link>
            </li>
            <li class="nav-item" v-if="$store.state.user">
              <button class="btn btn-link nav-link" @click="$store.dispatch('logout')">Logout</button>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="$store.state.user">
              <router-link class="nav-link" to="/login" active-class="active">Loggato</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view/>
  </main>
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
