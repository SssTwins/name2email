<script setup lang="js">
import { ref } from 'vue'
import conn, { tableData } from '../db/conn.js'
import { read, utils } from 'xlsx'
import { ElMessage, genFileId } from 'element-plus'
import { isNonEmptyString } from '../common/utils.js'

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
const fileData = ref()

const handleBeforeUpload = (file) => {
  // 在这里获取文件的二进制数据
  const reader = new FileReader()
  reader.onload = (e) => {
    fileData.value = e.target.result // 文件的二进制数据
  }
  reader.readAsArrayBuffer(file) // 或者使用 readAsDataURL(file) 读取为 Data URL
  return true // 阻止文件自动上传
}

const submitExport = () => {
  const workbooks = read(fileData.value)
  const sheetNames = workbooks.SheetNames
  if (sheetNames && sheetNames.length > 0) {
    const worksheet = workbooks.Sheets[workbooks.SheetNames[0]]
    const rawData = utils.sheet_to_json(worksheet)
    if (rawData && rawData.length > 0) {
      console.log('rawData: ', rawData)
      const needInsert = []
      rawData.forEach((row) => {
        if (isNonEmptyString(row.name) && isNonEmptyString(row.email)) {
          needInsert.push({
            name: row.name,
            email: row.email,
          })
        }
      })
      console.log('needInsert: ', needInsert)
      conn
        .then((conn) => {
          return conn.insert({
            into: tableData,
            values: needInsert,
          })
        })
        .then((noOfRowsInserted) => {
          if (noOfRowsInserted > 0) {
            console.log('Successfully Added')
            ElMessage.success('导入成功')
          }
        })
    }
  }
  fileData.value = null // 清除文件数据
  uploadRef.value.clearFiles()
}

const handleExceed = (files) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
}

const handleRemove = () => {
  fileData.value = null // 清除文件数据
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
            <el-upload
              ref="uploadRef"
              class="upload"
              action=""
              :before-upload="handleBeforeUpload"
              :on-remove="handleRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :show-file-list="true"
              :multiple="false"
            >
              <template #trigger>
                <el-button type="primary" size="small">选择文件</el-button>
              </template>
              <el-button type="primary" @click="submitExport" size="small">导入</el-button>
            </el-upload>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style></style>
