<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1,
      total: 0,
      timer: null
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
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 方向 0 0 1 0 从左到右
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
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
      // 数据从小到大排序
      this.allData.sort((a, b) => a.value - b.value)
      // 每五条显示一页  // 是否能被整除
      this.total =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    updateChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      // 包左不包右
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValue = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValue
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.total) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
      // 分辨率配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,

            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表resize方法
      this.chartInstance.resize()
    }
  }
}
</script>
<style scoped lang="scss"></style>
