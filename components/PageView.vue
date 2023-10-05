<script setup lang="ts">
import { ElTable } from 'element-plus';
import { storeToRefs } from 'pinia'

const store = useItemStore()
const { getFavoriteKeys, getFavoriteItems } = store
const { currentItems } = storeToRefs(store)

interface Item {
  key: number
  label: string
  favorite?: boolean,
  location?: string,
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()

// 根据喜好默认选择
const favoriteItems = getFavoriteItems()
function defaultSelect(rows?: Item[]) {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, true)
    })
  }
}
onMounted(() => {
  defaultSelect(favoriteItems)
})

const selectedRows = ref<Item[]>()
function handleSelectionChange(rows: Item[]) {
  selectedRows.value = rows
}

// 做决定
const res = ref()
function doSelect() {
  console.log('do select')
}

</script>

<template>
  <div text-gray:80>
    <el-container>
      <el-header>Eat What?</el-header>
      <el-container>
        <el-aside>
          <el-button type="primary" @click="doSelect">决定吧！</el-button>
          <el-table ref="multipleTableRef" :data="currentItems" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column property="label" label="名称" width="120" align="center" />
            <el-table-column property="location" label="位置" width="120" align="center" />
          </el-table>
        </el-aside>
        <el-main>{{ res }}</el-main>
      </el-container>
    </el-container>
  </div>
</template>
