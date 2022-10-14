<script>
import chunkLogger from '../chunk-logger';

export default {
  name: 'Bar',
}
</script>

<template>
  <div>
    <h1>Page Bar</h1>
    <p class=".fizz-content">fizz content</p>
    <router-link to="/">back home</router-link>
  </div>
</template>

<style>
.fizz-content {
  color: #00c000;
}
</style>
