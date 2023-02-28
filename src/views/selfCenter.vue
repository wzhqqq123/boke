<template>
  <div id="seleCenter">
    <div class="banner-img"></div>
    <div id="userInfoContain">
      <div class="headIcon">
        <div
          :style="
            headIconUrl ? { 'background-image': `url(${headIconUrl})` } : null
          "
        ></div>
      </div>
      <el-button round class="changeHeadIcon" @click="openFileDialog"
        >更换头像</el-button
      >
      <div class="infoItem" v-for="item in userInfoConfig" :key="item.id">
        <span :class="['icon', item.id]"></span>
        <div class="title">{{ item.title }}</div>
        <el-input
          v-model="userInfo[item.id]"
          placeholder="请输入内容"
          :disabled="item.disabled"
          :clearable="item.clearable"
          :show-password="item.showPassword"
        ></el-input>
      </div>
      <span class="changePwd" @click="dialogVisible = true">修改</span>
      <div class="confirmBtns infoItem">
        <el-button type="success" @click="updateUseInfo">确认</el-button>
        <el-button type="info" @click="backHome">取消</el-button>
      </div>
    </div>
    <MyDialog
      :dialogVisible.sync="dialogVisible"
      :config="{ title: '修改密码', width: '40%' }"
    >
      <div class="infoItem" v-for="item in changePwdObj" :key="item.id">
        <span :class="['icon', item.id]"></span>
        <div class="title">{{ item.title }}</div>
        <el-input
          v-model="item.value"
          placeholder="请输入内容"
          clearable
          show-password
        ></el-input>
      </div>
      <el-button type="success" plain @click="updatePwd">确认</el-button>
      <el-button plain @click="dialogVisible = false">取消</el-button>
    </MyDialog>
    <input
      type="file"
      class="file"
      ref="imgFile"
      multiple="multiple"
      style="display: none"
      @change="uploadHeadIcon"
    />
  </div>
</template>

<script>
export default {
  name: "seleCenter",
  components: {},
  data() {
    return {
      userInfoConfig: [
        {
          id: "username",
          title: "登录名",
          showPassword: false,
          disabled: true,
          clearable: false,
        },
        {
          id: "realname",
          title: "用户名",
          showPassword: false,
          disabled: false,
          clearable: true,
        },
        {
          id: "email",
          title: "邮箱",
          showPassword: false,
          disabled: false,
          clearable: true,
        },
        {
          id: "phone",
          title: "联系方式",
          showPassword: false,
          disabled: false,
          clearable: true,
        },
        {
          id: "password",
          title: "密码",
          showPassword: true,
          disabled: true,
          clearable: false,
        },
      ],
      dialogVisible: false,
      changePwdObj: [
        {
          id: "oldPwd",
          title: "旧密码",
          value: "",
        },
        {
          id: "newPwd",
          title: "新密码",
          value: "",
        },
        {
          id: "confirmNewPwd",
          title: "确认密码",
          value: "",
        },
      ],
    };
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    headIconUrl() {
      return this.$store.state.userInfo.headIcon
        ? developUrl + this.$store.state.userInfo.headIcon
        : null;
    },
    updateAvatarurl() {
      return `${developUrl}/updateAvatar`;
    },
  },
  methods: {
    // getUserInfo() {
    //   // 获取用户信息
    //   this.$get("/getUserInfo", {
    //     requestName: "getUserInfo",
    //   }).then((res) => {
    //     res.data.password = 123456;
    //     this.userInfo = res.data;
    //   });
    // },
    updateUseInfo() {
      // 更新用户信息
      let { password, status, headIcon, ...params } = this.userInfo; // 剔除password属性
      this.$post("/updateUseInfo", params).then((res) => {
        this.$store.commit("SET_USER_INFO", res.data);
      });
    },
    backHome() {
      return this.$router.push({ path: "/home" });
    },
    updatePwd() {
      // 更新密码
      if (this.changePwdObj[1].value !== this.changePwdObj[2].value) {
        return this._message("两次输入的新密码不一致！", "error");
      }
      let param = {
        oldPwd: this.changePwdObj[0].value,
        newPwd: this.changePwdObj[1].value,
      };
      this.$post("/updatePassword", param).then((res) => {
        if (res.status) {
          this.$router.push("login");
        }
      });
    },
    uploadHeadIcon() {
      // 上传头像信息
      const file = this.$refs.imgFile.files[0];
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        return this._message("上传头像图片只能是JPG或PNG格式!", "error");
      }
      if (!isLt2M) {
        return this._message("上传头像图片大小不能超过 2MB!", "error");
      }
      let formdata = new FormData();
      formdata.append("headIcon", file);
      const config = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "content-type": "multipart/form-data",
          processData: false,
        },
      };
      this.$post(this.updateAvatarurl, formdata, config).then((res) => {
        this.$store.commit("SET_HEAD_ICON", res.data);
        // this.headIconUrl = developUrl + res.data;
      });
    },
    openFileDialog() {
      this.$refs.imgFile.click();
    },
  },
};
</script>

<style lang="scss" scoped>
#seleCenter {
  margin-top: 80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .banner-img {
    width: 80%;
    height: 500px;
    background-image: url(@/imgs/selfBgc.jpeg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.2s linear;
    overflow: hidden;

    &:hover {
      transform: scale(1.05, 1.05);
      filter: contrast(130%);
    }
  }

  #userInfoContain {
    margin-top: 20px;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 600px;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: #704141f5;
    box-shadow: 0 7px 0 #044452;
    transition: all 0.5s;
    text-align: center;
    color: #fff;

    .headIcon {
      margin-top: 20px;
      border-radius: 50%;
      border: 5px solid rgba(255, 255, 255, 0.3);
      div {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url(@/imgs/defaultHead.jpeg);
      }
    }

    .changeHeadIcon {
      margin: 10px 0;
    }

    span.changePwd {
      position: absolute;
      color: #3099f3;
      right: 5px;
      bottom: 3px;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
      bottom: 73px;
      right: 30px;
    }
  }

  .infoItem {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    padding: 0 20px;

    .icon {
      height: 25px;
      width: 25px;
      background-size: 100% 100%;
      margin-right: 10px;
    }

    .title {
      width: 80px;
      text-align: left;
    }

    .username {
      background-image: url(@/imgs/username.png);
    }

    .realname {
      background-image: url(@/imgs/realname.png);
    }

    .phone {
      background-image: url(@/imgs/phone.png);
    }

    .email {
      background-image: url(@/imgs/email.png);
    }

    .password {
      background-image: url(@/imgs/password.png);
    }

    .oldPwd {
      background-image: url(@/imgs/oldpassword.png);
    }

    .newPwd {
      background-image: url(@/imgs/password.png);
    }

    .confirmNewPwd {
      background-image: url(@/imgs/confirmPwd.png);
    }

    .el-input {
      flex: 1;
    }
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
}
</style>
