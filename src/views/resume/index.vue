/**
* 简历页面
*/
<template>
  <div class="resume-page">
    <!-- 左侧 -->
    <!-- <left-menu
      id="fixedHeaderRoot"
      :class="headerFixed && 'isFixed'"
      :total="totalProps"
      :total1="total1"
      :total2="total2"
      :total3="total3"
      @searchList="getResumeInfoListByUserId"
    />-->
    <div class="left-menu-wrap">
      <div class="left-menu">
        <div class="menu-item" style="padding: 10px 0 10px 0">
          <div class="item-title" @click="allSelect">
            <i class="title-icon icon iconfont icon-bianzu10" />
            <p class="title-text">全部人才</p>
            <p class="title-num">{{ allResumeNum }}</p>
          </div>
        </div>
        <!-- 文件夹 -->
        <folder ref="folder" :company-folder-type="3" @select="folderSelect" />
        <!-- 标签 -->
        <labels ref="labels" :resume-labels-type="3" @select="labelSelect" />
        <div class="menu-item" style="padding: 0 0 10px 0">
          <div class="item-title" @click="backSelect">
            <i
              class="title-icon icon iconfont icon-zhuanxietuijianbaogao-changping1"
            />
            <p class="title-text">回收站</p>
          </div>
        </div>
      </div>
    </div>
    <div class="right-content">
      <!-- 顶部 -->
      <top-part
        :query-type="queryType"
        :selected-folder="selectedFolder"
        :selected-labels="selectedLabels"
        @searchList="getResumeInfoListByUserId"
      />
      <!-- 搜索 -->
      <search-part
        :query-type="queryType"
        @searchList="getResumeInfoListByUserId"
      />
      <!-- 筛选 -->
      <!-- <filter-part :total="total" @searchList="getResumeInfoListByUserId" /> -->
      <!-- 列表 -->
      <div v-if="Array.isArray(listData) && listData.length > 0">
        <list-part
          v-loading="listLoading"
          :list-data="listData"
          :total="total"
          :page-size="pageSize"
          :page-number="pageNumber"
          :query-type="queryType"
          @refreshList="getResumeInfoListByUserId"
          @changePageSize="changePageSize"
          @onBatch="onBatch"
          @toParentAgain="toParentAgain"
        />
      </div>
      <div
        v-else-if="Array.isArray(listData) && listData.length === 0"
        class="empty-page"
      >
        <img
          style="height: 154px"
          src="@/assets/images/resume/resume_empty.png"
        />
        <p>抱歉，未能找到您搜索的简历</p>
        <el-button
          type="primary"
          size="small"
          @click="uploadResume"
        >上传简历</el-button>
      </div>
      <div v-else v-loading="listLoading" class="h-100"></div>
    </div>
    <!-- 简历上传解析（抽屉） -->
    <drawer-common
      :drawer.sync="drawer"
      :router="'resumeDetail'"
      :no-new-window="true"
      @close="close"
    >
      <upload-drawer
        slot="inner-body"
        ref="uploadDrawer"
        @fatherMethod="close"
        @finishUpload="finishUpload"
      />
    </drawer-common>
  </div>
</template>

<script>
// import LeftMenu from '@/components/resume/index/leftMenu'
import folder from '@/components/folder';
import labels from '@/components/resume/labels';
// import FilterPart from '@/components/resume/index/filterPart'
import ListPart from '@/components/resume/index/listPart';
import SearchPart from '@/components/resume/index/searchPart';
import topPart from '@/components/resume/index/topPart';
import {
  getResumeListByFolderIdAndTalentId,
  getAllResumeList,
  getBackResumeList,
  getResumeCountByType
} from '@/api/resume';
import { mapState } from 'vuex';
import DrawerCommon from '@/components/common/drawerCommon';
import UploadDrawer from '@/components/resume/resumeUpload/uploadDrawer';
// import { addFolderFileBatch } from '@/api/common'

export default {
  components: {
    // LeftMenu,
    folder,
    labels,
    SearchPart,
    topPart,
    // FilterPart,
    ListPart,
    DrawerCommon,
    UploadDrawer
  },
  inject: ['reload'],
  data() {
    return {
      listData: null,
      pageNumber: 1,
      pageSize: 20,
      total: 0,
      searchName: '', // 关键字
      attentCity: null,
      isRecommend: null,
      listLoading: false,
      totalProps: 0,
      drawer: false,
      total1: 0,
      total2: 0,
      total3: 0,
      allResumeNum: 0,
      queryType: 1,
      selectedFolder: {},
      selectedlabels: {},
      folderIds: null,
      labels: [],
      selectedLabels: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      selectedData: (state) => state.common.selectedData
    })
  },
  watch: {
    $route(to, from) {
      if (to.name === from.name && to.query.refresh) {
        console.log(to.name, from.name, to.name === from.name, '刷新当前页面');
        this.reload();
      }
    }
  },
  mounted() {
    // sessionStorage.clear()
    sessionStorage.removeItem('talent');
    sessionStorage.removeItem('obj');
    sessionStorage.removeItem('universityLabel');
    sessionStorage.removeItem('famousCompany');
    sessionStorage.removeItem('top500');
    sessionStorage.removeItem('orderBy');
    this.isRecommend =
      Number(this.$route.query.isRecommend) === 1
        ? this.$route.query.isRecommend
        : null;
    if (Number(this.$route.query.isRecommend) === 0) {
      document.title = '人才库-大猎英才';
    } else if (Number(this.$route.query.isRecommend) === 1) {
      document.title = '我推荐过的简历-大猎英才';
    }
    this.getResumeInfoListByUserId();
    this.getResumeCountByType();
    this.getAllResumeList();
  },
  destroyed() {
    sessionStorage.removeItem('talent');
    sessionStorage.removeItem('obj');
    sessionStorage.removeItem('universityLabel');
    sessionStorage.removeItem('famousCompany');
    sessionStorage.removeItem('top500');
    sessionStorage.removeItem('orderBy');
  },
  methods: {
    toParentAgain() {
      console.log('再向上')
      this.$refs.labels.reloadComponent()
    },
    finishUpload() {
      this.$message.success('上传成功');
      this.reloadComponent();
      setTimeout(() => {
        this.close();
      }, 1500);
    },
    async reloadComponent() {
      const folderDataResume = JSON.parse(
        sessionStorage.getItem('folderDataResume')
      );
      if (folderDataResume && folderDataResume.id) {
        setTimeout(() => {
          this.getResumeInfoListByUserId();
        }, 500);
      }
    },
    getAllResumeList() {
      getAllResumeList({
        pageNumber: 1,
        pageSize: 10
      }).then((res) => {
        this.allResumeNum = res.data.total;
      });
    },
    // 选择了全部人才触发
    allSelect() {
      sessionStorage.removeItem('folderDataResume');
      this.queryType = 1;
      this.selectedFolder = {};
      sessionStorage.setItem('talent', JSON.stringify({}));
      this.labels = []
      this.getResumeInfoListByUserId();
    },
    // 选择了文件夹触发
    folderSelect(data) {
      this.labels = []
      this.folderIds = data && data.id;
      console.log('简历文件夹', data, this.$route.name);
      if (this.$route.name === 'resume') {
        sessionStorage.setItem('folderDataResume', JSON.stringify(data));
      }
      this.queryType = 2;
      this.selectedFolder = Object.assign({}, data);
      sessionStorage.setItem('talent', JSON.stringify({}));
      this.getResumeInfoListByUserId();
    },
    // 选择了标签触发
    labelSelect(data) {
      console.log('简历标签', data);
      sessionStorage.removeItem('folderDataResume');
      this.queryType = 4;
      this.selectedFolder = {};
      this.selectedLabels = Object.assign({}, data);
      this.labels = data && [data.labelId]
      this.getResumeInfoListByUserId();
    },
    // 选择了回收站触发
    backSelect() {
      sessionStorage.removeItem('folderDataResume');
      this.queryType = 3;
      this.selectedFolder = {};
      sessionStorage.setItem('talent', JSON.stringify({}));
      this.getResumeInfoListByUserId();
    },
    // 批量处理完成
    onBatch() {
      this.$refs.folder.commonTreeKey = new Date().getTime();
      this.$refs.folder.intellectTreeKey = new Date().getTime();
    },
    getResumeCountByType() {
      const params = {
        userId: this.$store.state.userInfo.userId
      };
      getResumeCountByType(params).then((res) => {
        const { code, data } = res;
        if (code === '000000') {
          data.filter((item) => {
            if (item.typeName === '全部简历') {
              this.total1 = item.count;
            }
            if (item.typeName === '推荐过的') {
              this.total2 = item.count;
            }
            if (item.typeName === '新的线索') {
              this.total3 = item.count;
            }
          });
        }
      });
    },
    uploadResume() {
      this.drawer = true;
    },
    close() {
      this.drawer = false;
      this.$refs.uploadDrawer.destroyedInterval();
    },
    // 切换页码
    changePageSize(val) {
      this.pageSize = val;
      this.getResumeInfoListByUserId();
    },
    // 简历列表
    getResumeInfoListByUserId(pageNumberProp) {
      console.log()
      this.pageNumber = pageNumberProp || 1;
      this.listLoading = true;
      let obj = JSON.parse(sessionStorage.getItem('obj') || '{}');
      const talent = JSON.parse(sessionStorage.getItem('talent') || '{}');
      obj = Object.assign(obj, talent);
      obj.folderId = this.selectedFolder.id;

      const universityLabel =
        sessionStorage.getItem('universityLabel') &&
        sessionStorage
          .getItem('universityLabel')
          .split(',')
          .map((item) => {
            return item - 0;
          });
      const famousCompany =
        sessionStorage.getItem('famousCompany') &&
        sessionStorage.getItem('famousCompany') - 0;
      const top500 =
        sessionStorage.getItem('top500') &&
        sessionStorage.getItem('top500') - 0;
      const { pageNumber, pageSize } = this;
      let intentionCityArr = [];
      if (Array.isArray(obj.intentionCity)) {
        intentionCityArr =
          obj &&
          obj.intentionCity &&
          obj.intentionCity.map((item) => {
            return item - 0;
          });
      } else {
        intentionCityArr = obj.intentionCity && [obj.intentionCity - 0];
      }
      const params = {
        pageNumber,
        pageSize,
        searchName: (obj && obj.inputValue) || this.$route.params.searchName,
        age: obj && obj.age && obj.age - 0,
        degreeCode: obj && obj.degreeCode && obj.degreeCode - 0,
        workMonth: obj && obj.workMonth && obj.workMonth - 0,
        intentionCity: intentionCityArr,
        currentSalarySpecific:
          obj && obj.currentSalarySpecific && obj.currentSalarySpecific - 0,
        universityLabel,
        famousCompany,
        top500,
        orderBy: sessionStorage.getItem('orderBy') - 0 || 1,
        isRecommend:
          Number(this.$route.query.isRecommend) === 1
            ? this.$route.query.isRecommend
            : null,
        talentPoolId: obj && obj.talentPoolId,
        folderId: obj && obj.folderId,
        labels: this.labels
      };
      let api = null;
      if (this.queryType === 1 || this.queryType === 4) {
        api = getAllResumeList;
      } else if (this.queryType === 2) {
        api = getResumeListByFolderIdAndTalentId;
      } else {
        api = getBackResumeList;
      }
      api(params).then((res) => {
        const { code, data } = res;
        this.listLoading = false;
        if (code === '000000') {
          this.listData = data.records;
          this.total = data.total;
          if (
            this.$route.query.isRecommend - 0 === 0 ||
            typeof this.$route.query.isRecommend === 'undefined'
          ) {
            this.totalProps = data.total;
            localStorage.setItem('totalProps', data.total);
          }
        }
      });
    }
  }
};
</script>
<style  lang="scss">
@import "@/assets/sass/resume/index.scss";
.resume-page {
  .menu-item {
    .item-title {
      padding-left: 10px;
    }
  }
}
</style>

