<template>
  <div
    class="customer-account"
  >
    <el-tabs v-model="activeName" size="small" class="mtv-15" @tab-click="handleTab">
      <el-tab-pane name="baseInfo">
        <span slot="label">
          基本信息
        </span>
        <div class="header">
          <p class="title">编辑客户信息</p>
        </div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          :label-width="slotPage === 'releasePositionPage' ? '90px' : '145px'"
          class="ruleForm"
        >
          <!-- 基本资料 -->
          <p class="title1">基本资料</p>
          <el-form-item label="公司名称" prop="name" size="small">
            <el-input v-model="ruleForm.name" :disabled="$props.operatorType === 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="对外名称" prop="replaceName" size="small">
            <el-input v-model="ruleForm.replaceName"></el-input>
          </el-form-item>
          <el-form-item label="公司规模" prop="scale" size="small">
            <el-select v-model="ruleForm.scale" placeholder="请选择公司规模" style="width: 100%;">
              <el-option
                v-for="item in dictData.dicts.enterpriseScale"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="公司行业" prop="industry" size="small">
            <el-select v-model="ruleForm.industry" placeholder="请选择公司行业" style="width: 100%;">
              <el-option
                v-for="item in dictData.industry"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="公司性质" prop="style" size="small">
            <el-select v-model="ruleForm.style" placeholder="请选择公司性质" style="width: 100%;">
              <el-option
                v-for="item in dictData.dicts.enterpriseProperty"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-row class="two-row">
            <el-col :span="slotPage === 'releasePositionPage' ? 10 : 12">
              <el-form-item label="公司地址" prop="areas" size="small">
                <el-cascader v-model="ruleForm.areas" :options="areas" clearable style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="slotPage === 'releasePositionPage' ? 14 : 12">
              <el-form-item prop="address" size="small" label-width="10px">
                <el-input v-model="ruleForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="公司介绍" prop="introduce" size="small">
            <el-input
              v-model="ruleForm.introduce"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              maxlength="2000"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="公司LOGO" prop="logoWeb" size="small">
            <el-upload
              v-loading="uploadLoading"
              class="avatar-uploader"
              :data="paramsData"
              :action="uploadAction"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="ruleForm.logoWeb" :src="ruleForm.logoWeb" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="desc">请上传长宽1:1比例的图片</p>
          </el-form-item>
          <!-- 合作信息 -->
          <p class="title1">合作信息</p>
          <el-form-item label="合作状态" prop="customerCooperationStatus" size="small">
            <el-radio-group v-model="ruleForm.customerCooperationStatus">
              <el-radio v-for="(item,index) in dictData.dicts.customerCooperationStatus" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户负责人" prop="customerPmId" size="small">
            <el-select v-model="ruleForm.customerPmId" placeholder="请选择客户负责人" style="width: 100%;" :disabled="companyRole !== 4">
              <el-option
                v-for="item in userIdsArr"
                :key="item.value"
                :label="item.trueName"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" size="small" :loading="loading" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="contacter">
        <span slot="label">
          客户账号
        </span>
        <p class="tip">在这里您可以为客户开启端口账号，授权客户使用客户自己的手机号登录客户后台，以便客户自行查看项目数据。</p>
        <p class="tip">账户开通后，客户使用以下网址即可登录后台（ {{ url }} <span class="copy" @click="copyCode(url)">点击复制</span> ）</p>
        <div class="operate-div">
          <el-button type="primary" icon="el-icon-plus" size="small" :loading="loading" @click="newAccount">新增客户账号</el-button>
        </div>
        <!-- 表格 -->
        <el-table
          v-loading="listLoading"
          :data="listData"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          row-class-name="tableRowClassName"
        >
          <el-table-column label="姓名" prop="remarkName" align="center" >
            <template slot-scope="scope">
              <span style="font-size:16px;color:#909399;">{{ scope.row.remarkName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="userMobile" align="center">
            <template slot-scope="scope">
              <span style="font-size:16px;color:#909399;">{{ scope.row.userMobile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" align="center">
            <template slot-scope="scope">
              <span style="font-size:16px;color:#909399;">{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="editIt(scope.row)">修改</el-button>
              <el-popconfirm title="是否删除该客户账号？" @onConfirm="delIt(scope.row.customerUserId)">
                <el-button slot="reference" type="text" size="mini" class="ml-10" >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          size="mini"
          class="mt-10"
          background
          :current-page="pageNumber"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 新增联系人 -->
    <el-dialog
      title="新增联系人"
      :visible.sync="accountVisible"
      append-to-body
      :close-on-click-modal="false"
      class="account-modal"
      width="600px"
      @close="closeIt"
    >
      <el-form
        ref="accountForm"
        :model="accountForm"
        :rules="accountFormRules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="手机号" prop="userMobile" class="name-input">
          <el-input v-model="accountForm.userMobile" :disabled="disabledIt" maxlength="11" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="姓名" prop="remarkName" class="name-input">
          <el-input v-model="accountForm.remarkName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="accountForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeIt">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveAccount('accountForm')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { getCompanyDetail, editCompany, addCompany, saveCustomerUser, customerSearchPage, deleteByCustomerUserId } from '@/api/company'
import {
  findMemberVOList
} from '@/api/releasePosition'

export default {
  props: {
    operatorType: {
      type: String,
      default: ''
    },
    companyId: {
      type: Number,
      default: null
    },
    backTo: {
      type: String,
      default: ''
    },
    slotPage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      disabledIt: false,
      url: '',
      uploadLoading: false,
      userIdsArr: [],
      pageNumber: 1,
      pageSize: 20,
      total: 0,
      listData: [],
      listLoading: false,
      activeName: 'baseInfo',
      loading: false,
      paramsData: {},
      uploadAction: '/api/common/upload',
      uploadHeader: Object.assign(
        {
          'x-client-token': Vue.ls.get('x-client-token')
        },
        {}
      ),
      limit: 9,
      companyParamsData: {},
      videoParamsData: {},
      uploadCompanyImgsAction: '/api/company/upload',
      areas: [], // 地区
      ruleForm: {
        customerPmId: '',
        customerCooperationStatus: '',
        name: '',
        shortName: '',
        replaceName: '',
        areas: [],
        address: '',
        scale: '',
        industry: '',
        style: '',
        logo: '',
        logoWeb: '',
        introduce: '',
        fileList: [],
        companyPictures: [],
        companyVideo: '',
        companyVideoWeb: '',
        companyWxMp: '',
        website: '',
        companyWxQr: '',
        companyWxQrUrl: '',
        companyWzLogo: '',
        companyWzLogoUrl: '',
        companyWzFirstLogo: '',
        companyWzFirstLogoUrl: '',
        companyWzMpQr: '',
        companyWzMpQrUrl: ''
      },
      companyImgs: [],
      rules: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        shortName: [
          { required: true, message: '请输入公司简称', trigger: 'blur' }
        ],
        replaceName: [
          { required: true, message: '请输入对外名称', trigger: 'blur' }
        ],
        areas: [
          { required: true, message: '请选择公司地址', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入公司详细地址', trigger: 'blur' }
        ],
        scale: [
          { required: true, message: '请选择公司规模', trigger: 'change' }
        ],
        industry: [
          { required: true, message: '请选择公司行业', trigger: 'change' }
        ],
        style: [
          { required: true, message: '请选择公司性质', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入公司介绍', trigger: 'blur' }
        ],
        logoWeb: [{ required: false, message: '请上传公司LOGO' }],
        contactUserName: [{ required: true, message: '请输入联系人姓名' }],
        contactUserMobile: [{ required: true, message: '请输入联系人电话' }]
      },
      accountForm: {},
      accountFormRules: {
        userMobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        remarkName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ]
      },
      accountVisible: false,
      companyRole: null
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: (state) => state.userInfo,
      selfCompanyId: state => state.userInfo.companyId
    })
  },
  watch: {
    dictData(val) {
      this.areas = this.dictData.areas
      this.areas.map(item => {
        item.children &&
          item.children.map(x => {
            x.children &&
              x.children.map(y => {
                delete y.children
              })
          })
      })
    }
  },
  created() {
    const { companyRole } = this.userInfo
    this.companyRole = companyRole - 0
    console.log('角色', companyRole)
    const host = window.location.host
    console.log('host', host)
    this.url = host + '/login?loginType=fast'
    this.areas = this.dictData.areas
    this.areas.map(item => {
      item.children &&
        item.children.map(x => {
          x.children &&
            x.children.map(y => {
              delete y.children
            })
        })
    })
  },
  mounted() {
      this.getDetail()
      this.findMemberVOList()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNumber = val
      this.customerSearchPage()
    },
    closeIt() {
      this.accountVisible = false
      this.accountForm = {}
    },
    editIt(row) {
      this.accountForm = JSON.parse(JSON.stringify(row))
      this.accountVisible = true
      this.disabledIt = true
    },
    delIt(customerUserId) {
      this.deleteByCustomerUserId(customerUserId)
    },
    // 复制
    copyCode(data) {
      const url = data
      const oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    newAccount() {
        this.accountVisible = true
        this.disabledIt = false
    },
    findMemberVOList() {
      const params = {
        searchName: this.userIdSearchName
      }
      findMemberVOList(params).then((res) => {
        const { code, data } = res
        if (code === '000000') {
          const arr = []
          data &&
            data.filter((item) => {
              item.memberDTOs &&
                item.memberDTOs.filter((itemInner) => {
                  arr.push({
                    value: itemInner.id,
                    gender: itemInner.gender,
                    visitAvatarUrl: itemInner.visitAvatarUrl,
                    label: itemInner.nickName,
                    trueName: itemInner.trueName
                  })
                })
            })
          this.userIdsArr = arr
        }
      })
    },
    customerSearchPage() {
      this.listLoading = true
      const params = {
        companyId: this.$props.companyId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      customerSearchPage(params).then((res) => {
        this.listLoading = false
        const { code, data } = res
        if (code === '000000') {
          this.total = data.total
          this.listData = data.records
          console.log('total', this.total)
        }
      })
    },
    handleTab(e) {
      console.log(e)
      if (e.name === 'contacter') {
        this.customerSearchPage()
      }
    },
    // 公司详情
    getDetail() {
      const params = {
        companyId: this.$props.companyId
      }
      console.log('companyId', this.$props.companyId)
      this.$props.companyId && getCompanyDetail(params).then(res => {
        this.ruleForm.name = res.data.company.name
        this.ruleForm.shortName = res.data.company.shortName
        this.ruleForm.replaceName = res.data.company.replaceName
        this.ruleForm.areas =
          res.data.company.provinceId &&
          res.data.company.cityId &&
          res.data.company.areaId
            ? [
                res.data.company.provinceId,
                res.data.company.cityId,
                res.data.company.areaId
              ]
            : []
        console.log('11111111地址', this.ruleForm.areas)
        this.ruleForm.address = res.data.company.address
        this.ruleForm.scale =
          res.data.company.scale && res.data.company.scale + ''
        this.ruleForm.industry =
          res.data.company.industrys1 && res.data.company.industrys1 + ''
        this.ruleForm.style =
          res.data.company.style && res.data.company.style + ''
        this.ruleForm.logo = res.data.company.logo
        this.ruleForm.logoWeb = res.data.logoImg
        this.ruleForm.introduce = res.data.introduce || ''
        this.ruleForm.customerCooperationStatus = res.data.company.customerCooperationStatus + '' || ''
        this.ruleForm.customerPmId = res.data.company.customerPmId || ''
        res.data.companyPictureImgs &&
          res.data.companyPictureImgs.forEach((item, i) => {
            this.ruleForm.fileList.push({ url: item })
            res.data.companyPictures &&
              res.data.companyPictures.forEach((items, j) => {
                if (i === j) {
                  this.companyImgs.push({
                    url: item,
                    companyPicture: items.companyPicture
                  })
                }
              })
          })
        this.ruleForm.companyVideo = res.data.companyVideo
        this.ruleForm.companyVideoWeb = res.data.companyVideoUrl
        this.ruleForm.companyWxMp = res.data.companyWxMp
        this.ruleForm.website = res.data.company.website
        this.ruleForm.companyWxQr = res.data.companyWxQr
        this.ruleForm.companyWxQrUrl = res.data.companyWxQrUrl
        this.ruleForm.companyWzLogo = res.data.companyWzLogo
        this.ruleForm.companyWzLogoUrl = res.data.companyWzLogoUrl
        this.ruleForm.companyWzFirstLogo = res.data.companyWzFirstLogo
        this.ruleForm.companyWzFirstLogoUrl = res.data.companyWzFirstLogoUrl
        this.ruleForm.companyWzMpQr = res.data.companyWzMpQr
        this.ruleForm.companyWzMpQrUrl = res.data.companyWzMpQrUrl
        console.log(this.ruleForm)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$props.slotPage === 'releasePositionPage' &&
            this.$emit('getCompanyValid', true) // 发布职位method
          this.loading = true
          this.editCompany()
        } else {
          this.$props.slotPage === 'releasePositionPage' &&
            this.$emit('getCompanyValid', false) // 发布职位method
          console.log('error submit!!')
          return false
        }
      })
    },
    saveAccount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveCustomerUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteByCustomerUserId(customerUserId) {
      const params = {
        customerUserId
      }
      deleteByCustomerUserId(params).then(res => {
        if (res.code === '000000') {
          this.$message.success('删除成功')
          this.customerSearchPage()
        }
      })
    },
    // 编辑企业
    editCompany() {
      const companyImgs = this.companyImgs
      this.ruleForm.companyPictures = []
      companyImgs.forEach(item => {
        if (item.response) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.response.data[0].dbPath
          })
        } else if (item.companyPicture) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.companyPicture
          })
        }
      })
      console.log(companyImgs, this.ruleForm.companyPictures)
      const params = {
        customerPmId: this.ruleForm.customerPmId,
        customerCooperationStatus: this.ruleForm.customerCooperationStatus,
        id: this.$props.companyId,
        name: this.ruleForm.name,
        shortName: this.ruleForm.shortName,
        replaceName: this.ruleForm.replaceName,
        provinceId: this.ruleForm.areas[0],
        cityId: this.ruleForm.areas[1],
        areaId: this.ruleForm.areas[2],
        address: this.ruleForm.address,
        scale: this.ruleForm.scale,
        industrys1: this.ruleForm.industry,
        style: this.ruleForm.style,
        logo: this.ruleForm.logo,
        introduce: this.ruleForm.introduce,
        companyPictures: this.ruleForm.companyPictures,
        companyVideo: this.ruleForm.companyVideo,
        companyWxMp: this.ruleForm.companyWxMp,
        website: this.ruleForm.website,
        companyWxQr: this.ruleForm.companyWxQr,
        companyWzLogo: this.ruleForm.companyWzLogo,
        companyWzFirstLogo: this.ruleForm.companyWzFirstLogo,
        companyWzMpQr: this.ruleForm.companyWzMpQr
      }
      editCompany(params).then(res => {
        if (res.code === '000000') {
          this.$props.slotPage !== 'releasePositionPage' &&
            this.$message.success('保存成功')
          this.loading = false
          if (this.backTo === 'postionDetail') {
            this.$router.push('/job')
          } else {
            this.$emit('reload')
          }
        }
      })
    },
    saveCustomerUser() {
      const params = this.accountForm
      params.companyId = this.$props.companyId
      delete params.userId
      console.log('参数', params)
      saveCustomerUser(params).then(res => {
        if (res.code === '000000') {
          this.$message.success('保存成功')
          this.accountVisible = false
          this.customerSearchPage()
        }
      })
    },
    // 新增企业
    addCompany() {
      const companyImgs = this.companyImgs
      this.ruleForm.companyPictures = []
      companyImgs.forEach(item => {
        if (item.response) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.response.data[0].dbPath
          })
        } else if (item.companyPicture) {
          this.ruleForm.companyPictures = this.ruleForm.companyPictures.concat({
            companyPicture: item.companyPicture
          })
        }
      })
      console.log(companyImgs, this.ruleForm.companyPictures)
      const params = {
        customerCooperationStatus: this.ruleForm.customerCooperationStatus,
        name: this.ruleForm.name,
        shortName: this.ruleForm.shortName,
        replaceName: this.ruleForm.replaceName,
        provinceId: this.ruleForm.areas[0],
        cityId: this.ruleForm.areas[1],
        areaId: this.ruleForm.areas[2],
        address: this.ruleForm.address,
        scale: this.ruleForm.scale,
        industrys1: this.ruleForm.industry,
        style: this.ruleForm.style,
        logo: this.ruleForm.logo,
        introduce: this.ruleForm.introduce,
        companyPictures: this.ruleForm.companyPictures,
        companyVideo: this.ruleForm.companyVideo,
        companyWxMp: this.ruleForm.companyWxMp,
        website: this.ruleForm.website,
        companyWxQr: this.ruleForm.companyWxQr,
        companyWzLogo: this.ruleForm.companyWzLogo,
        companyWzFirstLogo: this.ruleForm.companyWzFirstLogo,
        companyWzMpQr: this.ruleForm.companyWzMpQr
      }
      addCompany(params).then(res => {
        this.loading = false
        if (res.code === '000000') {
          this.$message.success('保存成功')
          this.$emit('closeDrawer', res.data)
          this.$emit('reload')
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.ruleForm.customerPmId = null
      this.ruleForm.customerCooperationStatus = null
      this.ruleForm.shortName = null
      this.ruleForm.replaceName = null
      this.ruleForm.areas = []
      this.ruleForm.address = null
      this.ruleForm.scale = null
      this.ruleForm.industry = null
      this.ruleForm.style = null
      this.ruleForm.logo = null
      this.ruleForm.logoWeb = null
      this.ruleForm.introduce = null
      this.ruleForm.fileList = []
      this.ruleForm.companyPictures = []
      this.ruleForm.companyVideo = null
      this.ruleForm.companyVideoWeb = null
      this.ruleForm.companyWxMp = null
      this.ruleForm.website = null
      this.ruleForm.companyWxQr = null
      this.ruleForm.companyWxQrUrl = null
      this.ruleForm.companyWzLogo = null
      this.ruleForm.companyWzLogoUrl = null
      this.ruleForm.companyWzFirstLogo = null
      this.ruleForm.companyWzFirstLogoUrl = null
    },
    // 上传企业logo
    beforeAvatarUpload(file) {
      this.uploadLoading = true
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleAvatarSuccess(res, file) {
      this.uploadLoading = false
      if (res.code === '000000') {
        this.ruleForm.logo = res.data && res.data.dbPath
        this.ruleForm.logoWeb = res.data && res.data.webPath
        console.log(this.ruleForm.logoWeb)
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    // 上传企业图片
    beforeCompanyImgsUpload(file) {
      this.companyParamsData.ossFileType = 'companyPicture'
    },
    handleCompanyImgsSuccess(res, file) {
      if (res.code === '000000') {
        this.companyImgs = this.companyImgs.concat(file)
        console.log('返回', this.companyImgs)
        // this.$message({
        //   message: '上传成功',
        //   type: 'success'
        // })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    handleExceed(file, fileList) {
      if (file.length > this.limit) {
        this.$message({
          message: `最多上传${this.limit}张图片`,
          type: 'error'
        })
      }
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.companyImgs.forEach((item, idx) => {
        if (file.url === item.url) {
          this.companyImgs.splice(idx, 1)
        }
      })
    },
    // 上传企业视频
    beforeVideoUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (
        [
          'video/mp4',
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb'
        ].indexOf(file.type) === -1
      ) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt50M) {
        this.$message.error('上传视频大小不能超过50MB哦!')
        return false
      }
      this.videoParamsData.ossFileType = 'companyVideo'
    },
    handleVideoSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyVideo = res.data && res.data.dbPath
        this.ruleForm.companyVideoWeb = res.data && res.data.webPath
        console.log(this.ruleForm.companyVideoWeb)
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    // 上传公众号
    beforeWxQrUpload(file) {
      this.paramsData.ossFileType = 'companyWxQr'
    },
    handleWxQrSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWxQr = res.data && res.data.dbPath
        this.ruleForm.companyWxQrUrl = res.data && res.data.webPath
        console.log(this.ruleForm.logoWeb)
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    // 上传主页背景
    beforeWzLogoUpload(file) {
      this.paramsData.ossFileType = 'companyWzBack'
    },
    handleWzLogoSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWzLogo = res.data && res.data.dbPath
        this.ruleForm.companyWzLogoUrl = res.data && res.data.webPath
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    // 上传大logo
    beforeFirstLogoUpload(file) {
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleFirstLogoSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWzFirstLogo = res.data && res.data.dbPath
        this.ruleForm.companyWzFirstLogoUrl = res.data && res.data.webPath
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    },
    // 微站公众号二维码
    beforeWzMpQrUpload(file) {
      this.paramsData.ossFileType = 'companyLogo'
    },
    handleWzMpQrSuccess(res, file) {
      if (res.code === '000000') {
        this.ruleForm.companyWzMpQr = res.data && res.data.dbPath
        this.ruleForm.companyWzMpQrUrl = res.data && res.data.webPath
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-account{
  padding: 16px;
  box-sizing: border-box;
}
.tableRowClassName .cell,.tableRowClassName td, .tableRowClassName th {
  font-size: 14px;
}
.tableRowClassName .el-table__empty-block{
    height: auto !important;
}
.avatar-uploader{
  width: 150px;
}
::v-deep .el-tabs__nav-wrap::after{
  background-color: #E4E7ED !important;
}
.operate-div{
  margin: 15px auto;
}
.tip{
    font-size: 14px;
    color: #666;
    line-height: 24px;
}
.copy {
  color: #1678f9;
  font-size: 14px;
  cursor: pointer;
}
.edit {
  padding: 16px;
  .el-radio-group{
    vertical-align: middle;
    height: 32px;
    line-height: 32px;
    .el-radio{
      height: 32px;
      line-height: 32px;
    }
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #14171a;
      line-height: 22px;
    }
  }
  .ruleForm {
    .title1 {
      font-size: 14px;
      color: #333;
      margin: 15px 0 20px;
    }
    ::v-deep .el-form-item__content {
      position: relative;
      .desc {
        font-size: 13px;
        position: absolute;
        left: 160px;
        bottom: 0;
      }
    }
  }
  .avatar-uploader {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
    object-fit: contain;
  }
}
</style>
