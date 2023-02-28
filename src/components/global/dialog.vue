<!--
 * @Description: 全局弹窗
 * @Author: wzh
 * @Date: 2022-07-13 10:43:47
 * @LastEditTime: 2022-08-11 16:50:19
 * @LastEditors: wzh
-->
<template>
  <div class="dialog md-modal">
    <el-dialog
      :title="config.title"
      :visible.sync="dialogVisible"
      :width="config.width"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
    >
      <div
        class="dialogContent"
        :style="{ height: config.height ? config.height : 'auto' }"
      >
        <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "MyDialog",
  // inject:["appendToBody"],
  props: {
    //弹窗标题名称
    config: {
      type: Object,
      default: () => {
        return {
          title: "标题",
          width: "40%",
          height: "500px",
        };
      },
    },
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations({
      setUpdataView: "viewConfig/SET_UPDATAVIEW",
    }),
    closeDialog() {
      this.$emit("update:dialogVisible", false);
      if (this.config.updateView) {
        this.setUpdataView();
      }
    },
  },
};
</script>

<style scoped>
.md-modal /deep/ .el-dialog {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 20px;
  /* transform: translateX(-50%) translateY(-50%); */
}

.md-modal /deep/ .el-dialog .el-dialog__header {
  text-align: left;
  font-weight: 600;
  /* background: grey; */
  border-radius: 18px 18px 0 0;
  border-bottom: 1px solid #ebebeb;
}
.md-modal /deep/ .el-dialog .el-dialog__body {
  background-color: aliceblue;
  border-radius: 0 0 18px 18px;
}

.md-modal /deep/ .el-input--suffix .el-input__inner{
  padding-right: 55px;
}
</style>
