<script setup lang="ts">
import { ElTable } from 'element-plus';
import { getRandomInt } from 'element-plus/es/utils';
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
const res = ref<Item>()
function doSelect() {
  if (selectedRows.value) {
    const idx =getRandomInt(selectedRows.value.length)
    res.value = selectedRows.value[idx]
  }
}

</script>

<template>
  <div text-gray:80>
    <el-container>
      <el-header>Eat What?</el-header>
      <el-container>
        <el-main>
          <el-button type="primary" @click="doSelect">决定吧！</el-button>
          <el-row>
            <el-table ref="multipleTableRef" :data="currentItems" @selection-change="handleSelectionChange" width="100%">
              <el-table-column type="selection" />
              <el-table-column property="label" label="名称" align="center" />
              <el-table-column property="location" label="位置" align="center" />
            </el-table>
          </el-row>
          <el-row>
            {{ res?.location }}
            {{ res?.label }}
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
