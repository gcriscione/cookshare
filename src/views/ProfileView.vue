<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Incrementa</button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class ProfileView extends Vue{
  count = 0;
  
  increment() {
    this.count++; 
  } 
}
</script>
