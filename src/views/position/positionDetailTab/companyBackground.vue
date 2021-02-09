<template>
  <div class="wrap">
    <!-- 公司信息 -->
    <div class="panel">
      <div class="panel-body">
        <div class="list">
          <ul>
            <li v-if="renderInfo.name">
              <span class="title">公司名称：</span>
              <p class="content">
                {{ renderInfo.name }}
                <el-link
                  :href="`https://baike.baidu.com/item/${renderInfo.name}`"
                  target="_blank"
                  :underline="false"
                >百度百科</el-link>
              </p>
            </li>
            <li v-if="renderInfo.shortName">
              <span class="title">别名：</span>
              <p class="content">{{ renderInfo.shortName }}</p>
            </li>
            <li v-if="renderInfo.financing">
              <span class="title">融资轮次：</span>
              <p
                class="content"
              >{{ renderInfo.financing | filterCommonDict(dictData.dicts.financing) }}</p>
            </li>
            <li v-if="renderInfo.scale">
              <span class="title">公司规模：</span>
              <p
                class="content"
              >{{ renderInfo.scale | filterCommonDict(dictData.dicts.enterpriseScale) }}</p>
            </li>
            <li v-if="renderInfo.welfareHighlights.length">
              <span class="title">公司标签：</span>
              <p class="content">
                <el-tag
                  v-for="(item, index) in renderInfo.welfareHighlights"
                  :key="index"
                  effect="dark"
                  :class="index % 2 === 0 ? 'red' : 'blue'"
                >{{ item | filterCommonDict(dictData.dicts.lightLabel) }}</el-tag>
              </p>
            </li>
            <li v-if="!renderInfo.desensitizatio && renderInfo.introduce">
              <span class="title">公司介绍：</span>
              <p class="content">{{ renderInfo.introduce }}</p>
            </li>
            <li v-if="renderInfo.provinceId || renderInfo.cityId || renderInfo.areaId || renderInfo.address">
              <span class="title">详细地址：</span>
              <p
                class="content"
              >{{ renderInfo.provinceId | filterCommonDict(dictData.areas) }}{{ renderInfo.cityId | filterLevel2(dictData.areas) }}{{ renderInfo.areaId | filterLevel3(dictData.areas) }}{{ renderInfo.address }}</p>
            </li>
          </ul>
        </div>
        <div v-if="renderInfo.provinceId || renderInfo.cityId || renderInfo.areaId || renderInfo.address" id="map" class="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from '@/utils/filters'
export default {
  components: {},
  props: {
    // 企业信息
    companyInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    },
    // 渲染的企业信息
    renderInfo() {
      const data = Object.assign({}, this.companyInfo)
      data.introduce =
        this.companyInfo.companyDetail &&
        this.companyInfo.companyDetail.introduce
      data.welfareHighlights =
        this.companyInfo.companyDetail &&
        this.companyInfo.companyDetail.welfareHighlights
          ? this.companyInfo.companyDetail.welfareHighlights.split(',')
          : []
      return data
    }
  },
  watch: {
    companyInfo(val) {
      // 渲染腾讯地图
      this.tencentMap()
    }
  },
  mounted() {
    // 渲染腾讯地图
    this.tencentMap()
  },
  methods: {
    tencentMap() {
      const city = filters.filterLevel2(
        this.companyInfo.cityId,
        this.dictData.areas
      )
      const area = filters.filterLevel3(
        this.companyInfo.areaId,
        this.dictData.areas
      )
      const address = this.companyInfo.address
      const result = []
      if (city) {
        result.push(city)
      }
      if (area) {
        result.push(area)
      }
      if (address) {
        result.push(address)
      }
      const geoAddress = result.join(',')
      console.log(geoAddress)
      const geo = new window.qq.maps.Geocoder()
      geo.getLocation(geoAddress) // 地址
      geo.setComplete(function(res) {
        console.log(res, res.detail.location) // 得到经纬度
        const map = new window.qq.maps.Map(document.getElementById('map'), {
          center: res.detail.location, // 将经纬度加到center属性上
          zoom: 16, // 缩放
          draggable: true, // 是否可拖拽
          scrollwheel: true, // 是否可滚动缩放
          disableDoubleClickZoom: false
        })
        new window.qq.maps.Marker({
          position: res.detail.location, // 标记的经纬度
          animation: window.qq.maps.MarkerAnimation.BOUNCE, // 标记的动画
          map: map // 标记的地图
        })
        new window.qq.maps.CityService({
          // 设置地图
          map: map,
          complete: function(results) {
            console.log(9999, results)
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap {
  .panel {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .panel-title {
      font-size: 15px;
      color: #191919ff;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .panel-body {
      .list {
        line-height: 32px;
        font-size: 14px;
        color: #4d4d4dff;
        li {
          display: flex;
          .title {
            flex: none;
          }
          .content {
            white-space: pre-wrap;
            flex: auto;
            .el-link {
              color: $main-color;
              vertical-align: baseline;
              margin-left: 20px;
            }
            .el-tag {
              border: none;
              height: 24px;
              line-height: 24px;
              margin: 4px 10px;
              border-radius: 4px;
              background: transparent;
              &.red {
                border: 1px solid $red-color;
                color: $red-color;
              }
              &.blue {
                border: 1px solid $main-color;
                color: $main-color;
              }
            }
          }
        }
      }
      .map {
        width: 600px;
        height: 200px;
        background-color: #d8d8d8ff;
        border-radius: 8px;
        overflow: hidden;
      }
    }
  }
}
</style>

