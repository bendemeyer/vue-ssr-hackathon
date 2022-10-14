<script setup>
import { useCommonStore } from '../stores/commonStore'
const store = useCommonStore()
</script>

<template>
  <div>
    <h1>Page Bar</h1>
    <p class="bar-content">bar content</p>
    <router-link to="/">back home</router-link>
  </div>
  <div>
    now counter from foo is {{store.count}}
  </div>
</template>

<style>
.bar-content {
  color: #00c000;
}
</style>
