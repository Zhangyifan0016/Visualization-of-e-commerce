<template>
  <div class="com-container">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null // 服务器返回的数据
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.screenAdapter)
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, 'chalk')
      // 初始化配置控制
      const initOption = {}
      this.chartInstance.setOption(initOption)

      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData() {
      const { data: res } = await this.$http.get('seller')
      this.allData = res

      this.updateChart()
    },
    updateChart() {
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter() {
      // 分辨率配置项
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表resize方法
      this.chartInstance.resize()
    }
  }
}
</script>
<style scoped lang="scss"></style>
