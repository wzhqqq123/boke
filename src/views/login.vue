<template>
  <div id="login">
    <div class="main">
      <h1>Alan's Blog</h1>
      <div class="login-form">
        <h2>SignIn Form</h2>
        <div class="agileits-top">
          <form action="#" method="post">
            <div class="styled-input">
              <input
                type="text"
                name="User Name"
                required=""
                v-model="username"
              />
              <label>User Name</label>
              <span></span>
              <div
                class="clearBtn"
                v-if="username"
                @click="clear('username')"
              ></div>
            </div>
            <div class="styled-input">
              <input
                type="password"
                name="Password"
                required=""
                v-model="password"
                @keydown.enter="login"
              />
              <label>Password</label>
              <span></span>
              <div
                class="clearBtn"
                v-if="password"
                @click="clear('password')"
              ></div>
            </div>
            <div class="wthree-text">
              <ul>
                <li>
                  <input type="checkbox" id="brand" value="" v-model="remember"/>
                  <label for="brand"><span></span> Remember me</label>
                </li>
                <li><a href="#" @click="toRegister">No account ?</a></li>
              </ul>
            </div>
          </form>
        </div>
        <div class="agileits-bottom">
          <input type="submit" value="Sign In" @click="login"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encode, decode } from 'js-base64';

export default {
  name: "login",
  data() {
    return {
      username: null,
      password: null,
      remember: false
    };
  },
  created(){
    this.initNamePwd();
  },
  methods: {
    clear(type) {
      type === "username" ? (this.username = null) : (this.password = null);
    },
    login() {
      this.$post("/api/login", {
        username: this.username,
        password: encode(this.password),
      }).then((res) => {
        const data = res.data;
        this.$store.commit("SET_USER_INFO",data.userInfo); // 存储用户信息
        localStorage.setItem("token", data.token ? data.token : "");
        // 记住密码存储到localStorage中
        if(this.remember){
          localStorage.setItem("wzhBokeUserName", this.username);
          localStorage.setItem("wzhBokePassword", encode(this.password)); // base64加密
        } else {
          localStorage.removeItem('wzhBokeUserName');
          localStorage.removeItem('wzhBokePassword');
        }
        this.$router.push({
            path:'/home'
        });
      });
    },
    toRegister() {
      this.$router.push({
        path: "/register",
      });
    },
    initNamePwd(){
      const name = localStorage.getItem("wzhBokeUserName");
      const pwd = localStorage.getItem("wzhBokePassword");
      if(name && pwd){
        this.username = name;
        this.password = decode(pwd); // base64解密
        this.remember = true;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
#login {
  background-image: url("@/imgs/login.jpeg");
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
h1 {
  font-size: 3em;
  text-align: center;
  color: #fff;
  font-weight: 100;
  font-family: cursive;
}
/*-- main --*/
h2 {
  font-size: 1.1em;
  text-align: center;
  padding: 1.2em;
  background: #02a299;
  color: #fff;
  font-weight: 200;
  letter-spacing: 10px;
}
.main {
  width: 100%;
  padding: 3em 0 0;
}
.login-form {
  width: 35%;
  margin: 3.5em auto;
  background: rgba(12, 85, 105, 0.51);
  padding-bottom: 4em;
}
.agileits-top {
  padding: 2em 3em 3em;
}
.login-form input[type="text"],
.login-form input[type="password"] {
  font-size: 1em;
  color: #fff;
  padding: 0.8em 1em;
  border: 0;
  width: 93%;
  border-bottom: 1px solid #c7c7c7;
  background: none;
  -webkit-appearance: none;
}
/*-- input-effect --*/
.styled-input input:focus ~ label,
.styled-input input:valid ~ label {
  font-size: 1.1em;
  color: #02a299;
  top: -2em;
  -webkit-transition: all 0.125s ease;
  transition: all 0.125s ease;
}
.styled-input {
  width: 100%;
  margin: 2em 0 1em;
  position: relative;
}

.styled-input label {
  color: #fff;
  padding: 0.8em 1em;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  transition: all 0.3s ease;
  pointer-events: none;
  font-weight: 400;
  font-size: 1em;
  display: block;
  line-height: 1em;
}
.styled-input input ~ span {
  display: block;
  width: 0;
  height: 2px;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  -webkit-transition: all 0.125s ease;
  transition: all 0.125s ease;
}

.styled-input input:focus {
  outline: 0;
}

.styled-input .clearBtn {
  position: absolute;
  background-image: url(@/imgs/clear.png);
  background-size: 100% 100%;
  height: 20px;
  width: 20px;
  top: 15px;
  right: 0;
  cursor: pointer;
}

.styled-input input:focus ~ span {
  width: 100%;
  -webkit-transition: all 0.075s ease;
  transition: all 0.075s ease;
  font-family: "OpenSans-Regular";
}
/*-- //input-effect --*/
.login-form p {
  font-size: 1em;
  color: #fff;
  margin: 1em 0 0.5em;
}
/*-- checkbox --*/
.wthree-text input[type="checkbox"] {
  display: none;
}
.wthree-text input[type="checkbox"] + label {
  position: relative;
  padding-left: 1.8em;
  border: none;
  outline: none;
  font-size: 1em;
  color: #fff;
  cursor: pointer;
  display: block;
}
.wthree-text input[type="checkbox"] + label span:first-child {
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  position: absolute;
  left: 0;
}
.wthree-text input[type="checkbox"]:checked + label span:first-child:before {
  content: "";
  background: url(@/imgs/tick.png) no-repeat;
  position: absolute;
  left: 1px;
  top: 0px;
  font-size: 10px;
  width: 10px;
  height: 10px;
}
/*-- //checkbox --*/
.wthree-text {
  margin-top: 3em;
}
.wthree-text ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wthree-text ul li {
  display: inline-flex;
}
.wthree-text ul li a {
  font-size: 1em;
  color: #fff;
}
.wthree-text ul li a:hover {
  color: #02a299;
}
.agileits-bottom {
  position: relative;
}
.agileits-bottom:before {
  content: "";
  position: absolute;
  top: -17px;
  left: -17px;
  width: 0;
  height: 0;
  border-top: 17px solid transparent;
  border-right: 18px solid #fff;
  transition: 0.5s all ease;
}
.agileits-bottom:after {
  content: "";
  position: absolute;
  top: -17px;
  right: -17px;
  width: 0;
  height: 0;
  border-left: 17px solid #fff;
  border-top: 17px solid transparent;
  transition: 0.5s all ease;
}
.agileits-bottom input[type="submit"] {
  font-size: 1.5em;
  color: #02a299;
  background: #fff;
  outline: none;
  cursor: pointer;
  padding: 1em 0;
  -webkit-appearance: none;
  border: none;
  width: 106%;
  margin-left: -0.7em;
  text-transform: uppercase;
}
.agileits-bottom input[type="submit"]:hover {
  color: #fff;
  background: #02a299;
  transition: 0.5s all ease;
}
.agileits-bottom:hover:before {
  border-right-color: #02a299;
}
.agileits-bottom:hover:after {
  border-left-color: #02a299;
}
/*-- //main --*/
/*-- responsive-design --*/
@media (max-width: 1440px) {
  .agileits-bottom input[type="submit"] {
    width: 106.8%;
  }
}
@media (max-width: 1366px) {
  .login-form {
    width: 37%;
    margin: 3em auto;
  }
}
@media (max-width: 1280px) {
  .login-form {
    width: 40%;
  }
}
@media (max-width: 1080px) {
  .main {
    padding: 2em 0 0;
  }
  .login-form {
    width: 48%;
  }
  h1 {
    font-size: 2.8em;
  }
}
@media (max-width: 1024px) {
  h1 {
    font-size: 2.6em;
  }
  .login-form {
    width: 50%;
    margin: 2em auto;
  }
}
@media (max-width: 991px) {
  h1 {
    font-size: 2.5em;
  }
  .login-form {
    width: 52%;
  }
}
@media (max-width: 900px) {
  .agileits-top {
    padding: 1em 3em 3em;
  }
  .login-form {
    width: 56%;
    padding-bottom: 3.5em;
  }
}
@media (max-width: 800px) {
  .login-form {
    width: 63%;
  }
  .agileits-top {
    padding: 1em 2.5em 2.5em;
  }
  .agileits-bottom input[type="submit"] {
    font-size: 1.3em;
    margin-left: -0.8em;
  }
}
@media (max-width: 768px) {
  h1 {
    font-size: 2.3em;
  }
  .agileits-bottom input[type="submit"] {
    width: 107%;
  }
}
@media (max-width: 736px) {
  .agileits-bottom input[type="submit"] {
    width: 107.5%;
  }
}
@media (max-width: 667px) {
  .agileits-bottom input[type="submit"] {
    width: 108%;
    font-size: 1.1em;
    margin-left: -0.9em;
  }
}
@media (max-width: 640px) {
  .login-form {
    width: 67%;
  }
  .agileits-bottom input[type="submit"] {
    width: 108%;
  }
}
@media (max-width: 600px) {
  .agileits-bottom input[type="submit"] {
    width: 108.7%;
  }
}
@media (max-width: 480px) {
  h1 {
    font-size: 1.8em;
  }
  h2 {
    font-size: 1em;
    padding: 1em;
    letter-spacing: 7px;
  }
  .agileits-top {
    padding: 1em 1.5em 1.5em;
  }
  .login-form input[type="text"],
  .login-form input[type="password"] {
    font-size: 0.9em;
    padding: 0.6em 1em;
    width: 93%;
  }
  .styled-input label {
    padding: 0.6em 1em;
    font-size: 0.9em;
  }
  .styled-input input:focus ~ label,
  .styled-input input:valid ~ label {
    font-size: 1em;
    top: -1.5em;
  }
  .wthree-text {
    margin-top: 2em;
  }
  .wthree-text input[type="checkbox"] + label {
    font-size: 0.9em;
    padding-left: 1.5em;
  }
  .wthree-text input[type="checkbox"] + label span:first-child {
    width: 12px;
    height: 12px;
  }
  .wthree-text ul li a {
    font-size: 0.9em;
  }
  .agileits-bottom input[type="submit"] {
    font-size: 1em;
    margin-left: -0.6em;
    width: 105.3%;
    padding: 0.8em 0;
  }
  .login-form {
    padding-bottom: 3em;
  }
  .login-form {
    width: 80%;
  }
  .agileits-bottom:before {
    top: -11px;
    left: -11px;
    border-top: 11px solid transparent;
    border-right: 11px solid #fff;
  }
  .agileits-bottom:after {
    top: -11px;
    right: -11px;
    border-left: 11px solid #fff;
    border-top: 11px solid transparent;
  }
  .wthree-text input[type="checkbox"]:checked + label span:first-child:before {
    left: -1px;
    top: -1px;
    transform: scale(0.8);
  }
}
@media (max-width: 414px) {
  .main {
    padding: 1.5em 0 0;
  }
  .styled-input {
    margin: 1.5em 0 1em;
  }
  .agileits-bottom:before {
    top: -10px;
    left: -10px;
    border-top: 10px solid transparent;
    border-right: 10px solid #fff;
  }
  .agileits-bottom:after {
    top: -10px;
    right: -10px;
    border-left: 10px solid #fff;
    border-top: 10px solid transparent;
  }
  .agileits-bottom input[type="submit"] {
    width: 106%;
  }
}
@media (max-width: 384px) {
  .agileits-bottom input[type="submit"] {
    width: 106.8%;
    font-size: 0.9em;
    margin-left: -0.7em;
  }
}
@media (max-width: 375px) {
  .agileits-bottom input[type="submit"] {
    width: 106.5%;
    margin-left: -0.6em;
  }
  h1 {
    font-size: 1.6em;
  }
  h2 {
    letter-spacing: 5px;
  }
  .login-form {
    margin: 1.5em auto;
  }
  .wthree-text ul li {
    display: block;
  }
  // .wthree-text ul li:nth-child(2) {
  //   margin-top: 1em;
  // }
  .wthree-text {
    margin-top: 1.5em;
  }
}
@media (max-width: 320px) {
  h2 {
    letter-spacing: 3px;
    padding: 0.8em;
  }
  .login-form {
    width: 85%;
  }
  .agileits-top {
    padding: 0.5em 1em 1.5em;
  }
  .login-form input[type="text"],
  .login-form input[type="password"] {
    font-size: 0.85em;
    padding: 0.6em;
    width: 88%;
  }
  .styled-input label {
    padding: 0.6em;
    font-size: 0.85em;
  }
  .styled-input input:focus ~ label,
  .styled-input input:valid ~ label {
    font-size: 0.9em;
    top: -1em;
  }
  .login-form {
    padding-bottom: 2em;
  }
  .agileits-bottom input[type="submit"] {
    width: 107%;
    margin-left: -0.6em;
  }
}
</style>
