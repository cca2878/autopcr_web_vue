<script setup>
import LoginForm from '@/components/LoginView/LoginForm'
import RegisterForm from '@/components/LoginView/RegisterForm'
import ToggleDark from '@/components/Common/ToggleDark.vue'
import logoSvg from '@/assets/autopcr.svg'
</script>
<template>
  <el-container>
    <el-main>
      <el-row justify="center">
        <el-col :lg="7" :md="9" :sm="13" :xl="5" :xs="21">
          <el-card body-style="padding-top: 2px">
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <el-image :src="logoSvg" style="height: 24px; vertical-align: middle" />
                <toggle-dark />
              </div>
            </template>
            <el-tabs class="login-tabs">
              <el-tab-pane label="登录">
                <login-form />
              </el-tab-pane>
              <el-tab-pane label="注册">
                <RegisterForm />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
.login-tabs:deep(.el-tabs__nav-scroll) {
  display: flex;
  justify-content: center;
}

.login-tabs:deep(.el-tabs__nav-wrap::after) {
  content: none;
}
</style>
