<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <span class="iconfont left" :style="titleStyle" @click="toLeft">
      &#xe6ef;
    </span>
    <span class="iconfont right" :style="titleStyle" @click="toRight">
      &#xe6ed;
    </span>
    <span class="cat-name" :style="titleStyle">{{ catName }}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  computed: {
    catName() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    titleStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, 'chalk')
      // 初始化配置控制
      const initOption = {
        title: {
          text: '▎热销商品的占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach((item) => {
              total += item.value
            })
            let str = ''
            thirdCategory.forEach((item) => {
              str += `${item.name}:${parseInt((item.value / total) * 100) + '%'}
              <br/>`
            })
            return str
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    async getData() {
      const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      this.updateChart()
    },
    updateChart() {
      const legendArr = this.allData[this.currentIndex].children.map((item) => {
        return item.name
      })
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children
          }
        }
      )
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6
      // 分辨率配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ],
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表resize方法
      this.chartInstance.resize()
    },
    toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>
<style scoped lang="scss">
.left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
