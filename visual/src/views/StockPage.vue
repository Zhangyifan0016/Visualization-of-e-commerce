<template>
  <div class="com-page">
    <stock></stock>
  </div>
</template>

<script>
import Stock from '@/components/Stock'
export default {
  name: 'StockPage',
  components: {
    stock: Stock
  }
}
</script>

<style lang="less" scoped></style>
