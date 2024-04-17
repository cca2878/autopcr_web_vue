<script setup>
import { hSwcChange, testModules } from '@/views/ConfigView/src/ConfigView.jsbak'
import { Bottom, Check, Close, Top } from '@element-plus/icons-vue'
import { ProfileDrawer } from '@/components/ConfigView/ProfileDrawer'
</script>

<template>
  <el-card>
    <template #header>
      <el-form :inline="true">
        <el-form-item label="预设" style="margin-bottom: 0">
          <el-select-v2
            v-model="value"
            :options="options"
            filterable
            placeholder="Please select"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <ProfileDrawer />
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="filterTableData" stripe style="width: 100%" table-layout="auto">
      <el-table-column :width="1" type="selection" />
      <el-table-column :width="1" type="expand">
        <template #default="scope">
          <el-collapse-transition>
            <el-container>
              <el-main>
                <el-descriptions border title="配置信息">
                  <el-descriptions-item
                    v-for="item in testModules.find((module) => module.key === scope.row.key).props"
                    :key="item.key"
                    :label="item.title"
                  >
                    <template v-if="item.prop_type === 'bool'">
                      <el-tag
                        :type="
                          scope.row.config[item.key] === item.candidates['1'] ? 'success' : 'danger'
                        "
                      >
                        {{ scope.row.config[item.key] === item.candidates['1'] ? '开启' : '关闭' }}
                      </el-tag>
                    </template>
                    <template v-else-if="item.prop_type === 'single'">
                      {{ item.candidates[scope.row.config[item.key]] }}
                    </template>
                    <template v-else-if="item.prop_type === 'multi'">
                      {{
                        scope.row.config[item.key].map((value) => item.candidates[value]).join(', ')
                      }}
                    </template>
                    <template v-else-if="item.prop_type === 'num'">
                      {{ scope.row.config[item.key] }}
                    </template>
                  </el-descriptions-item>
                </el-descriptions>
              </el-main>
            </el-container>
          </el-collapse-transition>
        </template>
      </el-table-column>
      <!--          <el-table-column label="序号" type="index" width="55">-->
      <!--            <template #default="scope">-->
      <!--              {{ scope.row.rowIndex + 1 }}-->
      <!--            </template>-->
      <!--          </el-table-column>-->

      <el-table-column label="名称">
        <template #default="scope">
          {{ testModules.find((module) => module.key === scope.row.key).title }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-icon="Check"
            :inactive-icon="Close"
            inline-prompt
            @update:model-value="hSwcChange"
          />
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template #default="scope">
          {{ testModules.find((module) => module.key === scope.row.key).desc }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" placeholder="Type to search" size="small" />
        </template>
        <template #default="scope">
          <el-button-group size="small" style="margin-right: 12px">
            <el-button :icon="Top" @click="handleMove(scope.row.id, scope.row.rowIndex - 1)" />
            <el-button :icon="Bottom" @click="handleMove(scope.row.id, scope.row.rowIndex + 1)" />
          </el-button-group>
          <el-button size="small" type="primary" @click="handleMDrawer(scope.row)">
            编辑
          </el-button>

          <!--              <ModuleDrawer v-model:model-value="tableData[scope.row.rowIndex]"/>-->
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped></style>
