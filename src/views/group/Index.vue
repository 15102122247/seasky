<template>
  <div class="group" @click="bodyClick2">
    <h2>人员分组管理</h2>
    <div class="group-main">
      <div class="group-fl">
        <h4>分组信息</h4>
        <div class="group-block">
          <div class="group-block-item" style="display:flex;">
            <label>分组名称：</label>
            <el-input v-model="groupName" clearable></el-input>
          </div>
          <div class="group-block-item">
            <el-button type="primary" @click="checkGroupList">查询</el-button>
          </div>
          <div class="group-block-item">
            <el-button type="success" @click="addGroupList">添加</el-button>
          </div>
        </div>
        <div class="group-table">
          <el-table
            :data="groupList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionGroupList"
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column
              prop="groupName"
              label="分组名称"
              width="200"
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
                  type="success"
                  @click="checkInfo(scope.$index, scope.row)"
                  >查看分组人员信息</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="delGroup(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="group-fr" v-show="groupFrStatus">
        <h4>人员查询条件</h4>
        <div class="group-block">
          <div class="group-block-item">
            <label class="wtS">工号</label>
            <el-input v-model="checkPersonTrem.userNo" clearable></el-input>
          </div>
          <div class="group-block-item" style="position: relative;">
            <label class="wtS">部门</label>
            <el-input
              v-model="deptName"
              @focus="seeTree2"
              id="treeInfoipt2"
              clearable
            ></el-input>
            <div class="deptTree" v-if="treeFlag2" id="treeInfo2">
              <el-tree
                :data="deptInfo"
                :props="defaultProps"
                highlight-current
                @node-click="handleNodeClick2"
              ></el-tree>
            </div>
          </div>
          <div class="group-block-item">
            <label class="wtS">姓名</label>
            <el-input v-model="checkPersonTrem.userName" clearable></el-input>
          </div>
          <div class="group-block-item">
            <label class="wtS">类型</label>
            <el-select
              v-model="checkPersonTrem.userType"
              placeholder="请选择"
              clearable
            >
              <el-option label="管理员" value="管理员"></el-option>
              <el-option label="员工" value="员工"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </div>
          <div class="group-block-item">
            <el-button type="success" size="small" @click="checkPersonGroup2"
              >查询</el-button
            >
          </div>
          <div class="group-block-item">
            <el-button type="primary" size="small" @click="dialogAdd = true"
              >新增</el-button
            >
          </div>
          <div class="group-block-item">
            <el-button type="danger" size="small" @click="seeDelGroup"
              >删除</el-button
            >
          </div>
        </div>
        <h4>组下人员信息</h4>
        <div class="group-table">
          <el-table
            ref="multipleTable"
            :data="groupPersonList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectGroupPerson"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              prop="userCode"
              width="80"
              label="工号"
            ></el-table-column>
            <el-table-column
              prop="userName"
              width="80"
              label="姓名"
            ></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="email" label="邮件"></el-table-column>
          </el-table>
        </div>
        <div class="group-pagination">
          <div class="checkAll">
            <el-checkbox
              v-model="checkedAllPerson2"
              :indeterminate="isIndeterminate2"
              @change="checkAllPerson2"
              >全选</el-checkbox
            >
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNOGroupPerson"
            :page-sizes="[5, 10]"
            :page-size="pageSizeGroupPerson"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataCountGroupPerson"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <el-form
        :model="groupInfo"
        :rules="rules"
        ref="groupInfo"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分组名称：" prop="groupName">
          <el-input v-model="groupInfo.groupName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="keppGroupList('groupInfo')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogDel" width="30%">
      <div class="dialogBody">确定删除该条信息？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="danger" @click="confirmDel">确定删除</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogDelGroup" width="30%">
      <div class="dialogBody">确定删除这些信息？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelGroup = false">取 消</el-button>
        <el-button type="danger" @click="confirmDelGroup">确定删除</el-button>
      </span>
    </el-dialog>
    <el-dialog title="人员选择" :visible.sync="dialogAdd" width="800px">
      <table-group
        @handlePerson="getPersonChild"
        ref="groupChild"
      ></table-group>
    </el-dialog>
  </div>
</template>

<script>
import TableGroup from "@/views/common/tableGroup";
import {
  ListGroup,
  CreateGroup,
  GetGroup,
  ModifyGroup,
  ListUser,
  RemoveGroup,
  ListDept,
  CreateUserGroup,
  RemoveUserGroup
} from "@/api/network";
export default {
  data() {
    return {
      multipleSelectionGroupList: [],
      multipleSelectionPerson: [],
      groupFrStatus: false,
      dialogAdd: false,
      // 最新
      oData: {},
      dialogVisible: false,
      dialogDel: false,
      groupList: [], //分组列表
      groupName: "", //分组名称
      tickFlag: 0, //判断是添加还是修改
      groupInfo: {
        groupName: "" //添加or修改分组名称
      },
      rules: {
        groupName: [
          { required: true, message: "请输入分组名称", trigger: "blur" }
        ]
      },
      groupPersonList: [], //组下人员信息列表
      oGroupId: "",
      pageNOGroupPerson: 0,
      pageSizeGroupPerson: 0,
      dataCountGroupPerson: 0,
      deptInfo: [],
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      selectOrg: {
        orgsid: []
      },
      deptName: "",
      deptName2: "",
      checkPerson: {
        deptID: ""
      },
      treeFlag: false,
      treeFlag2: false,
      dataCountPerson: 0, //总数
      pageSizePerson: 0, //每页显示多少条
      pageNOPerson: 0, //当前页
      driver_id: [],
      checkedAllPerson: false,
      isIndeterminate: false,
      checkedAllPerson2: false,
      isIndeterminate2: false,
      checkPersonTrem: {
        userNo: "", //工号
        deptID: "", //部门
        userName: "", //姓名
        userType: "", //类型
        groupID: ""
      },
      groupID: "",
      dialogDelGroup: false,
      multipleSelect: [],
      pathFlag: 0
    };
  },
  components: {
    TableGroup
  },
  computed: {},
  watch: {
    multipleSelect(val, oldVal) {
      if (val.length != 0) {
        if (val.length == this.groupPersonList.length) {
          this.checkedAllPerson2 = true;
        } else {
          this.checkedAllPerson2 = false;
        }
      } else {
        this.checkedAllPerson2 = false;
      }
    },
    pathFlag(val, oldVal) {
      if (val == 2) {
        let arr = [];
        this.multipleSelectionPerson.forEach(item => {
          arr.push(item.userCode);
        });
        let data = {
          groupId: this.groupID,
          userNoList: arr
        };
        CreateUserGroup(data).then(res => {
          let data = {
            groupId: this.groupID
          };
          this.setListUser(data);
          this.dialogAdd = false;
          this.pathFlag = 0;
          this.$message.success("添加成功");
          this.$refs.groupChild.clearSelection();
        });
      }
    }
  },
  created() {
    this.getListGroup(this.oData);
    this.getListDept(this.oData);
  },
  methods: {
    getPersonChild(obj) {
      this.pathFlag = obj.current;
      this.multipleSelectionPerson = obj.multipleSelectionPerson;
    },
    // 批量删除组下人员
    seeDelGroup() {
      if (this.multipleSelect.length == 0) {
        this.$message.error("删除信息不能为空");
        return;
      }
      this.dialogDelGroup = true;
    },
    // 确定删除组下人员
    confirmDelGroup() {
      let arr = [];
      this.multipleSelect.forEach(item => {
        arr.push(item.userCode);
      });
      let data = {
        userNoList: arr,
        groupId: this.groupID
      };
      RemoveUserGroup(data).then(res => {
        let data = {
          groupID: this.groupID
        };
        this.setListUser(data);
        this.dialogDelGroup = false;
        this.$message.success("删除成功");
      });
    },
    // 人员列表全选
    checkAllPerson() {
      this.$refs.multipleTableP.toggleAllSelection();
      this.isIndeterminate = false;
    },
    checkAllPerson2() {
      this.$refs.multipleTable.toggleAllSelection();
      this.isIndeterminate2 = false;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      let data = {
        pageNO: this.pageNOPerson,
        pageSize: this.pageSize,
        groupID: this.groupID
      };
      this.setListUser(data);
    },
    handleCurrentChange(val) {
      this.pageNO = val;
      let data = {
        pageNO: this.pageNO,
        pageSize: this.pageSize,
        groupID: this.groupID
      };
      this.setListUser(data);
    },
    bodyClick2(e) {
      if (e.target.id == "treeInfo2" || e.target.id == "treeInfoipt2") {
        this.treeFlag2 = true;
      } else {
        this.treeFlag2 = false;
      }
    },

    seeTree2() {
      this.treeFlag2 = true;
    },
    handleNodeClick2(data) {
      console.log("data", data);
      this.deptName2 = data.deptName;
      this.checkPersonTrem.deptID = data.deptID;
    },
    checkPersonGroup2() {
      this.setListUser(this.checkPersonTrem);
    },
    // 部门列表
    getListDept(data) {
      ListDept(data).then(res => {
        this.deptInfo = res.data;
      });
    },
    // 确定删除单条分组
    confirmDel() {
      RemoveGroup(this.oGroupId).then(res => {
        this.dialogDel = false;
        this.$message.success("删除成功");
        this.getListGroup(this.oData);
      });
    },
    // 删除分组信息
    delGroup(index, row) {
      this.dialogDel = true;
      this.oGroupId = row.groupID;
    },
    getCreateGroup(data) {
      CreateGroup(data).then(res => {
        this.getListGroup(this.oData);
      });
    },
    keppGroupList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.tickFlag == 1) {
            this.getCreateGroup(this.groupInfo);
            this.$message.success("添加成功");
          } else {
            ModifyGroup(this.groupInfo).then(res => {
              this.getListGroup(this.oData);
            });
            this.$message.success("修改成功");
          }
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加分组
    addGroupList() {
      Object.keys(this.groupInfo).forEach(key => (this.groupInfo[key] = ""));
      this.dialogVisible = true;
      this.tickFlag = 1;
    },
    // 查询分组列表
    checkGroupList() {
      let data = {
        groupName: this.groupName
      };
      this.getListGroup(data);
    },
    getListGroup(data) {
      ListGroup(data).then(res => {
        console.log("分组列表", res.data.listData);
        this.groupList = res.data.listData;
      });
    },
    checkAll(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 取消选中
    infoHandle(id) {
      this.multipleSelectionPerson.forEach((item, index) => {
        if (item.userCode === id) {
          this.multipleSelectionPerson.splice(index, 1);
          this.$refs.multipleTableP.toggleRowSelection(item);
        }
      });
    },
    handleSelectionGroupList(val) {
      this.multipleSelectionGroupList = val;
    },
    handleSelectGroupPerson(val) {
      this.multipleSelect = val;
    },
    // 修改
    handleEdit(index, row) {
      console.log(row);
      this.dialogVisible = true;
      this.tickFlag = 2;
      let groupID = row.groupID;
      GetGroup(groupID).then(res => {
        this.groupInfo = res.data;
      });
    },
    setListUser(data) {
      ListUser(data).then(res => {
        console.log("分组下人员列表", res.data);
        this.groupPersonList = res.data.listData;
        this.pageNOGroupPerson = res.data.pageNO;
        this.pageSizeGroupPerson = res.data.pageSize;
        this.dataCountGroupPerson = res.data.dataCount;
      });
    },
    // 查看
    checkInfo(index, row) {
      this.groupFrStatus = true;
      this.groupID = row.groupID;
      this.checkPersonTrem.groupID = row.groupID;
      let data = {
        groupID: this.groupID
      };
      this.setListUser(data);
    }
  }
};
</script>

<style scoped>
/* .group-main {
  min-height: calc(100vh - 191px);
} */
.deptTree {
  position: absolute;
  top: 38px;
  left: 51px;
  width: 209px;
  max-height: 200px;
  z-index: 10;
  overflow-y: scroll;
  overflow-x: hidden;
}
.deptTree2 {
  position: absolute;
  top: 38px;
  left: 81px;
  width: 209px;
  max-height: 200px;
  z-index: 10;
  overflow-y: scroll;
  overflow-x: hidden;
}
.group-main {
  display: flex;
}
.group-fl {
  width: 40%;
}
.group-fr {
  width: 60%;
}
.group-fl,
.group-fr {
  min-height: calc(100vh - 191px);
  border: 1px solid #ccc;
  padding: 20px;
}
.group-fl {
  /* background: #ccc; */
  margin-right: 20px;
}
.group-fr {
  /* background: #eee; */
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
.dialo-item {
  margin-bottom: 20px;
  display: flex;
}
.dialo-item label {
  display: inline-block;
  width: 100px;
  text-align: right;
  line-height: 35px;
}
.group-pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.el-select {
  width: 100%;
}
.wtS {
  width: 60px !important;
}
.checkAll {
  margin-left: 14px;
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
