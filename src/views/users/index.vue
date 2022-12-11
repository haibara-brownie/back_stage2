<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          :placeholder="$t('table.placeholder')"
          type="text"
          v-model="queryForm.query"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initGetUserList">{{
        $t('table.search')
      }}</el-button>
      <el-button type="primary" @click="handleDialogValue()">{{
        $t('table.adduser')
      }}</el-button>
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        v-for="(item, index) in options"
        :prop="item.prop"
        :label="$t(`table.${item.label}`)"
        :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'mg_state'"
          ><el-switch v-model="row.mg_state" @change="changeUserState(row)" />
        </template>

        <template v-slot="{ row }" v-else-if="item.prop === 'create_time'"
          >{{ $filters.filterTimes(row.create_time) }}
        </template>

        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="handleDialogValue(row)"
          />
          <el-button type="warning" size="small" :icon="Setting" />
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="delUser(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:currentPage="queryForm.pagenum"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryForm.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @initUserList="initGetUserList"
    />
  </el-card>

  <Dialog
    v-model="dialogVisible"
    :dialogTitle="dialogTitle"
    v-if="dialogVisible"
    :dialogTableVal="dialogTableVal"
  />
</template>

<script setup>
import { Search, Edit, Delete, Setting } from '@element-plus/icons-vue'
import { getUser, getUserState, deleteUser } from '@/api/user.js'
import { ref } from 'vue'
import { options } from './options'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Dialog from './component/dialog.vue'
// import isNull from '@/util/filters'
const i18n = useI18n()
const queryForm = ref({
  query: '',
  pagenum: 1,
  pagesize: 2
})
const total = ref(0)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogTableVal = ref({})

const initGetUserList = async () => {
  const res = await getUser(queryForm.value)
  // console.log(res)
  total.value = res.total
  tableData.value = res.users
}
initGetUserList()

const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum = 1
  queryForm.value.pagesize = pageSize
  initGetUserList()
}

const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  initGetUserList()
}

// 更新开关状态
const changeUserState = async (info) => {
  await getUserState(info.id, info.mg_state)
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success'
  })
}

// 因为莫名的报错 就直接先把filter.js的判空方法直接先粘贴过来了 然后就不报错了
// 之前是将文件导入用里面的isnull 但一直提示一个全局变量报错
const isNull = (obj) => {
  if (!obj) return true
  if (JSON.stringify(obj) === '{}') return true
  if (JSON.stringify(obj) === '[]') return true
}

// 更新是否显示对话框
const handleDialogValue = (row) => {
  if (isNull(row)) {
    dialogTitle.value = '添加用户'
    dialogTableVal.value = {}
  } else {
    dialogTitle.value = '编辑用户'
    dialogTableVal.value = JSON.parse(JSON.stringify(row))
  }
  dialogVisible.value = true
}

// 删除
const delUser = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await deleteUser(row.id)
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
      initGetUserList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
  // justify-content: center; //居中
  //float: left;居左
  float: right; //居右
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #ff9800 !important; //修改默认的背景色
}
</style>
