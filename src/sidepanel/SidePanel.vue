<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const defaultActive = ref('/table')
const router = useRouter()
router.push({ path: '/table' })
</script>

<template>
  <div class="container">
    <el-menu mode="horizontal" :default-active="defaultActive" :router="true" class="menu">
      <el-menu-item index="/table">数据表格</el-menu-item>
      <el-menu-item index="/upload">文件上传</el-menu-item>
      <el-menu-item index="/help">帮助</el-menu-item>
    </el-menu>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style></style>
