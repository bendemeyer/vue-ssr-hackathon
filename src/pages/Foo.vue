<script setup>
import { useCommonStore } from '../stores/commonStore'
const store = useCommonStore()
store.initialize()
import { reactive, ref, defineAsyncComponent, toRefs, computed } from 'vue';
import chunkLogger from '../chunk-logger';
import { useHead } from '@unhead/vue';
import foo from '~/foo';
const Baz = defineAsyncComponent(() => import(/* webpackChunkName: "baz-component" */ '../components/Baz.vue'));
const Fizz = defineAsyncComponent(() => import(/* webpackChunkName: "fizz-component" */ '../components/Fizz.vue'));


const showBaz = ref(false);
const showFizz = ref(false);

function toggleBazz() {
  showBaz.value = !showBaz.value;
}

function toggleFizz() {
  showFizz.value = !showFizz.value;
}

useHead(computed(() => ({
  title: `foo ${store.count}`,
  script: [
    { type: 'application/ld+json', children: { foo: store.count } },
  ],
})));

foo('123');

</script>

<template>
  <div>
    <h1>Page Foo</h1>
    <p class="foo-content">foo content</p>
    <router-link to="/">back home</router-link>

    <div>
      <button @click="toggleBazz">show baz</button>
      <button @click="toggleFizz">show fizz</button>
    </div>
    <Baz v-if="showBaz"></Baz>
    <Fizz v-if="showFizz"></Fizz>
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
