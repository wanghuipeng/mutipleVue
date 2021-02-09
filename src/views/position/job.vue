<template>
  <div class="wrap-box">
    <div class="left-menu-wrap">
      <div class="left-menu">
        <div class="menu-item" style="padding: 10px 0 10px 0;">
          <div class="item-title" @click="allSelect">
            <i class="title-icon icon iconfont icon-bianzu161"/>
            <p class="title-text">进行中职位</p>
            <p class="title-num">{{ allPositionNum }}</p>
          </div>
        </div>
        <folder
          ref="folder"
          :company-folder-type="1"
          @select="folderSelect"
        />
        <div class="menu-item" style="padding: 0 0 10px 0">
          <div class="item-title" @click="backSelect">
            <i class="title-icon icon iconfont icon-bianzu19"/>
            <p class="title-text">已结束</p>
          </div>
        </div>
      </div>
    </div>
    <div class="right-content">
      <!-- 右侧表格 -->
      <list
        ref="list"
        :folder-id="folderId"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import folder from '@/components/folder'
import list from './jobTab/list'
import { getCPositionByUserId } from '@/api/position'
export default {
  components: {
    folder,
    list
  },
  data() {
    return {
      // 进行中职位数量
      allPositionNum: 0,
      folderId: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => {
        return state.userInfo
      }
    }),
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {
    document.title = '职位-大猎英才'
    // 查询进行中职位数量
    this.getAllPositionNum();
  },
  methods: {
    // 查询进行中职位数量
    getAllPositionNum() {
      getCPositionByUserId({
        pageNumber: 1,
        pageSize: 10
      }).then(res => {
        this.allPositionNum = res.data.total;
      })
    },
    // 选择了进行中职位触发
    allSelect() {
      sessionStorage.removeItem('folderDataJob')
      this.$refs.list.queryType = 1;
      this.$refs.list.selectedFolder = {
        name: '进行中职位',
        remark: ''
      };
      this.$refs.list.queryForm = {
        searchName: '',
        recruitType: '',
        positionDepartment: '',
        recruitNature: ''
      };
      this.$refs.list.dataTableObj.currPage = 1;
      this.$refs.list.searchList();
    },
    // 选择了文件夹触发
    folderSelect(data) {
      this.folderId = data && data.id
      this.$refs.list.queryType = 2;
      this.$refs.list.selectedFolder = Object.assign({}, data);
      console.log('职位文件夹', this.$refs.list.selectedFolder)
      if (this.$route.name === 'job') {
        sessionStorage.setItem('folderDataJob', JSON.stringify(this.$refs.list.selectedFolder))
      }
      this.$refs.list.queryForm = {
        searchName: '',
        recruitType: '',
        positionDepartment: '',
        recruitNature: ''
      };
      this.$refs.list.dataTableObj.currPage = 1;
      this.$refs.list.searchList();
    },
    // 选择了已结束触发
    backSelect() {
      sessionStorage.removeItem('folderDataJob')
      this.$refs.list.queryType = 3;
      this.$refs.list.selectedFolder = {
        name: '已结束',
        remark: ''
      };
      this.$refs.list.queryForm = {
        searchName: '',
        recruitType: '',
        positionDepartment: '',
        recruitNature: ''
      };
      this.$refs.list.dataTableObj.currPage = 1;
      this.$refs.list.searchList();
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/position/common.scss';
.wrap-box {
  display: flex;
  min-height: calc(100% - 76px);
  padding: 16px 0 16px 238px;
  justify-content: space-between;
  background-color: #f7f7f7;
  overflow: hidden;
  .left-menu-wrap{
    width: 240px;
    background-color: #fff;
    position: fixed;
    left: 0;
    top: 45px;
    bottom: 0;
    overflow-y: auto;
    .left-menu{
      width: 240px;
      .menu-item{
        .item-title{
          display: flex;
          padding-left: 10px;
          height: 36px;
          padding-right: 30px;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          &:hover{
              background-color: #F5F7FA;
          }
          .title-icon{
            flex: none;
            font-size: 20px;
            color: #0D121A;
          }
          .title-text{
            flex: auto;
            padding: 0 12px;
            font-size: 14px;
            font-weight: bold;
            color: #0D121A;
          }
          .title-num{
            flex: none;
            font-size: 14px;
            color: #0D121A;
          }
        }
      }
    }
  }
  .right-content {
    flex: auto;
    background-color: #fff;
    overflow: hidden;
  }
}
</style>

