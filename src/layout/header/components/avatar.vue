<template>
  <el-dropdown>
    <span class="el-dropdown-link">
       <el-avatar shape="square" :size="50" :src="squareUrl" />
      &nbsp;&nbsp;{{currentUser.username}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item @click="logout">安全退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import {ref} from 'vue'
import store from '@/store'
import { ArrowDown } from '@element-plus/icons-vue'
import requestUtil,{getServerUrl} from '@/util/request'

const currentUser=ref(store.getters.GET_USERINFO)
const squareUrl=ref(getServerUrl()+'image/userAvatar/'+currentUser.value.avatar)
// console.log(getServerUrl()+'image/userAvatar/'+currentUser.value.avatar)

const logout=async ()=>{
  let result=await requestUtil.get('/logout')
  if(result.data.code===200){
    store.commit('RESET_TABS');
    store.commit('SET_ROUTES_STATE',false);
    store.dispatch('logout')  //store中action通过dispatch触发
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
