<template>
  <div class="rules">
    <h2>推送模板管理</h2>
    <div class="rules-block">
      <div class="rules-block-item" style="display:flex;">
        <label>推送类型</label>
        <el-select v-model="pushTypeCheck" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in sendTypeList"
            :key="index + 'sendTypeList'"
            :label="item.configType"
            :value="item.configType"
          ></el-option>
        </el-select>
      </div>
      <div class="rules-block-item" style="display:flex;">
        <label>模板名称</label>
        <el-input v-model="pushTemplateNameCheck" clearable></el-input>
      </div>

      <div class="rules-block-item">
        <el-button type="primary" @click="checkInfo">查询</el-button>
      </div>
      <div class="rules-block-item">
        <el-button type="success" @click="addTemplateList">添加</el-button>
      </div>
    </div>
    <div class="rules-table">
      <el-table :data="listTemplateData" stymessagele="width: 100%">
        <el-table-column prop="pushType" label="推送类型"></el-table-column>
        <el-table-column
          prop="pushTemplateName"
          label="模板名称"
        ></el-table-column>
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
    <el-dialog :visible.sync="dialogVisible" width="500px">
      <el-form
        :model="pushTemplate"
        :rules="rules"
        ref="pushTemplate"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="推送类型" prop="pushType">
          <el-select
            v-model="pushTemplate.pushType"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in sendTypeList"
              :key="index + 'sendTypeList'"
              :label="item.configType"
              :value="item.configType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="pushTemplateName" class="wt">
          <el-input
            v-model="pushTemplate.pushTemplateName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="模板类型" prop="PushTemplateType">
          <el-radio class="tl" v-model="pushTemplate.pushTemplateType" label="1"
            >纯文本</el-radio
          >
          <el-radio class="tl" v-model="pushTemplate.pushTemplateType" label="2"
            >富文本</el-radio
          >
        </el-form-item>
        <el-form-item label="模板内容" prop="PushTemplateContent">
          <el-input
            v-show="pushTemplate.pushTemplateType == '1'"
            class="item-block"
            v-model="pushTemplate.pushTemplateContent"
            type="textarea"
          ></el-input>
          <editor
            v-show="pushTemplate.pushTemplateType == '2'"
            ref="editorChild"
          ></editor>
        </el-form-item>
        <el-form-item>
          <el-button class="addField" type="primary" @click="addField"
            >添加字段</el-button
          >
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addToTemplate('pushTemplate')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogDel" width="30%">
      <div class="dialogBody">确定删除该条信息？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="danger" @click="delInfo">确定删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 组件
import editor from "@/views/template/common/editor";
// 接口
import {
  CreatePushTemplate,
  ListPushTemplate,
  GetPushTemplate,
  RemovePushTemplate,
  ListConfig,
  ModifyPushTemplate
} from "@/api/network";
export default {
  data() {
    return {
      dialogDel: false,
      // 推送模板管理
      dialogVisible: false,
      pushTemplate: {
        pushType: "", //推送类型
        pushTemplateName: "", //模板名称
        pushTemplateType: "1",
        pushTemplateContent: ""
      },
      rules: {
        pushType: [
          { required: true, message: "请输入推送类型", trigger: "change" }
        ],
        pushTemplateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ]
      },
      oData: {},
      listTemplateData: [],
      pushTypeCheck: "",
      pushTemplateNameCheck: "",
      extendNum: 1,
      editorNum: 1,
      editorHtml: "",
      oPushTemplateID: "",
      sendTypeList: [],
      templateFlag: 0
    };
  },
  created() {
    this.getListPushTemplate(this.oData);
    this.getListConfig(this.oData);
  },
  methods: {
    getListConfig(data) {
      ListConfig(data).then(res => {
        console.log("发送方式列表", res.data);
        this.sendTypeList = res.data;
      });
    },
    addTemplateList() {
      this.dialogVisible = true;
      this.templateFlag = 1;
      this.pushTemplate.pushType = this.pushTemplate.pushTemplateName = this.pushTemplate.pushTemplateContent =
        "";
      if (this.$refs.editorChild) {
        this.$refs.editorChild.clearEditorContent();
      }
    },
    getListPushTemplate(data) {
      ListPushTemplate(data).then(res => {
        console.log("模板信息列表", res);
        this.listTemplateData = res.data;
      });
    },
    addToTemplate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.templateFlag == 1) {
            CreatePushTemplate(this.pushTemplate).then(res => {
              console.log("创建模板", res);
              this.dialogVisible = false;
              this.$message.success("创建成功");
              this.getListPushTemplate(this.oData);
            });
          } else {
            ModifyPushTemplate(this.pushTemplate).then(res => {
              this.dialogVisible = false;
              this.$message.success("修改成功");
              this.getListPushTemplate(this.oData);
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加模板内容字段
    addField() {
      if (this.pushTemplate.pushTemplateType == "1") {
        if (this.extendNum <= 10) {
          this.pushTemplate.pushTemplateContent +=
            "{{Extend" + this.extendNum + "}}";
          this.extendNum++;
        } else {
          this.$message.error("最多添加十个字段");
        }
      } else {
        if (this.editorNum <= 10) {
          this.pushTemplate.pushTemplateContent = window.editor.txt
            .html()
            .replace(/\s+/g, "");
          this.pushTemplate.pushTemplateContent +=
            "{{Extend" + this.editorNum + "}}";
          console.log("editorHtml", this.pushTemplate.pushTemplateContent);
          window.editor.txt.html(this.pushTemplate.pushTemplateContent);
          this.editorNum++;
        } else {
          this.$message.error("最多添加十个字段");
        }
      }
    },
    handleEdit(index, row) {
      let oPushTemplateID = "";
      this.dialogVisible = true;
      this.templateFlag = 2;
      oPushTemplateID = row.pushTemplateID;
      GetPushTemplate(oPushTemplateID).then(res => {
        this.pushTemplate = res.data;
        if (this.pushTemplate.pushTemplateType == "2") {
          window.editor.txt.html(this.pushTemplate.pushTemplateContent);
        }
      });
    },
    handleDelete(index, row) {
      this.dialogDel = true;
      this.oPushTemplateID = row.pushTemplateID;
    },
    // 确定删除
    delInfo() {
      RemovePushTemplate(this.oPushTemplateID).then(res => {
        this.dialogDel = false;
        this.$message.success("删除成功");
        this.getListPushTemplate(this.oData);
      });
    },
    // 查询
    checkInfo() {
      let data = {
        pushType: this.pushTypeCheck,
        pushTemplateName: this.pushTemplateNameCheck
      };
      this.getListPushTemplate(data);
    }
  },
  components: {
    editor
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
  display: inline-block;
  width: 100px;
  text-align: right;
  line-height: 35px;
  margin-right: 20px;
}
.dialo-item {
  margin-bottom: 20px;
  display: flex;
}
.dialo-item label {
  display: inline-block;
  width: 120px;
  text-align: right;
  line-height: 35px;
}
.dialo-item .el-input {
  width: 209px;
}
.dialo-item .addField {
  margin-left: 138px;
}
.tl {
  text-align: left !important;
}
.dialo-item .dialo-item-content {
  width: 209px;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 20px 0 20px 144px;
  overflow-y: scroll;
}
.dialo-item .item-block {
  width: 209px;
}
.wt .el-input {
  width: 209px;
}
.item-block {
  width: 209px;
  height: 150px;
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
