<script setup lang="js">
import { ref } from 'vue'
import { read, utils } from 'xlsx'
import { isNonEmptyString } from '../common/utils.js'
import conn, { tableData } from '../db/conn.js'
import { ElMessage, genFileId } from 'element-plus'

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
        .catch((error) => {
          console.log(error)
          ElMessage.success('导入失败：' + error.message)
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
                :http-request="() => {}"
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

.import-card {
  height: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

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

@media (max-width: 768px) {
  .card-col {
    margin-bottom: 20px;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
