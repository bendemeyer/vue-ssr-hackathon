<script setup>
import { useCommonStore } from '../stores/commonStore'
const store = useCommonStore()
</script>

<template>
  <div>
    <h1>Page Foo</h1>
    <p class="foo-content">foo content</p>
    <router-link to="/">back home</router-link>
  </div>
  <div>
    {{store.name}}
    {{store.count}}
    <button @click=store.increment(1)>Click Me</button>
  </div>
</template>

<style>
.foo-content {
  color: #c00000;
}
</style>
