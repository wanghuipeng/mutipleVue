export const TableMixin = {
  data() {
    return {
      // 是否显示详情模态框
      positionDetailVisible: false,
      // 职位ID
      positionId: '',
      // 表格对象
      dataTableObj: {
        currPage: 1,
        pageSize: 20,
        total: 0,
        list: []
      },
      // 加载loading效果
      loading: false
    }
  },
  methods: {
    // 切换分页
    handleCurrentChange(val) {
      this.dataTableObj.currPage = val;
      this.searchList();
    },
    // 切换页码
    handleSizeChange(val) {
      this.dataTableObj.currPage = 1;
      this.dataTableObj.pageSize = val;
      this.searchList();
    },
    // 打开详情模态框
    lookDetail(id) {
      this.positionId = id;
      this.positionDetailVisible = true;
    }
  },
  mounted() {
    // 初始化渲染
    this.searchList();
  }
};
