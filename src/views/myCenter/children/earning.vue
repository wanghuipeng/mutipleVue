<template>
  <div class="earning-page child-view">
    <div class="panel">
      <ul>
        <li>
          <p>本月收入</p>
          <p>88888元</p>
        </li>
        <li>
          <p>可提现</p>
          <p>88888元</p>
        </li>
        <li>
          <p>等待过保</p>
          <p>88888元</p>
        </li>
        <li>
          <p>累计收入</p>
          <p>88888元</p>
        </li>
      </ul>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="账单编号" width="180" />
      <el-table-column prop="name" label="关联订单" width="180" />
      <el-table-column prop="address" label="账单金额" />
      <el-table-column prop="address" label="账单金额" />
      <el-table-column prop="address" label="操作" />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/myCenter/earning.scss';
</style>
