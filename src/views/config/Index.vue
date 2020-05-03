<template>
  <div class="rules">
    <h2>配置信息管理</h2>
    <div class="rules-block">
      <div class="rules-block-item" style="display:flex;">
        <label>配置类型</label>
        <el-input v-model="checkType" clearable></el-input>
      </div>
      <div class="rules-block-item" style="display:flex;">
        <label>配置名称</label>
        <el-input v-model="checkName" clearable></el-input>
      </div>

      <div class="rules-block-item">
        <el-button type="primary" @click="checkInfo">查询</el-button>
      </div>
      <div class="rules-block-item">
        <el-button type="success" @click="add">添加</el-button>
      </div>
    </div>
    <div class="rules-table">
      <el-table :data="tableDataConfig" stymessagele="width: 100%">
        <el-table-column prop="configType" label="配置类型"></el-table-column>
        <el-table-column prop="configName" label="名称"></el-table-column>
        <el-table-column prop="configInfo" label="模板信息"></el-table-column>
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
    <el-dialog :visible.sync="dialogVisible">
      <el-form
        :model="config"
        :rules="rules"
        ref="config"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="配置类型" prop="configType">
          <el-select
            v-model="config.configType"
            placeholder="请选择"
            clearable
            style="width:209px"
          >
            <el-option label="短信" value="短信"></el-option>
            <el-option label="邮箱" value="邮箱"></el-option>
            <el-option label="微信" value="微信"></el-option>
            <el-option label="企业微信" value="企业微信"></el-option>
          </el-select>
          <!-- <el-input v-model="config.configType"></el-input> -->
        </el-form-item>
        <el-form-item label="配置信息名称" prop="configName">
          <el-input v-model="config.configName" clearable></el-input>
        </el-form-item>
        <el-form-item label="应用ID" prop="appID">
          <el-input v-model="config.appID" clearable></el-input>
        </el-form-item>
        <el-form-item label="应用密钥" prop="appSecret">
          <el-input v-model="config.appSecret" clearable></el-input>
        </el-form-item>
        <el-form-item label="消息加密密钥" prop="encodingAESKey">
          <el-input v-model="config.encodingAESKey" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段1" prop="extend1">
          <el-input v-model="config.extend1" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段2" prop="extend2">
          <el-input v-model="config.extend2" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段3" prop="extend3">
          <el-input v-model="config.extend3" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段4" prop="extend4">
          <el-input v-model="config.extend4" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段5" prop="extend5">
          <el-input v-model="config.extend5" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段6" prop="extend6">
          <el-input v-model="config.extend6" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段7" prop="extend7">
          <el-input v-model="config.extend7" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段8" prop="extend8">
          <el-input v-model="config.extend8" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展字段9" prop="extend9">
          <el-input v-model="config.extend9" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addToConfig('config')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogDel" width="30%">
      <div class="dialogBody">确定删除该条信息？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="danger" @click="mineDel">确定删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  ListConfig,
  CreateConfig,
  ModifyConfig,
  GetConfig,
  RemoveConfig
} from "@/api/network";
export default {
  data() {
    return {
      config: {
        configType: "", //配置信息类型
        configName: "", //配置信息名称
        appID: "", //应用ID
        appSecret: "", //应用秘钥
        encodingAESKey: "", //消息加密秘钥
        extend1: "", //扩展字段1
        extend2: "", //扩展字段2
        extend3: "", //扩展字段3
        extend4: "", //扩展字段4
        extend5: "", //扩展字段5
        extend6: "", //扩展字段6
        extend7: "", //扩展字段7
        extend8: "", //扩展字段8
        extend9: "" //扩展字段9
      },
      rules: {
        configType: [
          { required: true, message: "请输入配置信息类型", trigger: "change" }
        ]
        // configName: [
        //   { required: true, message: "请输入配置信息名称", trigger: "blur" }
        // ],
        // appID: [{ required: true, message: "请输入应用ID", trigger: "blur" }],
        // appSecret: [
        //   { required: true, message: "请输入消息加密秘钥", trigger: "blur" }
        // ],
        // encodingAESKey: [
        //   { required: true, message: "请输入应用秘钥", trigger: "blur" }
        // ],
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
        // ]
      },
      tableDataConfig: [],
      dialogVisible: false,
      dialogDel: false,
      flagTag: 0,
      delConfigID: "",
      checkType: "",
      checkName: "",
      oData: {}
    };
  },
  created() {
    this.getListConfig(this.oData);
  },
  methods: {
    // 查询消息列表
    checkInfo() {
      let data = {
        ConfigType: this.checkType,
        ConfigName: this.checkName
      };
      this.getListConfig(data);
    },
    // 获取列表数据
    getListConfig(data) {
      ListConfig(data).then(res => {
        this.tableDataConfig = this.setConfigInfo(res.data);
      });
    },
    // 对返回的数据时间做处理
    setConfigInfo(arr) {
      // console.log("arr1", arr);
      let oCreated = "";
      let oUpdate = "";
      arr.forEach(item => {
        oCreated = item.gmtCreateDate.split("T")[1].split(".")[0];
        oUpdate = item.gmtUpdateDate.split("T")[1].split(".")[0];
        this.$set(item, "configInfo", oCreated + "-" + oUpdate);
      });
      // console.log("arr2", arr);
      return arr;
    },
    // 添加按钮
    add() {
      Object.keys(this.config).forEach(key => (this.config[key] = ""));
      this.dialogVisible = true;
      this.flagTag = 1;
    },
    addToConfig(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.flagTag == 1) {
            CreateConfig(this.config).then(res => {
              this.getListConfig(this.oData);
              this.dialogVisible = false;
              this.successDialog("恭喜你，创建成功！");
            });
          } else if (this.flagTag == 2) {
            ModifyConfig(this.config).then(res => {
              this.getListConfig(this.oData);
              this.dialogVisible = false;
              this.successDialog("恭喜你，修改成功！");
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    successDialog(msg) {
      this.$message.success(msg);
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.flagTag = 2;
      let configID = row.configID;
      GetConfig(configID).then(res => {
        this.config = res.data;
      });
    },
    handleDelete(index, row) {
      this.dialogDel = true;
      this.delConfigID = row.configID;
    },
    // 确定删除
    mineDel() {
      RemoveConfig(this.delConfigID).then(res => {
        this.getListConfig(this.oData);
        this.dialogDel = false;
        this.successDialog("恭喜你，删除成功！");
      });
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
.el-input {
  width: 209px;
}
</style>
