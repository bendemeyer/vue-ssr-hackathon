<script setup>
import { useCommonStore } from '../stores/commonStore'
import { useHead } from '@vueuse/head';
const store = useCommonStore()
import chunkLogger from '../chunk-logger';
import { defineAsyncComponent, onMounted, ref } from 'vue';
const Baz = defineAsyncComponent(() => import(/* webpackChunkName: "baz-component" */ '../components/Baz.vue'));

const showBaz = ref(false);

const barPage = ref({
  description: 'Bar page',
});
const title = ref('bar title');

useHead({
  title,
  meta: [
    { name: 'description', content: () => barPage.value.description },
  ],
  style: [
    { type: 'text/css', textContent: 'body { background: blue; }' },
  ],
})

onMounted(() => chunkLogger('Bar'));

function toggleShowBaz() {
  showBaz.value = !showBaz.value;
}

</script>

<template>
  <div>
    <h1>Page Bar</h1>
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
