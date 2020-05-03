<template>
  <div @click="bodyClick">
    <div class="group-block">
      <div class="group-block-item">
        <label>工号</label>
        <el-input v-model="checkPersonInfo.userNo"></el-input>
      </div>
      <div class="group-block-item" style="position: relative;">
        <label>部门</label>
        <el-input
          v-model="deptName"
          @focus="seeTree"
          id="treeInfoipt"
          clearable
        ></el-input>
        <div class="deptTree" v-if="treeFlag" id="treeInfo">
          <el-tree
            :data="deptInfo"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>
      <div class="group-block-item">
        <label>姓名</label>
        <el-input v-model="checkPersonInfo.userName"></el-input>
      </div>
      <div class="group-block-item">
        <label>类型</label>
        <el-select v-model="checkPersonInfo.userType" placeholder="请选择">
          <el-option label="管理员" value="管理员"></el-option>
          <el-option label="员工" value="员工"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </div>
      <div class="group-block-item">
        <el-button type="success" @click="checkPerson">查询</el-button>
      </div>
    </div>
    <div class="group-table">
      <el-table
        :data="listPersonData"
        tooltip-effect="dark"
        style="width: 100%"
        ref="multipleTableP"
        :row-key="getRowKey"
        @selection-change="handleSelectionChangeP"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        ></el-table-column>
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
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column
          prop="deptName"
          label="部门"
          width="80"
        ></el-table-column>
      </el-table>
    </div>
    <div class="group-pagination">
      <div class="checkAll">
        <el-checkbox
          v-model="checkedAll"
          @change="checkAll"
          :indeterminate="isIndeterminate"
          >全选</el-checkbox
        >
      </div>
      <el-pagination
        @size-change="handleSizeChangeP"
        @current-change="handleCurrentChangeP"
        :current-page="pageNOPerson"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSizePerson"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataCountPerson"
      ></el-pagination>
    </div>
    <add-info
      :multipleSelection="multipleSelectionPerson"
      @sendData="infoHandle"
    ></add-info>
    <div class="addPerson">
      <el-button type="primary" @click="addPerson">添加</el-button>
    </div>
  </div>
</template>

<script>
// 组件
import AddInfo from "@/views/common/addInfo";
// 接口
import { ListUser, ListDept } from "@/api/network";
export default {
  data() {
    return {
      //人员列表数据
      listPersonData: [],
      oData: {},
      dataCountPerson: 0,
      pageSizePerson: 0,
      pageNOPerson: 0,
      multipleSelectionPerson: [],
      select_order_number: [],
      select_orderId: [],
      checkPersonInfo: {
        userNo: "", //工号
        deptID: "", //部门
        userName: "", //姓名
        userType: "" //类型
      },
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      treeFlag: false,
      checkedAll: false,
      isIndeterminate: false,
      path: "",
      deptInfo: [], //部门列表
      deptName: "" //部门名称
    };
  },
  created() {
    this.getListUser(this.oData);
    this.getListDept(this.oData);
    this.path = this.$route.path;
  },
  components: {
    AddInfo
  },
  watch: {
    // 如果跨页选择的所有项，在当前页数据里面全部匹配的到，自定义全选按钮打钩
    multipleSelectionPerson(val, oldVal) {
      let arr = this.listPersonData.filter(p =>
        val.map(q => q.userCode).includes(p.userCode)
      );
      if (arr.length == this.listPersonData.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
    }
  },
  methods: {
    addPerson() {
      if (this.path.indexOf("infoedit") > -1) {
        let data = {
          current: 1,
          multipleSelectionPerson: this.multipleSelectionPerson
        };
        this.$emit("handlePerson", data);
      } else if (this.path.indexOf("group") > -1) {
        let data = {
          current: 2,
          multipleSelectionPerson: this.multipleSelectionPerson
        };
        this.$emit("handlePerson", data);
      }
    },
    // 推送列表全选
    checkAll() {
      this.$refs.multipleTableP.toggleAllSelection();
      this.isIndeterminate = false;
    },
    handleNodeClick(data) {
      console.log("data", data);
      this.deptName = data.deptName;
      this.checkPersonInfo.deptID = data.deptID;
    },
    bodyClick(e) {
      if (e.target.id == "treeInfo" || e.target.id == "treeInfoipt") {
        this.treeFlag = true;
      } else {
        this.treeFlag = false;
      }
    },
    seeTree() {
      this.treeFlag = true;
    },
    // 人员列表查询
    checkPerson() {
      this.getListUser(this.checkPersonInfo);
    },
    // 部门列表
    getListDept(data) {
      ListDept(data).then(res => {
        // console.log("部门列表", res.data);
        this.deptInfo = res.data;
      });
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
    async handleCurrentChangeP(val) {
      this.pageNOPerson = val;
      let data = {
        pageNO: this.pageNOPerson,
        pageSize: this.pageSizePerson
      };
      await this.getListUser(data);
    },
    async handleSizeChangeP(val) {
      this.pageSizePerson = val;
      let data = {
        pageNO: this.pageNOPerson,
        pageSize: this.pageSizePerson
      };
      await this.getListUser(data);
    },
    getRowKey(row) {
      return row.userCode;
    },
    handleSelectionChangeP(selection) {
      this.multipleSelectionPerson = selection;
      this.select_order_number = this.multipleSelectionPerson.length;
      if (selection) {
        selection.forEach(row => {
          if (row) {
            this.select_orderId.push(row.userCode);
          }
        });
      }
    },
    async getListUser(data) {
      const res = await ListUser(data);
      this.listPersonData = res.data.listData;
      this.listPersonData.forEach(item => {
        this.$set(item, "src", require("@/assets/svg/success.svg"));
      });
      this.dataCountPerson = res.data.dataCount;
      this.pageSizePerson = res.data.pageSize;
      this.pageNOPerson = res.data.pageNO;
    }
  }
};
</script>

<style scoped>
.addPerson {
  display: flex;
  justify-content: flex-end;
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
.deptTree {
  position: absolute;
  top: 38px;
  left: 87px;
  width: 209px;
  max-height: 200px;
  z-index: 10;
  overflow-y: scroll;
  overflow-x: hidden;
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
.group-pagination {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
</style>
