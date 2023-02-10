<template>
  <el-button type="primary" @click="handleLogin">测试登录</el-button>
  <el-button type="danger" @click="handleUserList">测试获取用户列表信息</el-button>
</template>
<script setup>
import requestUtil from '@/util/request'
import store from '@/store'

const handleLogin=async ()=>{
  let result=await requestUtil.get('test/login')
  let data=result.data
  if(data.code===200){
    const token=data.token
    console.log("登陆成功：token="+token)
    // store.commit('SET_TOKEN',token);
    this.$store.commit('SET_TOKEN',token)
  }else{
    console.log("登录出错！")
  }
}

const handleUserList=async ()=>{
  let result=await requestUtil.get("test/user/list");
  let data=result.data;
  if(data.code===200){
    const userList=data.userList;
    console.log("用户列表信息：userList="+userList);
  }else{
    console.log("出错！")
  }
}

</script>
<style>
</style>
