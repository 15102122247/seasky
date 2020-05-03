<template>
  <div class="rules">
    <h2>推送规则管理</h2>
    <div class="rules-block">
      <div
        class="rules-block-item ml"
        style="display:flex;align-items: center;"
      >
        <label>消息类型</label>
        <el-input
          v-model="checkRulesData.pushRulesTypeLike"
          clearable
        ></el-input>
      </div>
      <div class="rules-block-item">
        <label>推送规则</label>
        <el-select
          placeholder="请选择"
          clearable
          v-model="checkRulesData.pushType"
        >
          <el-option label="立即推送" value="1"></el-option>
          <el-option label="定时推送" value="2"></el-option>
          <el-option label="延时推送" value="3"></el-option>
        </el-select>
      </div>
      <div class="rules-block-item">
        <label>发送方式</label>
        <el-select
          v-model="checkRulesData.configID"
          clearable
          placeholder="请选择"
        >
          <el-option
            :label="item.configType"
            :value="item.configID"
            v-for="(item, index) in sendTypeList"
            :key="index + 'sendTypeList'"
          ></el-option>
        </el-select>
      </div>
      <div
        class="rules-block-item ml"
        style="display:flex;align-items: center;"
      >
        <label>推送模板</label>
        <el-input
          v-model="checkRulesData.pushTemplateName"
          clearable
        ></el-input>
      </div>
      <div class="rules-block-item">
        <el-button type="primary" @click="checkRulesList">查询</el-button>
      </div>
      <div class="rules-block-item">
        <el-button type="success" @click="addRule">添加</el-button>
      </div>
    </div>
    <div class="rules-table">
      <el-table :data="rulesListData" stymessagele="width: 100%">
        <el-table-column
          prop="pushRulesType"
          label="消息类型"
        ></el-table-column>
        <el-table-column prop="pushType" label="推送规则类型"></el-table-column>
        <el-table-column
          prop="pushTemplateName"
          label="推送模板"
        ></el-table-column>
        <el-table-column
          prop="configInfo"
          label="推送起止时间"
        ></el-table-column>
        <el-table-column
          prop="timingPushTime"
          label="定时推送时间"
        ></el-table-column>
        <el-table-column
          prop="pushTimeDelay"
          label="延时时间/半小时"
        ></el-table-column>
        <el-table-column prop="configType" label="发送方式"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <el-form
        :model="pushRulesData"
        :rules="rules"
        ref="pushRulesData"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="消息类型：" prop="pushRulesType">
          <el-input
            v-model="pushRulesData.pushRulesType"
            clearable
            style="width:200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="推送规则类型：" prop="pushType">
          <el-select
            v-model="pushRulesData.pushType"
            placeholder="请选择"
            clearable
          >
            <el-option label="立即推送" value="1"></el-option>
            <el-option label="定时推送" value="2"></el-option>
            <el-option label="延时推送" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="推送起止时间："
          v-if="pushRulesData.pushType == '3'"
        >
          <el-col :span="11">
            <el-form-item prop="pushStartTime">
              <el-time-select
                placeholder="起始时间"
                v-model="pushRulesData.pushStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00'
                }"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="pushEndTime">
              <el-time-select
                placeholder="结束时间"
                v-model="pushRulesData.pushEndTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  minTime: pushRulesData.pushStartTime
                }"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="延时时间：" prop="pushTimeDelay">
          <el-input
            v-model="pushRulesData.pushTimeDelay"
            style="width:200px"
            clearable
          ></el-input
          >分钟
        </el-form-item>
        <el-form-item
          label="定时推送时间："
          prop="timingPushTime"
          v-if="pushRulesData.pushType == '2'"
        >
          <el-time-select
            placeholder="选择时间"
            v-model="pushRulesData.timingPushTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00'
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="发送方式：" prop="configID">
          <el-select
            v-model="pushRulesData.configID"
            placeholder="请选择"
            clearable
          >
            <el-option
              :label="item.configType"
              :value="item.configID"
              v-for="(item, index) in sendTypeList"
              :key="index + 'sendTypeList'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送模板：" prop="pushTemplateID">
          <el-select
            v-model="pushRulesData.pushTemplateID"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in listPushTemplateList"
              :key="index + 'listPushTemplateList'"
              :label="item.pushTemplateName"
              :value="item.pushTemplateID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="keepRules('pushRulesData')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogDel" width="30%">
      <div class="dialogBody">确定删除该条信息？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="danger" @click="delPushRules">确定删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  ListPushRules,
  ListPushRulesType,
  ListPushTemplate,
  CreatePushRules,
  ListConfig,
  RemovePushRules,
  GetPushRules,
  ModifyPushRules
} from "@/api/network";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogDel: false,

      // 新数据
      oData: {},
      pushRulesData: {
        pushRulesType: "", //消息类型
        pushType: "", //推送规则类型
        pushTemplateID: "", //推送模板
        configID: "", //发送方式id
        configName: "", //发送方式name
        timingPushTime: "", //定时推送时间
        pushTimeDelay: "", //延时时间
        pushStartTime: "", //推送开始时间
        pushEndTime: "" //推送结束时间
      },
      rules: {
        pushRulesType: [
          { required: true, message: "请输入消息类型", trigger: "blur" }
        ],
        pushType: [
          { required: true, message: "请选择推送规则类型", trigger: "blur" }
        ],
        pushStartTime: [
          { required: true, message: "请输入开始时间", trigger: "change" }
        ],
        pushEndTime: [
          { required: true, message: "请输入结束时间", trigger: "change" }
        ],
        pushTimeDelay: [
          { required: true, message: "请输入延时时间", trigger: "blur" }
        ],
        timingPushTime: [
          { required: true, message: "请输入定时推送时间", trigger: "blur" }
        ],
        configID: [
          { required: true, message: "请选择发送方式", trigger: "blur" }
        ],
        pushTemplateID: [
          { required: true, message: "请选择推送模板", trigger: "blur" }
        ]
      },
      checkRulesData: {
        pushTemplateName: "", //查询模板
        pushType: "", //查询规则类型
        pushRulesTypeLike: "", //查询消息类型
        configID: "" //查询发送方式
      },
      rulesListData: [],
      listPushRules: [], //推送规则列表
      listPushTemplateList: [], //推送模板列表
      pushRulesTypeName: "", //获取消息类型
      sendTypeList: [], //发送方式列表
      pushRulesID: "", //规则管理id
      handFlag: 0,
      abcd: ""
    };
  },
  created() {
    this.getListPushRules(this.oData);
    this.getListPushRulesType();
    this.getListConfig(this.oData);
  },
  computed: {
    newVal() {
      return this.pushRulesData.configID;
    }
  },
  watch: {
    newVal(val, oldVal) {
      let data = {
        configID: this.pushRulesData.configID
      };
      this.getPushTemplateList(data);
    }
  },
  methods: {
    addRule() {
      this.dialogVisible = true;
      this.handFlag = 1;
      Object.keys(this.pushRulesData).forEach(
        key => (this.pushRulesData[key] = "")
      );
    },
    // 查询列表
    checkRulesList() {
      this.getListPushRules(this.checkRulesData);
    },
    // 确定删除
    delPushRules() {
      RemovePushRules(this.pushRulesID).then(res => {
        this.$message.success("删除成功");
        this.dialogDel = false;
        this.getListPushRules(this.oData);
      });
    },
    getListConfig(data) {
      ListConfig(data).then(res => {
        // console.log("发送方式列表", res);
        this.sendTypeList = res.data;
      });
    },
    keepRules(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.handFlag == 1) {
            CreatePushRules(this.pushRulesData).then(res => {
              // console.log("创建推送规则", res);
              this.dialogVisible = false;
              this.$message.success("创建成功");
              this.getListPushRules(this.oData);
            });
          } else {
            ModifyPushRules(this.pushRulesData).then(res => {
              this.dialogVisible = false;
              this.$message.success("修改成功");
              this.getListPushRules(this.oData);
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取模板信息
    getPushTemplateList(data) {
      ListPushTemplate(data).then(res => {
        // console.log("推送模板信息列表", res);
        this.listPushTemplateList = res.data;
      });
    },
    // 获取消息类型列表
    getListPushRulesType() {
      ListPushRulesType().then(res => {
        // console.log("消息列表", res);
        this.listPushRules = res.data;
      });
    },
    getListPushRules(data) {
      ListPushRules(data).then(res => {
        // console.log("res", res);
        this.rulesListData = this.changePushRulesType(res.data);
      });
    },
    changePushRulesType(data) {
      data.forEach((item, index) => {
        // console.log("推送规则类型1", typeof item.pushType);
        // console.log("推送规则类型2", item.pushType);
        switch (item.pushType) {
          case 1:
            item.pushType = "立即推送";
            break;
          case 2:
            item.pushType = "定时推送";
            break;
          case 3:
            item.pushType = "延时推送";
            break;
        }
        if (item.timingPushTime.indexOf("1900") != -1) {
          item.timingPushTime = "-";
        } else {
          item.timingPushTime = item.timingPushTime.split("T")[1].split("+")[0];
        }
        // console.log("pushStartTime", item.pushStartTime);
        if (
          item.pushStartTime.indexOf("1900") != -1 ||
          item.pushEndTime.indexOf("1900") != -1
        ) {
          this.$set(item, "configInfo", "-");
        } else {
          let oCreated = "";
          let oUpdate = "";
          oCreated = item.pushStartTime.split("T")[1].split("+")[0];
          oUpdate = item.pushEndTime.split("T")[1].split("+")[0];
          this.$set(item, "configInfo", oCreated + "-" + oUpdate);
        }
      });
      return data;
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.handFlag = 2;
      let oPushRulesID = row.pushRulesID;
      GetPushRules(oPushRulesID).then(res => {
        this.pushRulesData = this.changeTime(res.data);
      });
    },
    changeTime(data) {
      if (data.timingPushTime.indexOf("1900") == -1) {
        data.timingPushTime = data.timingPushTime.split("T")[1].split("+")[0];
      }
      if (
        data.pushStartTime.indexOf("1900") == -1 ||
        data.pushEndTime.indexOf("1900") == -1
      ) {
        data.pushStartTime = data.pushStartTime.split("T")[1].split("+")[0];
        data.pushEndTime = data.pushEndTime.split("T")[1].split("+")[0];
      }
      switch (data.pushType) {
        case 1:
          data.pushType = "立即推送";
          break;
        case 2:
          data.pushType = "定时推送";
          break;
        case 3:
          data.pushType = "延时推送";
          break;
      }
      return data;
    },
    handleDelete(index, row) {
      this.dialogDel = true;
      this.pushRulesID = row.pushRulesID;
    }
  }
};
</script>

<style scoped>
.rules-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.rules-block-item {
  margin-right: 20px;
  margin-bottom: 20px;
}
label {
  margin-right: 20px;
}
.dialo-item {
  margin-bottom: 20px;
}
.dialo-item label {
  display: inline-block;
  width: 100px;
  text-align: right;
  line-height: 35px;
}
.ml >>> .el-input {
  width: 209px;
  margin-left: 4px;
}
</style>
