<template>
  <div class="main">
    <!-- 订单列表 -->
    <div v-if="listData.records && listData.records.length > 0" class="list">
      <ul class="list-header">
        <li class="list-item-name">候选人</li>
        <li class="list-item-position">推荐职位</li>
        <li class="list-item-state">状态</li>
        <li class="list-item-step">阶段</li>
        <li class="list-item-date">推荐时间</li>
        <li class="list-item-operation">操作</li>
      </ul>
      <ul v-for="item in listData.records" :key="item.id" class="list-item">
        <li class="list-item-name">{{ item.jobhunterName }}</li>
        <li class="list-item-position" @click="toDetail(item.id,item.resumeId)">
          <p>{{ item.positionName }}</p>
          <p>{{ item.companyName }}</p>
        </li>
        <li class="list-item-state">
          <p>{{ item.statusNo | filterArr(initStatusNo) }}</p>
        </li>
        <li class="list-item-step">{{ item.stage | filterArr(stage) }}</li>
        <li class="list-item-date">
          <p>{{ item.recommendTime | filterDateTime }}</p>
        </li>
        <li class="list-item-operation">
          <!-- 推荐待审 -->
          <template v-if="item.statusNo === 11 || item.statusNo === 12">
            <el-button round @click="handleBtn(item, 2)">取消推荐</el-button>
          </template>
          <!-- 待提交HR -->
          <template v-if="item.statusNo === 16">
            <el-button round @click="handleBtn(item, 2)">取消推荐</el-button>
          </template>
          <!-- 待HR反馈 -->
          <template v-if="item.statusNo === 21">
            <el-button round @click="handleBtn(item, 2)">取消推荐</el-button>
          </template>
          <!-- 评估已通过 -->
          <template v-if="item.statusNo === 22">
            <el-button round @click="handleBtn(item, 2)">取消推荐</el-button>
          </template>
          <!-- 待重推 -->
          <template v-if="item.statusNo === 13">
            <p>
              <el-button round @click="handleBtn(item, 7, true)">重新推荐</el-button>
            </p>
            <p>
              <el-button round @click="handleBtn(item, 2)">取消推荐</el-button>
            </p>
          </template>
          <!-- 取消推荐 -->
          <template v-if="item.statusNo === 17">
            <el-button round @click="handleBtn(item, 7)">重新推荐</el-button>
          </template>
          <!-- 待猎头约面 -->
          <template v-if="item.statusNo === 31">
            <p>
              <el-button round @click="handleBtn(item, 14, true)">安排面试</el-button>
            </p>
            <p>
              <el-button round @click="handleBtn(item, 15)">取消面试</el-button>
            </p>
          </template>
          <!-- 已安排面试 -->
          <template v-if="item.statusNo === 32">
            <p>
              <el-button round @click="handleBtn(item, 17, true)">修改面试</el-button>
            </p>
            <p>
              <el-button round @click="handleBtn(item, 15)">取消面试</el-button>
            </p>
          </template>
          <!-- 已到面 -->
          <template v-if="item.statusNo === 34">
            <el-button round @click="handleBtn(item, 15)">取消面试</el-button>
          </template>
          <!-- 面试通过 -->
          <template v-if="item.statusNo === 36">
            <el-button round @click="handleBtn(item, 15)">取消面试</el-button>
          </template>
          <!-- 准备offer -->
          <template v-if="item.statusNo === 41">
            <el-button round @click="handleBtn(item, 29)">放弃offer</el-button>
          </template>
          <!-- 已发offer -->
          <template v-if="item.statusNo === 42">
            <el-button round @click="handleBtn(item, 28)">放弃入职</el-button>
          </template>
          <!-- 已过保 -->
          <template v-if="item.statusNo === 52">
            <!-- <el-button round @click="handleBtn(item, 30)">领取佣金</el-button> -->
          </template>
        </li>
      </ul>
    </div>

    <!-- 空页面 -->
    <blank v-if="listData.records && listData.records.length === 0" />

    <!-- 订单详情抽屉 -->
    <!-- <drawer-common
      v-if="orderVisible"
      :drawer.sync="orderVisible"
      :router="'orderDetail?orderId='+ orderId"
    >
      <detail :id="orderId" slot="inner-body" @reload="reloadPage" />
    </drawer-common>-->
    <!-- 简历详情（抽屉） -->
    <drawer-common
      :drawer.sync="orderVisible"
      :router="'resumeDetail'"
      :direction="'btt'"
      :modal="true"
      :drawer-new="true"
      :no-new-window="true"
      class="resume-detail-supplier-drawer"
      @close="close"
    >
      <resume-detail-supplier v-if="orderVisible" slot="inner-body" :company-account-type="2" />
    </drawer-common>

    <!-- 草稿箱抽屉 -->
    <drawer-common v-if="draftVisible" :drawer.sync="draftVisible" class="draft">
      <draft-list slot="inner-body" />
    </drawer-common>

    <!-- 取消推荐弹窗 -->
    <handle-dialog
      v-if="recommendVisible"
      :dialog.sync="recommendVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      title="请确认是否取消推荐"
      @reload="reloadPage"
    />

    <!-- 面试安排弹窗 -->
    <handle-dialog
      v-if="interviewVisible"
      :dialog.sync="interviewVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      type="confirmInterview"
      title="确认面试安排"
      @reload="reloadPage"
    />

    <!-- 取消面试弹窗 -->
    <handle-dialog
      v-if="cancelInterviewVisible"
      :dialog.sync="cancelInterviewVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      title="请确认是否取消面试"
      @reload="reloadPage"
    />

    <!-- 修改面试弹窗 -->
    <handle-dialog
      v-if="modifyInterviewVisible"
      :dialog.sync="modifyInterviewVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      type="modifyInterview"
      title="修改面试安排"
      @reload="reloadPage"
    />

    <!-- 取消OFFER弹窗 -->
    <handle-dialog
      v-if="cancelOfferVisible"
      :dialog.sync="cancelOfferVisible"
      :info="orderInfo"
      :operate-method="operateMethod"
      title="请确认是否取消OFFER"
      @reload="reloadPage"
    />
  </div>
</template>

<script>
import drawerCommon from '@/components/common/drawerCommon'
import ResumeDetailSupplier from '@/components/resume/index/resumeDetailSupplier'
// import detail from '../detail/index'
import draftList from './draftList'
import handleDialog from '../dialog/handleDialog'
import blank from './blank'
import { operation } from '@/api/order'
export default {
  inject: ['reload'],
  components: {
    drawerCommon,
    // detail,
    draftList,
    handleDialog,
    blank,
    ResumeDetailSupplier
  },
  props: {
    listData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      orderVisible: false, // 订单详情抽屉弹窗
      draftVisible: false, // 草稿箱抽屉弹窗
      recommendVisible: false, // 取消推荐弹窗
      interviewVisible: false, // 面试弹窗
      cancelInterviewVisible: false, // 取消面试
      modifyInterviewVisible: false, // 修改面试
      cancelOfferVisible: false, // 修改offer
      orderId: 0, // 订单id
      orderInfo: {}, // 订单信息
      operateMethod: null, // 操作类型
      initStatusNo: [
        { value: '11', label: '合格待审' },
        { value: '12', label: '不合格待审' },
        { value: '13', label: '待重推' },
        { value: '14', label: '已重复' },
        { value: '15', label: '不合格' },
        { value: '16', label: '待提交HR' },
        { value: '17', label: '推荐已取消' },
        { value: '21', label: '待HR反馈' },
        { value: '22', label: '评估已通过' },
        { value: '23', label: '评估未通过' },
        { value: '31', label: '待猎头约面' },
        { value: '32', label: '约面成功' },
        { value: '33', label: '约面失败' },
        { value: '34', label: '已到面' },
        { value: '35', label: '面试未到' },
        { value: '36', label: '面试通过' },
        { value: '37', label: '面试未通过' },
        { value: '38', label: '面试取消' },
        { value: '41', label: '待发offer' },
        { value: '42', label: '已发offer' },
        { value: '44', label: '放弃offer' },
        { value: '51', label: '已到岗' },
        { value: '52', label: '放弃到岗' },
        { value: '61', label: '已过保' },
        { value: '62', label: '过保关闭' }
      ],
      stage: [
        { value: '1', label: '平台推荐' },
        { value: '3', label: '面试' },
        { value: '4', label: 'OFFR' },
        { value: '5', label: '入职' },
        { value: '6', label: '过保' }
      ]
    }
  },
  mounted() {
    this.$bus.$on('openDraft', this.openDraft)
  },
  methods: {
    // 关闭简历详情
    close() {
      document.body.style['overflow'] = 'auto'
      this.orderVisible = false
      // this.$emit('refreshList', 1)
    },
    openDraft() {
      this.draftVisible = true
    },
    handleBtn(order, method, flag) {
      console.log(order, method)
      this.orderInfo = order
      this.operateMethod = method
      if (
        order.statusNo === 11 ||
        order.statusNo === 12 ||
        order.statusNo === 16 ||
        order.statusNo === 21 ||
        order.statusNo === 22
      ) {
        this.recommendVisible = !this.recommendVisible
      } else if (order.statusNo === 13) {
        if (flag) {
          this.operations(order, method)
        } else {
          this.recommendVisible = !this.recommendVisible
        }
      } else if (order.statusNo === 31) {
        if (flag) {
          this.interviewVisible = !this.interviewVisible
        } else {
          this.cancelInterviewVisible = !this.cancelInterviewVisible
        }
      } else if (order.statusNo === 32) {
        if (flag) {
          this.modifyInterviewVisible = !this.modifyInterviewVisible
        } else {
          this.cancelInterviewVisible = !this.cancelInterviewVisible
        }
      } else if (order.statusNo === 34) {
        this.cancelInterviewVisible = !this.cancelInterviewVisible
      } else if (order.statusNo === 41 || order.statusNo === 42) {
        this.cancelOfferVisible = !this.cancelOfferVisible
      } else {
        this.operations(order, method)
      }
    },
    operations(order, method) {
      const params = {
        candidateId: order.id,
        operateMethod: method,
        operatorType: 1,
        operatorUserId: this.$store.state.userInfo.userId
      }
      operation(params).then(res => {
        if (res.code === '000000') {
          this.$emit('getList')
          if (method === 7) {
            this.$router.push({
              path: '/reviewReport',
              query: {
                positionId: order.positionId,
                companyId: order.companyId,
                reportId: order.recommendReportId,
                resumeId: order.resumeId,
                orderId: order.id
              }
            })
          }
        }
      })
    },
    toDetail(id, resumeId) {
      this.orderId = id
      sessionStorage.setItem('resumeId', resumeId)
      this.orderVisible = true
    },
    reloadPage() {
      this.$emit('getList')
    },
    isInArray(arr, value) {
      arr.filter(item => {
        if (item.value * 1 === value) {
          return true
        } else {
          return false
        }
      })
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  .list {
    padding: 20px;
    background: #ffffff;
    // overflow: auto;
    .list-header,
    .list-item {
      display: flex;
      flex-direction: row;
      padding-bottom: 12px;
      li {
        font-size: 14px;
        color: #4d4d4d;
        line-height: 20px;
        margin-right: 56px;
        &:last-child {
          margin: 0;
        }
      }
      .list-item-name {
        width: 42px;
        width: 5.25%;
      }
      .list-item-position {
        width: 201px;
        width: 25.125%;
        cursor: pointer;
      }
      .list-item-state {
        width: 72px;
        width: 9%;
      }
      .list-item-step {
        width: 56px;
        width: 7%;
      }
      .list-item-date {
        width: 79px;
        width: 9.875%;
      }
    }
    .list-header {
      li {
        color: #1a1a1a;
        font-weight: 600;
      }
    }
    .list-item {
      padding: 20px 0;
      background: url('~@/assets/images/order/cut-off_rule.png') repeat-x;
      background-size: 100%;
      &:last-child {
        padding-bottom: 0;
      }
      li {
        color: #1a1a1a;
      }
      .list-item-name {
        font-weight: 600;
      }
      .list-item-position {
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p:first-child {
          font-weight: 600;
          color: #1a1a1a;
        }
        p:last-child {
          margin-top: 8px;
          color: #808080;
        }
        p {
          &:hover {
            color: #1678f9;
            text-decoration: underline;
          }
        }
      }
      .list-item-state {
        p {
          font-size: 12px;
          color: #1678f9;
          line-height: 17px;
          text-align: center;
          border: 1px solid #1678f9;
          border-radius: 2px;
          padding: 2px 4px;
          box-sizing: border-box;
        }
      }
      .list-item-step,
      .list-item-date {
        color: #808080;
        // p:last-child {
        //   margin-top: 8px;
        // }
      }
      .list-item-operation {
        .el-button {
          width: 92px;
          height: 28px;
          color: #ffffff;
          background: #1678f9;
          padding: 7px 0;
          margin-bottom: 8px;
        }
      }
    }
  }
  .page {
    text-align: center;
    margin-top: 10px;
    .el-pagination.is-background .el-pager li {
      background-color: #ededed;
    }
  }
  .draft {
    ::v-deep .fix-drawer .drawer-detail-inner {
      background: #ffffff;
    }
    ::v-deep .icon-newWindow {
      display: none;
    }
  }
}
</style>
