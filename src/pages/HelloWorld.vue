<template>
  <div>
    <Head>
      <title>foo bar</title>
      <html lang="en" />
      <body foo="bar" />
      <meta name="component-foo" :content="foo" />
      <template v-if="show">
        <meta name="questionable" content="whatever" />
      </template>
      <script type="application/ld+json">{"foo":"bar"}</script>
      <noscript>hi no scripts</noscript>
    </Head>
    <p>Hello World</p>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useHead, Head } from "@vueuse/head";

export default {
  name: "HelloWorld",
  components: {
    Head,
  },
  setup() {
    const foo = ref('bar & baz');

    useHead(computed(() => ({
      meta: [{ name: "use-foo", content: foo.value }],
    })));

    const show = ref(Math.random() > 0.5);
    console.log('hi show?', show.value);
    return {
      foo,
      show,
    };
  },
};
</script>
