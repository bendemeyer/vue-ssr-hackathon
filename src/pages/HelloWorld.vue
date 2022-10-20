<template>
  <div>
    <Head>
      <meta name="component-foo" content="bar" />
    </Head>
    <p>Hello World</p>
  </div>
</template>

<script>
import { computed } from "vue";
import { useHead, Head } from "@vueuse/head";

export default {
  name: "HelloWorld",
  components: {
    Head,
  },
  setup() {
    useHead(
      computed(() => ({
        meta: [{ name: "use-foo", content: "bar" }],
      }))
    );
  },
};
</script>
