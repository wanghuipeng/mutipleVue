<template>
  <div class="wrap">
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 基本信息 -->
      <div v-if="renderInfo.name || renderInfo.shortName || renderInfo.style || renderInfo.scale || renderInfo.financing || renderInfo.website || renderInfo.industryRanking || renderInfo.establishmentDate" id="nav_1" class="panel">
        <p class="panel-title">基本信息</p>
        <div class="panel-body">
          <div class="list">
            <ul>
              <li v-if="renderInfo.name">
                <span class="title">公司名称：</span>
                <p class="content">{{ renderInfo.name }}</p>
              </li>
              <li v-if="renderInfo.shortName">
                <span class="title">公司别名：</span>
                <p class="content">{{ renderInfo.shortName }}</p>
              </li>
              <li v-if="renderInfo.style">
                <span class="title">公司性质：</span>
                <p
                  class="content"
                >{{ renderInfo.style | filterCommonDict(dictData.dicts.enterpriseProperty) }}</p>
              </li>
              <li v-if="renderInfo.scale">
                <span class="title">公司规模：</span>
                <p
                  class="content"
                >{{ renderInfo.scale | filterCommonDict(dictData.dicts.enterpriseScale) }}</p>
              </li>
              <li v-if="renderInfo.financing">
                <span class="title">发展状态：</span>
                <p
                  class="content"
                >{{ renderInfo.financing | filterCommonDict(dictData.dicts.financing) }}</p>
              </li>
              <li v-if="renderInfo.website">
                <span class="title">公司网站：</span>
                <p class="content">{{ renderInfo.website }}</p>
              </li>
              <li v-if="renderInfo.industryRanking">
                <span class="title">行业排名：</span>
                <p
                  class="content"
                >{{ renderInfo.industryRanking | filterCommonDict(dictData.dicts.industryRanking) }}</p>
              </li>
              <li v-if="renderInfo.establishmentDate">
                <span class="title">成立时间：</span>
                <p class="content">{{ renderInfo.establishmentDate | filterDateMonth }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 公司介绍 -->
      <div v-if="!renderInfo.desensitizatio && renderInfo.introduce" id="nav_2" class="panel">
        <p class="panel-title">公司介绍</p>
        <div class="panel-body">
          <div class="list">
            <ul>
              <li>
                <p class="content">{{ renderInfo.introduce }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 公司地址 -->
      <div v-if="renderInfo.provinceId || renderInfo.cityId || renderInfo.areaId || renderInfo.address" id="nav_3" class="panel">
        <p class="panel-title">公司地址</p>
        <div class="panel-body">
          <div class="list">
            <ul>
              <li>
                <p
                  class="content"
                >{{ renderInfo.provinceId | filterCommonDict(dictData.areas) }}{{ renderInfo.cityId | filterLevel2(dictData.areas) }}{{ renderInfo.areaId | filterLevel3(dictData.areas) }}{{ renderInfo.address }}</p>
              </li>
            </ul>
          </div>
          <div id="map" class="map"></div>
        </div>
      </div>
      <!-- 产品信息 -->
      <div v-if="renderInfo.companyProducts.length" id="nav_4" class="panel">
        <p class="panel-title">产品信息</p>
        <div class="panel-body">
          <table class="table">
            <tr v-for="(item, index) in renderInfo.companyProducts" :key="index" class="tr">
              <td class="td">
                <img class="pic logo" :src="item.imageImg" />
              </td>
              <td class="td">
                <span class="info">{{ item.name }}</span>
              </td>
              <td class="td">
                <span class="info">
                  <a href="item.website" target="_blank">官网介绍</a>
                </span>
              </td>
              <td class="td">
                <span class="des">{{ item.description }}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 团队背景 -->
      <div v-if="renderInfo.companyTeams.length" id="nav_5" class="panel">
        <p class="panel-title">团队背景</p>
        <div class="panel-body">
          <table class="table">
            <tr v-for="(item, index) in renderInfo.companyTeams" :key="index" class="tr">
              <td class="td">
                <img class="pic avatar" :src="item.imageImg" />
              </td>
              <td class="td">
                <span class="info">{{ item.name }}</span>
              </td>
              <td class="td">
                <span class="info">{{ item.position }}</span>
              </td>
              <td class="td">
                <span class="des">{{ item.introduction }}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- 右侧导航 -->
    <div class="right-bar">
      <div id="fixedHeaderRoot" :class="['bar-main',headerFixed && 'isFixed']">
        <p
          v-if="renderInfo.name || renderInfo.shortName || renderInfo.style || renderInfo.scale || renderInfo.financing || renderInfo.website || renderInfo.industryRanking || renderInfo.establishmentDate"
          :class="['item',{active: currentNav === '1'}]"
          @click="currentNav = '1'"
        >
          <span class="item-hover">
            <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
          </span>
          <a href="#nav_1" class="item-name">基本信息</a>
        </p>
        <p
          v-if="!renderInfo.desensitizatio && renderInfo.introduce"
          :class="['item',{active: currentNav === '2'}]"
          @click="currentNav = '2'"
        >
          <span class="item-hover">
            <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
          </span>
          <a href="#nav_2" class="item-name">公司介绍</a>
        </p>
        <p
          v-if="renderInfo.provinceId || renderInfo.cityId || renderInfo.areaId || renderInfo.address"
          :class="['item',{active: currentNav === '3'}]"
          @click="currentNav = '3'"
        >
          <span class="item-hover">
            <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
          </span>
          <a href="#nav_3" class="item-name">公司地图</a>
        </p>
        <p
          v-if="renderInfo.companyProducts.length"
          :class="['item',{active: currentNav === '4'}]"
          @click="currentNav = '4'"
        >
          <span class="item-hover">
            <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
          </span>
          <a href="#nav_4" class="item-name">产品信息</a>
        </p>
        <p
          v-if="renderInfo.companyTeams.length"
          :class="['item',{active: currentNav === '5'}]"
          @click="currentNav = '5'"
        >
          <span class="item-hover">
            <i class="icon iconfont icon-zhiwei-quanbuzhiwei14" />
          </span>
          <a href="#nav_5" class="item-name">团队背景</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import filters from '@/utils/filters'
export default {
  components: {},
  props: {
    // 公司信息
    companyInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 当前导航
      currentNav: '1'
    }
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
      data.companyProducts = data.companyProducts || []
      data.companyTeams = data.companyTeams || []
      data.introduce = data.companyDetail && data.companyDetail.introduce
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
  display: flex;
  justify-content: space-between;
  .main-content {
    flex: auto;
    .panel {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .panel-title {
        font-size: 15px;
        color: #343434ff;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .panel-body {
        .list {
          line-height: 30px;
          font-size: 14px;
          color: #7f7f7f;
          ul{
            overflow: hidden;
          }
          li {
            display: flex;
            width: 50%;
            float: left;
            .title {
              flex: none;
            }
            .content {
              white-space: pre-wrap;
              flex: auto;
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
        .table {
          border-spacing: 0;
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          .tr {
            .td {
              border-right: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              .pic {
                display: block;
                width: 40px;
                height: 40px;
                padding: 10px 20px;
                &.logo {
                  border-radius: 5px;
                }
                &.avatar {
                  border-radius: 50%;
                }
              }
              .info {
                display: inline-block;
                width: 130px;
                padding: 0 15px;
                font-size: 14px;
                color: #7f7f7f;
                a {
                  color: $main-color;
                  text-decoration: none;
                }
              }
              .des {
                display: inline-block;
                padding: 0 15px;
                font-size: 14px;
                color: #7f7f7f;
              }
            }
          }
        }
      }
    }
  }
  .right-bar {
    width: 90px;
    margin-left: 50px;
    flex: none;
    overflow: hidden;
    .bar-main {
      width: 90px;
      padding: 10px 0;
      text-align: center;
      line-height: 36px;
      background-color: #fff;
      box-shadow: 2px 4px 20px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      font-size: 14px;
      color: #4c4c4cff;
      .item {
        position: relative;
        &.active {
          color: $main-color;
          .item-hover {
            color: $main-color;
          }
        }
        .item-name {
          text-decoration: none;
          color: #4c4c4cff;
        }
        .item-hover {
          width: 11px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          position: absolute;
          left: 0;
          top: 3px;
          color: #fff;
          transform: rotateZ(180deg);
        }
      }
    }
  }
}
</style>

