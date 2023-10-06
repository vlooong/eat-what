import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface Item {
  key: number
  label: string
  favorite: boolean,
  location: string,
}
export const useItemStore = defineStore('item', () => {
  const defaultSelectedItems = [{
    key: 1,
    label: '火锅米线',
    favorite: true,
    location: '一食堂'
  },
  {
    key: 2,
    label: '犟拐拐',
    favorite: true,
    location: '西门外'
  },
  {
    key: 3,
    label: '小炒',
    favorite: false,
    location: '二食堂三楼'
  },
  {
    key: 4,
    label: '大众餐',
    favorite: false,
    location: '一食堂一楼'
  },
  {
    key: 5,
    label: '刘氏鸡公煲',
    favorite: false,
    location: '西门外'
  },
  {
    key: 6,
    label: '油泼面',
    favorite: false,
    location: '一食堂二楼'
  }]

  const currentItems = useLocalStorage('itemsLocalStorage', defaultSelectedItems)

  function getFavoriteKeys() {
    return currentItems.value.filter(item => item.favorite).map(item => item.key)
  }

  function getFavoriteItems() {
    return currentItems.value.filter(item => item.favorite)
  }

  function restoreToDefault() {
    currentItems.value = defaultSelectedItems
  }



  return {
    currentItems: skipHydrate(currentItems),
    getFavoriteKeys,
    getFavoriteItems,
    restoreToDefault
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useItemStore, import.meta.hot))
