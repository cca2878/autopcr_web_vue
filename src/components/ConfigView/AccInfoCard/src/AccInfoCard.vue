<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetAccountRequest, postDoDailyRequest, putUpdateAccountRequest } from '@/api'
import { timeStampedText, uniFormVali } from '@/utils'
import { ElMessage, ElNotification } from 'element-plus'
import { TimeStatusText } from '@/components/Common/TimeStatusText'
import { useStore } from '@/stores'

const emit = defineEmits(['afterDoDaily'])

const show = ref(false)
const route = useRoute()
const store = useStore()
const accAlias = computed(() => route.params.acc)
const lastDailyInfo = ref({})
const lastTaskInfo = ref({})
const lastTaskText = ref()
const doing = computed(() => store.doing_task)
const selfDoing = ref(false)
const formRef = ref(null)
const formModel = ref({
  uname: '',
  pwd: ''
})
const gameInfo = ref({
  clan_id: '0',
  clan_name: '',
  game_name: '',
  uid: '0',
  level: '',
  jewel: ''
})

// const getInfo = (acc) => {
//   getGetInfoRequest().then((res) => {
//     res.data['accounts'].forEach((item) => {
//       if (item['name'] === acc) {
//         console.log(item)
//         lastDailyInfo.value = item['daily_clean_time']['time']
//       }
//     })
//   })
// }
const doDaily = (acc, text_result) => {
  console.log('doSingle', acc, text_result)
  ElNotification.info({
    offset: 50,
    title: `"${acc}"开始清日常`,
    message: timeStampedText('请稍候。请勿刷新页面。')
  })
  store.setDoingTask(true)
  selfDoing.value = true
  postDoDailyRequest(acc, text_result)
    .then((res) => {
      console.log(res.data)
      store.setDoingTask()
      selfDoing.value = false
      if (res.data['status'] === 'error') {
        ElNotification.error({
          offset: 50,
          title: `"${acc}"清日常失败`,
          message: timeStampedText(res.data['result'])
        })
      } else {
        emit('afterDoDaily', res)
        // Object.keys(res.data['result']).forEach(key => {
        //   if (dailyCardRefs.value[key]) {
        //     let item = res.data['result'][key]
        //     dailyCardRefs.value[key].refreshTextResult(item['log'], res.data['time'], item['status'])
        //   }
        // });
        getAccount(accAlias.value)
        ElNotification.success({
          offset: 50,
          title: `"${acc}"清日常执行成功`,
          message: timeStampedText('请查看执行结果。')
        })
      }
    })
    .catch(() => {
      store.setDoingTask()
      selfDoing.value = false
    })
}

const getAccount = (acc) => {
  console.log(acc)
  getGetAccountRequest(acc).then((res) => {
    console.log(res.data)
    if (res.data['username'] === '') {
      show.value = true
    }
    formModel.value.uname = res.data['username']
    gameInfo.value = res.data['game_info']
    lastDailyInfo.value = res.data['last_daily_info']
    lastTaskInfo.value = res.data['last_task_info']
    if (lastTaskInfo.value['name'] === null) {
      lastTaskInfo.value['name'] = '暂无数据'
    }
    lastTaskText.value = `${lastTaskInfo.value['name']}@${lastTaskInfo.value['time']}`
  })
}

const updateAccount = (acc, uname, pwd) => {
  putUpdateAccountRequest(acc, uname, pwd).then((res) => {
    console.log(res)
    ElMessage.success('更新成功')
  })
}

const submitForm = (formRef) => {
  uniFormVali(formRef, () =>
    updateAccount(accAlias.value, formModel.value.uname, formModel.value.pwd)
  )
}

const refreshInfo = () => {
  getAccount(accAlias.value)
}

defineExpose({
  refreshInfo
})

onMounted(() => {
  // getInfo(accAlias)
  refreshInfo()
})
</script>

<template>
  <el-card>
    <!--    <template #header>-->
    <!--      Account Information-->
    <!--      <el-button type="primary" @click="show = !show">Operation</el-button>-->
    <!--    </template>-->

<!--    <el-row align="middle" justify="space-around">-->
<!--      <el-col :span="19" style="display: flex; align-items: center">-->

<!--        &lt;!&ndash;        <el-divider direction="vertical"/>&ndash;&gt;-->
<!--        &lt;!&ndash;        <el-text>上次执行</el-text>&ndash;&gt;-->
<!--        &lt;!&ndash;        <el-divider border-style="hidden" direction="vertical" style="margin: 0 4px"/>&ndash;&gt;-->
<!--        &lt;!&ndash;        <TimeStatusText :last_time="lastTaskText" :status="lastTaskInfo['status']" style="max-width: 100%"/>&ndash;&gt;-->
<!--      </el-col>-->
<!--      <el-col :span="5">-->

<!--      </el-col>-->
<!--    </el-row>-->
    <div style="display: flex;justify-content: space-between; align-items: center">
      <div style="display: flex; align-items: center">
        <el-text tag="b">{{ accAlias }}</el-text>
        <el-divider direction="vertical" />
        <el-text>上次清日常</el-text>
        <el-divider border-style="hidden" direction="vertical" style="margin: 0 4px" />
        <TimeStatusText
          :last_time="lastDailyInfo['time']"
          :status="lastDailyInfo['status']"
          style="max-width: 100%"
        />
      </div>
      <div style="text-align: right">
        <el-button
          :disabled="doing && !selfDoing"
          :loading="selfDoing"
          type="primary"
          @click="doDaily(accAlias, true)"
        >执行清日常
        </el-button>
        <el-button type="primary" @click="show = !show">展开/收起</el-button>
      </div>
    </div>
    <el-collapse-transition>
      <el-row v-show="show" :gutter="20" style="padding-top: 20px">
        <el-col :sm="18">
          <div>
            <el-descriptions :border="true" :column="2" size="default">
              <el-descriptions-item :span="2" label="上次单项执行">
                <TimeStatusText
                  :last_time="lastTaskText"
                  :status="lastTaskInfo['status']"
                  style="max-width: 100%"
                />
              </el-descriptions-item>
              <el-descriptions-item label="用户名">{{ gameInfo.game_name }}</el-descriptions-item>
              <el-descriptions-item label="UID">{{ gameInfo.uid }}</el-descriptions-item>
              <el-descriptions-item label="等级">{{ gameInfo.level }}</el-descriptions-item>
              <el-descriptions-item label="宝石数">{{ gameInfo.jewel }}</el-descriptions-item>
              <el-descriptions-item label="公会名">
                {{ gameInfo.clan_name }}
              </el-descriptions-item>
              <el-descriptions-item label="公会ID">{{ gameInfo.clan_id }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>

        <!--        <el-divider direction="vertical"></el-divider>-->
        <el-col :sm="6">
          <div>
            <el-form ref="formRef" :model="formModel" class="acc-form">
              <el-form-item>
                <el-divider content-position="left" style="margin: 0 0 8px 0">账户设置</el-divider>
              </el-form-item>
              <el-form-item clearable label="账号" prop="uname" required>
                <el-input v-model="formModel.uname" />
              </el-form-item>
              <el-form-item clearable label="密码" prop="pwd" required>
                <el-input v-model="formModel.pwd" show-password type="password" />
              </el-form-item>
              <el-form-item style="text-align: right">
                <el-button
                  :disabled="doing"
                  style="width: 100%"
                  type="primary"
                  @click="submitForm(formRef)"
                  >保存
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-collapse-transition>
  </el-card>
</template>

<style scoped>
@media (max-width: 768px) {
  .acc-form {
    padding-top: 20px;
  }
}
</style>
