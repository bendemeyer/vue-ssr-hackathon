<script setup>
import { useCommonStore } from '../stores/commonStore'
const store = useCommonStore()
store.initialize()
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
    <button @click=store.increment(1)>Increment</button>
    <button @click=store.initialize(1)>Reset</button>
  </div>
</template>

<style>
.foo-content {
  color: #c00000;
}
</style>
