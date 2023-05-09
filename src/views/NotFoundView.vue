<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist or has been moved.</p>
    <router-link to="/">Go back to the home page</router-link>
  </div>
</template>

<script lang="ts">
export default {
  name: "NotFoundView",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

p {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.router-link-active {
  font-size: 1.125rem;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
</style>