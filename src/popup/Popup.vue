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
    return conn.insert({
      into: tableData,
      values: [value],
    })
  })

  if (noOfRowsInserted > 0) {
    console.log('Successfully Added')
    name.value = ''
    email.value = ''
  }
}

const searchName = ref('')
const data = ref([])
const isLoading = ref(false)

const handleSearch = async () => {
  data.value = await conn.then((conn) => {
    return conn.select({
      from: tableData,
      where: {
        name: {
          like: '%' + searchName.value + '%',
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
    <el-main class="container">
      <el-row :gutter="20" class="main-row">
        <!-- 新增数据板块 -->
        <el-col :xs="24" :sm="12" :md="8" class="card-col">
          <el-card class="form-card" shadow="hover">
            <h3 class="card-title">新增用户</h3>
            <el-form label-width="80px" size="small">
              <el-form-item label="姓名">
                <el-input v-model="name" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit" class="submit-btn">提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 搜索数据板块 -->
        <el-col :xs="24" :sm="12" :md="8" class="card-col">
          <el-card class="search-card" shadow="hover">
            <h3 class="card-title">用户查询</h3>
            <el-form label-width="80px" size="small">
              <el-form-item label="搜索">
                <el-input v-model="searchName" placeholder="输入姓名搜索" />
              </el-form-item>
              <el-button type="primary" @click="handleSearch" class="search-btn"
                >立即搜索
              </el-button>

              <div v-if="isLoading" class="status-message loading">搜索中...</div>
              <template v-else>
                <div v-if="data.length" class="result-list">
                  <div v-for="item in data" :key="item.id" class="result-item">
                    <div class="name">{{ item.name }}</div>
                    <div class="email">{{ item.email }}</div>
                  </div>
                </div>
                <div v-else class="status-message no-results">暂无匹配结果</div>
              </template>
            </el-form>
          </el-card>
        </el-col>

        <!-- 数据导入板块 -->
        <el-col :xs="24" :sm="24" :md="8" class="card-col">
          <el-card class="import-card" shadow="hover">
            <h3 class="card-title">批量导入</h3>
            <div class="upload-container">
              <el-upload
                ref="uploadRef"
                class="upload-box"
                action=""
                :before-upload="handleBeforeUpload"
                :on-remove="handleRemove"
                :limit="1"
                :on-exceed="handleExceed"
                :show-file-list="true"
                :multiple="false"
              >
                <template #trigger>
                  <el-button type="primary" icon="Upload" class="upload-btn"
                    >选择Excel文件
                  </el-button>
                </template>
                <el-button
                  type="success"
                  @click="submitExport"
                  class="import-btn"
                  :disabled="!fileData"
                >
                  开始导入
                </el-button>
              </el-upload>
              <div class="upload-tips">支持.xlsx格式，最大50MB</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-row {
  margin: -10px;
}

.card-col {
  padding: 10px;
}

.form-card,
.search-card,
.import-card {
  height: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

.form-card:hover,
.search-card:hover,
.import-card:hover {
  transform: translateY(-5px);
}

.card-title {
  margin: 0 0 20px 0;
  color: #409eff;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.submit-btn,
.search-btn {
  width: 100%;
  margin-top: 10px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-btn {
  width: 100%;
}

.import-btn {
  width: 100%;
  margin-top: 10px;
}

.upload-tips {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}

.result-list {
  margin-top: 15px;
  width: 100%;
}

.result-item {
  padding: 12px;
  margin: 8px 0;
  background: #f8f9fa;
  border-radius: 4px;
  transition: background 0.3s;
}

.result-item:hover {
  background: #e9ecef;
}

.name {
  font-weight: 500;
  color: #333;
}

.email {
  color: #666;
  font-size: 13px;
}

.status-message {
  text-align: center;
  padding: 20px;
  color: #999;
}

.loading {
  color: #409eff;
}

.no-results {
  color: #f56c6c;
}

@media (max-width: 768px) {
  .card-col {
    margin-bottom: 20px;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
