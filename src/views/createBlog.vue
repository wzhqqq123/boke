<template>
  <div id="createBlog">
    <div class="mdContent">
      <p class="contentType"><i class="el-icon-edit"></i> 博客封面</p>
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :http-request="uploadBanner"
        :before-upload="handleBeforeUpload"
        :on-preview="handlePreview"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :file-list="fileList"
        :list-type="picture"
        :limit="1"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <p class="contentType"><i class="el-icon-edit"></i> 博客标题</p>
      <el-input
        v-model="editInfo.title"
        class="blogTitle inputDiv"
        placeholder="请输入文章标题（5～100个字）"
      ></el-input>
      <p class="contentType"><i class="el-icon-edit"></i> 博客摘要</p>
      <el-input
        type="textarea"
        :rows="2"
        class="summary inputDiv"
        placeholder="请输入文章摘要（5～200个字)"
        maxlength="200"
        resize="none"
        autosize
        show-word-limit
        v-model="editInfo.summary"
      >
      </el-input>
      <p class="contentType"><i class="el-icon-edit"></i> 博客分类</p>
      <el-autocomplete
        class="inline-input inputDiv"
        v-model="editInfo.category"
        :fetch-suggestions="querySearch"
        placeholder="请输入分类"
      ></el-autocomplete>
      <p class="contentType"><i class="el-icon-edit"></i> 是否置顶</p>
      <el-select v-model="editInfo.isTop" clearable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <p class="contentType"><i class="el-icon-edit"></i> 正文</p>
      <mavon-editor
        :class="['set_md_height', isFullScreen ? 'FullScreen' : '']"
        ref="mdedit"
        v-model="editInfo.content"
        :toolbars="toolbars"
        boxShadow
        defaultOpen="preview"
        toolbarsFlag
        @fullScreen="changeFullScreen"
        @imgAdd="imgAdd"
        ><button
          slot="left-toolbar-before"
          type="button"
          aria-hidden="true"
          title="颜色"
          class="op-icon"
          style="position: relative"
          v-if="toolbars.fontColors"
        >
          <i class="el-icon-font-color"></i>
          <el-color-picker
            style="opacity: 0; position: absolute; top: 0; left: 0"
            @change="activeChange"
          />
        </button>
      </mavon-editor>
    </div>
    <div class="contorl">
      <el-button class="saveBtn" type="primary" plain @click="save"
        >保存</el-button
      >
      <el-button
        class="backDetail"
        type="success"
        plain
        @click="backDetail"
        v-if="isEditPage"
        >查看</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "createBlog",
  components: {},
  data() {
    return {
      fileList: [], //上传封面
      picture: "picture", //封面预览
      editInfo: {}, //存储编辑回显数据
      isFullScreen: false, // 编辑是否全屏
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        fontColors: true,
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        table: true, // 表格
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: false, // 帮助
        code: true, // code
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        undo: false, // 上一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        subfield: true, // true：双栏(编辑预览同屏)，false： 单栏(编辑预览分屏)
      },
    };
  },
  created() {},
  watch: {
    "$route.path": {
      handler(toPath, fromPath) {
        if (toPath.indexOf("editBlog") !== -1) {
          // 博客编辑页面
          this.getBlogDetail();
        } else {
          // 博客新增页面
          this.clear();
        }
      },
      deep: true, // 深度监听
      immediate: true, // 第一次初始化渲染就可以监听到
    },
  },
  computed: {
    isEditPage() {
      return this.$route.path.indexOf("editBlog") !== -1;
    },
    saveUrl() {
      return this.isEditPage ? "/editBlog" : "/createBlog";
    },
    uploadFileurl() {
      return `${developUrl}/uploadFile`;
    },
    uploadBannerUrl() {
      return `${developUrl}/uploadBanner`;
    },
    categoryList() {
      return this.$store.state.bolgCateGory.map((item) => {
        item.value = item.title;
        return item;
      });
    },
  },
  methods: {
    // 获取博客内容详情
    getBlogDetail() {
      let param = {
        id: this.$route.params.id,
        requestName: "getBlogDetail",
      };
      this.$post("/getBlogDetail", param).then((res) => {
        const detail = res.data;
        if (detail.banner) {
          this.$set(this.fileList, 0, {
            url: developUrl + detail.banner.replaceAll(/\\/g, "/"),
            name: detail.banner.match(/([^\\]+)$/g)[0],
          });
        }
        this.editInfo = detail;
      });
    },
    imgAdd(pos, file) {
      let imgData = new FormData();
      imgData.append("file", file);
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "multipart/form-data",
          processData: false,
        },
      };
      this.$post(this.uploadFileurl, imgData, config).then((res) => {
        this.$refs.mdedit.$img2Url(pos, `${developUrl + res.data}`);
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 切换编辑器全屏
    changeFullScreen(status) {
      if (status) {
        this.isFullScreen = true;
        document.querySelector("#layout-header").style.display = "none";
      } else {
        this.isFullScreen = false;
        document.querySelector("#layout-header").style.display = "flex";
      }
    },
    // 上传封面
    uploadBanner() {
      let imgData = new FormData();
      imgData.append("file", this.fileList[0]);
      imgData.append("pubTime", this.editInfo.pubTime || this.pubTime);
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "multipart/form-data",
          processData: false,
        },
        requestName: "uploadBanner",
      };
      this.$post(this.uploadBannerUrl, imgData, config);
    },
    handleBeforeUpload(file) {
      this.fileList[0] = file;
    },
    handleChange(file) {
      this.fileList.push(file);
    },
    // 点击保存
    async save() {
      if (
        !this.editInfo.title ||
        !this.editInfo.summary ||
        !this.editInfo.category ||
        !this.editInfo.content ||
        this.editInfo.isTop === null ||
        !this.fileList.length
      ) {
        return this._message("数据填写不完整，请检查录入", "warning");
      }
      let htmlContent = document.querySelector(".v-show-content").innerHTML;
      htmlContent = htmlContent
        .replace(/(?<=<pre>).*?(?=<code)/gi, "")
        .replace(/(?<=code>).*?(?=<\/pre)/gi, "");
      // htmlContent = htmlContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // 转义所有<>标签
      // const regex =
      //   /(<(?!pre|\/pre|code|\/code)[^>]+?>)|(<\/(?!pre|code)[^>]+?>)/gi;
      // htmlContent = htmlContent.replace(regex, (match) => {
      //   return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // });
      this.pubTime = new Date().getTime();
      let params = {
        content: this.editInfo.content,
        htmlContent,
        title: this.editInfo.title,
        summary: this.editInfo.summary,
        category: this.editInfo.category.toUpperCase(),
        isTop: this.editInfo.isTop || 0,
        pubTime: this.editInfo.pubTime || this.pubTime,
        isHot: this.editInfo.isHot || 0,
        // commentsCount: this.editInfo.isHot || 0,
        // viewsCount: this.editInfo.viewsCount || 0,
        author: this.editInfo.author || this.$store.state.userInfo.username,
        requestName: "createBlog",
      };

      this.isEditPage ? (params.id = this.$route.params.id) : null;
      // 单独上传博客封面
      await this.submitUpload();
      this.$post(this.saveUrl, params).then((res) => {
        // 更新博客分类
        this.$store.commit("SET_BOLG_CATEGORY", res.data);
        if (!this.isEditPage) {
          // 如果是新建博客成功后返回首页
          this.$router.push({ path: "/home" });
        }
      });
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    handlePreview(file) {
      console.log(file, this.fileList);
    },
    // 退出编辑返回博客详情
    backDetail() {
      this.$router.push({
        path: `/article/${this.$route.params.id}`,
      });
    },
    querySearch(queryString, cb) {
      var restaurants = this.categoryList;
      var results = queryString
        ? restaurants.filter((item) => {
            return (
              item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            );
          })
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    clear() {
      this.editInfo = {};
    },
    // 自定义字体颜色改变
    activeChange(e) {
      const insert_text = {
        prefix: `<font color="${e}">`,
        subfix: "</font>",
        str: "",
      };
      const $vm = this.$refs.mdedit;
      $vm.insertText($vm.getTextareaDom(), insert_text);
    },
  },
};
</script>

<style lang="scss" scoped>
#createBlog {
  margin-top: 80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .mdContent {
    width: 90%;
    margin-top: 20px;

    .contentType {
      margin: 10px 0 5px 0;
      color: cadetblue;
    }
    .inputDiv {
      margin-bottom: 10px;
    }

    .set_md_height {
      max-height: 70vh;
      z-index: 88;
    }

    .set_md_height.FullScreen {
      max-height: 100vh;
    }
  }

  .contorl {
    margin-top: 10px;
    display: flex;
  }
}
.el-icon-font-color {
  transform: scale(1.15);

  &::before {
    content: "Α";
    font-weight: 550;
    left: 2px;
    position: relative;
    transform: scale(1.5);
  }
}
</style>
