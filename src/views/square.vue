<template>
  <div class="home">
    <div class="site-content animate">
      <!--通知栏-->
      <div class="notify" v-if="searchWords">
        <div class="search-result" >
          <span >搜索结果："{{ searchWords }}" 相关文章</span>
        </div>
      </div>
      <!--文章列表-->
      <main class="site-main" :class="{ search: searchWords }">
        <section-title v-if="!searchWords">推荐</section-title>
        <template v-for="item in blogList">
          <post :post="item" :key="item.id"></post>
        </template>
        <Empty v-if="!blogList.length">文章飞走咯~</Empty>
      </main>
      <!--加载更多-->
      <div class="more" v-show="hasNextPage">
        <div class="more-btn" @click="loadMore">More</div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from "@/components/banner.vue";
import Empty from "@/components/empty.vue";
import Feature from "@/components/feature.vue";
import sectionTitle from "@/components/section-title.vue";
import Post from "@/components/post.vue";
import SmallIco from "@/components/small-ico.vue";
import Quote from "@/components/quote.vue";

export default {
  name: "Home",
  props: ["cate", "words"],
  data() {
    return {
      features: [],
      blogList: [],
      currPage: 1,
      hasNextPage: false,
      pageSize: 10,
    };
  },
  components: {
    Banner,
    Empty,
    Feature,
    sectionTitle,
    Post,
    SmallIco,
    Quote,
  },
  computed: {
    searchWords() {
      return this.$route.params.words;
    },
    notice() {
      return this.$store.getters.notice;
    },
  },
  watch: {
    "$route.path"(to, from) {
      this.currPage = 1;
      this.hasNextPage = false;
      this.blogList = [];
      this.getBlogList();
    },
  },
  methods: {
    // 获取广场所有博客列表
    getBlogList() {
      let param = {
        currPage: this.currPage,
        size: this.pageSize,
        searchWords: this.searchWords,
        requestName: "getAllBlogList"
      };
      this.$post("/getAllBlogList", param).then((res) => {
        if (res.data) {
          this.blogList = this.blogList.concat(res.data.list);
          this.currPage = res.data.currPage;
          this.hasNextPage = res.data.hasNextPage;
        }
      });
    },
    loadMore() {
      console.log(this.currPage);
      this.currPage++;
      this.getBlogList();
    },
  },
  created() {
    this.getBlogList();
  },
  mounted() {
    // this.fetchFocus();
  },
};
</script>
<style scoped lang="less">
.site-content {
  .notify {
    margin: 60px 0;
    border-radius: 3px;
    & > div {
      padding: 20px;
    }
  }

  .search-result {
    padding: 15px 20px;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    border: 1px dashed #ddd;
    color: #828282;
  }
}

.top-feature {
  width: 100%;
  height: auto;
  margin-top: 30px;

  .feature-content {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    position: relative;

    .feature-item {
      width: 32.9%;
    }
  }
}

.site-main {
  padding-top: 120px;
  text-align: left;
  &.search {
    padding-top: 0;
  }
}

.more {
  margin: 50px 0;
  .more-btn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #adadad;
    border: 1px solid #adadad;
    border-radius: 20px;
    margin: 0 auto;
    cursor: pointer;
    &:hover {
      color: #8fd0cc;
      border: 1px dashed #8fd0cc;
    }
  }
}

/******/
@media (max-width: 800px) {
  .top-feature {
    display: none;
  }

  .site-main {
    padding-top: 40px;
  }

  .site-content {
    .notify {
      margin: 30px 0 0 0;
    }

    .search-result {
      margin-bottom: 20px;
      font-size: 16px;
    }
  }
}

/******/
</style>
