<template>
  <div class="login">

    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">Java1234 Vue3 后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
            v-model="loginForm.username"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="账号"
        >
          <template #prefix><svg-icon icon="user" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon="password" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
            v-model="loginForm.code"
            size="large"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon="validCode" /></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox  v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
            size="large"
            type="primary"
            style="width:100%;"
            @click.prevent="handleLogin"
        >
          <span>登 录</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2013-2022 <a href="http://www.codeleader.top" target="_blank">codeleader.top</a> 版权所有.</span>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import requestUtil from '@/util/request'
import store from '@/store'
import qs from 'qs'
import {ElMessage} from 'element-plus'
import router from '@/router'
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/util/jsencrypt";
const loginRef=ref(null)
const codeUrl=ref('')

const loginForm=ref({
  username:"",
  password:"",
  rememberMe:false,
  code:'',
  uuid:''
})

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code:[{required:true,trigger:'blur',message:'请输入验证码'}]
};

const getCode=async ()=>{
  let result=await requestUtil.get('/captcha');
  console.log(result)
  loginForm.value.uuid=result.data.uuid;
  codeUrl.value=result.data.base64Img;
}

const handleLogin=()=>{
  loginRef.value.validate(async(valid)=>{
    if(valid){
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      console.log('请求login')
      let result=await requestUtil.post("login?"+qs.stringify(loginForm.value))
      console.log('请求login结束')
      let data=result.data
      if(data.code===200){
        const token=data.authorization
        const menuList=data.menuList
        const currentUser=data.currentUser
        const perms=data.perms
        console.log('准备设置的token:'+token)
        console.log('menuList='+menuList)
        // this.$store.commit('SET_TOKEN',token)
        store.commit('SET_TOKEN',token)
        console.log('token是否设置成功:'+store.getters.GET_TOKEN);
        // debugger
        store.commit('SET_MENULIST',menuList)
        // debugger
        store.commit('SET_USERINFO',currentUser)
        store.commit('SET_PERMS',perms)
        // router.replace("/")
        //  router.push({path: '/'})
        console.log('准备跳转')
        await router.replace({path: '/index'})
        // debugger
        console.log(' router.replace("/")执行完毕')
      }else{
        ElMessage.error(data.msg)
      }
    }else{
      console.log('验证失败');
    }
  })
}
function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCode();
getCookie();
</script>

<style lang="scss" scoped>
a{
  color:white
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/wallhaven-3kpdqd.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;
    input {
      display: inline-block;
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
