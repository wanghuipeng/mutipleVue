<template>
  <div v-loading="rightLoading" class="resume-order-supplier">
    <div v-if="selectShow" class="select-input-modal" @click.stop="selectShow=false"></div>
    <!-- 头部 -->
    <div class="order-cont">
      <template v-if="statusNo">
        <!-- 选择推荐报告 -->
        <div
          :class="[selectShow ? 'select-input active' : 'select-input']"
          @click="selectShow=false"
        >
          <div class="value" @click.stop="selectShow=!selectShow">
            <span class="num">{{ arr && arr.length }}</span>
            <span class="id">#{{ selectValue.applyId }}</span>
            <span class="job-name">{{ selectValue.positionName }}</span>&nbsp;-&nbsp;
            <span class="comp-name">{{ selectValue.companyName }}</span>
          </div>
          <ul class="list">
            <li
              v-for="item in arr"
              :key="item.applyId"
              :title="'#'+item.applyId+' '+item.positionName+' - '+item.companyName"
              @click="checkIt(item)"
            >
              <span class="id">#{{ item.applyId }}</span>
              <span class="job-name">{{ item.positionName }}</span>&nbsp;-&nbsp;
              <span class="comp-name">{{ item.companyName }}</span>
            </li>
          </ul>
        </div>
        <!-- 步骤条 -->
        <el-steps :active="processNode" class="steps" align-center>
          <el-step v-if="processNode === 1" title="简历筛选" icon="el-icon el-icon-active"></el-step>
          <el-step v-else title="简历筛选" icon="el-icon"></el-step>
          <el-step v-if="processNode === 2" title="面试" icon="el-icon el-icon-active"></el-step>
          <el-step v-else title="面试" icon="el-icon"></el-step>
          <el-step v-if="processNode === 3" title="Offer" icon="el-icon el-icon-active"></el-step>
          <el-step v-else title="Offer" icon="el-icon"></el-step>
          <el-step v-if="processNode === 4" title="入职" icon="el-icon el-icon-active"></el-step>
          <el-step v-else title="入职" icon="el-icon"></el-step>
          <el-step v-if="processNode === 10" title="淘汰" icon="el-icon el-icon-active"></el-step>
          <el-step v-else title="淘汰" icon="el-icon"></el-step>
        </el-steps>
        <!-- 各种订单操作 -->
        <div class="btns">
          <!-- 企业HR相关操作 -->
          <template v-if="userInfo && userInfo.companyAccountType === 1">
            <!-- 初筛（企业） -->
            <template v-if="statusNo === 21">
              <el-dropdown
                size="mini"
                split-button
                type="primary"
                trigger="click"
                placement="bottom-start"
                :class="[checkBrowserType === 'firefox' ? 'btns-firefox' : 'btns-split-button']"
                @click.stop="handleBtn(52, null, 'otherVisible', '筛选通过')"
              >
                筛选通过
                <el-dropdown-menu slot="dropdown" class="btns-dropdown-menu">
                  <el-dropdown-item @click.native="handleBtn(14, null, 'interviewVisible')">安排面试</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(53, null, 'weedOutVisible')"
              >淘汰</el-button>
            </template>
            <!-- 筛选通过（企业） -->
            <template v-else-if="statusNo === 22">
              <el-dropdown
                size="mini"
                split-button
                type="primary"
                trigger="click"
                placement="bottom-start"
                :class="[checkBrowserType === 'firefox' ? 'btns-firefox' : 'btns-split-button']"
                @click.stop="handleBtn(14, null, 'interviewVisible')"
              >
                安排面试
                <el-dropdown-menu slot="dropdown" class="btns-dropdown-menu">
                  <el-dropdown-item
                    @click.native="handleBtn(66, null, 'offerVisible', '发送Offer')"
                  >Offer</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(53, null, 'weedOutVisible')"
              >淘汰</el-button>
            </template>
            <!-- 面试（待面试） -->
            <template v-else-if="statusNo === 32">
              <el-dropdown
                size="mini"
                split-button
                type="primary"
                trigger="click"
                placement="bottom-start"
                :class="[checkBrowserType === 'firefox' ? 'btns-firefox' : 'btns-split-button']"
                @click.stop="handleBtn(66, null, 'offerVisible', '发Offer')"
              >
                Offer
                <el-dropdown-menu slot="dropdown" class="btns-dropdown-menu">
                  <el-dropdown-item
                    v-if="interviewList && interviewList[0] && !interviewList[0].isOver"
                    @click.native="handleBtn(64, null, 'interviewVisible', '下一轮面试')"
                  >下一轮面试</el-dropdown-item>
                  <el-dropdown-item @click.native="handleBtn(59, null, 'hireVisible')">录用</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(53, null, 'weedOutVisible')"
              >淘汰</el-button>
            </template>
            <!-- Offer（已发offer） -->
            <template v-else-if="statusNo === 42">
              <el-button
                size="mini"
                class="w-370"
                type="primary"
                @click.native="handleBtn(59, null, 'hireVisible')"
              >录用</el-button>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(53, null, 'weedOutVisible')"
              >淘汰</el-button>
            </template>
            <!-- 录用 -->
            <template v-else-if="statusNo === 51 && guaranteePeriod">
              <el-button
                size="mini"
                class="w-370"
                type="primary"
                @click.native="handleBtn(61, null, 'otherVisible', '过保')"
              >过保</el-button>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(60, null, 'weedOutVisible')"
              >淘汰</el-button>
            </template>
            <!--淘汰（企业操作） -->
            <template v-if="processNode === 10">
              <el-dropdown
                size="mini"
                split-button
                type="primary"
                trigger="click"
                placement="bottom-start"
                :class="[checkBrowserType === 'firefox' ? 'btns-firefox block-btns' : 'btns-split-button block-btns']"
                @click.stop="handleBtn(70, null, 'otherVisible', '激活到初筛', 21)"
              >
                激活到初筛
                <el-dropdown-menu slot="dropdown" class="btns-dropdown-menu w-424">
                  <el-dropdown-item
                    @click.native="handleBtn(70, null, 'otherVisible', '激活到筛选通过', 22)"
                  >激活到筛选通过</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="handleBtn(74, null, 'interviewVisible', '安排面试')"
                  >激活到面试</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="handleBtn(73, null, 'offerVisible', '发送Offer')"
                  >激活到Offer</el-dropdown-item>
                  <el-dropdown-item @click.native="handleBtn(75, null, 'hireVisible')">激活到录用</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>

          <!-- 供应商相关操作 -->
          <template v-if="userInfo && userInfo.companyAccountType === 2">
            <!-- 初筛（供应商）——猎头职位 -->
            <template v-if="statusNo === 11 && positionType === 1">
              <el-dropdown
                size="mini"
                split-button
                type="primary"
                trigger="click"
                placement="bottom-start"
                :class="[checkBrowserType === 'firefox' ? 'btns-firefox' : 'btns-split-button']"
                @click.stop="handleBtn(50, null, 'otherVisible', '筛选通过')"
              >
                筛选通过
                <el-dropdown-menu slot="dropdown" class="btns-dropdown-menu">
                  <el-dropdown-item @click="handleBtn(68, null, 'otherVisible', '推荐人选')">推荐</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(51, null, 'otherVisible', '淘汰')"
              >淘汰</el-button>
            </template>
            <!-- 初筛（供应商）——RPO职位 -->
            <template v-else-if="statusNo === 11 && positionType === 2">
              <el-dropdown
                size="mini"
                split-button
                type="primary"
                trigger="click"
                placement="bottom-start"
                :class="[checkBrowserType === 'firefox' ? 'btns-firefox' : 'btns-split-button']"
                @click.stop="handleBtn(50, null, 'otherVisible', '筛选通过')"
              >
                筛选通过
                <el-dropdown-menu slot="dropdown" class="btns-dropdown-menu">
                  <el-dropdown-item @click="handleBtn(68, null, 'otherVisible', '推荐人选')">推荐</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(51, null, 'otherVisible', '淘汰')"
              >淘汰</el-button>
            </template>
            <!-- 筛选通过（供应商）——猎头职位 -->
            <template v-else-if="statusNo === 16 && positionType === 1">
              <el-button
                size="mini"
                class="w-370"
                type="primary"
                @click.native="handleBtn(68, null, 'otherVisible', '推荐人选')"
              >推荐</el-button>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(51, null, 'otherVisible', '淘汰')"
              >淘汰</el-button>
            </template>
            <!-- 筛选通过（供应商）——RPO职位 -->
            <template v-else-if="statusNo === 16 && positionType === 2">
              <el-button
                size="mini"
                class="w-370"
                type="primary"
                @click.native="handleBtn(68, null, 'otherVisible', '推荐人选')"
              >推荐</el-button>
              <el-button
                class="btn-orange"
                size="mini"
                @click.native="handleBtn(51, null, 'otherVisible', '淘汰')"
              >淘汰</el-button>
            </template>
            <!-- 淘汰（供应商处理） -->
            <template v-if="processNode === 10">
              <el-dropdown
                size="mini"
                split-button
                type="primary"
                trigger="click"
                placement="bottom-start"
                :class="[checkBrowserType === 'firefox' ? 'btns-firefox block-btns' : 'btns-split-button block-btns']"
                @click.stop="handleBtn(70, null, 'otherVisible', '激活到初筛', 11)"
              >
                激活到初筛
                <el-dropdown-menu slot="dropdown" class="btns-dropdown-menu w-424">
                  <el-dropdown-item
                    @click.native="handleBtn(70, null, 'otherVisible', '激活到筛选通过', 16)"
                  >激活到筛选通过</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </div>
        <el-tabs v-model="orderActiveName" class="order-tabs" @tab-click="handleClickOrder">
          <el-tab-pane label="处理动态" name="log">
            <div v-loading="logLoading" class="log-pane">
              <div v-if="logList && logList.length > 0" class="remarks">
                <ul>
                  <li v-for="(item,index) in logList" :key="index">
                    <template>
                      <p class="title">
                        阶段：{{ item.beforeProcessNodeName }}
                        <span class="time">{{ item.operateTime }}</span>
                      </p>
                      <p class="result">
                        <span class="label">处理人：</span>
                        {{ item.operatorUserName || '-' }}
                      </p>
                      <p class="remark">
                        <span class="label">处理操作：</span>
                        {{ item.operateCodeName }}
                        <el-popover
                          v-if="item.paramJsonObj && item.paramJsonObj.beforeProcessNode === 2"
                          placement="right"
                          trigger="hover"
                        >
                          <div v-if="item.paramJsonObj" class="mess-poper">
                            <p class="title">{{ item.paramJsonObj.round | filterChinaNum }}轮面试</p>
                            <p v-if="item.paramJsonObj.plannedInterviewTime">
                              <label>面试时间：</label>
                              {{ item.paramJsonObj.plannedInterviewTime | filterDateTime }}
                            </p>
                            <p v-if="item.paramJsonObj.interviewProvince">
                              <label>面试地址：</label>
                              {{ item.paramJsonObj.interviewProvince| filterArr(dictData.areas) }}{{ item.paramJsonObj.interviewCity| filterLevel2(dictData.areas) }}{{ item.paramJsonObj.interviewArea| filterLevel3(dictData.areas) }}{{ item.paramJsonObj.interviewAddress }}
                            </p>
                            <p v-if="item.paramJsonObj.contactName">
                              <label>联系人：</label>
                              {{ item.paramJsonObj.contactName }}
                            </p>
                            <p v-if="item.paramJsonObj.contactMobile">
                              <label>联系电话：</label>
                              {{ item.paramJsonObj.contactMobile }}
                            </p>
                            <p v-if="item.paramJsonObj.interviewerName">
                              <label>面试官：</label>
                              {{ item.paramJsonObj.interviewerName }}
                            </p>
                            <p v-if="item.paramJsonObj.interviewMethod">
                              <label>面试方式：</label>
                              {{ item.paramJsonObj.interviewMethod | filterArr(dictData.dicts.interviewType) }}
                            </p>
                            <p v-if="item.paramJsonObj.description">
                              <label>备注提醒：</label>
                              {{ item.paramJsonObj.description }}
                            </p>
                          </div>
                          <el-button slot="reference" class="hover-mess" size="mini">面试信息</el-button>
                        </el-popover>
                        <el-popover
                          v-if="item.paramJsonObj && item.beforeProcessNode === 3"
                          placement="right"
                          trigger="hover"
                        >
                          <div v-if="item.paramJsonObj" class="mess-poper">
                            <p class="title">Offer</p>
                            <p v-if="item.paramJsonObj.offerSendDate">
                              <label>Offer发放日期：</label>
                              {{ item.paramJsonObj.offerSendDate | filterDateTime }}
                            </p>
                            <p v-if="item.paramJsonObj.plannedArrivalDate">
                              <label>预计入职日期：</label>
                              {{ item.paramJsonObj.plannedArrivalDate | filterDateTime }}
                            </p>
                            <p v-if="item.paramJsonObj.probationPeriod">
                              <label>试用期：</label>
                              {{ item.paramJsonObj.probationPeriod }}个月
                            </p>
                            <p v-if="item.paramJsonObj.salary">
                              <label>薪资待遇：</label>
                              {{ item.paramJsonObj.salary }}元{{ item.paramJsonObj.salaryType === 2 ? '/月' : (item.paramJsonObj.salaryType === 1 ? '/年' : '') }}
                            </p>
                            <p v-if="item.paramJsonObj.salaryDescription">
                              <label>薪资说明：</label>
                              {{ item.paramJsonObj.salaryDescription }}
                            </p>
                            <p v-if="item.paramJsonObj.attachmentUrl">
                              <label style="line-height:28px">Offer附件：</label>
                              <el-button
                                v-if="item.paramJsonObj.attachmentUrl.indexOf('png') !== -1 || item.paramJsonObj.attachmentUrl.indexOf('jpg') !== -1"
                                size="mini"
                                class="priview-btn"
                                @click="priview(item.paramJsonObj.attachmentUrl)"
                              >预览</el-button>
                              <el-button
                                v-else
                                class="priview-btn"
                                size="mini"
                                @click="priview(item.paramJsonObj.attachmentUrl)"
                              >下载</el-button>
                            </p>
                            <p v-if="item.paramJsonObj.description">
                              <label>备注提醒：</label>
                              {{ item.paramJsonObj.description }}
                            </p>
                          </div>
                          <el-button slot="reference" class="hover-mess" size="mini">Offer信息</el-button>
                        </el-popover>
                      </p>
                      <p v-if="item.remarks " class="remark">
                        <span class="label">处理备注：</span>
                        {{ item.remarks }}
                      </p>
                    </template>
                  </li>
                </ul>
              </div>
              <div v-else-if="!logList" class="empty">
                <img src="~@/assets/images/order/blank.png" />
                <p>暂无动态</p>
              </div>
              <p
                v-if="logList && logList.length > 0 && logList.length < total"
                class="more-link"
                @click="moreLog"
              >
                <span v-if="logLoading">正在加载...</span>
                <span v-else>点击查看更多</span>
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="面试" name="interview">
            <span slot="label">面试<label v-if="statusNo === 31 || statusNo === 32 || statusNo === 34 || statusNo === 36" class="red-dot"></label></span>
            <div v-if="interviewList && interviewList.length > 0" class="interview-pane">
              <div v-for="(item,index) in interviewList" :key="index" class="tab-item">
                <div class="title">
                  {{ item.round | filterChinaNum }}轮面试
                  <span
                    v-if="item.statusNo > 1"
                    class="state"
                  >{{ item.statusNo | filterArr(candidateStatus) }}</span>
                  <el-popover
                    v-if="index === 0 && processNode === 2 && (userInfo && userInfo.companyAccountType === 1)"
                    class="more"
                    popper-class="more-popper"
                    width="80"
                    placement="bottom-start"
                    trigger="click"
                  >
                    <div class="item">
                      <el-link
                        :underline="false"
                        @click.native="handleBtn(65, null, 'interviewVisible','修改面试')"
                      >修改面试</el-link>
                      <el-link
                        :underline="false"
                        @click.native="handleBtn(57, null, 'weedOutVisible','取消面试')"
                      >取消面试</el-link>
                    </div>
                    <i
                      slot="reference"
                      class="info-btn icon iconfont icon-zhiwei-quanbuzhiwei15"
                      @click.stop
                    />
                  </el-popover>
                </div>
                <div class="cont">
                  <p v-if="item.plannedInterviewTime" class="text">
                    <span class="label">面试时间：</span>
                    {{ item.plannedInterviewTime }}
                  </p>
                  <p v-if="item.interviewProvince" class="text">
                    <span class="label">面试地址：</span>
                    {{ item.interviewProvince| filterArr(dictData.areas) }}{{ item.interviewCity| filterLevel2(dictData.areas) }}{{ item.interviewArea| filterLevel3(dictData.areas) }}{{ item.interviewAddress }}
                  </p>
                  <p v-if="item.contactName" class="text">
                    <span class="label">联系人：</span>
                    {{ item.contactName }}
                  </p>
                  <p v-if="item.contactMobile" class="text">
                    <span class="label">联系电话：</span>
                    {{ item.contactMobile }}
                  </p>
                  <p v-if="item.interviewerName" class="text">
                    <span class="label">面试官：</span>
                    {{ item.interviewerName }}
                  </p>
                  <p v-if="item.interviewMethod" class="text">
                    <span class="label">面试方式：</span>
                    {{ item.interviewMethod | filterArr(dictData.dicts.interviewType) }}
                  </p>
                  <p v-if="item.description" class="text">
                    <span class="label">备注提醒：</span>
                    {{ item.description }}
                  </p>
                </div>
                <el-collapse
                  v-if="item.operateLogList && item.operateLogList.length > 0"
                  accordion
                  class="more-log"
                >
                  <el-collapse-item>
                    <template slot="title">面试日志</template>
                    <div class="remarks">
                      <ul v-for="(itemInner,indexInner) in item.operateLogList" :key="indexInner">
                        <li>
                          <p class="title">{{ itemInner.operatorUserName }}</p>
                          <p class="remark">
                            <span class="label">处理：</span>
                            {{ itemInner.operateCodeName }}
                            <span
                              class="time"
                            >{{ itemInner.operateTime }}</span>
                          </p>
                          <p v-if="itemInner.remarks" class="remark">
                            <span class="label">备注：</span>
                            {{ itemInner.remarks }}
                          </p>
                        </li>
                      </ul>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div v-else class="empty">
              <img src="~@/assets/images/order/blank.png" />
              <p>暂无面试信息</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Offer" name="offer">
            <span slot="label">Offer<label v-if="statusNo === 41 || statusNo === 42" class="red-dot"></label></span>
            <div v-if="offerList && offerList.length > 0" class="offer-pane">
              <div v-for="(item,index) in offerList" :key="index" class="tab-item">
                <div class="title">
                  Offer
                  <span
                    v-if="item.statusNo > 1"
                    class="state"
                  >{{ item.statusNo | filterArr(candidateStatus) }}</span>
                  <el-popover
                    v-if="index === 0 && processNode === 3 && (userInfo && userInfo.companyAccountType === 1)"
                    class="more"
                    popper-class="more-popper"
                    width="80"
                    placement="bottom-start"
                    trigger="click"
                  >
                    <div class="item">
                      <el-link
                        :underline="false"
                        @click.native="handleBtn(69, null, 'offerVisible','修改Offer')"
                      >修改Offer</el-link>
                      <el-link
                        :underline="false"
                        @click.native="handleBtn(67, null, 'weedOutVisible','取消Offer')"
                      >取消Offer</el-link>
                    </div>
                    <i
                      slot="reference"
                      class="info-btn icon iconfont icon-zhiwei-quanbuzhiwei15"
                      @click.stop
                    />
                  </el-popover>
                </div>
                <div class="cont">
                  <p v-if="item.offerSendDate" class="text">
                    <span class="label">Offer发放日期：</span>
                    {{ item.offerSendDate }}
                  </p>
                  <p v-if="item.plannedArrivalDate" class="text">
                    <span class="label">预计入职日期：</span>
                    {{ item.plannedArrivalDate }}
                  </p>
                  <p v-if="item.probationPeriod" class="text">
                    <span class="label">试用期：</span>
                    {{ item.probationPeriod }}个月
                  </p>
                  <p v-if="item.salary" class="text">
                    <span class="label">薪资待遇：</span>
                    {{ item.salary }}元{{ item.salaryType === 2 ? '/月' : (item.salaryType === 1 ? '/年' : '') }}
                  </p>
                  <p v-if="item.salaryDescription" class="text">
                    <span class="label">薪资说明：</span>
                    {{ item.salaryDescription }}
                  </p>
                  <p v-if="item.attachmentUrl" class="text">
                    <span class="label" style="line-height:28px">Offer附件：</span>
                    <el-button
                      v-if="item.attachmentUrl.indexOf('png') !== -1 || item.attachmentUrl.indexOf('jpg') !== -1"
                      size="mini"
                      class="priview-btn"
                      @click="priview(item.attachmentUrl)"
                    >预览</el-button>
                    <el-button
                      v-else
                      class="priview-btn"
                      size="mini"
                      @click="priview(item.attachmentUrl)"
                    >下载</el-button>
                  </p>
                  <p v-if="item.description" class="text">
                    <span class="label">备注提醒：</span>
                    {{ item.description }}
                  </p>
                </div>
                <el-collapse
                  v-if="item.operateLogList && item.operateLogList.length > 0"
                  accordion
                  class="more-log"
                >
                  <el-collapse-item>
                    <template slot="title">Offer日志</template>
                    <div class="remarks">
                      <ul v-for="(itemInner,indexInner) in item.operateLogList" :key="indexInner">
                        <li>
                          <p class="title">{{ itemInner.operatorUserName }}</p>
                          <p class="remark">
                            <span class="label">处理：</span>
                            {{ itemInner.operateCodeName }}
                            <span
                              class="time"
                            >{{ itemInner.operateTime }}</span>
                          </p>
                          <p v-if="itemInner.remarks" class="remark">
                            <span class="label">备注：</span>
                            {{ itemInner.remarks }}
                          </p>
                        </li>
                      </ul>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div v-else class="empty">
              <img src="~@/assets/images/order/blank.png" />
              <p>暂无Offer信息</p>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- /各种订单操作 -->
      </template>
      <div v-else-if="!processNode" class="empty">
        <img src="~@/assets/images/order/blank.png" />
        <p>该候选人暂无相关投递记录</p>
      </div>
    </div>

    <!-- 面试操作 -->
    <operations
      v-if="interviewVisible"
      :dialog.sync="interviewVisible"
      title="安排面试"
      :type="1"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      :position-info="positionInfo"
      @updateList="updateList"
    />

    <!-- offer操作 -->
    <operations
      v-if="offerVisible"
      :dialog.sync="offerVisible"
      title="发放offer"
      :type="2"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      @updateList="updateList"
    />

    <!-- 录用操作 -->
    <operations
      v-if="hireVisible"
      :dialog.sync="hireVisible"
      title="录用"
      :type="3"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      @updateList="updateList"
    />

    <!-- 淘汰操作 -->
    <operations
      v-if="weedOutVisible"
      :dialog.sync="weedOutVisible"
      title="候选人淘汰"
      :type="4"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      @updateList="updateList"
    />

    <!-- 其他操作 -->
    <operations
      v-if="otherVisible"
      :dialog.sync="otherVisible"
      :title="operationTitle"
      :candidates="multipleSelection"
      :operate-type="operateType"
      :operate-code="operateCode"
      :activate-code="activateCode"
      :width="500"
      @updateList="updateList"
    />
  </div>
</template>

<script>
import {
  getApplyListByResumeId,
  getCandidateInfoById,
  getOperateLogPage
} from '@/api/resume'
import { mapState } from 'vuex'
import operations from '@/views/order/candidate/operations'
import { detail } from '@/api/order'
import { checkBrowser } from '@/utils/common'

export default {
  components: {
    operations
  },
  props: {
    resumeId: {
      type: String,
      required: true,
      default: ''
    },
    resumeName: {
      type: String,
      required: true,
      default: ''
    },
    candidateId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      logLoading: false,
      multipleSelection: [],
      applyId: null,
      orderActiveName: 'log',
      getLoading: false,
      noGetLoading: false,
      rightLoading: true,
      logList: [],
      selectShow: false,
      arr: [],
      processNode: 1,
      activeName: '1',
      selectValue: '',
      statusNo: null,
      interviewList: [],
      offerList: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      lastInterviewId: null,
      offerId: null,
      guaranteePeriod: null, // 有无过保
      positionType: null, // 合作方式
      operateCode: null,
      activateCode: null,
      operateType: null,
      dialogType: null,
      operationTitle: null,
      interviewVisible: false,
      offerVisible: false,
      hireVisible: false,
      weedOutVisible: false,
      otherVisible: false,
      candidateStatus: [], // 职位订单状态
      candidateProcessNode: [], // 职位流程节点
      checkBrowserType: '', // 浏览器类型
      candidateRecommendReport: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      dictData: state => state.common.dictData
    })
  },
  created() {
    this.checkBrowserType = checkBrowser()
    console.log('浏览器', this.checkBrowserType)
    this.candidateStatus =
      this.dictData &&
      this.dictData.dicts &&
      this.dictData.dicts.candidateStatus
    this.candidateProcessNode =
      this.dictData &&
      this.dictData.dicts &&
      this.dictData.dicts.candidateProcessNode
  },
  mounted() {
    this.getApplyListByResumeId()
  },
  methods: {
    // 预览附件
    priview(url) {
      window.open(url)
    },
    // 处理动态分页
    moreLog() {
      this.pageNumber++
      this.getOperateLogPage(this.applyId)
    },
    // 更新列表
    updateList() {
      this.getCandidateInfoById(this.applyId)
      this.getOperateLogPage(this.applyId)
    },
    // 单个操作
    handleBtn(operateCode, resumeId, dialogType, title, activateCode) {
      if (operateCode === 14 || operateCode === 64 || operateCode === 74) {
        this.candidateRecommendReport && sessionStorage.setItem('candidateCreateTime', JSON.stringify(this.candidateRecommendReport.createTime))
      }
      console.log('订单id', this.applyId)
      this.operateCode = operateCode
      this.activateCode = activateCode
      this.operateType = 1
      this.multipleSelection = [
        { id: this.applyId, jobhunterName: this.$props.resumeName }
      ]
      this[dialogType] = true
      this.operationTitle = title
    },
    // 处理动态
    getOperateLogPage(candidateId) {
      this.logLoading = true
      const { pageSize, pageNumber } = this
      const params = {
        candidateId,
        pageNumber,
        pageSize
      }
      getOperateLogPage(params).then(res => {
        this.logLoading = false
        const { code, data } = res
        if (code === '000000' && data) {
          console.log(typeof data.records, typeof this.logList)
          this.logList =
            data && data.records && this.logList.concat(data.records)
          this.total = data.total
          if (!this.total) {
            this.logList = null
          }
        }
      })
    },
    handleClickOrder(e) {
      console.log(e.name)
      if (e.name === 'log') {
        this.logList = []
        this.total = 0
        this.pageNumber = 1
        this.getOperateLogPage(this.applyId)
      }
    },
    checkIt(item) {
      console.log(item)
      this.selectValue = item
      this.getCandidateInfoById(item.applyId)
      this.orderActiveName = 'interview'
      this.getOperateLogPage(item.applyId)
    },
    // 获取简历对应的订单列表
    getApplyListByResumeId() {
      this.rightLoading = true
      const params = {
        resumeId: this.$props.resumeId
      }
      getApplyListByResumeId(params).then(res => {
        this.rightLoading = false
        const { code, data } = res
        if (code === '000000') {
          let indexApplyId = null
          if (this.$props.candidateId) {
            // 默认订单Id
            indexApplyId = this.$props.candidateId
            // 默认选中项
            const item =
              data &&
              data.filter(item => {
                return item.applyId === this.$props.candidateId
              })
            this.selectValue = item && item[0]
          } else {
            // 默认订单Id
            indexApplyId = data && data[0] && data[0].applyId
            // 默认选中项
            this.selectValue = data && data[0]
          }
          console.log('订单id：', this.$props.candidateId)
          console.log('默认选中项：', this.selectValue)
          data &&
            data[0] &&
            data[0].applyId &&
            this.getCandidateInfoById(indexApplyId)
          data &&
            data[0] &&
            data[0].applyId &&
            this.getOperateLogPage(indexApplyId)
          data && data[0] && data[0].applyId && this.orderDetail(indexApplyId)

          this.arr = data
          if ((data && data.length === 0) || !data) {
            this.processNode = 0
          }
        }
      })
    },
    // 获取分享订单信息
    getCandidateInfoById(applyId) {
      this.applyId = applyId
      console.log('订单id', this.applyId)
      const params = {
        id: applyId
      }
      getCandidateInfoById(params).then(res => {
        const { code, data } = res
        if (code === '000000' && data) {
          this.candidateRecommendReport = data.candidateRecommendReport
          // 订单流程节点
          this.processNode = data.processNode
          // 订单状态
          this.statusNo = data.statusNo
          // 是否过保
          this.guaranteePeriod = data.guaranteePeriod
          // 合作方式
          this.positionType = data.positionType
          // 最后面试id
          this.lastInterviewId = data.lastInterviewId
          // offerId
          this.offerId = data.offerId
          // 面试信息
          this.interviewList = data.interviewList
          // offer信息
          this.offerList = data.offerList
        }
      })
    },
    orderDetail(applyId) {
      this.applyId = applyId
      const params = {
        id: applyId
      }
      detail(params).then(res => {
        const { code, data } = res
        if (code === '000000') {
          this.$store.commit('setReportDetail', data)
        }
      })
    }
  }
}
</script>
<style  lang="scss">
.more-popper {
  .item {
    text-align: center;
  }
  .el-link {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.mess-poper {
  padding: 4px;
  .title {
    color: #0d121a;
    position: relative;
    font-weight: 600;
  }
  p {
    font-size: 13px;
    margin-bottom: 15px;
    color: #0d121a;
    &:last-child {
      margin-bottom: 0;
    }
    label {
      color: #8d9299;
      display: inline-block;
    }
  }
}
.btns-dropdown-menu {
  border-radius: 0;
  padding: 6px 0;
  li {
    width: 370px;
    box-sizing: border-box;
    padding: 0px 12px 12px !important;
    text-align: center;
    color: #595f66;
    line-height: initial !important;
    height: initial !important;
    font-size: 13px !important;
    &:first-child {
      padding-top: 12px !important;
    }
  }
  &.w-424 {
    li {
      width: 424px;
    }
  }
}
.resume-order-supplier {
  min-height: 50px;
  padding: 24px;
  .red-dot{
    width: 8px;
    display: inline-block;
    position: absolute;
    background: red;
    height: 8px;
    border-radius: 100%;
    top: 11px;
  }
  .priview-btn {
    font-size: 13px !important;
    color: #282c32;
    border-color: #e9edf1;
  }
  .select-input-modal {
    position: fixed;
    top: 60px;
    height: 100%;
    width: 98%;
    left: 1%;
    z-index: 10;
    background: transparent;
  }
  .block-btns {
    width: 100% !important;
    button:first-child {
      width: 385px !important;
    }
  }
  .tag-gray {
    background: #e5e5e6 !important;
    color: #909399 !important;
  }
  .order-tabs {
    background: #f9fafb;
    .tab-item {
      border-bottom: 1px solid #dfe2e6;
      margin-top: 16px;
      &:last-child {
        border-bottom: none;
        margin-bottom: 0px;
      }
    }
    .remarks {
      margin: 0 0 16px 0;
      background: #fff;
      .title {
        font-size: 13px !important;
        &::before {
          height: 14px;
          top: 3px;
        }
      }
    }
    .el-collapse-item:last-child {
      margin-bottom: 0;
    }
    .el-collapse-item__wrap {
      background: transparent;
      border: none;
    }
    .more-log {
      border: none;
      .remarks ul li .label {
        min-width: 40px;
      }
      .el-collapse-item__header {
        background: #f9fafb;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        border-bottom-color: transparent;
        border: none;
        .el-collapse-item__arrow {
          margin-right: 0px;
        }
      }
      .el-collapse-item__header.is-active {
        background: transparent;
        font-size: 14px;
        font-weight: bold;
        border-bottom-color: #ebeef5;
      }
    }
    .el-tab-pane {
      padding: 0 16px;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .el-tabs__header {
      background: #f9fafb;
      padding: 0 16px;
      margin-bottom: 0;
      border-bottom: 1px solid #dfe2e6;
    }
    .interview-pane,
    .offer-pane,
    .log-pane {
      .remarks {
        .remark {
          position: relative;
          display: flex;
          white-space: pre-line;
          .hover-mess {
            position: absolute;
            right: 0;
            top: -2px;
            font-size: 13px;
            color: #282c32;
            border-color: #e9edf1;
          }
        }
      }
      .item {
        border-bottom: 1px solid #c3c7cd;
      }
      .title {
        color: #0d121a;
        position: relative;
        font-size: 14px;
        font-weight: 600;
        span {
          &.state {
            font-weight: normal;
            display: inline-block;
            color: #46ba86;
            height: 20px;
            line-height: 20px;
            text-align: center;
            padding: 0 8px;
            font-size: 11px;
            border-radius: 11px;
            background: rgba(70, 186, 134, 0.1);
            margin-left: 6px;
          }
          &.more {
            font-weight: normal;
            position: absolute;
            right: -4px;
            top: 2px;
            font-size: 18px;
            cursor: pointer;
          }
        }
        margin-bottom: 15px;
      }
      .cont {
        .text {
          font-size: 13px;
          color: #0d121a;
          margin-bottom: 10px;
          display: flex;
          white-space: pre-line;
          line-height: 20px;
          .label {
            color: #8d9299;
            display: inline-block;
            min-width: 65px;
          }
        }
      }
    }
    .log-pane {
      min-height: 100px;
      .remarks {
        margin-top: 16px;
        padding: 0;
        background: transparent;
        li {
          margin-bottom: 16px;
        }
      }
      .remarks .title {
        .time {
          position: absolute;
          color: #c3c7cd;
          right: 0px;
          background: transparent;
          right: 0;
          padding: 0;
          top: 2px;
          font-weight: normal;
        }
        &::before {
          top: 2px;
        }
      }
    }
  }
  .btns-split-button {
    button {
      float: none !important;
    }
    .el-button--primary {
      background: #1678f9;
      border-color: #1678f9;
    }
    button:first-child {
      width: 330px;
      padding-left: 55px;
      margin-right: 0 !important;
      border-right: none;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    .el-dropdown__caret-button {
      border-left: none;
      width: 40px !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      &::before {
        top: 5px;
        bottom: 5px;
      }
    }
  }
  .btns-firefox {
    &.block-btns{
      margin-bottom: 15px;
      button:first-child {
        width: 371px !important;
      }
    }
    button {
      float: none !important;
    }
    .el-button--primary {
      background: #1678f9;
      border-color: #1678f9;
    }
    button:first-child {
      width: 315px;
      padding-left: 55px;
      margin-right: 0 !important;
      border-right: none;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    .el-dropdown__caret-button {
      border-left: none;
      width: 40px !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      &::before {
        top: 5px;
        bottom: 5px;
      }
    }
  }
  .empty {
    padding: 50px;
    img {
      display: block;
      width: 220px;
      height: 168px;
      margin: 0 auto;
    }
    p {
      font-size: 14px;
      color: #b3b3b3;
      text-align: center;
      margin-top: 30px;
    }
  }
  .order-cont {
    .btns {
      display: flex;
      justify-content: space-between;

      .btns-split-button {
        margin-bottom: 15px;
      }
      button {
        height: 28px;
        border-radius: 2px;
        vertical-align: middle;
        &:first-child {
          margin-right: 16px;
          border-right: none !important;
          border-color: #1678f9;
        }
        &.w-370 {
          border-right: initial !important;
          background: #1678f9;
        }
        &:last-child {
          border-left: none !important;
        }
        &.btn-orange {
          color: #f64f4f;
          border-color: #f64f4f;
          border-left: 1px solid #f64f4f !important;
          width: 46px;
          padding: 0;
          margin-left: 0;
          margin-bottom: 15px;
        }
        &.block {
          width: 100%;
        }
      }
    }
  }
  .steps {
    margin: 24px 0 16px 0;
    .el-step__title {
      color: #8d9299;
      font-size: 11px;
      &.is-finish {
        color: #1678f9;
      }
    }
    .el-icon {
      width: 12px;
      height: 12px;
      display: inline-block;
      background: url('~@/assets/images/resume/resumeDetailSupplier/gray_circle.png')
        no-repeat;
      background-size: 12px;
    }
    .is-finish {
      .el-icon {
        width: 12px;
        height: 12px;
        background: url('~@/assets/images/resume/resumeDetailSupplier/blue_circle.png')
          no-repeat;
        background-size: 12px;
        &.el-icon-active {
          width: 20px;
          height: 20px;
          background: url('~@/assets/images/resume/resumeDetailSupplier/active_circle.png')
            no-repeat !important;
          background-size: 20px !important;
        }
      }
    }
  }
  .select-input {
    width: 100%;
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    color: #282c32;
    font-size: 13px;
    padding: 0 30px 0 0px;
    border: 1px solid #e9edf1;
    border-radius: 2px;
    box-sizing: border-box;
    position: relative;
    &::after {
      content: '';
      width: 16px;
      height: 16px;
      display: inline-block;
      background: url('~@/assets/images/resume/resumeDetailSupplier/arrow_d.png')
        no-repeat;
      background-size: 16px;
      position: absolute;
      right: 10px;
      top: 6px;
      transform: rotateZ(0);
      transition: transform 0.3s;
    }
    .job-name {
      color: #282c32;
    }
    .comp-name {
      color: #8d9299;
    }
    .num {
      height: 27px;
      background: rgba(233, 237, 241, 1);
      border-radius: 2px 0px 0px 2px;
      display: inline-block;
      text-align: center;
      padding: 0 9px;
      font-size: 16px;
      font-weight: bold;
      color: #1678f9;
    }
    &.active {
      &::after {
        transform: rotateZ(-180deg);
      }
      .list {
        position: absolute;
        left: 0;
        top: 33px;
        z-index: 10;
        transform-origin: center top;
        display: block;
      }
    }
    .list {
      display: none;
      width: 100%;
      list-style: none;
      padding: 6px 0;
      margin: 0;
      background-color: #fff;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
      box-sizing: border-box;
      margin: 5px 0;
      li {
        padding: 6px 16px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          background-color: #f5f7fa;
        }
        span {
          &.id {
            margin-right: 8px;
          }
        }
      }
    }
    .value {
      white-space: nowrap;
      overflow: hidden;
      span {
        line-height: 26px;
        display: inline-block;
        &.id {
          margin-right: 8px;
          margin-left: 16px;
        }
      }
    }
  }
  .remarks {
    background: #f9fafb;
    border-radius: 2px;
    padding: 16px;
    margin-top: 24px;
    ul {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      li {
        .name {
          color: #0d121a;
          font-size: 14px;
        }
        .title {
          color: #0d121a;
          position: relative;
          font-size: 14px;
          padding-left: 12px;
          font-weight: 600;
          &::before {
            content: '';
            width: 4px;
            height: 16px;
            display: inline-block;
            position: absolute;
            background: #1678f9;
            left: 0;
            top: 2px;
          }
        }
        .label {
          color: #8d9299;
          min-width: 65px;
        }
        p {
          font-size: 13px;
          margin-bottom: 10px;
          line-height: 20px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .result,
        .remark {
          color: #0d121a;
          .time {
            position: absolute;
            color: #c3c7cd;
            right: 0px;
          }
        }
      }
    }
  }
}
</style>
