<script setup lang="js">
import { ref } from 'vue'
import conn, { tableData } from '../db/conn.js'

const name = ref('')
const email = ref('')

const handleSubmit = () => {
  console.log('提交数据:', { name: name.value, email: email.value })
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
    })
  })
}
</script>

<template>
  <main>
    <h3>Popup Page</h3>

    <div class="add">
      <form @submit.prevent="handleSubmit">
        <input v-model="name" placeholder="姓名" />
        <input v-model="email" placeholder="邮箱" />
        <button type="submit">新增</button>
      </form>
    </div>
    <div class="search-container">
      <!-- 搜索输入框和按钮 -->
      <div class="search-box">
        <input
          v-model="searchName"
          type="text"
          placeholder="输入名称搜索..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">搜索</button>
      </div>

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
    </div>
  </main>
</template>

<style></style>
