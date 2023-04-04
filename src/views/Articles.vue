<template>
  <div class="articles">
    <banner></banner>
    <div class="site-content animate">
      <main class="site-main">
        <article class="hentry" v-if="blogDetail">
          <router-link :to="`/editBlog/${blogDetail.id}`" class="edit"
            ><i class="el-icon-position" style="color: grey" v-if="showEditBtn"
              >编辑</i
            ></router-link
          >
          <!-- 文章头部 -->
          <header class="entry-header">
            <!-- 标题输出 -->
            <h1 class="entry-title">{{ blogDetail.title }}</h1>
            <hr />
            <div class="breadcrumbs">
              <div id="crumbs">
                最后更新时间：{{ blogDetail.pubTime | parseTime }}
              </div>
            </div>
          </header>
          <!-- 正文输出 -->
          <div
            class="entry-content"
            v-html="blogDetail.htmlContent"
            v-highlight
          ></div>
          <!-- 文章底部 -->
          <section-title>
            <footer class="post-footer">
              <!-- 阅读次数 -->
              <div class="post-like">
                <i class="iconfont iconeyes"></i>
                <span class="count">{{ blogDetail.viewsCount }}</span>
              </div>
              <div
                class="donate"
                v-if="showDonate"
                @click="showDonate = !showDonate"
              >
                <span>赏</span>
                <ul class="donate_inner" :class="{ show: showDonate }">
                  <li class="wedonate">
                    <img src="http://cdn.fengziy.cn/gblog/wexin_pay.png" />
                    <p>微信</p>
                  </li>
                  <li class="alidonate">
                    <img src="http://cdn.fengziy.cn/gblog/ali_pay.jpg" />
                    <p>支付宝</p>
                  </li>
                </ul>
              </div>
              <!-- 文章标签 -->
              <div class="post-tags" v-if="blogDetail.category">
                <i class="iconfont iconcategory"></i>
                <router-link :to="`/category/${blogDetail.category}`">{{
                  blogDetail.category
                }}</router-link>
              </div>
            </footer>
          </section-title>

          <!--声明-->
          <div class="open-message">
            <p>
              声明：Gblog博客|版权所有，违者必究|如未注明，均为原创|本网站采用<a
                href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
                target="_blank"
                >BY-NC-SA</a
              >协议进行授权
            </p>
            <p>
              转载：转载请注明原文链接 -
              <a :href="thisHref">{{ blogDetail.title }}</a>
            </p>
          </div>
          <!--评论-->
          <div class="commentHeader" style="padding: 30px 0px">
            <h1 class="section-title">
              <div class="comment-hr">
                <div class="comment-title">
                  <span>Comments</span>|<span> {{ commentSize }} 条评论</span>
                </div>
                <div class="addCommentBtn" @click.stop="addComment">
                  添加评论
                </div>
              </div>
            </h1>
            <div v-if="showCommentEditor" @click.stop="">
              <comment-message-editor
                :inline="true"
                buttonText="添加"
                @submit="submitAdd"
              ></comment-message-editor>
            </div>
            <div class="comments" v-if="comments.length">
              <comment
                v-for="item in comments"
                :key="item.id"
                :comment="item"
                @refreshComment="getComment"
                @updateCommentCount="updateCommentCount"
              >
                <template v-if="item.reply && item.reply.length">
                  <comment
                    @refreshComment="getComment"
                    @updateCommentCount="updateCommentCount"
                    v-for="reply in item.reply"
                    :key="reply.id"
                    :comment="reply"
                  ></comment>
                </template>
              </comment>
            </div>
          </div>
        </article>
      </main>
    </div>
    <!-- 文章目录 -->
    <div id="article-menus" v-if="menus.length">
      <div class="right-side">
        <menu-tree :menus="menus" child-label="child"></menu-tree>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from "@/components/banner.vue";
import sectionTitle from "@/components/section-title.vue";
import comment from "@/components/comment.vue";
import menuTree from "@/components/menu-tree.vue";
import commentMessageEditor from "comment-message-editor";

export default {
  name: "articles",
  data() {
    return {
      showDonate: false,
      comments: [],
      commentSize: 0, // 评论数量
      menus: [],
      blogDetail: null,
      thisHref: "/",
      showCommentEditor: false,
    };
  },
  components: {
    Banner,
    sectionTitle,
    comment,
    menuTree,
    commentMessageEditor,
  },
  methods: {
    // 获取评论
    getComment() {
      let param = {
        id: this.$route.params.id,
        requestName: "getCommentList",
      };
      this.$post("/getComment", param).then((res) => {
        this.comments = res.data || [];
        this.commentSize = res.size || 0;
        // console.log(this.comments);
      });
    },
    fetchH(arr, left, right) {
      if (right) {
        return arr.filter(
          (item) => item.offsetTop > left && item.offsetTop < right
        );
      } else {
        return arr.filter((item) => item.offsetTop > left);
      }
    },
    // 生成目录
    createMenus() {
      let arr = [];
      for (let i = 6; i > 0; i--) {
        let temp = [];
        let e = document
          .querySelector(".entry-content") && document
          .querySelector(".entry-content")
          .querySelectorAll(`h${i}`);
        for (let j = 0; j < e.length; j++) {
          e[j].id = "a" + Math.floor(Math.random() * 10000);
          let child = this.fetchH(
            arr,
            e[j].offsetTop,
            j + 1 === e.length
              ? undefined
              : e[j + 1].getBoundingClientRect().top
          );
          temp.push({
            h: i,
            title: e[j].innerText,
            id: e[j].id,
            offsetTop: e[j].getBoundingClientRect().top,
            child,
          });
        }
        if (temp.length) {
          arr = temp;
        }
      }
      this.menus = arr;
    },
    // 获取博客内容详情
    async getBlogDetail() {
      let param = {
        id: this.$route.params.id,
        requestName: "getBlogDetail",
      };
      await this.$post("/getBlogDetail", param).then((res) => {
        this.blogDetail = res.data;
      });

      this.addViewsCount({
        viewsCount: this.blogDetail.viewsCount,
        requestName: "addViewsCount",
        ...param,
      });
    },
    // 每次浏览详情增加一次浏览数量
    addViewsCount(param) {
      this.$post("/addViewsCount", param);
    },
    // 添加一级评论
    addComment() {
      this.showCommentEditor = true;
    },
    async submitAdd(v) {
      // 获取该文章作者真实名称
      const realname = await this.$get(
        `/getUserInfo?username=${this.blogDetail.author}`
      ).then((res) => {
        return res.data.realname;
      });
      if (realname) {
        let param = {
          blogId: this.$route.params.id, // 文章id
          fromUserId: this.$store.state.userInfo.username,
          fromUserName: this.$store.state.userInfo.realname,
          fromUserAvatar: this.$store.state.userInfo.headIcon,
          toUserId: this.blogDetail.author,
          toUserName: realname,
          content: v,
          createTime: new Date().getTime(),
          requestName: "addComment",
        };
        await this.$post("/addComment", param).then((res) => {
          this.close();
          this.getComment();
        });
        // 更新博客绑定的评论数量
        this.updateCommentCount();
      }
    },
    // 更新博客评论数量
    updateCommentCount() {
      let param = {
        blogId: this.$route.params.id, // 文章id
        commentsCount: this.blogDetail.commentsCount, // 评论数量
      };
      this.$post("/updateCommentCount", param);
    },
    close() {
      this.showCommentEditor = false;
    },
  },
  watch: {
    showCommentEditor(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  created() {
    this.getBlogDetail();
    this.getComment();
    this.thisHref = location.href;
  },
  mounted() {
    let that = this;
    const targetNode = document.querySelector(".site-main");
    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };
    // 当观察到变动时执行的回调函数
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          mutation.addedNodes[0]?.classList?.contains("hentry")
        ) {
          setTimeout(() => {
            that.createMenus();
          }, 2000);
        }
      }
    };
    // 创建一个观察器实例并传入回调函数
    this.observer = new MutationObserver(callback);
    // 以上述配置开始观察目标节点
    this.observer.observe(targetNode, config);
  },
  beforeDestroy() {
    this.observer = null;
  },
  computed: {
    showEditBtn() {
      return this.$store.state.userInfo?.username === this.blogDetail?.author;
    },
  },
};
</script>
<style scoped lang="less">
.articles {
  position: relative;
}
.site-content {
  position: relative;
  display: flex;
  justify-content: center;
  .site-main {
    padding: 80px 0 0 0;
    max-width: 800px;
    width: 100%;
  }
}
#article-menus {
  margin-left: 100px;
  position: absolute;
  top: 500px;
  right: 100px;
  height: calc(100% - 500px);

  .right-side {
    position: sticky;
    top: 0;
    box-shadow: 0 2px 6px rgb(0 0 0 / 10%);
    border-radius: 3px;
    padding: 15px;
    width: 300px;
    transform: translateY(100px);
    font-size: 14px;
    max-height: 700px;
    overflow-y: auto;
  }
}
article.hentry {
  position: relative;
  .edit {
    position: absolute;
    right: 0;
    transform: translateY(5px);
  }
  .entry-header {
    .entry-title {
      font-size: 23px;
      font-weight: 600;
      color: #737373;
      margin: 0.67em 0;

      &:before {
        content: "#";
        margin-right: 6px;
        color: #d82e16;
        font-size: 20px;
        font-weight: 600;
      }
    }

    hr {
      height: 1px;
      border: 0;
      background: #efefef;
      margin: 15px 0;
    }

    .breadcrumbs {
      font-size: 14px;
      color: #d2d2d2;
      text-decoration: none;
      margin-bottom: 30px;
    }
  }

  footer.post-footer {
    width: 100%;
    padding: 20px 10px;
    margin-top: 30px;
    height: 65px;
    position: relative;
    i {
      font-size: 18px;
      margin-right: 5px;
    }
    .post-like {
      float: right;
      margin: 7px 0 0 20px;
    }

    .post-share {
      float: right;
      list-style: none;
      margin-right: 20px;
    }

    .donate {
      float: left;
      line-height: 36px;
      border-radius: 100%;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border: 1px solid #2b2b2b;
      &:hover {
        border: 1px solid goldenrod;
        span {
          color: goldenrod;
        }
      }
      span {
        color: #2b2b2b;
        padding: 10px;
        position: relative;
        cursor: pointer;
      }

      .donate_inner {
        display: none;
        margin: 0;
        list-style: none;
        position: absolute;
        left: 80px;
        top: -40px;
        background: #fff;
        padding: 10px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 3px;
        &.show {
          display: block;
        }
        li {
          float: left;
        }

        img {
          width: 100px;
        }
        p {
          text-align: center;
          font-size: 15px;
          color: #d2d2d2;
          line-height: 1rem;
        }
      }

      .donate_inner:after,
      .donate_inner:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 45%;
        margin-left: -8px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #fff;
      }

      .donate_inner:before {
        left: -1px;
        border-right: 8px solid #ddd;
      }
    }

    .post-tags {
      margin: 7px 0 0 20px;
      float: left;
      text-transform: uppercase;
      a:hover {
        color: #ff6d6d;
      }
    }
  }
  .open-message {
    margin: 50px 0;
    position: relative;
    background: #2b2b2b;
    padding: 10px 30px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    &:after {
      content: "";
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #2b2b2b;
      position: absolute;
      top: -8px;
      left: 48%;
    }
    p {
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      // white-space: nowrap;
    }
    a {
      color: #a0dad0;
      padding: 0 5px;
    }
  }

  .commentHeader {
    .section-title {
      color: #757575;
      font-size: 16px;
      font-weight: 400;
      padding-bottom: 15px;
      border-bottom: 1px dashed #ececec;
      .comment-hr {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .comment-title span:first-of-type {
          font-size: 18px;
          font-weight: 700;
          margin-right: 20px;
        }
        .comment-title span:nth-of-type(2) {
          font-size: 16px;
          margin-left: 20px;
        }

        .addCommentBtn {
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
          &:hover {
            color: cornflowerblue;
            font-weight: bold;
            transform: scale(1.2);
          }
        }
      }
    }
  }
}
@media (max-width: 1700px) {
  #article-menus {
    right: 50px;
  }
}

@media (max-width: 1600px) {
  #article-menus {
    right: 25px;
  }
}

@media (max-width: 1500px) {
  #article-menus {
    display: none;
  }
}
@media (max-width: 800px) {
  #article-menus {
    display: none;
  }
}
</style>
