<script setup lang="js">
import { ref } from 'vue'
import conn, { tableData } from '../db/conn.js'

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
.search-card {
  height: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

.form-card:hover,
.search-card:hover {
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
