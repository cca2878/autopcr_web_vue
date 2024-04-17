<script setup>
import { ref, watchEffect } from 'vue'
import { AccInfoCard } from '@/components/ConfigView/AccInfoCard'
import { TaskListCard } from '@/components/ConfigView/TaskListCard'

const refTaskListCard = ref()
const refAccInfoCard = ref()
// const funcDoDaily = ref(null)
const funcAfterDoDaily = ref(null)
const funcAfterDoSingle = ref(null)

watchEffect(() => {
  if (refTaskListCard.value) {
    funcAfterDoDaily.value = refTaskListCard.value.afterDoDaily
  }
  if (refAccInfoCard.value) {
    funcAfterDoSingle.value = refAccInfoCard.value.refreshInfo
  }
})
</script>

<template>
  <div style="display: flex; flex-direction: column; min-height: 100%; height: 100%">
    <AccInfoCard
      ref="refAccInfoCard"
      style="flex-shrink: 0; overflow: visible"
      @afterDoDaily="(res) => funcAfterDoDaily(res)"
    />
    <TaskListCard
      ref="refTaskListCard"
      style="flex-grow: 1"
      @afterDoSingle="() => funcAfterDoSingle()"
    />
  </div>
</template>

<style scoped></style>
