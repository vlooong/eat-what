import { acceptHMRUpdate, defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface Item {
  key: number
  label: string
  favorite: boolean,
  location: string,
}
export const useItemStore = defineStore('item', () => {
  const defaultSelectedItems: Item[] = [{
    key: 1,
    label: '火锅米线',
    favorite: true,
    location: '一食堂二楼'
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
    favorite: true,
    location: '二食堂三楼'
  },
  {
    key: 4,
    label: '大众餐',
    favorite: true,
    location: '一食堂一楼'
  },
  {
    key: 5,
    label: '刘氏鸡公煲',
    favorite: true,
    location: '西门外'
  },
  {
    key: 6,
    label: '猪肝面',
    favorite: true,
    location: '一食堂一楼'
  },
  {
    key: 7,
    label: '东家卤味',
    favorite: true,
    location: '一食堂二楼'
  },
  {
    key: 8,
    label: '冒菜',
    favorite: true,
    location: '一食堂二楼'
  },
  {
    key: 9,
    label: '黄焖鸡',
    favorite: true,
    location: '一食堂二楼'
  },
  {
    key: 10,
    label: '老麻抄手',
    favorite: true,
    location: '一食堂一楼'
  },
  {
    key: 11,
    label: '烫饭',
    favorite: true,
    location: '一食堂一楼'
  },
  {
    key: 12,
    label: '自选饺子',
    favorite: true,
    location: '二食堂负一楼'
  },
  {
    key: 13,
    label: '粤式烧腊',
    favorite: true,
    location: '一食堂二楼'
  },
  ]

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
