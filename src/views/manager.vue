<template>
  <div class="manager">
    <!-- <banner></banner> -->
    <div id="managerContent">
      <!-- 博客筛选区 -->
      <header class="condition">
        <span class="label">关键字查询：</span>
        <el-input
          placeholder="请输入关键字"
          v-model="searchWords"
          class="input-with-select"
          @keyup.enter.native="getBlogList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getBlogList"
          ></el-button>
        </el-input>

        <span class="label">分类：</span>
        <el-select
          v-model="category"
          clearable
          placeholder="请选择"
          @change="getBlogList"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.title"
            :label="item.title"
            :value="item.title"
          >
          </el-option>
        </el-select>
      </header>
      <!-- 博客列表 -->
      <el-table stripe :data="tableData" style="width: 100%" height="700">
        <el-table-column prop="title" label="标题" min-width="20%">
        </el-table-column>
        <el-table-column prop="summary" label="摘要" min-width="35%">
        </el-table-column>
        <el-table-column label="发布日期" min-width="15%">
          <template slot-scope="{ row }">
            <span>{{ row.pubTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" min-width="10%">
        </el-table-column>
        <el-table-column label="操作" min-width="20%">
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                size="mini"
                type="primary"
                @click="handlelook(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        :current-page.sync="currPage"
        style="text-align: center"
        @current-change="getBlogList"
      >
      </el-pagination>
      <MyDialog
        :dialogVisible.sync="dialogVisible"
        :config="{ title: '文章删除', width: '40%' }"
      >
        <p class="title">确定删除标题为 {{ deleteObj?.title }} 的文章吗？</p>
        <div class="delBtns">
          <el-button type="success" plain @click="deleteSure">确认</el-button>
          <el-button plain @click="cancleDelete">取消</el-button>
        </div>
      </MyDialog>
    </div>
  </div>
</template>

<script>
import Banner from "@/components/banner.vue";
export default {
  name: "manager",
  components: { Banner },
  data() {
    return {
      tableData: [],
      currPage: 1,
      pageSize: 8,
      category: null,
      searchWords: null,
      hasNextPage: false,
      total: 1,
      dialogVisible: false,
      deleteObj: null,
    };
  },
  created() {
    this.getBlogList();
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    categoryList() {
      return this.$store.state.bolgCateGory;
    },
  },
  methods: {
    // 获取博客列表
    getBlogList() {
      let param = {
        currPage: this.currPage,
        size: this.pageSize,
        searchWords: this.searchWords,
        category: this.category,
        requestName: "getBlogList"
      };
      this.$post("/getBlogList", param).then((res) => {
        this.searchWords = null;
        if (res.data) {
          this.tableData = res.data.list;
          this.currPage = res.data.currPage;
          this.hasNextPage = res.data.hasNextPage;
          this.total = res.data.total;
        }
      });
    },
    handlelook(index, row) {
      this.$router.push({ path: `/article/${row.id}` });
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/editBlog/${row.id}` });
    },
    handleDelete(index, row) {
      this.dialogVisible = true;
      this.deleteObj = row;
    },
    deleteSure() {
      let param = {
        id: this.deleteObj.id,
        requestName: "deleteBlog"
      };
      this.$post("/deleteBlog", param).then((res) => {
        if (res.status) {
          this.currPage = 1;
          this.getBlogList();
        }
      });
      this.cancleDelete();
    },
    cancleDelete() {
      this.deleteObj = null;
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.manager {
  margin-top: 80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  #managerContent {
    width: 80%;
    max-width: 1400px;

    .condition {
      display: flex;
      padding: 20px 0;
      align-items: center;

      .label {
        font-size: 15px;
        white-space: nowrap;
        color: grey;
        &:nth-of-type(2) {
          margin-left: 20px;
        }
      }
    }

    .title {
      text-align: left;
      line-height: 3em;
      font-size: 15px;
      margin-bottom: 20px;
    }
    .delBtns {
      display: flex;
      justify-content: center;
    }
  }

  @media (max-width: 1400px) {
    .btns .el-button + .el-button {
      margin-left: 0;
      margin-top: 5px;
    }
  }
}
</style>
