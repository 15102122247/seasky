<template>
  <div class="rules">
    <h2>推送日志管理</h2>
    <div class="rules-block">
      <div class="rules-block-item" style="display:flex;">
        <label style="width:120px;">推送人</label>
        <el-input v-model="checkInfo.pushUserNo" clearable></el-input>
      </div>
      <div class="rules-block-item">
        <label>起止时间</label>
        <el-time-select
          placeholder="起始时间"
          v-model="checkInfo.pushStartTime"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00'
          }"
        >
        </el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="checkInfo.pushEndTime"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00',
            minTime: checkInfo.endTime
          }"
        >
        </el-time-select>
      </div>
      <div class="rules-block-item" style="display:flex;">
        <label>发送结果</label>
        <el-input v-model="checkInfo.isPushSuccess" clearable></el-input>
      </div>

      <div class="rules-block-item">
        <el-button type="primary" @click="checkLogList">查询</el-button>
      </div>
    </div>
    <div class="rules-table">
      <el-table :data="logList" stymessagele="width: 100%">
        <el-table-column prop="sendMsg" label="发送信息内容"></el-table-column>
        <el-table-column prop="gmtCreateUser" label="发送人"></el-table-column>
        <el-table-column
          prop="gmtCreateDate"
          label="发送时间"
        ></el-table-column>
        <el-table-column
          prop="isPushSuccess"
          label="发送结果"
        ></el-table-column>
        <el-table-column
          prop="pushErrorMsg"
          label="发送失败原因"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="group-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataCount"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="500px">
      <div class="dialogBody">
        <div class="dialo-item">
          <label>发送消息</label>
          <el-input
            type="textarea"
            v-model="lookLogIofo.pushTemplateContent"
            :disabled="true"
          ></el-input>
        </div>
        <div class="dialo-item">
          <label>接收人员</label>
          <el-input
            v-model="lookLogIofo.pushUserName"
            :disabled="true"
          ></el-input>
        </div>
        <div class="dialo-item">
          <label>消息类型</label>
          <el-input
            v-model="lookLogIofo.pushRulesType"
            :disabled="true"
          ></el-input>
        </div>
      </div>
      <el-table :data="lookLogIofoTable" stymessagele="width: 100%">
        <el-table-column prop="gmtCreateUser" label="发送人"></el-table-column>
        <el-table-column
          prop="gmtCreateDate"
          label="发送时间"
        ></el-table-column>
        <el-table-column
          prop="isPushSuccess"
          label="发送结果"
        ></el-table-column>
        <el-table-column
          prop="pushErrorMsg"
          label="发送失败原因"
        ></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 接口
import { ListPushLog, GetPushLog, GetPushInfo } from "@/api/network";
export default {
  data() {
    return {
      currentPage4: 2,
      // 新数据
      oData: {},
      logList: [],
      pageNo: 0,
      pageSize: 0,
      dataCount: 0,
      checkInfo: {
        pushUserNo: "",
        pushStartTime: "",
        pushEndTime: "",
        isPushSuccess: ""
      },
      dialogVisible: false,
      lookLogIofo: {
        pushTemplateContent: "", //发送消息
        pushUserName: "", //接收人员
        pushRulesType: "" //消息类型
      },
      lookLogIofoTable: []
    };
  },
  created() {
    this.initListPushLog(this.oData);
  },
  methods: {
    // 查询
    checkLogList() {
      this.initListPushLog(this.checkInfo);
    },
    handleEdit(index, row) {
      console.log("row", row);
      this.dialogVisible = true;
      let pushInfoID = row.pushInfoID;
      GetPushInfo(pushInfoID).then(res => {
        console.log("look", res.data);
        this.lookLogIofo = res.data;
        this.lookLogIofoTable = this.filterData(res.data.pushLogInfos);
      });
    },
    initListPushLog(data) {
      ListPushLog(data).then(res => {
        console.log("推送日志列表", res.data);
        this.logList = this.filterData(res.data.listData);
        this.pageNo = res.data.pageNO;
        this.pageSize = res.data.pageSize;
        this.dataCount = res.data.dataCount;
      });
    },
    filterData(data) {
      data.forEach((item, index) => {
        switch (item.isPushSuccess) {
          case true:
            item.isPushSuccess = "发送成功";
            break;
          case false:
            item.isPushSuccess = "发送失败";
            break;
        }
        if (item.gmtCreateDate.indexOf("1900") != -1) {
          item.gmtCreateDate = "-";
        } else {
          item.gmtCreateDate =
            item.gmtCreateDate.split("T")[0] +
            "-" +
            item.gmtCreateDate.split("T")[1].split(".")[0];
        }
      });
      return data;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNo = val;
      let data = {
        pageNO: this.pageNo,
        pageSize: this.pageSize
      };
      this.initListPushLog(data);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      let data = {
        pageNO: this.pageNo,
        pageSize: this.pageSize
      };
      this.initListPushLog(data);
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
  width: 100px;
  text-align: right;
  line-height: 35px;
}
.group-pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
</style>
