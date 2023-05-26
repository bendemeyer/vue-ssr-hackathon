<template>
  <div>
    <p>Hello World</p>
  </div>
</template>

<script>
import { ref, computed } from "vue";
// import { useHead, Head } from "@vueuse/head";

export default {
  name: "HelloWorld",
  // components: {
  //   Head,
  // },
  setup() {
    const foo = ref('bar & baz');

    // useHead(computed(() => ({
    //   meta: [{ name: "use-foo", content: foo.value }],
    // })));

    const show = ref(Math.random() > 0.5);
    console.log('hi show?', show.value);
    return {
      foo,
      show,
    };
  },
};
</script>
