<template>
  <v-app dark>
    <v-container class="bcnaBackground">
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      420 Enhance your calm
      <NuxtLink to="/">
        Home page
      </NuxtLink>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "EmptyLayout",
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "420 error ",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style>
.bcnaBackground {
  background: transparent url("/bg_imgs.png") 0 0 no-repeat padding-box;
  background-size: 800px;
  background-position: 20% 10%;
  height: 100vh;
}
</style>
