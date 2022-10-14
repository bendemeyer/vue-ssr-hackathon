<script>
export default {
}
</script>

<template>
	<div id="app">
    <div class="root">
		  Hello Evan You world!
    </div>

    <router-view></router-view>

    <hr>
    <p>
      <router-link to="/foo">foo</router-link>
    </p>
    <p>
      <router-link to="/bar">bar</router-link>
    </p>
	</div>
</template>

<style lang="css">
	.root {
		color: red;
	}
</style>
