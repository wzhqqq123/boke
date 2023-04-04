<template>
  <div
    id="layout-header"
    :class="{ fixed: fixed, hidden: hidden }"
    @click.stop="mobileShow = false"
  >
    <div class="site-logo">
      <router-link to="/home">
        <img src="@/assets/site-logo.svg" alt="" />
        <p class="site-name">Gblog</p>
      </router-link>
    </div>
    <div class="menus-btn" @click.stop="mobileShow = !mobileShow">Menus</div>
    <div
      class="site-menus"
      :class="{ mobileShow: mobileShow }"
      @click.stop="mobileShow = !mobileShow"
    > 
      <div class="menu-item header-search"><header-search /></div>
      <div class="menu-item"><router-link to="/home">首页</router-link></div>
      <div class="menu-item hasChild" v-if="!fromSquare">
        <a href="#">文章</a>
        <div class="childMenu" v-if="category.length">
          <div class="sub-menu" v-for="item in category" :key="item.title">
            <router-link :to="`/category/${item.title}`">{{
              item.title
            }}</router-link>
          </div>
        </div>
      </div>
      <div class="menu-item" v-if="!fromSquare"><router-link to="/about">关于</router-link></div>
      <div class="menu-item" ><router-link to="/square">广场</router-link></div>
      <div class="menu-item hasChild">
        <a href="#">我的</a>
        <div class="childMenu" v-if="my.length">
          <div class="sub-menu" v-for="item in my" :key="item.title">
            <span @click="toRouter(item.href)">{{ item.title }}</span>
            <!-- <router-link :to="item.href" @click="toRouter(item.href)">{{ item.title }}</router-link> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/header-search.vue";
import { fetchCategory } from "../../api";
export default {
  name: "layout-header",
  components: { HeaderSearch },
  data() {
    return {
      lastScrollTop: 0,
      fixed: false,
      hidden: false,
      my: [
        { href: "/selfCenter", title: "个人中心" },
        { href: "/createBlog", title: "博客创作" },
        { href: "/login", title: "退出登陆" },
      ],
      mobileShow: false,
      fromSquare:false, // 是否来自于广场路由
    };
  },
  mounted() {
    window.addEventListener("scroll", this.watchScroll);
    // this.getCategory();
    // this.fetchCategory();
  },
  computed:{
    category(){
      return this.$store.state.bolgCateGory || []
    },
  },
  watch:{
    "$route.path"(to, from) {
      if(to.includes('square') || (!to.includes('home') && from.includes('square'))){
        this.fromSquare = true;
      } else {
        this.fromSquare = false;
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.watchScroll);
  },
  methods: {
    watchScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop === 0) {
        this.fixed = false;
        this.hidden = false;
      } else if(scrollTop > 600){
        this.fixed = false;
        this.hidden = true;
      } else if (scrollTop >= this.lastScrollTop) {
        this.fixed = false;
        this.hidden = true;
      } else {
        this.fixed = true;
        this.hidden = false;
      }
      this.lastScrollTop = scrollTop;
      this.$store.commit("SET_SCROLL_TOP",scrollTop);
    },
    fetchCategory() {
      fetchCategory()
        .then((res) => {
          console.log(res.data);
          this.category = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toRouter(href){
      this.$router.push(href);
      if(href === "/login"){
        localStorage.removeItem("token");
        this.$store.commit("SET_USER_INFO",null); // 清空用户信息
      }
    }
  },
};
</script>

<style scoped lang="less">
#layout-header {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 80px;
  padding: 0 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s all ease;
  -webkit-transition: 0.3s all ease;
  -moz-transition: 0.3s all linear;
  -o-transition: 0.3s all ease;
  -ms-transition: 0.3s all ease;
  &.hidden {
    top: -100px;
  }
  &.fixed {
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.site-logo {
  text-align: center;

  img {
    width: 60px;
    height: 60px;
  }

  p.site-name {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    top: -10px;
  }
}
.menus-btn {
  display: none;
  visibility: hidden;
}
.site-menus {
  display: flex;
  align-items: center;

  .menu-item {
    min-width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: relative;
    a {
      padding: 12px 10px;
      color: #545454;
      font-weight: 500;
      font-size: 16px;
      &:hover {
        color: #ff6d6d;
      }
    }
    &:not(:last-child) {
      margin-right: 15px;
    }
    &.hasChild:hover .childMenu {
      opacity: 1;
      visibility: visible;
      transform: translateY(-5px);
    }
  }
  .childMenu {
    width: 130px;
    background-color: #fdfdfd;
    border-radius: 3px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 55px;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transition: 0.7s all ease;
    -webkit-transition: 0.6s all ease;
    -moz-transition: 0.6s all linear;
    -o-transition: 0.6s all ease;
    -ms-transition: 0.6s all ease;
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 8px solid white;
      top: -8px;
      left: 20px;
    }
    &:before {
      top: -9px;
      border-bottom: 8px solid #ddd;
    }
    .sub-menu {
      height: 40px;
      line-height: 40px;
      position: relative;
      &:not(:last-child):after {
        /*position: absolute;*/
        content: "";
        width: 50%;
        height: 1px;
        color: #ff6d6d;
        bottom: 0;
        left: 25%;
        z-index: 99;
      }

      span{
        user-select: none;
        cursor: pointer;
        &:hover{
          color:#ff6d6d;
        }
      }
    }
  }
}
@media (max-width: 960px) {
  #layout-header {
    padding: 0 20px;
  }

  .site-menus .menu-item:last-of-type .childMenu{
    right:0;

    &::after{
      left: auto;
      right: 20px;
    }

    &::before{
      left: auto;
      right: 20px;
    }
  }

}
@media (max-width: 600px) {
  #layout-header {
    padding: 0 10px;
  }
  .menus-btn {
    display: block;
    visibility: visible;
  }
  .site-menus {
    position: absolute;
    display: none;
    visibility: hidden;
    background-color: #f9f9f9;
    width: 100%;
    left: 0;
    top: 80px;
    z-index: -9;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .menu-item {
      position: relative;
      height: unset;
      &:not(:last-child) {
        margin-right: 0;
      }
    }
    .childMenu {
      position: relative;
      width: 100%;
      top: 0;
      background-color: #f3f3f3;
      opacity: 1;
      visibility: visible;
      border: none;
      box-shadow: none;
      &:before,
      &:after {
        content: "";
        position: relative;
        width: 0;
        height: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    }
  }
  .site-menus.mobileShow {
    display: inline-block;
    visibility: visible;
    z-index: 99;
    padding-bottom: 1em;
  }
}
</style>
