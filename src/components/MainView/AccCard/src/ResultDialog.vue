<script setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { getDailyResultRequest } from '@/api'
import { Clock, Picture, Tickets } from '@element-plus/icons-vue'
import { TimeStatusText } from '../../../Common/TimeStatusText'
import DailyResultView from './DailyResultView.vue'
/*
 * timeList格式：
 * [{
 *   time: '2024/03/25 19:57:05',
 *   time_safe: '20240325195705'
 *   status: 'success'
 *   task_id: 1
 * }]
 * */
const props = defineProps({
  visible: Boolean,
  acc: String,
  timeList: Object
})

const emit = defineEmits(['update:visible'])

const selected = ref('')
const loading = ref(false)
const imageUrl = ref('')
const resultNeedText = ref(true)
const dailyResult = ref()

const showDialog = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const getDailyResult = (acc, result_id, text_result = undefined) => {
  loading.value = true
  getDailyResultRequest(acc, result_id, text_result)
    .then((res) => {
      // const blob = new Blob([res.data], {type: 'image/jpeg'})
      // imageUrl.value = URL.createObjectURL(blob)
      imageUrl.value = res.data['image']
      dailyResult.value = res.data
      loading.value = false
    })
    .catch((err) => {
      console.log(err)
      loading.value = false
    })
}

watch(
  () => props.visible,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      // 对话框从关闭状态变为打开状态
      // 在这里重置对话框内部的数据
      selected.value = ''
      imageUrl.value = ''
    }
  }
)
</script>

<template>
  <el-dialog
    v-model="showDialog"
    :title="`${props.acc}的历史结果`"
    align-center
    style="max-height: 100vh"
  >
    <el-space direction="vertical" fill style="width: 100%">
      <div style="display: flex; justify-content: space-between">
        <el-select
          v-model="selected"
          placeholder="选择时间"
          style="max-width: 40%"
          @change="(value) => getDailyResult(props.acc, value)"
        >
          <el-option v-if="props.timeList.length > 0" :value="0" label="Latest">
            <TimeStatusText last_time="Latest" status="success" />
          </el-option>
          <el-option
            v-for="item in props.timeList"
            :key="item['time_safe']"
            :label="item['time']"
            :value="item['task_id']"
          >
            <TimeStatusText :last_time="item['time']" :status="item['status']" />
          </el-option>
          <template #prefix>
            <el-icon>
              <Clock />
            </el-icon>
          </template>
        </el-select>
        <el-radio-group v-model="resultNeedText" :disabled="loading" style="flex-wrap: unset">
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
          :if-result-text="resultNeedText"
          :imageUrl="imageUrl"
          :loading="loading"
          :result="dailyResult"
        />
      </el-scrollbar>
    </el-space>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog__body {
  padding-top: 0 !important;
}
</style>
