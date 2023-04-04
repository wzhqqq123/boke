<template>
  <div id="banner" :class="{ 'home-banner': isHome }">
    <div :class="['banner-img',imgClass]">
      <template v-if="isHome">
        <!--博主信息-->
        <div class="focusinfo">
          <!-- 头像 -->
          <div class="header-tou">
            <router-link to="/home"
              ><div class="headIcon">
                <div
                  :style="
                    headIconUrl
                      ? { 'background-image': `url(${headIconUrl})` }
                      : null
                  "
                ></div></div
            ></router-link>
          </div>
          <!-- 简介 -->
          <div class="header-info">
            <p>{{ websiteInfo.slogan }}</p>
          </div>
          <!-- 社交信息 -->
          <div class="top-social">
            <div v-for="item in socials" :key="item.id" :title="item.title">
              <a
                :href="item.href"
                target="_blank"
                :style="{ color: item.color }"
                ><i class="iconfont" :class="item.icon"></i
              ></a>
            </div>
          </div>
        </div>
        <!--左右倾斜-->
        <div class="slant-left"></div>
        <div class="slant-right"></div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "banner",
  data() {
    return {
      websiteInfo: {},
      socials: [],
    };
  },
  props: {
    src: {
      type: String,
      default: "@/imgs/topBgc.jpg",
    },
    isHome: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    headIconUrl() {
      return this.$store.state.userInfo?.headIcon
        ? developUrl + this.$store.state.userInfo?.headIcon
        : null;
    },
    imgClass(){
      return `bannel${[Math.floor(Math.random() * 10) + 1]}`
      35910
    }
  },
  created() {
    this.getWebSiteInfo();
    this.getSocial();
  },
  methods: {
    getSocial() {
      this.$store.dispatch("getSocials").then((data) => {
        this.socials = data;
      });
    },
    getWebSiteInfo() {
      this.$store.dispatch("getSiteInfo").then((data) => {
        this.websiteInfo = data;
      });
    },
  },
};
</script>

<style scoped lang="less">
#banner {
  position: relative;
  margin-top: 80px;
  width: 100%;
  height: 500px;

  .banner-img {
    width: inherit;
    height: inherit;
    background-image: url("@/imgs/topBgc1.jpeg");
    transition: all 0.2s linear;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    &:hover {
      transform: scale(1.1, 1.1);
      filter: contrast(130%);
    }
  }

  .bannel1{
    background-image: url("@/imgs/topBgc1.jpeg");
  }
  .bannel2{
    background-image: url("@/imgs/topBgc2.jpeg");
  }
  .bannel3{
    background-image: url("@/imgs/topBgc3.jpeg");
  }
  .bannel4{
    background-image: url("@/imgs/topBgc4.jpeg");
  }
  .bannel5{
    background-image: url("@/imgs/topBgc5.jpeg");
  }
  .bannel6{
    background-image: url("@/imgs/topBgc6.jpeg");
  }
  .bannel7{
    background-image: url("@/imgs/topBgc7.jpeg");
  }
  .bannel8{
    background-image: url("@/imgs/topBgc8.jpeg");
  }
  .bannel9{
    background-image: url("@/imgs/topBgc9.jpeg");
  }
  .bannel10{
    background-image: url("@/imgs/topBgc10.jpeg");
  }

  &.home-banner {
    height: 550px;
    .banner-img {
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
      z-index: -1;
      transition: unset;
      &:hover {
        transform: unset;
        filter: unset;
      }
    }
    .slant-left {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 100px solid #fff;
      border-right: 800px solid transparent;
      left: 0;
      bottom: 0;
    }
    .slant-right {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 100px solid #fff;
      border-left: 800px solid transparent;
      right: 0;
      bottom: 0;
    }
  }
}

.headIcon {
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.3);
  width: fit-content;
  position: relative;
  left: calc(50% - 40px);
  div {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(@/imgs/defaultHead.jpeg);
  }
}

.focusinfo {
  position: relative;
  max-width: 800px;
  padding: 0 10px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  text-align: center;
  img {
    width: 80px;
    height: auto;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
  .header-info {
    width: 60%;
    font-size: 14px;
    color: #eaeadf;
    background: rgba(0, 0, 0, 0.66);
    padding: 20px 30px;
    margin: 30px auto 0 auto;
    font-family: miranafont, "Hiragino Sans GB", STXihei, "Microsoft YaHei",
      SimSun, sans-serif;
    letter-spacing: 1px;
    line-height: 30px;
  }
  .top-social {
    height: 32px;
    margin-top: 30px;
    margin-left: 10px;
    list-style: none;
    display: inline-block;
    font-family: miranafont, "Hiragino Sans GB", STXihei, "Microsoft YaHei",
      SimSun, sans-serif;
    div {
      float: left;
      margin-right: 10px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      width: 32px;
      background: white;
      border-radius: 100%;
    }
  }
}
@media (max-width: 960px) {
  #banner {
    height: 400px;
  }
}
@media (max-width: 800px) {
  #banner {
    display: none;
  }
}
</style>
