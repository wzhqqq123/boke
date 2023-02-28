<template>
  <div>
    <loading></loading>
    <layout-header></layout-header>
    <layout-body></layout-body>
    <layout-footer></layout-footer>
  </div>
</template>

<script>
import layoutHeader from "@/components/layout/layout-header.vue";
import layoutBody from "@/components/layout/layout-body.vue";
import layoutFooter from "@/components/layout/layout-footer.vue";
import Loading from "@/components/loading.vue";

export default {
  name: "index",
  components: {
    layoutHeader,
    layoutBody,
    layoutFooter,
    Loading,
  },
};
</script>

<style lang="scss">
</style>
