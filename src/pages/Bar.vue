<script>
export default {
  name: 'Bar',
}
</script>

<template>
  <div>
    <h1>Page Bar</h1>
    <p class="bar-content">bar content</p>
    <router-link to="/">back home</router-link>
  </div>
</template>

<style>
.bar-content {
  color: #00c000;
}
</style>
