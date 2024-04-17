<script setup>
import { Monitor, Moon, Sunny } from '@element-plus/icons-vue'
import { watchEffect } from 'vue'
import { useColorMode, useCycleList } from '@vueuse/core'

const mode = useColorMode({ emitAuto: true })
const { state, next } = useCycleList(['dark', 'light', 'auto'], { initialValue: mode })
const defComponents = {
  dark: { icon: Moon, comp: null },
  light: { icon: Sunny, comp: null },
  auto: { icon: Monitor, comp: null }
}
// const text = {
//   dark: 'Dark',
//   light: 'Light',
//   auto: 'Auto'
// }
// for (const [key, value] of Object.entries(defComponents)) {
//   value.comp = h('span',text[key])
// }
watchEffect(() => (mode.value = state.value))
</script>

<template>
  <el-link :underline="false" style="text-transform: capitalize" @click="next()">
    <el-icon>
      <transition mode="out-in" name="el-zoom-in-center">
        <component :is="defComponents[state].icon"></component>
      </transition>
    </el-icon>
    {{ state }}
  </el-link>
</template>

<style scoped></style>
