<template>
  <div class="rules">
    <h2>信息编辑推送管理</h2>
    <div class="rules-block">
      <div class="rules-block-item">
        <label>起止时间</label>
        <el-time-select
          placeholder="起始时间"
          v-model="checkEditData.pushStartTime"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00'
          }"
        ></el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="checkEditData.pushEndTime"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00',
            minTime: checkEditData.pushStartTime
          }"
        ></el-time-select>
      </div>
      <div class="rules-block-item" style="display:flex;">
        <label>推送内容</label>
        <el-input
          v-model="checkEditData.pushTemplateContent"
          clearable
        ></el-input>
      </div>
      <div class="rules-block-item" style="display:flex;">
        <label>推送人员</label>
        <el-input v-model="checkEditData.pushUserCode" clearable></el-input>
      </div>
      <div class="rules-block-item">
        <label>信息类型</label>
        <el-select
          v-model="checkEditData.pushRulesType"
          placeholder="请选择"
          clearable
        >
          <el-option
            :label="item.pushRulesTypeName"
            :value="item.pushRulesTypeName"
            v-for="(item, index) in msgTypeList"
            :key="index + 'msgTypeList'"
          ></el-option>
        </el-select>
      </div>
      <div class="rules-block-item">
        <el-button type="primary" @click="checkEdit">查询</el-button>
      </div>
      <div class="rules-block-item">
        <el-button type="success" @click="addIdetInfo">添加</el-button>
      </div>
    </div>
    <div class="relus-push">
      <div class="relus-push-item">
        <el-button type="primary" @click="rePush">重新推送</el-button>
      </div>
      <div class="relus-push-item">
        <el-button type="success" @click="imPush">立即推送</el-button>
      </div>
    </div>
    <div class="rules-table">
      <el-table
        :data="listData"
        tooltip-effect="dark"
        :select-all="allSel"
        style="width: 100%"
        ref="multipleTablel"
        @selection-change="handleSelectionChangel"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectable"
        ></el-table-column>
        <el-table-column prop="pushTemplateContent" label="推送内容">
          <template slot-scope="scope">
            <div v-html="scope.row.pushTemplateContent"></div>
          </template>
        </el-table-column>
        <el-table-column prop="pushUserCode" label="推送人员"></el-table-column>
        <el-table-column
          prop="pushRulesType"
          label="信息类型"
        ></el-table-column>
        <el-table-column prop="sendTime" label="理论推送时间"></el-table-column>
        <el-table-column prop="pushState" label="推送状态"></el-table-column>
      </el-table>
    </div>
    <div class="group-pagination">
      <div class="checkAll">
        <el-checkbox
          v-model="checkedAll"
          @change="checkAll"
          :indeterminate="isIndeterminate2"
          >全选</el-checkbox
        >
      </div>
      <el-pagination
        @size-change="handleSizeChangel"
        @current-change="handleCurrentChangel"
        :current-page="pageNOhome"
        :page-sizes="[5, 10]"
        :page-size="pageSizehome"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataCounthome"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="800px">
      <el-form
        :model="pushInfoAdd"
        :rules="rules"
        ref="pushInfoAdd"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="推送类型：">
          <el-radio v-model="pushInfoAdd.groupFlag" label="1">人员</el-radio>
          <el-radio v-model="pushInfoAdd.groupFlag" label="2">分组</el-radio>
        </el-form-item>
        <el-form-item
          label="选择人员："
          v-if="pushInfoAdd.groupFlag == '1'"
          class="flex"
        >
          <div class="seePerson">
            <add-info
              :multipleSelection="multipleSelectionPerson"
              @sendData="infoHandle"
            ></add-info>
          </div>
          <el-button type="warning" @click="choicePerson">选择</el-button>
        </el-form-item>
        <el-form-item
          label="选择分组："
          prop="groupID"
          v-if="pushInfoAdd.groupFlag == '2'"
        >
          <el-select
            v-model="pushInfoAdd.groupID"
            placeholder="请选择"
            clearable
            class="wt209"
          >
            <el-option
              v-for="(item, index) in groupList"
              :key="index + 'groupList'"
              :label="item.groupName"
              :value="item.groupID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息类型：" prop="pushRulesType">
          <el-select
            v-model="pushInfoAdd.pushRulesType"
            placeholder="请选择"
            clearable
            class="wt209"
          >
            <el-option
              :label="item.pushRulesTypeName"
              :value="item.pushRulesTypeName"
              v-for="(item, index) in msgTypeList"
              :key="index + 'msgTypeList'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送方式：" prop="pushTemplateID">
          <el-select
            v-model="pushInfoAdd.pushTemplateID"
            placeholder="请选择"
            clearable
            class="wt209"
          >
            <el-option
              v-for="(item, index) in sendTypeList"
              :key="index + 'sendTypeList'"
              :label="item.configType"
              :value="item.pushTemplateID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送方式：">
          <el-radio v-model="pushInfoAdd.rulesFlag" label="1"
            >按发送规则</el-radio
          >
          <el-radio v-model="pushInfoAdd.rulesFlag" label="2"
            >立即推送</el-radio
          >
        </el-form-item>
        <el-form-item label="扩展字段1" prop="extend1">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend1"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段2" prop="extend2">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend2"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段3" prop="extend3">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend3"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段4" prop="extend4">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段5" prop="extend5">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend5"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段6" prop="extend6">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend6"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段7" prop="extend7">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend7"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段8" prop="extend8">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend8"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段9" prop="extend9">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend9"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扩展字段10" prop="extend10">
          <el-input
            class="setW"
            v-model="pushInfoAdd.extend10"
            clearable
          ></el-input>
        </el-form-item>
        <div class="temPreview">
          <h4>模板结构预览:</h4>
          <div
            class="temPreview-box"
            v-html="singleTemplateData.pushTemplateContent"
          ></div>
        </div>

        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="keepInfoEdit('pushInfoAdd')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="人员选择" :visible.sync="dialogChoice" width="800px">
      <table-group
        @handlePerson="getPersonChild"
        ref="groupChild"
      ></table-group>
    </el-dialog>
  </div>
</template>

<script>
// 组件
import AddInfo from "@/views/common/addInfo";
import TableGroup from "@/views/common/tableGroup";
// 接口
import {
  ListPushInfo,
  ListPushRulesType,
  ListPushRules,
  GetPushTemplate,
  CreatePushInfo,
  ListGroup,
  SendPushInfo
} from "@/api/network";

export default {
  data() {
    return {
      multipleSelection: [],
      multipleSelectionPerson: [],
      driver_id: [],
      checkedAll: false,
      checkedAllPerson: false,
      allSel: false,
      allSep: false,
      allSelPerson: false,
      listData: [],
      pageSizeP: 10, //每页多少条数据人员列表
      dataCountP: 2, //数据总数
      pageNOP: 1, //当前页数
      pushInfoAdd: {
        pushTemplateID: "",
        isGroup: false, //组true/人员false
        isNowSend: false, //立即推送true按规则推送false
        pushTemplateType: "", //模板类型
        groupFlag: "1",
        rulesFlag: "1",
        personCode: [], //选择人员id数组
        pushRulesType: "", //消息类型
        groupID: "", //分组id
        extend1: "",
        extend2: "",
        extend3: "",
        extend4: "",
        extend5: "",
        extend6: "",
        extend7: "",
        extend8: "",
        extend9: "",
        extend10: ""
      },
      rules: {
        // groupID: [{ required: true, message: "请选择分组", trigger: "change" }],
        pushRulesType: [
          { required: true, message: "请选择消息类型", trigger: "blur" }
        ],
        pushTemplateID: [
          { required: true, message: "请选择发送方式", trigger: "blur" }
        ]
        // extend1: [
        //   { required: true, message: "请输入扩展字段1", trigger: "blur" }
        // ],
        // extend2: [
        //   { required: true, message: "请输入扩展字段2", trigger: "blur" }
        // ],
        // extend3: [
        //   { required: true, message: "请输入扩展字段3", trigger: "blur" }
        // ],
        // extend4: [
        //   { required: true, message: "请输入扩展字段4", trigger: "blur" }
        // ],
        // extend5: [
        //   { required: true, message: "请输入扩展字段5", trigger: "blur" }
        // ],
        // extend6: [
        //   { required: true, message: "请输入扩展字段6", trigger: "blur" }
        // ],
        // extend7: [
        //   { required: true, message: "请输入扩展字段7", trigger: "blur" }
        // ],
        // extend8: [
        //   { required: true, message: "请输入扩展字段8", trigger: "blur" }
        // ],
        // extend9: [
        //   { required: true, message: "请输入扩展字段9", trigger: "blur" }
        // ],
        // extend10: [
        //   { required: true, message: "请输入扩展字段10", trigger: "blur" }
        // ]
      },

      checkEditData: {
        pushStartTime: "",
        pushEndTime: "",
        pushTemplateContent: "",
        pushUserCode: "",
        pushRulesType: ""
      },
      dialogVisible: false,
      dialogChoice: false,
      oData: {},
      msgTypeList: [], //消息类型列表
      sendTypeList: [], //发送方式列表
      templateId: "", //模板id
      singleTemplateData: {}, //单条模板信息
      groupList: [], //分组列表
      pageNOhome: 0,
      pageSizehome: 0,
      dataCounthome: 0, //数据总数
      isIndeterminate: false,
      isIndeterminate2: false,
      pushWay: {
        sendType: 0,
        pushInfoIDs: []
      },
      pathFlag: 0
    };
  },
  components: {
    AddInfo,
    TableGroup
  },
  computed: {
    newVal() {
      return this.pushInfoAdd.groupFlag;
    },
    newRlues() {
      return this.pushInfoAdd.rulesFlag;
    },
    newLength() {
      return this.multipleSelection.length;
    },
    msgType() {
      //消息类型
      return this.pushInfoAdd.pushRulesType;
    },
    newtemplateId() {
      return this.pushInfoAdd.pushTemplateID;
    }
  },
  watch: {
    multipleSelection(val, oldVal) {
      val.forEach(item => {
        this.pushWay.pushInfoIDs.push(item.pushInfoID);
        this.pushWay.pushInfoIDs = this.pushWay.pushInfoIDs.filter(
          (item, index, arr) => {
            return arr.indexOf(item) === index;
          }
        );
      });
    },
    newtemplateId(val, oldVal) {
      if (val != "") {
        GetPushTemplate(val).then(res => {
          this.singleTemplateData = res.data;
          this.pushInfoAdd.pushTemplateType = this.singleTemplateData.pushTemplateType;
        });
      }
    },
    // 监听消息类型去查发送方式
    msgType(val, oldVal) {
      let data = {
        pushRulesType: this.pushInfoAdd.pushRulesType
      };
      this.getListPushRules(data);
    },
    newVal(val, oldVal) {
      console.log("newVal", val);
      if (val == "1") {
        this.pushInfoAdd.isGroup = false;
      } else {
        this.pushInfoAdd.isGroup = true;
      }
    },
    newRlues(val, oldVal) {
      if (val == "1") {
        this.pushInfoAdd.isNowSend = false;
      } else {
        this.pushInfoAdd.isNowSend = true;
      }
    },
    newLength(val, oldVal) {
      if (val == this.listData.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
    },
    pathFlag(val, oldVal) {
      if (val == 1) {
        this.dialogChoice = false;
        this.pathFlag = 0;
      }
    }
  },
  created() {
    this.getListPushInfo(this.oData);
    this.getListPushRulesType();
    this.getListGroup(this.oData);
  },
  methods: {
    getPersonChild(obj) {
      this.pathFlag = obj.current;
      this.multipleSelectionPerson = obj.multipleSelectionPerson;
    },
    addIdetInfo() {
      this.dialogVisible = true;
      Object.keys(this.pushInfoAdd).forEach(
        key => (this.pushInfoAdd[key] = "")
      );
      this.pushInfoAdd.groupFlag = this.pushInfoAdd.rulesFlag = "1";
      this.pushInfoAdd.isGroup = this.pushInfoAdd.isNowSend = false;
      this.pushInfoAdd.personCode = this.multipleSelectionPerson = [];
      this.singleTemplateData.pushTemplateContent = "";
    },
    getRowKey(row) {
      return row.userCode;
    },
    // 重新推送
    rePush() {
      this.pushWay.sendType = 1;
      if (this.pushWay.pushInfoIDs.length == 0) {
        this.$message.error("推送内容不能为空");
      } else {
        this.getSendPushInfo(this.pushWay);
      }
    },
    // 立即推送
    imPush() {
      this.pushWay.sendType = 2;
      if (this.pushWay.pushInfoIDs.length == 0) {
        this.$message.error("推送内容不能为空");
      } else {
        this.getSendPushInfo(this.pushWay);
      }
    },
    getSendPushInfo(data) {
      SendPushInfo(data).then(res => {
        this.getListPushInfo(data);
      });
    },
    // 查询
    checkEdit() {
      this.getListPushInfo(this.checkEditData);
    },
    keepInfoEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.multipleSelectionPerson.forEach(item => {
            this.pushInfoAdd.personCode.push(item.userCode);
          });
          CreatePushInfo(this.pushInfoAdd).then(res => {
            this.dialogVisible = false;
            this.$message.success("创建成功");
            this.getListPushInfo(this.oData);
            this.$refs.groupChild.clearSelection();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getListGroup(data) {
      ListGroup(data).then(res => {
        // console.log("分组列表", res.data.listData);
        this.groupList = res.data.listData;
      });
    },
    // get发送方式
    getListPushRules(data) {
      ListPushRules(data).then(res => {
        this.sendTypeList = res.data;
      });
    },
    // 消息类型列表
    getListPushRulesType() {
      ListPushRulesType().then(res => {
        // console.log("消息类型列表", res.data);
        this.msgTypeList = res.data;
      });
    },
    // 取消选中
    infoHandle(id) {
      this.$refs.groupChild.infoHandle(id);
    },
    // 选择人员
    choicePerson() {
      this.dialogChoice = true;
    },
    // 信息编辑推送列表
    getListPushInfo(data) {
      ListPushInfo(data).then(res => {
        this.listData = this.filterData(res.data.listData);
        this.pageSizehome = res.data.pageSize;
        this.dataCounthome = res.data.dataCount;
        this.pageNOhome = res.data.pageNO;
      });
    },
    filterData(data) {
      data.forEach((item, index) => {
        switch (item.pushState) {
          case 1:
            item.pushState = "待推送";
            break;
          case 2:
            item.pushState = "推送中";
            break;
          case 3:
            item.pushState = "推送成功";
            break;
          case 4:
            item.pushState = "推送失败";
            break;
        }
        switch (item.pushRulesType) {
          case 1:
            item.pushRulesType = "手动推送";
            break;
          case 2:
            item.pushRulesType = "收费";
            break;
          case 3:
            item.pushRulesType = "薪资";
            break;
          case 4:
            item.pushRulesType = "报销";
            break;
        }
        if (item.sendTime.indexOf("1900") != -1) {
          item.sendTime = "-";
        } else {
          item.sendTime = item.sendTime.split("T")[1].split("+")[0];
        }
      });
      return data;
    },
    // 推送列表全选
    checkAll() {
      this.$refs.multipleTablel.toggleAllSelection();
      this.isIndeterminate2 = false;
    },
    // 人员列表全选
    checkAllPerson() {
      this.$refs.multipleTableP.toggleAllSelection();
      this.isIndeterminate = false;
    },
    handleSelectionChangel(val) {
      this.multipleSelection = val;
    },
    handleCurrentChangel(val) {
      this.pageNOhome = val;
      let data = {
        pageNO: this.pageNOhome,
        pageSize: this.pageSizehome
      };
      this.getListPushInfo(data);
    },
    handleSizeChangel(val) {
      this.pageSizehome = val;
      let data = {
        pageNO: this.pageNOhome,
        pageSize: this.pageSizehome
      };
      this.getListPushInfo(data);
    },
    selectable(row, index) {
      if (row.pushState == "推送中") {
        return false;
      } else {
        return true;
      }
    },
    handleEdit(row) {
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.dialogDel = true;
    }
  }
};
</script>

<style scoped>
.flex >>> .el-form-item__content {
  display: flex;
  align-items: flex-start;
}
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
label {
  display: inline-block;
  width: 100px;
  text-align: right;
  line-height: 35px;
}
.tl {
  text-align: left !important;
}
.setW {
  width: auto;
  margin-left: 4px;
  width: 208px;
  margin-right: 20px;
}
.dialogBody {
  position: relative;
}
.temPreview-box {
  width: 280px;
  height: 200px;
  border: 1px solid #000;
}
.temPreview {
  bottom: 300px;
  position: absolute;
  right: 100px;
}
.group-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.group-block-item {
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
}
.group-block-item label {
  display: inline-block;
  width: 120px;
  font-weight: 400;
  line-height: 35px;
}
.relus-push {
  display: flex;
}
.relus-push-item {
  margin-right: 20px;
  margin-bottom: 20px;
}
.group-pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.checkAll label {
  margin-left: 14px;
  text-align: left;
}
.seePerson {
  width: 211px;
  height: 150px;
  border: 1px solid #eee;
  border-radius: 3px;
  margin-right: 20px;
  margin-left: 4px;
  overflow-y: scroll;
}
.seePerson >>> .multipleSelection-item {
  margin-right: 0;
  margin-bottom: 10px;
}
.seePerson >>> .multipleSelection {
  justify-content: space-between;
  padding: 0 15px;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/
::-webkit-scrollbar-track {
  width: 6px;
  background-color: #fff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*滚动条的设置*/
::-webkit-scrollbar-thumb {
  background-color: #1890ff;
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*滚动条移上去的背景*/
::-webkit-scrollbar-thumb:hover {
  background-color: #1890ff;
}
</style>
