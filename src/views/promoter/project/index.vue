<template>
  <div class="customer-page">
    <!-- 右侧表格 -->
    <list
      ref="list"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import list from '@/components/promoter/project/list'
export default {
  components: {
    list
  },
  data() {
    return {
      // 进行中职位数量
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
  },
  methods: {
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
.customer-page{
  margin-top: 20px;
  background-color: #fff;
}
</style>

