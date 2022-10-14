<script>
export default {
  name: 'Foo',
}
</script>

<template>
  <div>
    <h1>Page Foo</h1>
    <p class="foo-content">foo content</p>
    <router-link to="/">back home</router-link>
  </div>
</template>

<style>
.foo-content {
  color: #c00000;
}
</style>
