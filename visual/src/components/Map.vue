<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>
<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      mapData: {}
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
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
      const res = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', res.data)
      // 初始化配置控制
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        if (!this.mapData[provinceInfo.key]) {
          const res = await axios.get(
            'http://localhost:8999' + provinceInfo.path
          )
          this.mapData[provinceInfo.key] = res.data
          this.$echarts.registerMap(provinceInfo.key, res.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData() {
      const { data: res } = await this.$http.get('map')
      this.allData = res
      this.updateChart()
    },
    updateChart() {
      const legendArr = this.allData.map((item) => {
        return item.name
      })
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6
      // 分辨率配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表resize方法
      this.chartInstance.resize()
    },
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>
<style scoped lang="scss"></style>
