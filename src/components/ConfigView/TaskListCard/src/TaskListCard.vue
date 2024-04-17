<script setup>
import { defineEmits, onMounted, ref, watch } from 'vue'
import { TaskCard } from '@/components/ConfigView/TaskCard'
import { getDailyResultRequest, getGetDailyConfigRequest, getGetToolsConfigRequest } from '@/api'
import { useRoute } from 'vue-router'
import { Guide } from '@element-plus/icons-vue'

const route = useRoute()
const dailyConfig = ref({})
const toolsConfig = ref({})
const dailyScroll = ref()
const toolsScroll = ref()
const activeScroll = ref()
const dailyCardRefs = ref({})
const toolCardRefs = ref({})
const selectedTab = ref('daily')
const navSelected = ref()
const navMap = ref([])
const navDailyMap = ref([])
const navToolsMap = ref([])

const emit = defineEmits(['afterDoSingle'])

const getDailyResult = (acc, result_id, text_result = undefined) => {
  getDailyResultRequest(acc, result_id, text_result).then((res) => {
    // const blob = new Blob([res.data], {type: 'image/jpeg'})
    // imageUrl.value = URL.createObjectURL(blob)
    Object.keys(res.data['result']).forEach((key) => {
      if (dailyCardRefs.value[key]) {
        let item = res.data['result'][key]
        dailyCardRefs.value[key].refreshTextResult(item['log'], item['time'], item['status'])
      }
    })
  })
}

const getDailyConfig = () => {
  getGetDailyConfigRequest(route.params.acc).then((res) => {
    console.log(res.data)
    dailyConfig.value = res.data
    for (let key in res.data['order']) {
      // console.log(key)
      const temp = {
        name: '',
        value: ''
      }
      temp['label'] = res.data['info'][res.data['order'][key]]['name']
      temp['value'] = res.data['order'][key]
      navDailyMap.value.push(temp)
    }
  })
}

const getToolsConfig = () => {
  getGetToolsConfigRequest(route.params.acc).then((res) => {
    // console.log(res.data)
    toolsConfig.value = res.data
    for (let key in res.data['order']) {
      const temp = {
        name: '',
        value: ''
      }
      temp['label'] = res.data['info'][res.data['order'][key]]['name']
      temp['value'] = res.data['order'][key]
      navToolsMap.value.push(temp)
    }
  })
}

const afterDoDaily = (res) => {
  Object.keys(res.data['result']).forEach((key) => {
    if (dailyCardRefs.value[key]) {
      console.log('refresh', key)
      let item = res.data['result'][key]
      dailyCardRefs.value[key].refreshTextResult(item['log'], res.data['time'], item['status'])
    }
  })
}

const handleScroll = (key) => {
  let element = document.getElementById(key)
  console.log(element)
  if (element) {
    console.log(element.offsetTop)
    activeScroll.value.scrollTo({ top: element.offsetTop, behavior: 'smooth' })
  }
}

defineExpose({
  // doDaily,
  afterDoDaily
})

onMounted(() => {
  getDailyConfig()
  getToolsConfig()
  getDailyResult(route.params.acc, 0, true)
  navMap.value = navDailyMap.value
  activeScroll.value = dailyScroll.value
  watch(selectedTab, (newVal) => {
    navSelected.value = ''
    if (newVal === 'daily') {
      activeScroll.value = dailyScroll.value
      navMap.value = navDailyMap.value
    } else if (newVal === 'tools') {
      activeScroll.value = toolsScroll.value
      navMap.value = navToolsMap.value
    }
  })
})
</script>

<template>
  <el-card
    body-style="padding-top: 0; max-height: 100%;"
    style="max-height: 100%; overflow: hidden"
  >
    <div class="tabs-container">
      <el-select-v2
        v-model="navSelected"
        :options="navMap"
        class="custom-component"
        filterable
        @change="handleScroll"
      >
        <template #prefix>
          <el-icon>
            <Guide />
          </el-icon>
        </template>
      </el-select-v2>
      <el-tabs v-model="selectedTab">
        <el-tab-pane label="清日常" name="daily" style="min-height: 100%; overflow: auto">
          <el-scrollbar ref="dailyScroll" height="65vh">
            <el-space :fill-ratio="100" direction="vertical" fill style="width: 100%">
              <TaskCard
                v-for="item of dailyConfig.order"
                :id="item"
                :key="item"
                :ref="
                  (el) => {
                    if (el) dailyCardRefs[item] = el
                  }
                "
                :config="dailyConfig.config"
                :config-info="dailyConfig.info[item]"
                @after-do-single="emit('afterDoSingle')"
              />
            </el-space>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="实用工具" name="tools" style="height: 100%; overflow: auto">
          <el-scrollbar ref="toolsScroll" height="65vh">
            <el-space :fill-ratio="100" direction="vertical" fill style="width: 100%">
              <TaskCard
                v-for="item of toolsConfig.order"
                :id="item"
                :key="item"
                :ref="
                  (el) => {
                    if (el) toolCardRefs[item] = el
                  }
                "
                :config="toolsConfig.config"
                :config-info="toolsConfig.info[item]"
                :is-tool="true"
                @after-do-single="emit('afterDoSingle')"
              />
            </el-space>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<style scoped>
.tabs-container {
  position: relative;
}

.custom-component {
  position: absolute;
  width: 20%;
  min-width: 200px;
  top: 4px;
  right: 0;
  z-index: 3;
}
</style>
