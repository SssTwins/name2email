<script setup lang="js">
import { ref } from 'vue'
import conn, { tableData } from '../db/conn.js'
import { read, utils } from 'xlsx';

const name = ref('')
const email = ref('')

const handleSubmit = () => {
  save({ name: name.value, email: email.value })
}

const save = async (data) => {
  let value = {
    name: data.name,
    email: data.email,
  }

  let noOfRowsInserted = await conn.then((conn) => {
    conn.insert({
      into: tableData,
      values: [value],
    })
  })

  if (noOfRowsInserted > 0) {
    console.log('Successfully Added')
  }
}

const searchName = ref('')
const data = ref([])
const isLoading = ref(false)

const handleSearch = async () => {
  console.log(searchName.value)
  data.value = await conn.then((conn) => {
    return conn.select({
      from: tableData,
      where: {
        name: {
          like: searchName.value + '%',
        },
      },
      limit: 10,
    })
  })
}

const uploadRef = ref()

const submitExport = () => {
  let workbooks = read(uploadRef.value)
  console.log(workbooks.SheetNames)
}
</script>

<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form label-width="auto" style="max-width: 600px" size="small">
            <el-form-item label="姓名">
              <el-input v-model="name" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-divider direction="vertical" style="height: 12em" />
        </el-col>
        <el-col :span="11">
          <el-row>
            <el-form label-width="auto" style="max-width: 600px" size="small">
              <el-form-item label="姓名">
                <el-input v-model="searchName" placeholder="输入名称搜索" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>
              <!-- 加载状态 -->
              <div v-if="isLoading" class="loading">搜索中...</div>
              <!-- 搜索结果展示 -->
              <div v-else-if="data.length > 0">
                <div v-for="item in data" :key="item.id">
                  <div class="name">{{ item.name }}</div>
                  <div class="email">{{ item.email }}</div>
                </div>
              </div>
              <!-- 无结果提示 -->
              <div v-else-if="!isLoading" class="no-results">没有找到匹配的结果</div>
            </el-form>
          </el-row>
          <el-divider />
          <el-row>
            <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false">
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>
              <el-button type="primary" @click="submitExport">导入</el-button>
            </el-upload>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style></style>
