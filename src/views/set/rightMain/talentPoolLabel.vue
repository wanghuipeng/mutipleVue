<template>
  <div class="app-container">
    <el-card class="main" shadow="never">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">人才库设置</el-breadcrumb-item>
        <el-breadcrumb-item>人才自定义标签</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="tip">在这里您可以管理人才库的统一自定义标签，以便规范化使用系统内的人才标签。</p>

      <!-- 新建人才库 -->
      <el-row class="addBtn">
        <el-dropdown placement="bottom" style="font-size: 12px; margin-left: 10px;">
          <span class="el-dropdown-link">
            <!-- <i class="el-icon-more" style="color: #409EFF; transform: rotate(90deg);"></i> -->
            <el-button type="primary" size="small" icon="el-icon-plus">新建</el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="addTags({}, '')">标签</el-dropdown-item>
            <el-dropdown-item @click.native="addTagGroups">分组</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>

      <el-card v-for="(item, index) in list" :key="index" class="list" shadow="hover">
        <div class="title">
          <p class="name">
            {{ item.userLabelPoolGroup.labelName }}
            <el-popover
              v-if="item.userLabelPoolGroup.remark"
              placement="top-start"
              title=""
              width="200"
              trigger="hover"
              :content="item.userLabelPoolGroup.remark"
            >
              <i slot="reference" class="el-icon-question" style="color: #999999;"></i>
            </el-popover>
          </p>
          <p v-if="item.userLabelPoolGroup.labelName !== '未分类'" class="btns">
            <el-button type="text" size="mini" icon="el-icon-plus" @click="addTags(item, item.userLabelPoolGroup.id)">添加标签</el-button>
            <el-dropdown placement="bottom" style="font-size: 12px; margin-left: 10px;">
              <span class="el-dropdown-link">
                <i class="el-icon-more" style="color: #409EFF; transform: rotate(90deg);"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editTagGroups(item)">修改</el-dropdown-item>
                <el-dropdown-item @click.native="delTagGroups(item)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
        </div>
        <p v-for="(items, idx) in item.userLabelPools" :key="idx" class="label">
          <el-popover
            placement="top-start"
            title=""
            width="40"
            trigger="hover"
          >
            <i class="el-icon-edit" @click="editTags(items, item.userLabelPoolGroup.id)"></i>
            <i class="el-icon-delete" style="margin-left: 10px;" @click="delTags(items)"></i>
            <el-tag slot="reference" size="small" effect="plain">{{ items.labelName }}</el-tag>
          </el-popover>
        </p>
      </el-card>

      <!-- 添加标签分组 -->
      <el-dialog
        v-if="tagGroupsDialogVisible"
        :title="tagGroupsType === 'add' ? '添加标签分组' : '编辑标签分组'"
        :visible.sync="tagGroupsDialogVisible"
        width="30%"
      >
        <el-form ref="tagGroupsForm" :model="tagGroupsForm" :rules="tagGroupsRules" size="small" label-width="100px">
          <el-form-item label="分组名称" prop="groupName">
            <el-input v-model="tagGroupsForm.groupName" placeholder="请输入分组名称" />
          </el-form-item>
          <el-form-item label="分组说明">
            <el-input
              v-model="tagGroupsForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入分组相关说明"
              maxlength="2000"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="tagGroupsDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveTagGroups('tagGroupsForm')">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 添加标签 -->
      <el-dialog
        v-if="tagsDialogVisible"
        :title="tagType === 'add' ? '添加标签' : '编辑标签'"
        :visible.sync="tagsDialogVisible"
        width="30%"
      >
        <el-form ref="tagsForm" :model="tagsForm" :rules="tagsRules" size="small" label-width="100px">
          <el-form-item label="标签名称" prop="tagName">
            <el-input v-model="tagsForm.tagName" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item label="标签分组">
            <el-select v-model="tagsForm.group" placeholder="请选择标签分组" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.userLabelPoolGroup.id"
                :label="item.userLabelPoolGroup.labelName"
                :value="item.userLabelPoolGroup.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="tagsDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveTags('tagsForm')">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 删除标签组 -->
      <el-dialog
        title="提示"
        :visible.sync="tagGroupsDialogDel"
        width="30%"
      >
        <span>确认移除该标签组</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="tagGroupsDialogDel = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="delGroups">删 除</el-button>
        </span>
      </el-dialog>

      <!-- 删除标签 -->
      <el-dialog
        title="提示"
        :visible.sync="tagsDialogDel"
        width="30%"
      >
        <span>确认移除该标签</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="tagsDialogDel = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="delTag">删 除</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  getUserLabelPoolOfCompany,
  addTalentLabelPoolOfCompany,
  editTalentLabelPoolOfCompany,
  deleteTalentLabelPoolOfCompany,
  addTalentLabelPool,
  editTalentLabelPool,
  deleteTalentLabelPool
} from '@/api/set/talentPool'
export default {
  data() {
    return {
      tagGroupsDialogVisible: false,
      tagsDialogVisible: false,
      tagGroupsDialogDel: false,
      tagsDialogDel: false,
      list: [],
      tagGroupsType: '',
      tagGroupsInfo: '',
      tagType: '',
      tagInfo: '',
      options: [],
      tagGroupsForm: {
        groupName: '',
        remark: ''
      },
      tagGroupsRules: {
        groupName: [
          { required: true, message: '请输入标签组名称', trigger: 'blur' }
        ]
      },
      tagsForm: {
        tagName: '',
        group: ''
      },
      tagsRules: {
        tagName: [
          { required: true, message: '请输入标签组名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      dictData: state => state.common.dictData,
      userInfo: state => state.userInfo
    })
  },
  created() {
    this.getList()
  },
  methods: {
    // 列表
    getList() {
      const params = {
        companyId: this.userInfo.companyId
      }
      getUserLabelPoolOfCompany(params).then(res => {
        console.log(res)
        this.list = res.data
        this.options = res.data.length > 0 ? res.data : []
      })
    },
    // 新建标签组弹窗
    addTagGroups() {
      this.tagGroupsType = 'add'
      this.tagGroupsInfo = {}
      this.tagGroupsForm.groupName = ''
      this.tagGroupsForm.remark = ''
      this.tagGroupsDialogVisible = true
    },
    // 编辑标签组弹窗
    editTagGroups(data) {
      this.tagGroupsType = 'edit'
      this.tagGroupsForm.groupName = data.userLabelPoolGroup.labelName
      this.tagGroupsForm.remark = data.userLabelPoolGroup.remark
      this.tagGroupsInfo = data
      this.tagGroupsDialogVisible = true
    },
    // 保存标签组
    saveTagGroups(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tagGroupsType === 'add') {
            const params = {
              companyId: this.userInfo.companyId,
              labelGroupType: 1,
              labelLevel: (this.list && this.list.length > 0 && this.list[this.list.length - 1] && this.list[this.list.length - 1].userLabelPoolGroup && this.list[this.list.length - 1].userLabelPoolGroup.labelLevel) + 1,
              labelName: this.tagGroupsForm.groupName,
              type: 1,
              remark: this.tagGroupsForm.remark
            }
            addTalentLabelPoolOfCompany(params).then(res => {
              this.tagGroupsDialogVisible = false
              if (res.success) {
              this.$message.success({
                message: '保存成功',
                duration: 1500
              })
            }
              this.getList()
            })
          } else {
            const params = this.tagGroupsInfo.userLabelPoolGroup
            params.labelName = this.tagGroupsForm.groupName
            console.log(params)
            editTalentLabelPoolOfCompany(params).then(res => {
              this.tagGroupsDialogVisible = false
              if (res.success) {
                this.$message.success({
                  message: '保存成功',
                  duration: 1500
                })
              }
              this.getList()
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 删除标签组弹窗
    delTagGroups(data) {
      this.tagGroupsInfo = data
      this.tagGroupsDialogDel = true
    },
    // 删除标签组
    delGroups() {
      const params = {
        labelGroupId: this.tagGroupsInfo.userLabelPoolGroup.id
      }
      deleteTalentLabelPoolOfCompany(params).then(res => {
        this.tagGroupsDialogDel = false
        this.$message.success({
          message: '删除成功',
          duration: 1000
        })
        this.getList()
      })
    },
    // 新建标签
    addTags(data, groupId) {
      this.tagType = 'add'
      this.tagInfo = data
      this.tagsForm.tagName = ''
      this.tagsForm.group = groupId
      this.tagsDialogVisible = true
    },
    // 编辑标签
    editTags(data, groupId) {
      this.tagType = 'edit'
      this.tagInfo = data
      this.tagsForm.tagName = data.labelName
      this.tagsForm.group = groupId
      this.tagsDialogVisible = true
    },
    // 保存标签
    saveTags(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tagType === 'add') {
            const params = {
              companyId: this.userInfo.companyId,
              labelGroup: this.tagsForm.group,
              labelName: this.tagsForm.tagName,
              type: 1
            }
            addTalentLabelPool(params).then(res => {
              this.tagsDialogVisible = false
              if (res.success) {
              this.$message.success({
                message: '保存成功',
                duration: 1500
              })
            }
              this.getList()
            })
          } else {
            const params = this.tagInfo
            params.labelGroup = this.tagsForm.group
            params.labelName = this.tagsForm.tagName
            delete params.createBy
            delete params.createTime
            delete params.updateBy
            delete params.updateTime
            console.log(params)
            editTalentLabelPool(params).then(res => {
              this.tagsDialogVisible = false
              if (res.success) {
                this.$message.success({
                  message: '保存成功',
                  duration: 1500
                })
              }
              this.getList()
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 删除标签弹窗
    delTags(data) {
      this.tagInfo = data
      this.tagsDialogDel = true
    },
    // 删除标签
    delTag() {
      const params = {
        labelId: this.tagInfo.id
      }
      deleteTalentLabelPool(params).then(res => {
        this.tagsDialogDel = false
        if (res.success) {
              this.$message.success({
                message: '保存成功',
                duration: 1500
              })
            }
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-left: 16px;
  .main {
    min-height: 600px;
    .tip {
      font-size: 14px;
      margin: 20px 0;
      color: #666;
    }
    .addBtn {
      margin: 20px 0;
    }
    .list {
      margin-bottom: 16px;
      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      .label {
        display: inline-block;
        margin-right: 16px;
      }
    }
  }
}
</style>
