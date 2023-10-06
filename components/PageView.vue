<script setup lang="ts">
import { getRandomInt } from 'element-plus/es/utils';
import { storeToRefs } from 'pinia'
import type { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, RefreshLeft } from '@element-plus/icons-vue'
import { loadFull } from "tsparticles"

const store = useItemStore()
const { getFavoriteItems, restoreToDefault } = store
const { currentItems } = storeToRefs(store)

interface Item {
  key: number
  label: string
  favorite: boolean,
  location: string,
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()

// 根据喜好默认选择
function defaultSelect() {
  const favoriteItems = getFavoriteItems()
  if (favoriteItems) {
    favoriteItems.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, true)
    })
  }
}
onMounted(() => {
  defaultSelect()
})

// 记住勾选状态
const selectedRows = ref<Item[]>()
function handleSelectionChange(rows: Item[]) {
  selectedRows.value = rows
  if (rows) {
    currentItems.value.forEach((item) => {
      item.favorite = rows.includes(item)
    })
  }
}

// 做决定
const res = ref<Item>()
function doSelect() {
  if (selectedRows.value && selectedRows.value.length > 0) {
    const idx = getRandomInt(selectedRows.value.length)
    res.value = selectedRows.value[idx]
    ElMessageBox.confirm(
      `${res.value.location} - ${res.value.label}`,
      '抽取结果',
      {
        callback: () => {
          res.value = undefined
        },
        showConfirmButton: false,
        showClose: false,
        showCancelButton: false,
        center: true,
        type: 'success',
      })
  } else {
    ElMessage({
      message: '请先选择',
      type: 'warning',
    })
  }
}

// 条目删除
function handleDelete(index: number, row: Item) {
  const idx = currentItems.value.findIndex(item =>
    item.label === row.label &&
    item.location === row.location)
  if (idx !== -1) {
    currentItems.value.splice(idx, 1)
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
  }
}

// 新增条目
const centerDialogVisible = ref(false)
const formLabelAlign = ref<Item>({
  key: 0,
  label: '',
  location: '',
  favorite: true,
})
function handleAddItem() {
  if (currentItems.value.find(item =>
    item.label === formLabelAlign.value.label &&
    item.location === formLabelAlign.value.location)) {

    centerDialogVisible.value = false
    ElMessage({
      message: `${formLabelAlign.value.label} 已存在`,
      type: 'warning',
    })
    return
  }
  currentItems.value.push({
    key: currentItems.value.length,
    label: formLabelAlign.value.label,
    location: formLabelAlign.value.location,
    favorite: formLabelAlign.value.favorite,
  })
  centerDialogVisible.value = false
  ElMessage({
    message: '新增成功',
    type: 'success',
  })
}

// 关闭遮罩
function handleDialogClose() {
  formLabelAlign.value = {
    key: 0,
    label: '',
    location: '',
    favorite: true,
  }
}

// 重置按钮
function handleReset() {
  restoreToDefault()
  defaultSelect()
}

// 粒子效果
const particlesOptions = {
  background: {
    color: "#fff"
  },
  fullScreen: {
    enable: true,
    zIndex: -1
  },
  particles: {
    color: {
      value: "#000"
    },
    links: {
      color: "#000",
      enable: true
    },
    move: {
      direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: false,
      speed: 4,
      straight: false
    },
    number: {
      value: 100
    }
  }
}

async function particlesInit(engine: Engine): Promise<void> {
  await loadFull(engine);
}

</script>

<template>
  <div text-gray:80>
    <vue-particles id="tsparticles" :options="particlesOptions" :particles-init="particlesInit" />
    <el-container>
      <el-header><span font-serif mx-auto font-size-12 color-blue>
          Eat What?
        </span></el-header>
      <el-main>
        <el-row>
          <el-table ref="multipleTableRef" :data="currentItems" @selection-change="handleSelectionChange" stripe
            width="100%" :default-sort="{ prop: 'location', order: 'ascending' }">
            <el-table-column type="selection" />
            <el-table-column property="location" label="位置" sortable align="center" />
            <el-table-column property="label" label="名称" align="center" />
            <el-table-column label="操作">
              <template #header>
                <el-button circle :icon="RefreshLeft" size="small" @click="handleReset">
                </el-button>
                <el-button :icon="Plus" @click="centerDialogVisible = true" circle type="primary" size="small">
                </el-button>
              </template>
              <template #default="scope">
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-button text bg @click="doSelect" type="primary" w-full font-size-14>
            点击抽取！！！
          </el-button>
        </el-row>

        <el-dialog v-model="centerDialogVisible" title="新增" width="15rem" align-center @closed="handleDialogClose">
          <el-form label-position="top" label-width="10rem" :model="formLabelAlign">
            <el-form-item label="名称">
              <el-input v-model="formLabelAlign.label" />
            </el-form-item>
            <el-form-item label="位置">
              <el-input v-model="formLabelAlign.location" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="handleAddItem">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
