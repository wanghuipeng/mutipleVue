<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="450px"
    lock-scroll
    :show-close="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <div class="main">
      <div class="main-content">
        <div class="title">平台用户协议</div>
        <div class="body">
          <div class="area">
            <div class="area-title">一、总则</div>
            <div class="area-body">
              1. 上海大猎英才科技有限公司（以下称：平台）同意按照本协议的规定及其不时发布的操作规则提供平台（dalieyingcai.com）网络服务，为获得平台所提供的服务，使用人（以下称“用户”）应当同意本协议的全部条款，其注册、使用以及获取平台服务的行为应遵守本协议与有关书面协议的规定，用户应仔细阅读本协议，如在注册时勾选“同意”按钮后，即视为用户已完全理解并接受本协议项下的全部条款；用户完成注册后，需主动对个人信息进行实名认证，平台工作人员会对用户实名注册信息进行审核，审核通过后即代表用户完成了实名认证。
              <br />2. 用户完成注册后，应自行妥善保管其注册的帐号和密码，用户应当对以其用户帐号进行的所有行为承担法律责任。
              <br />3. 平台有权在必要时修改本协议内容，并以平台通知或其它方式通知用户，如果用户不同意本协议变更后的内容，应在通知发出后的3 个工作日内通知平台，则用户将不再受本协议的约束，其所享有的用户权限与服务也将中止；如用户继续使用本平台，将被视为同意协议变更后的内容。
            </div>
          </div>
          <div class="area">
            <div class="area-title">二、用户使用规则</div>
            <div class="area-body">
              1. 用户使用服务的行为须遵守中华人民共和国相关法律法规。
              <br />2. 用户在申请使用平台时，必须向平台提供真实、准确的用户个人资料，如用户资料有任何变动，必须及时更新，若因用户未及时更新资料或其提供的资料不真实、不准确所造成的不利后果由用户自行承担，平台有权在此情况下中止为用户提供网络服务。
              <br />3. 用户不应将其帐号、密码转让或出借予他人使用，如用户违反本条款，由此产生的风险、损失及其他不利后果需由用户自行承担；如用户发现帐号遭他人非法使用，应立即通知平台；如因非法网络行为或用户的自身原因（如未妥善保管账号等）导致帐号、密码遭他人非法使用，平台不承担任何责任；
              <br />4. 用户对其自行发表、上传或传送的内容负全部责任，所有用户不得在平台的任何页面发布、转载、传送含有下列内容之一的信息，否则平台有权自行处理并不通知用户：
              <br />
              <span class="space"></span>（1） 违反国家相关法律法规确定的基本原则的；
              <br />
              <span class="space"></span>（2） 危害国家安全，泄漏国家机密，颠覆国家政权，破坏国家统一的；
              <br />
              <span class="space"></span>（3） 损害国家荣誉和利益的；
              <br />
              <span class="space"></span>（4） 煽动民族仇恨、民族歧视，破坏民族团结的；
              <br />
              <span class="space"></span>（5） 破坏国家宗教政策，宣扬邪教和封建迷信的；
              <br />
              <span class="space"></span>（6） 散布谣言，扰乱社会秩序，破坏社会稳定的；
              <br />
              <span class="space"></span>（7） 散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；
              <br />
              <span class="space"></span>（8） 侮辱或者诽谤他人，侵害他人合法权益的；
              <br />
              <span class="space"></span>（9） 煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的；
              <br />
              <span class="space"></span>（10） 以非法民间组织名义活动的；
              <br />
              <span class="space"></span>（11） 含有法律、行政法规禁止的其他内容的。
              <br />5. 用户在使用平台提供的服务同时应做到：
              <br />
              <span class="space"></span>（1） 遵守所有与网络服务有关的网络协议、规定和程序；
              <br />
              <span class="space"></span>（2） 不得为任何非法目的而使用网络服务系统；
              <br />
              <span class="space"></span>（3） 不得侵犯其他任何第三方的专利权、著作权、商标权、名誉权或其他任何合法权益；
              <br />
              <span class="space"></span>（4） 用户不得通过任何技术手段侵入平台数据库，进行查阅、直接下载或者转发等功能操作，一经发现平台有权停止该用户的账户所有功能及服务。
              <br />
              <span class="space"></span>（5） 用户有义务保证其在平台上上传资料的授权及真实性，不得夸张描述或编造虚假信息，一经发现平台有权停止相应账户的所有功能及服务。
              <br />
              <span class="space"></span>（6） 用户不得将平台上提供或发布的的任何信息用于使平台利益受损的用途（包括但不限于：跳过平台同本协议外的任何第三方进行合作、到任何第三方平台发布该等信息等）。一经发现平台有权封停用户的账号并停止提供服务且无须征得用户的同意或提前通知用户，用户的上述行为给平台造成损失时，平台有权要求用户赔偿平台由此遭受的全部损失。
              <br />6. 如用户违反以上规则造成平台被第三方索赔的，用户应全额补偿平台一切费用(包括但不限于各种赔偿费、诉讼代理费及为此支出的其它合理费用)；
              <br />7. 如用户违反以上规则，平台有权要求用户改正或直接采取一切必要措施（包括但不限于：删除用户上传的内容、暂停或终止用户使用服务的权利）以减轻或避免因用户的不当行为而造成的损害或产生的不良影响。
              <br />8. 用户承诺其在使用服务的过程中，将遵守平台不定时发布的平台使用规则，用户同时承诺，在其参加通过平台发起或举办的线上活动时，应同时遵守平台发布的活动规则。用户违反上述承诺时，平台有权依据本协议及有关规则的规定，做出相应处理或终止向用户提供服务，且无须征得用户的同意或提前通知用户。
              <br />9. 平台有权拒绝为与本单位经营同类业务、有业务竞争关系或者其他利害关系的单位及个人提供服务。
            </div>
          </div>
          <div class="area">
            <div class="area-title">三、数据收集与应用</div>
            <div class="area-body">
              1. 当注册成为平台用户时，您将会向平台提供您的个人信息，包括但不限于联系人的姓名、手机号、电子邮箱、服务领域等，在平台向您提供相关服务的过程中，您也可能向平台提供他人授权后的个人信息，包括姓名、联系方式等，平台不会从您的电脑、手机等终端主动提取您未提供给平台的相关信息。就您提供的信息，平台的系统会自动储存。
              <br />2. 用户在向平台提供第三人的信息时，应保证其对于第三人信息的收集、使用的行为与目的均已获得了被收集者的明示理解与同意（即授权）。用户保证其有权将被收集人的信息上传至平台，同时保证平台有权将该等信息基于盈利或其他商业目的而使用，平台在使用上述信息时不会受到被收集人的投诉、索赔或其他权利主张，如平台因使用用户提供的第三人信息而引起该被收集人的追责，用户应确保平台免收任何损害。
              <br />3. 在不透露用户个人隐私的前提下，平台有权将用户提供的信息录入数据库，并对整个数据库进行分析以及对数据库中的用户提供的部分或全部的信息用于盈利或其他商业上的用途。
            </div>
          </div>
          <div class="area">
            <div class="area-title">四、版权声明</div>
            <div class="area-body">
              1. 平台特有的标识、版面设计、编排方式、等版权均属平台享有，未经平台许可，不得任意复制或转载。
              <br />2. 平台用户发布的所有内容仅代表发布者的立场和观点，与平台无关，由信息发布者承担一切法律责任。
            </div>
          </div>
          <div class="area">
            <div class="area-title">五、免责声明</div>
            <div class="area-body">
              1. 用户明确同意其使用平台提供的服务所存在的风险将完全由其自己承担；因其使用平台服务而产生的一切后果也由其自己承担，平台对用户不承担任何责任。
              <br />2. 平台不保证服务一定能满足用户的需求，也不保证其所提供的服务不会中断，对服务的及时性、安全性、准确性也不作保证。同时，平台不保证所提供的服务能够长期无误的运营，也不保证服务器不会受到来自计算机病毒或其他故障的侵扰。
              <br />3. 平台将采取适当的技术措施和其他必要措施维护用户的信息安全，但此等措施并不是万全的，用户理解并同意，如果用户在使用本平台时发生数据丢失的情况，应及时通知平台，平台将协助用户采取必要的补救措施，但相关补救措施并不能保证用户的数据得以完全修复或恢复。用户理解并同意此类数据丢失的情况与平台无关，且不会就相关补救措施的过程和结果向平台主张任何权利或追究任何责任。
              <br />4. 平台对所有信息、文本、图形、链接及其它项目的准确性和完整性也都不作保证，这些信息仅供用户参考使用。
              <br />5. 用户必须独自承担由于使用平台或通过平台登录到其他站点而形成的全部风险，并独立承担与他人交流信息所造成的后果。平台不担保用户发送或接收的资料的真实性、精确性与可靠性。用户对所接受的资料的信任纯属个人风险。
              <br />6. 用户在通过平台得到资讯和信息后，其跳过平台所进行的任何线下交易均系其个人自主交易，平台有权追究用户相关的违约责任，如用户与线下交易方发生纠纷，皆与平台无关，平台不承担任何法律责任；本平台对于用户由于使用平台而造成的任何金钱、商誉、名誉的损失，或任何特殊的、间接的、或结果性的损失都不负任何责任。
            </div>
          </div>
          <div class="area">
            <div class="area-title">六、违约认定及处理措施</div>
            <div class="area-body">
              1. 发生如下情形之一的，视为您违约：
              <br />
              <span class="space"></span>（1） 使用本平台提供的服务时违反有关法律法规规定的；
              <br />
              <span class="space"></span>（2） 违反本协议约定的相关行为；
              <br />2. 平台可在其它规则中约定违约认定的程序和标准。
              <br />3. 如用户账号内存在数据异常，用户有义务对其在平台上所产生的数据异常现象进行充分举证和合理解释，否则将被认定为违约。
              <br />4. 平台发现用户在平台上发布的信息构成违约时，平台可根据相应规则立即对相应信息进行删除、屏蔽处理、中止向用户提供部分或全部服务。如用户的行为构成严重违约的，平台有权查封此账户并终止向用户提供服务。
              <br />5. 用户在平台上实施的行为，或虽未在平台上实施但对平台及其他用户产生影响的行为构成违约的，平台可依据相应规则对用户按前款约定进行处理。
              <br />6. 如用户因违约而被终止服务后，平台仍享有下列权利：
              <br />
              <span class="space"></span>（1） 继续保存您留存于平台的各类信息；
              <br />
              <span class="space"></span>（2） 对于您过往的违约行为，平台仍可依据本协议向您追究违约责任。
              <br />7. 平台可将对您上述违约行为处理措施信息以及其他经国家行政或司法机关生效法律文书确认的违法信息在平台上、社区、自媒体或其他媒体上予以公示，届时一切后果由用户自行承担。
            </div>
          </div>
          <div class="area">
            <div class="area-title">七、通知送达</div>
            <div class="area-body">
              1. 本协议要求的所有通知、要求和其他通信，均应以电话、电子邮件或平台站内通知等方式发送。
              <br />2. 若以电子邮件发送，于电子邮件成功发送的报告时即可认为通知已正式送达.
              <br />3. 若以站内通知方式发送，于发送后3个工作日即应认为通知已正式到达。
            </div>
          </div>
          <div class="area">
            <div class="area-title">八、不可抗力</div>
            <div
              class="area-body"
            >如果发生不可抗力事件，影响一方履行其在本协议条款或平台其它协议中的义务，则在不可抗力造成的延误期内中止履行，而不视为违约。“不可抗力”指在本特殊条款中签署后发生的、本特殊条款中签署时不能预见的、其发生与后果是无法避免或克服的、妨碍任何一方全部或部分履约的所有事件。上述事件包括地震、台风、水灾、火灾、战争、国际或国内运输中断、流行病、罢工，以及根据中国法律或一般国际商业惯例认作不可抗力的其他事件。</div>
          </div>
          <div class="area">
            <div class="area-title">九、法律管辖</div>
            <div class="area-body">
              1. 本协议的订立、执行和解释及争议的解决均应适用中国法律并受中国法院管辖。
              <br />2. 如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向平台所在地的人民法院提起诉讼。
            </div>
          </div>
          <div class="area">
            <div class="area-title">十、可分性</div>
            <div class="area-body">如本协议的任一条款被认定为或视为废止、无效或不可执行，不影响本协议其余条款的有效性及可执行性。</div>
          </div>
        </div>
      </div>
      <div class="main-check">
        <el-checkbox v-model="checked">我已阅读并同意上述参展须知</el-checkbox>
      </div>
    </div>
    <span slot="footer">
      <el-button class="cancel-btn" @click="handleClose">取消</el-button>
      <el-button class="confirm-btn" @click="handleSubmit">确认参展</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addJobFairCompany } from '@/api/jobfair'
export default {
  data() {
    return {
      title: '您好，请确认参展协议',
      visible: false,
      checked: true,
      // 编辑表单
      editForm: {}
    }
  },
  computed: {
    selectedData() {
      return this.$store.state.common.selectedData
    },
    dictData() {
      return this.$store.state.common.dictData
    }
  },
  mounted() {},
  methods: {
    // 表单赋值
    edit(row) {
      this.visible = true
      this.$nextTick(() => {
        this.editForm = Object.assign({}, row)
      })
    },
    // 确认参展
    handleSubmit() {
      if (this.checked) {
        const para = {}
        para.jobFairId = this.editForm.jobFairId
        addJobFairCompany(para).then(res => {
          this.handleClose()
          this.$emit('joinSuccess')
        })
      } else {
        this.$message('请阅读并同意上述参展须知');
      }
    },
    // 关闭模态框
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/jobfair/common.scss';
::v-deep .el-dialog__header {
  padding: 20px;
  .el-dialog__title{
    font-size: 14px;
    color: #15181B;
  }
}
::v-deep .el-dialog__body {
  padding: 0 20px;
  .main {
    .main-content {
      padding: 12px;
      height: 240px;
      border-radius:4px;
      border: 1px solid rgba(205,205,205,1);
      overflow: auto;
      margin-bottom: 18px;
      .title {
        text-align: center;
        font-size: 24px;
        color: #343434;
        margin-bottom: 20px;
      }
      .sub {
        text-indent: 2em;
        line-height: 24px;
        font-size: 14px;
        color: #4d4d4d;
        margin-bottom: 20px;
      }
      .body {
        .area {
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
          .area-title {
            font-size: 16px;
            color: #343434;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .area-body {
            line-height: 24px;
            font-size: 14px;
            color: #4d4d4d;
            .space {
              display: inline-block;
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 20px;
}
</style>
