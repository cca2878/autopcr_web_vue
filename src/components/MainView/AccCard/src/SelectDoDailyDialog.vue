<script setup>
import { computed, ref } from 'vue'
import { postDoDailyRequest } from '@/api'
import { Clock, Picture, Tickets } from '@element-plus/icons-vue'
import { TimeStatusText } from '@/components/Common/TimeStatusText'
import DailyResultView from '@/components/MainView/AccCard/src/DailyResultView.vue'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const selfDoing = ref(false)
const showDialog = ref(false)
const selectModel = ref('')
const showText = ref(false)
const doingInfo = ref({
  acc: '',
  status: ''
})
const currentImageUrl = ref('')
const currentResult = ref({})
const dailyResults = ref({})
const completeInfo = computed(() => {
  return Object.keys(dailyResults.value).map((key) => {
    return {
      acc: key,
      time: dailyResults.value[key]['time'],
      status: dailyResults.value[key]['status']
    }
  })
})

const resetFields = () => {
  selectModel.value = ''
  showText.value = false
  doingInfo.value = {
    acc: '',
    status: ''
  }
  currentImageUrl.value = ''
  currentResult.value = {}
  dailyResults.value = {}
}

const doDaily = async (acc, text_result) => {
  console.log('doDaily', acc, text_result)
  doingInfo.value.acc = acc
  selfDoing.value = true
  await postDoDailyRequest(acc, text_result)
    .then((res) => {
      console.log(acc, res.data)
      dailyResults.value[acc] = res.data
      doingInfo.value.status = res.data['status']
      selfDoing.value = false
    })
    .catch((err) => {
      console.log(err)
      selfDoing.value = false
    })
}

const doSelectDaily = async (accList) => {
  resetFields()
  showDialog.value = true
  for (let acc of accList) {
    await doDaily(acc, false)
    await delay(2000)
  }
  // selectModel.value = completeInfo.value[0] ? completeInfo.value[0].acc : ''
}

// watch(selectModel, (newVal) => {
//   if (newVal.length === 1) {
//     selectModel.value = newVal[0].acc;
//   }
// });

defineExpose({
  doSelectDaily
})
</script>

<template>
  <el-dialog
    v-model="showDialog"
    :close-on-click-modal="!selfDoing"
    :close-on-press-escape="!selfDoing"
    :show-close="!selfDoing"
    align-center
    destroy-on-close
    style="max-height: 100vh"
    title="批量清日常"
  >
    <el-space direction="vertical" fill style="width: 100%">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div style="display: flex; width: 40%; align-items: center; justify-content: space-between">
          <el-select
            v-model="selectModel"
            filterable
            placeholder="选择账号"
            style="margin-right: 12px"
            @change="
              (value) => {
                currentImageUrl = dailyResults[value]['image'] ? dailyResults[value]['image'] : ''
                currentResult = dailyResults[value]
              }
            "
          >
            <el-option
              v-for="(item, index) in completeInfo"
              :key="index"
              :label="item.acc"
              :value="item.acc"
            >
              <TimeStatusText :last_time="item['acc']" :status="item['status']" />
            </el-option>
            <template #prefix>
              <el-icon>
                <Clock />
              </el-icon>
            </template>
          </el-select>
          <TimeStatusText
            :last_time="doingInfo.acc"
            :loading="selfDoing"
            :status="doingInfo.status"
          />
        </div>
        <el-radio-group v-model="showText" :disabled="selfDoing" style="flex-wrap: unset">
          <el-radio-button :value="true">
            <el-icon>
              <Tickets />
            </el-icon>
          </el-radio-button>
          <el-radio-button :value="false">
            <el-icon>
              <Picture />
            </el-icon>
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-scrollbar height="75vh">
        <DailyResultView
          :if-result-text="showText"
          :imageUrl="currentImageUrl"
          :loading="selfDoing"
          :result="currentResult"
        />
      </el-scrollbar>
    </el-space>
  </el-dialog>
</template>

<style scoped></style>
