<script setup>
import { RouterView } from 'vue-router'
import { User } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useStore } from '@/stores'
import ToggleDark from '@/components/Common/ToggleDark.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import { ModProfileDialog } from '@/components/MainView/ModProfileDialog'
import { postLogoutRequest } from '@/api'
import logoSvg from '@/assets/autopcr.svg'
import { APP_VERSION } from '../utils'

const store = useStore()
const username = computed(() => store.username)
const drawerVisible = ref(false)
const modDialogVisible = ref(false)

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}
const toggleModDialog = () => {
  modDialogVisible.value = !modDialogVisible.value
}

const confirmLogout = (username) => {
  ElMessageBox.confirm(`确定退出${username}吗？`).then(() => {
    postLogoutRequest().then(() => {
      ElMessage.success('已退出')
      store.setUsername()
      store.setLogin()
      router.push({ name: 'login' })
      console.log('logout')
    })
  })
}
</script>

<template>
  <!--  <MenuDrawer :drawer-visible="drawerVisible" @close-drawer="drawerVisible = false"/>-->
  <ModProfileDialog v-model:dialog-visible="modDialogVisible" :username="username" />
  <el-container style="height: 100vh">
    <el-header style="padding: 0; height: 48px">
      <el-menu
        :ellipsis="false"
        mode="horizontal"
        style="height: 48px; justify-content: space-between"
      >
        <el-link
          :underline="false"
          style="padding: 12px 22px"
          @click="() => router.push({ name: 'home' })"
        >
          <template #icon>
            <el-image :src="logoSvg" style="height: 100%; vertical-align: middle" />
          </template>
        </el-link>
        <div class="flex-grow" />
        <ToggleDark />
        <el-sub-menu index="2">
          <template #title>
            <el-text>
              <el-icon style="margin: 0">
                <User />
              </el-icon>
              {{ username }}
            </el-text>
          </template>
          <el-menu-item index="2-1" @click="toggleModDialog()">更改资料</el-menu-item>
          <el-menu-item index="2-2" @click="confirmLogout(username)">退出</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer style="height: 24px; display: flex; align-items: center; justify-content: space-between">
      <el-text size="small" type="info">ver: {{ APP_VERSION }}</el-text>
      <el-link href="https://github.com/cca2878/autopcr_web_vue" style="font-size: small" target="_blank" type="info">
        @cca2878/autopcr_web_vue
      </el-link>
    </el-footer>
  </el-container>
</template>

<style lang="scss">
.flex-grow {
  flex-grow: 1;
}

.aside {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: solid 1px var(--el-border-color);
}
</style>
