<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      startValue: 0,
      endValue: 9,
      timer: null
    }
  },
  created() {
    this.$socket.registerCallback('rankData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.registerCallback('rankData')
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, 'chalk')
      // 初始化配置控制
      const initOption = {
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          show: true
        },
        series: [
          {
            type: 'bar'
            // label: {
            //   show: true,
            //   position: 'top'
            // }
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
    getData(res) {
      // const { data: res } = await this.$http.get('rank')
      this.allData = res
      // 数据从大到小排序
      this.allData.sort((a, b) => b.value - a.value)
      this.updateChart()
      this.startInterval()
    },
    updateChart() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const provinceArr = this.allData.map((item) => {
        return item.name
      })
      const valueArr = this.allData.map((item) => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
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
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6
      // 分辨率配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
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
