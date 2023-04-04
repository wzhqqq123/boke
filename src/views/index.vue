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
  created() {
    this.getUserInfo();
  },
  computed:{
    userInfo(){
      return this.$store.state.userInfo
    }
  },
  watch:{
    userInfo(newVal,oldVal){
      if(!newVal){
        this.getUserInfo();
      }
    }
  },
  methods: {
    async getUserInfo() {
      // 刷新网页时store储存的用户信息丢失时重新获取
      if (!this.$store.state.userInfo) {
        // 获取用户信息
        await this.$get("/getUserInfo",{
          requestName: "getUserInfo",
        }).then((res) => {
          this.$store.commit("SET_USER_INFO", res.data);
        });
        // 成功获取到用户信息后再调用分类接口 否则直接跳登录页了
        if(this.$store.state.userInfo){
          this.getCategory();
        }
      }
    },
    getCategory(){
      this.$get("/getCategory", {
        requestName: "getCategory",
      }).then((res) => {
        this.$store.commit("SET_BOLG_CATEGORY",res.data);
      });
    },
  },
};
</script>

<style lang="scss"></style>
