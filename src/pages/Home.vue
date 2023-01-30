<script>
export default {
  name: 'Home',
  data() {
    return {
      foo: 'bar',
    };
  },
  head() {
    return {
      title: `home: ${this.foo}`,
    };
  },
  serverPrefetch() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.foo = 'bar2';
        resolve();
      }, 100);
    });
  }
}
</script>

<template>
  <div>
    <h1>Page Home {{ foo }}</h1>
    <p class="home-content">home content</p>
    <img src="@img/icon.png">
  </div>
</template>

<style>
.home-content {
  color: #0000c0;
}
</style>
