<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Incrementa</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
