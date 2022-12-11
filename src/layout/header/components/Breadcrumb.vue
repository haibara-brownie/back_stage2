<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">
      <span class="no-redirect" v-if="index === breadList.length - 1">{{
        $t(`menus.${item.name}`)
      }}</span>
      <span class="redirect" v-else @click="handleRedirect(item.path)">{{
        $t(`menus.${item.name}`)
      }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const breadList = ref([])
const initbreadList = () => {
  breadList.value = route.matched
  // console.log(route.matched)
}

const handleRedirect = (path) => {
  router.push(path)
}

watch(
  route,
  () => {
    initbreadList()
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.no-redirect {
  cursor: text;
  color: #304156;
}
.redirect {
  color: #666;
  cursor: pointer;
  &.active {
    color: yellow;
  }
}
</style>
