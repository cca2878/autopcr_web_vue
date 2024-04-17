<script setup>
import 'element-plus/theme-chalk/display.css'
import { computed, defineExpose, defineProps, onMounted, ref, watch } from 'vue'
// import {devConfig, devConfigInfo} from './devData'
import { useRoute } from 'vue-router'
import { postDoSingleRequest, putPutConfigRequest } from '@/api'
import { ElMessage, ElNotification } from 'element-plus'
import { Picture, Tickets, Tools, VideoPlay } from '@element-plus/icons-vue'
import FuncResultView from './TaskResultView.vue'

import { timeStampedText } from '@/utils'
import { TimeStatusText } from '@/components/Common/TimeStatusText'
import { useStore } from '@/stores'

const route = useRoute()
const store = useStore()
const acc = ref('')
const show = ref(false)
const formModel = ref({})
const switchModel = ref(false)
// const resultNeedText = ref(true)
const resultText = ref('暂无数据')
const resultStatus = ref(undefined)
const resultIsText = ref(true)
const resultTime = ref(undefined)
const resultImage = ref('')

const doing = computed(() => store.doing_task)
const selfDoing = ref(false)

const emit = defineEmits(['afterDoSingle'])
const props = defineProps({
  config: Object,
  configInfo: Object,
  isTool: {
    type: Boolean,
    default: false
  }
})

const funcConfig = props.config
const funcConfigInfo = props.configInfo

watch(
  () => switchModel.value,
  (newVal) => {
    if (newVal) {
      show.value = true
    }
  }
)

const initFormModel = () => {
  return Object.keys(funcConfigInfo.config).reduce((tempModel, key) => {
    tempModel[key] = funcConfig[key] ?? funcConfigInfo.config[key]['default']
    return tempModel
  }, {})
}

const putConfig = (data) => {
  console.log('putConfig', data)
  putPutConfigRequest(acc.value, data).then((res) => {
    ElMessage.success('修改成功')
    console.log(res)
  })
}

const resetConfig = () => {
  const tempData = Object.keys(funcConfigInfo.config).reduce((tempModel, key) => {
    tempModel[key] = funcConfigInfo.config[key]['default']
    return tempModel
  }, {})
  putPutConfigRequest(acc.value, tempData).then((res) => {
    ElMessage.success('修改成功')
    formModel.value = tempData
    console.log(res)
  })
}

const refreshTextResult = (text, time, status) => {
  resultIsText.value = true
  resultImage.value = ''
  resultText.value = text
  resultStatus.value = status
  resultTime.value = time
}

const doSingle = (key, text_result) => {
  console.log('doSingle', [key], text_result)
  store.setDoingTask(true)
  selfDoing.value = true
  ElNotification.info({
    offset: 50,
    title: `开始执行"${funcConfigInfo.name}"`,
    message: timeStampedText('请稍候。请勿刷新页面。')
  })
  postDoSingleRequest(acc.value, [key], text_result)
    .then((res) => {
      console.log(res)
      store.setDoingTask()
      selfDoing.value = false
      ElNotification.success({
        offset: 50,
        title: `"${funcConfigInfo.name}"执行成功`,
        message: timeStampedText('执行成功，请查看结果。')
      })

      if (text_result) {
        refreshTextResult(
          res.data.result[res.data.order[0]]['log'],
          res.data['time'],
          res.data['status']
        )
      } else {
        resultIsText.value = false
        resultTime.value = res.data['time']
        resultStatus.value = res.data['status']
        resultImage.value = res.data['image']
        resultText.value = res.data.result[res.data.order[0]]['log']
      }
      emit('afterDoSingle')
    })
    .catch(() => {
      store.setDoingTask()
      selfDoing.value = false
      emit('afterDoSingle')
    })
  // _loading.value = false
}

defineExpose({ refreshTextResult })

onMounted(() => {
  acc.value = route.params.acc
  // console.log(acc)
  formModel.value = initFormModel()
  switchModel.value = funcConfig[funcConfigInfo.key]
})
</script>

<template>
  <el-card>
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <template v-if="!props.isTool">
          <el-switch
            v-model="switchModel"
            :disabled="doing"
            @change="putConfig({ [funcConfigInfo.key]: switchModel })"
          />
          <el-divider direction="vertical" />
        </template>
        <el-text size="large" tag="b">
          <el-icon v-if="props.isTool">
            <Tools />
          </el-icon>
          {{ funcConfigInfo.name }}
        </el-text>
        <!--        <el-divider direction="vertical"/>-->
        <!--        <el-text>上次执行</el-text>-->
        <!--        <el-divider border-style="hidden" direction="vertical" style="margin: 0 4px"></el-divider>-->
        <!--        <el-text>1919-8-10 11:45:14</el-text>-->
      </div>
      <div>
        <el-button
          :disabled="doing && !selfDoing"
          :icon="VideoPlay"
          :loading="selfDoing"
          type="primary"
          @click="doSingle(props.configInfo.key, resultIsText)"
          >单项执行
        </el-button>
        <el-button type="primary" @click="show = !show">展开/收起</el-button>
      </div>
    </div>
    <el-collapse-transition>
      <el-row v-show="show" :gutter="20" style="padding-top: 16px">
        <el-col :sm="8" :xs="24">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-space class="task-card-el-space" direction="vertical" fill>
                <el-text tag="b">描述</el-text>
                <el-text tag="p">{{ funcConfigInfo.description }} </el-text>
              </el-space>
            </el-col>
            <template v-if="Object.keys(funcConfigInfo.config).length !== 0">
              <el-divider class="task-card-horizon-divider" />
              <el-col :span="24">
                <el-space class="task-card-el-space" direction="vertical" fill>
                  <div style="display: flex; justify-content: space-between">
                    <el-text tag="b">设置</el-text>
                    <el-button :disabled="doing" size="small" @click="resetConfig()"
                      >恢复默认</el-button
                    >
                  </div>
                  <el-form
                    :disabled="doing"
                    :model="formModel"
                    :show-message="false"
                    label-width="auto"
                    size="default"
                  >
                    <el-form-item
                      v-for="item in funcConfigInfo.config_order"
                      :key="item"
                      :label="funcConfigInfo.config[`${item}`].desc"
                      :prop="item"
                    >
                      <template v-if="funcConfigInfo.config[`${item}`].config_type === 'multi'">
                        <el-select
                          v-model="formModel[`${item}`]"
                          class="task-card-el-select"
                          filterable
                          multiple
                          @change="putConfig({ [`${item}`]: formModel[`${item}`] })"
                        >
                          <el-option
                            v-for="option in funcConfigInfo.config[`${item}`].candidates"
                            :key="option"
                            :label="option"
                            :value="option"
                          />
                        </el-select>
                      </template>
                      <template
                        v-else-if="funcConfigInfo.config[`${item}`].config_type === 'single'"
                      >
                        <el-select
                          v-model="formModel[`${item}`]"
                          class="task-card-el-select"
                          filterable
                          @change="putConfig({ [`${item}`]: formModel[`${item}`] })"
                        >
                          <el-option
                            v-for="option in funcConfigInfo.config[`${item}`].candidates"
                            :key="option"
                            :label="option"
                            :value="option"
                          />
                        </el-select>
                      </template>
                      <template v-else-if="funcConfigInfo.config[`${item}`].config_type === 'bool'">
                        <el-switch
                          v-model="formModel[`${item}`]"
                          @change="putConfig({ [`${item}`]: formModel[`${item}`] })"
                        />
                      </template>
                      <template v-else-if="funcConfigInfo.config[`${item}`].config_type === 'time'">
                        <el-time-picker
                          v-model="formModel[`${item}`]"
                          arrow-control
                          format="HH:mm"
                          style="width: 100%"
                          value-format="HH:mm"
                          @change="putConfig({ [`${item}`]: formModel[`${item}`] })"
                        />
                      </template>
                      <template v-else-if="funcConfigInfo.config[`${item}`].config_type === 'int'">
                        <!--                        <el-input-number-->
                        <!--                            style="width: 100%"-->
                        <!--                            v-model="formModel[`${item}`]"-->
                        <!--                            @change="putConfig({[`${item}`]: formModel[`${item}`]})"-->
                        <!--                        />-->
                        <el-select
                          v-model="formModel[`${item}`]"
                          class="task-card-el-select"
                          @change="putConfig({ [`${item}`]: formModel[`${item}`] })"
                        >
                          <el-option
                            v-for="option in funcConfigInfo.config[`${item}`].candidates"
                            :key="option"
                            :label="option.toString()"
                            :value="option"
                          />
                        </el-select>
                      </template>
                    </el-form-item>
                  </el-form>
                </el-space>
              </el-col>
            </template>
          </el-row>
        </el-col>

        <el-divider class="hidden-xs-only" direction="vertical" style="height: auto" />
        <el-divider class="hidden-sm-and-up task-card-horizon-divider" />

        <el-col :sm="15" :xs="24" style="flex: 1; max-width: none">
          <el-space class="task-card-el-space" direction="vertical" fill>
            <div style="display: flex; justify-content: space-between">
              <el-space class="task-card-el-space">
                <el-text tag="b">上次结果</el-text>
                <!--                <el-tag v-if="resultStatus === 'success'" type="success">成功</el-tag>-->
                <!--                <el-tag v-else-if="resultStatus === 'skip'" type="info">跳过</el-tag>-->
                <!--                <el-tag v-else-if="resultStatus === 'abort'" type="warning">中止</el-tag>-->
                <!--                <el-tag v-else-if="resultStatus === 'error'" type="danger">错误</el-tag>-->
                <!--                <el-tag v-else>暂无</el-tag>-->
                <TimeStatusText :last_time="resultTime" :status="resultStatus" />
              </el-space>
              <div>
                <el-radio-group
                  v-model="resultIsText"
                  :disabled="doing"
                  size="small"
                  style="flex-wrap: unset"
                >
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
            </div>
            <FuncResultView
              :if_text="resultIsText"
              :image="resultImage"
              :loading="doing"
              :result="resultText"
            />
            <!--          <el-image :src="testUrl" style="width: 100%"/>-->
          </el-space>
        </el-col>
      </el-row>
    </el-collapse-transition>
  </el-card>
</template>

<style lang="scss">
.task-card-horizon-divider {
  margin: 8px 10px;
}

.task-card-el-space {
  width: 100%;
}

.task-card-el-select {
  width: 100%;
}

.task-card-el-input-number {
  width: 100%;
}
</style>
