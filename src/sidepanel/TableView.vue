<script setup lang="js">
import { ref, onMounted } from 'vue'
import conn, { tableData } from '../db/conn.js'
import { isNonEmptyString } from '../common/utils.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const panelTableData = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const filterForm = ref({ name: '', email: '' })

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  loading.value = true
  const where = { id: { '>': 0 } }
  if (isNonEmptyString(filterForm.value.name)) {
    Object.assign(where, {
      name: {
        like: '%' + filterForm.value.name + '%',
      },
    })
  }
  if (isNonEmptyString(filterForm.value.email)) {
    Object.assign(where, {
      email: {
        like: '%' + filterForm.value.email + '%',
      },
    })
  }
  panelTableData.value = await conn.then((conn) => {
    return conn.select({
      from: tableData,
      limit: pageSize.value,
      skip: (currentPage.value - 1) * pageSize.value,
      where: where,
    })
  })
  total.value = await conn.then((conn) => {
    return conn.count({
      from: tableData,
      where: where,
    })
  })
  loading.value = false
}

const handleSizeChange = (size) => {
  pageSize.value = size
  fetchData()
}
const handleCurrentChange = (currPage) => {
  currentPage.value = currPage
  fetchData()
}

const handleFilter = () => {
  currentPage.value = 1
  fetchData()
}

const editableRow = ref(null)
const originalData = ref(null)

const startEdit = (row) => {
  editableRow.value = { ...row }
  originalData.value = { ...row }
}

const saveEdit = async () => {
  try {
    await conn.then((conn) =>
      conn.update({
        in: tableData,
        set: editableRow.value,
        where: { id: editableRow.value.id },
      }),
    )
    await fetchData()
    ElMessage.success('修改成功')
    cancelEdit()
  } catch (error) {
    ElMessage.error('保存失败: ' + error.message)
  }
}

const cancelEdit = () => {
  editableRow.value = null
  originalData.value = null
}
const handleDelete = (_, row) => {
  ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      conn
        .then((conn) => {
          conn.remove({
            from: tableData,
            where: {
              id: row.id,
            },
          })
        })
        .then(() => {
          fetchData()
        })
        .catch((error) => {
          console.log(error)
          ElMessage.error(error.message)
        })
    })
    .catch((error) => {
      console.log(error.message)
    })
}
</script>

<template>
  <div>
    <el-backtop :right="10" :bottom="5" />
    <!-- 筛选表单 -->
    <el-form :inline="true" :model="filterForm" class="form-inline">
      <!-- 姓名筛选 -->
      <el-form-item label="姓名">
        <el-input
          v-model="filterForm.name"
          placeholder="输入姓名搜索"
          clearable
          @input="handleFilter"
        ></el-input>
      </el-form-item>

      <!-- 邮箱筛选 -->
      <el-form-item label="邮箱">
        <el-input
          v-model="filterForm.email"
          placeholder="输入邮箱搜索"
          clearable
          @input="handleFilter"
        ></el-input>
      </el-form-item>
    </el-form>
    <!--    <el-button type="primary" @click="showCreateDialog" class="mb-3">
          <el-icon>
            <Plus />
          </el-icon>
          新增
        </el-button>-->
    <!-- 表格 -->
    <el-table :data="panelTableData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名">
        <template #default="{ row }">
          <div v-if="editableRow?.id === row.id">
            <el-input v-model="editableRow.name" size="small" />
          </div>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template #default="{ row }">
          <div v-if="editableRow?.id === row.id">
            <el-input v-model="editableRow.email" size="small" />
          </div>
          <span v-else>{{ row.email }}</span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" width="140">
        <template #default="scope">
          <template v-if="editableRow?.id === scope.row.id">
            <el-button type="success" size="small" @click="saveEdit">保存</el-button>
            <el-button size="small" @click="cancelEdit">取消</el-button>
          </template>
          <template v-else>
            <el-button size="small" @click="startEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 20px; text-align: right"
      size="small"
    ></el-pagination>
  </div>
</template>

<style scoped>
.form-inline {
  padding-top: 10px;
}
</style>
