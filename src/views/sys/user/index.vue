<template>
  <div class="app-container">

    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input placeholder="请输入用户名..." v-model="queryForm.query" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initUserList">搜索</el-button>
      <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()">新增</el-button>
      <el-popconfirm title="您确定批量删除这些记录吗？" @confirm="handleDelete(null)">
        <template #reference>
          <el-button type="danger" :disabled="delBtnStatus" :icon="Delete" >批量删除</el-button>
        </template>
      </el-popconfirm>
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="avatar" label="头像" width="80" align="center">
        <template v-slot="scope">
          <img :src="getServerUrl()+'image/userAvatar/'+scope.row.avatar" width="50" height="50"/>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"  width="100" align="center"/>
      <el-table-column prop="roles" label="拥有角色" width="200" align="center">
        <template v-slot="scope">
          <el-tag size="small" type="warning" v-for="item in scope.row.sysRoleList">   {{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200" align="center"/>
      <el-table-column prop="phonenumber" label="手机号" width="120" align="center"/>
      <el-table-column prop="status" label="状态？" width="200" align="center" >
        <template v-slot="{row}" >
          <el-switch  v-model="row.status" @change="statusChangeHandle(row)" active-text="正常"
                      inactive-text="禁用" active-value="0" inactive-value="1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center"/>
      <el-table-column prop="loginDate" label="最后登录时间" width="200" align="center"/>
      <el-table-column prop="remark" label="备注"  />
      <el-table-column prop="action" label="操作" width="400" fixed="right" align="center">
        <template v-slot="scope" >
          <el-button  type="primary" :icon="Tools" @click="handleRoleDialogValue(scope.row.id,scope.row.sysRoleList)" v-if="hasAuth('system:user:role')">分配角色</el-button>
          <el-button v-if="scope.row.username!=='admin' && hasAuth('system:user:edit')" type="primary" :icon="Edit" @click="handleDialogValue(scope.row.id)" />
          <el-popconfirm v-if="scope.row.username!=='admin'" title="您确定要删除这条记录吗？" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button  type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.username!=='admin'" title="您确定要对这个用户重置密码吗？" @confirm="handleResetPassword(scope.row.id)">
            <template #reference>
              <el-button  type="warning" :icon="RefreshRight" >重置密码</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:currentPage="queryForm.pageNum"
        v-model:page-size="queryForm.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <Dialog v-model="dialogVisible" :dialogVisible="dialogVisible" :id="id" :dialogTitle="dialogTitle" @initUserList="initUserList"/>
  <RoleDialog v-model="roleDialogVisible" :sysRoleList="sysRoleList" :roleDialogVisible="roleDialogVisible" :id="id" @initUserList="initUserList"></RoleDialog>
</template>

<script setup>
import { Search ,Delete,DocumentAdd ,Edit, Tools, RefreshRight} from '@element-plus/icons-vue'
import requestUtil,{getServerUrl} from "@/util/request";
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Dialog from '@/views/sys/user/component/dialog'
import RoleDialog from '@/views/sys/user/component/ roleDialog'

const tableData=ref([]);

const total=ref(0)

const queryForm=ref({
  query:'',
  pageNum:1,
  pageSize:10
})

//Dialog组件传的三个值
const dialogVisible=ref(false)
const dialogTitle=ref("")
const id=ref(-1)
// RoleDialog的两个值
const sysRoleList=ref([])
const roleDialogVisible=ref(false)

const delBtnStatus=ref(true)
//复选框选中事件
const multipleSelection=ref([])
const handleSelectionChange=(selection)=>{
  console.log("勾选了")
  console.log(selection)
  multipleSelection.value=selection;
  delBtnStatus.value=selection.length===0;
}


//传的方法，子组件可以通过emits调用父组件事件
const initUserList=async()=>{
  const res=await requestUtil.post("sys/user/list",queryForm.value);
  tableData.value=res.data.userList;
  total.value=res.data.total;
}

initUserList();
//改变每页记录数触发
const handleSizeChange=(pageSize)=>{
  queryForm.value.pageNum=1;
  queryForm.value.pageSize=pageSize;
  initUserList()
}
//改变当前页触发
const handleCurrentChange=(pageNum)=>{
  queryForm.value.pageNum=pageNum;
  initUserList()
}
//用户修改或者添加对话框
const handleDialogValue=(userId)=>{
  if(userId){
    id.value=userId;
    dialogTitle.value="用户修改"
  }else{  //新增的时候没有传id
    id.value=-1;
    dialogTitle.value="用户添加"
  }
  dialogVisible.value=true
}
//批量删除
const handleDelete=async (id)=>{
  var ids = []
  if(id){ //单行删除
    ids.push(id)
  }else{  //多行删除
    multipleSelection.value.forEach(row=>{
      ids.push(row.id)
    })
  }
  const res=await requestUtil.post("sys/user/delete",ids)
  if(res.data.code===200){
    ElMessage({
      type: 'success',
      message: '执行成功!'
    })
    initUserList();
  }else{
    ElMessage({
      type: 'error',
      message: res.data.msg,
    })
  }
}
//重置密码
const handleResetPassword=async (id)=>{
  const res=await requestUtil.get("sys/user/resetPassword/"+id)
  if(res.data.code===200){
    ElMessage({
      type: 'success',
      message: '执行成功!'
    })
    initUserList();
  }else{
    ElMessage({
      type: 'error',
      message: res.data.msg,
    })
  }
}
//状态修改事件
const statusChangeHandle=async (row)=>{
  let res=await requestUtil.get("sys/user/updateStatus/"+row.id+"/status/"+row.status);
  if(res.data.code===200){
    ElMessage({
      type: 'success',
      message: '执行成功!'
    })
  }else{
    ElMessage({
      type: 'error',
      message: res.data.msg,
    })
    initUserList();
  }
}

//分配角色触发
const handleRoleDialogValue=(userId,roleList)=>{
  console.log("userId="+userId)
  id.value=userId;
  sysRoleList.value=roleList;
  roleDialogVisible.value=true  //显示
}
</script>

<style lang="scss" scoped>

.header{
  padding-bottom: 16px;
  box-sizing: border-box;
}

.el-pagination{
  float: right;
  padding: 20px;
  box-sizing: border-box;
}

::v-deep th.el-table__cell{
  word-break: break-word;
  background-color: #f8f8f9 !important;
  color: #515a6e;
  height: 40px;
  font-size: 13px;

}

.el-tag--small {
  margin-left: 5px;
}
</style>
