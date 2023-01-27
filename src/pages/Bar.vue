<script setup>
import { useCommonStore } from '../stores/commonStore'
const store = useCommonStore()
import chunkLogger from '../chunk-logger';
import { defineAsyncComponent, onMounted, onServerPrefetch, ref } from 'vue';
import { useHead } from '@unhead/vue';
const Baz = defineAsyncComponent(() => import(/* webpackChunkName: "baz-component" */ '../components/Baz.vue'));

const showBaz = ref(false);

const barPage = ref({
  description: 'Bar page',
});
const title = ref('bar title');
// const title = ref('bar title </title><script>alert("hi")<' + '/script>');

useHead({
  title,
  meta: [
    { name: 'description', content: () => barPage.value.description },
    { name: 'wat', content: '">xss?<hi>' },
  ],
  style: [
    // { type: 'text/css', children: 'body { background: blue; }<' + '/style><' + 'script>alert("hi")</' + 'script>' },
  ],
  script: [
    { type: 'application/ld+json', children: { foo: 'bar', xss: '</' + 'script>' } },
    { type: 'application/ld+json', children: { foo: 'bar2"' } },
  ],
})

onMounted(() => chunkLogger('Bar'));

onServerPrefetch(() => new Promise((resolve) => {
  setTimeout(() => {
    title.value = 'bar other title';
    resolve();
  }, 100);
}));

function toggleShowBaz() {
  showBaz.value = !showBaz.value;
}

</script>

<template>
  <div>
    <h1>Page Bar: {{ title }}</h1>
    <p class="bar-content">bar content</p>
    <router-link to="/">back home</router-link>

    <button @click="toggleShowBaz">showBaz</button>

    <Baz v-if="showBaz"></Baz>
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
