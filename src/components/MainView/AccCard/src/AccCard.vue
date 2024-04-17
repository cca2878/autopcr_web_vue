<script setup>
import {
  CircleCheck,
  CopyDocument,
  Delete,
  Edit,
  Plus,
  VideoPlay,
  View
} from '@element-plus/icons-vue'
import { computed, onMounted, reactive, ref, toRef, watchEffect } from 'vue'
import { deleteUpdateAccount, getGetInfoRequest } from '@/api'
import { useStore } from '@/stores'
import ResultDialog from './ResultDialog.vue'
import { TimeStatusText } from '../../../Common/TimeStatusText'
import AddAccDialog from './CreateAccDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PutDefaultAccDialog from './PutDefaultAccDialog.vue'
import SyncAccConfigDialog from './SyncAccConfigDialog.vue'
import router from '@/router'
import SelectDoDailyDialog from './SelectDoDailyDialog.vue'

const resultDialogVisible = ref(false)
const addAccDialogVisible = ref(false)
const putDefaultAccDialogVisible = ref(false)
const syncAccConfigDialogVisible = ref(false)
const dialogAcc = ref('')
const dialogTimeList = ref([])
const tableLoading = ref(false)

const store = useStore()

// const username = computed(() => store.username)
// const setUsername = store.setUsername
// const clearUsername = store.clearUsername
const accTableRef = ref(null)
const accTableData = reactive([])
const defaultAcc = ref('')
const refSelectDoDailyDialog = ref()
const funcDoSelectDaily = ref()

const doing = computed(() => store.doing_task)
const selfDoingAll = ref(false)
const selfDoingSelected = ref(false)

const refreshAccList = () => {
  selfDoingAll.value = true
  tableLoading.value = true
  getGetInfoRequest().then((res) => {
    console.log(res.data)
    accTableData.splice(0, accTableData.length)
    res.data['accounts'].forEach((item) => {
      // const temp1 = []
      // item['daily_clean_time_list'].forEach((time) => {
      //   temp1.push({
      //     time: time['time'],
      //     time_safe: time['time_safe'],
      //     status: time['status']
      //   })
      // })
      const temp2 = {
        last_time: item['daily_clean_time']['time'],
        timeList: item['daily_clean_time_list'],
        name: item['name'],
        profile: '',
        status: item['daily_clean_time']['status'],
        default: res.data['default_account'] === item['name'],
        selfDoing: false
      }
      accTableData.push(temp2)
    })
    defaultAcc.value = res.data['default_account']
    store.setUsername(res.data['qq'])
    selfDoingAll.value = false
    tableLoading.value = false
    console.log(accTableData)
  })
}

onMounted(() => {
  console.log('mounted')
  refreshAccList()
  console.log(accTableData)
})

const showResultDialog = (acc, timeList) => {
  console.log(acc)
  console.log(timeList)
  dialogAcc.value = acc
  dialogTimeList.value = timeList
  resultDialogVisible.value = true
  // getDailyResult(acc)
}

const confirmDelete = (acc) => {
  const accString = acc.join(', ')
  ElMessageBox.confirm(`确定删除账号${accString}吗？`, {
    confirmButtonClass: 'el-button--danger'
  }).then(() => {
    acc.forEach((accItem) => {
      deleteUpdateAccount(accItem).then((res) => {
        console.log(res)
        ElMessage.success('删除成功')
        refreshAccList()
      })
    })
    console.log('delete')
  })
}
const multiDelete = (data) => {
  if (data.length === 0) {
    ElMessage.warning('请选择要删除的账号')
    return
  }
  console.log('multiDelete')
  let temp = []
  data.forEach((item) => {
    temp.push(item.name)
  })
  confirmDelete(temp)
}

const startDoSelectDaily = async (accs) => {
  console.log('startDoSelectDaily', accs)
  funcDoSelectDaily.value(accs).then(() => {
    refreshAccList()
  })
}

const doSingle = (acc, ref) => {
  ref.value = true
  store.setDoingTask(true)
  console.log('doSingle', acc)
  startDoSelectDaily([acc]).then(() => {
    ref.value = false
    store.setDoingTask()
  })
}

const doSelected = (rows) => {
  if (rows.length === 0) {
    ElMessage.warning('请选择账号')
    return
  }
  selfDoingSelected.value = true
  store.setDoingTask(true)
  console.log('doSelected')
  startDoSelectDaily(rows.map((item) => item.name)).then(() => {
    selfDoingSelected.value = false
    store.setDoingTask()
  })
}

const doAll = () => {
  selfDoingAll.value = true
  store.setDoingTask(true)
  console.log('doAll')
  startDoSelectDaily(accTableData.map((item) => item.name)).then(() => {
    selfDoingAll.value = false
    store.setDoingTask()
  })
}

watchEffect(() => {
  if (refSelectDoDailyDialog.value) {
    funcDoSelectDaily.value = refSelectDoDailyDialog.value.doSelectDaily
  }
})
</script>

<template>
  <select-do-daily-dialog ref="refSelectDoDailyDialog" />
  <ResultDialog
    v-model:visible="resultDialogVisible"
    :acc="dialogAcc"
    :time-list="dialogTimeList"
  />
  <AddAccDialog v-model:visible="addAccDialogVisible" @created="refreshAccList()" />
  <PutDefaultAccDialog
    v-model:visible="putDefaultAccDialogVisible"
    :acc-list="accTableData"
    :default-acc="defaultAcc"
    @putDefaultAcc="refreshAccList()"
  />
  <SyncAccConfigDialog
    v-model:visible="syncAccConfigDialogVisible"
    :acc-list="accTableData"
    @syncAccConfig="refreshAccList()"
  />
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div>
          <el-button-group>
            <el-button
              :disabled="doing"
              :icon="VideoPlay"
              :loading="selfDoingAll"
              type="primary"
              @click="doAll()"
            >
              清日常全部
            </el-button>
            <el-button
              :disabled="doing"
              :loading="selfDoingSelected"
              type="primary"
              @click="doSelected(accTableRef.getSelectionRows())"
            >
              清日常选中
            </el-button>
          </el-button-group>
        </div>
        <div>
          <el-button-group>
            <el-button
              :disabled="doing"
              :icon="Plus"
              type="primary"
              @click="addAccDialogVisible = true"
            >
              添加账号
            </el-button>
            <el-button
              :disabled="doing"
              :icon="Delete"
              type="danger"
              @click="multiDelete(accTableRef.getSelectionRows())"
            >
              删除选中
            </el-button>
          </el-button-group>
        </div>
      </div>
    </template>

    <el-table
      ref="accTableRef"
      v-loading="tableLoading"
      :data="accTableData"
      stripe
      style="width: 100%"
      table-layout="auto"
    >
      <el-table-column type="selection" />
      <el-table-column label="名称">
        <template #default="scope">
          {{ scope.row.name }}
          <el-tag v-if="scope.row.default" type="success">默认</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上次执行" prop="last_time">
        <template #default="scope">
          <TimeStatusText :last_time="scope.row.last_time" :status="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="结果">
        <template #default="scope">
          <el-button
            :icon="View"
            :loading="doing"
            size="small"
            type="primary"
            @click="showResultDialog(scope.row.name, scope.row.timeList)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-button-group>
            <!--          <el-input size="small" placeholder="Type to search"/>-->
            <el-button
              :disabled="doing"
              :icon="CircleCheck"
              size="small"
              @click="putDefaultAccDialogVisible = true"
            >
              设置默认
            </el-button>
            <el-button
              :disabled="doing"
              :icon="CopyDocument"
              size="small"
              @click="syncAccConfigDialogVisible = true"
            >
              复制配置
            </el-button>
          </el-button-group>
        </template>
        <template #default="scope">
          <el-space>
            <el-button
              :disabled="doing && !scope.row.selfDoing.value"
              :icon="VideoPlay"
              :loading="scope.row.selfDoing.value"
              size="small"
              type="primary"
              @click="doSingle(scope.row.name, toRef(scope.row, 'selfDoing'))"
            >
            </el-button>
            <el-button
              :disabled="doing"
              :icon="Edit"
              size="small"
              type="primary"
              @click="router.push({ name: 'acc', params: { acc: `${scope.row.name}` } })"
            >
            </el-button>
            <el-button
              :disabled="doing"
              :icon="Delete"
              size="small"
              type="danger"
              @click="confirmDelete([scope.row.name])"
            >
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped></style>
