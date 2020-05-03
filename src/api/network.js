import request from "@/utils/request";

// 配置信息管理页面

// 获取配置信息页面列表
export function ListConfig(data) {
  return request({
    url: "/Config/ListConfig",
    method: "post",
    data
  });
}
// 创建单条配置信息
export function CreateConfig(data) {
  return request({
    url: "/Config/CreateConfig",
    method: "post",
    data
  });
}

// 获取单条配置信息
export function GetConfig(configID) {
  return request({
    url: "/Config/GetConfig",
    method: "get",
    params: { configID }
  });
}

// 修改单条配置信息
export function ModifyConfig(data) {
  return request({
    url: "/Config/ModifyConfig",
    method: "post",
    data
  });
}

// 删除单条配置信息
export function RemoveConfig(configID) {
  return request({
    url: "/Config/RemoveConfig",
    method: "get",
    params: { configID }
  });
}

// 信息编辑推送页面

// 查询推送信息列表
export function ListPushInfo(data) {
  return request({
    url: "/InfoEditPush/ListPushInfo",
    method: "post",
    data
  });
}
// 创建单条推送信息
export function CreatePushInfo(data) {
  return request({
    url: "/InfoEditPush/CreatePushInfo",
    method: "post",
    data
  });
}
// 查询单条推送信息
export function GetPushInfo(pushInfoID) {
  return request({
    url: "/InfoEditPush/GetPushInfo",
    method: "get",
    params: { pushInfoID }
  });
}
// 勾选推送信息
export function SendPushInfo(data) {
  return request({
    url: "/InfoEditPush/SendPushInfo",
    method: "post",
    data
  });
}

// 人员分组管理

// 人员列表
export function ListUser(data) {
  return request({
    url: "/UserGroup/ListUser",
    method: "post",
    data
  });
}
// 创建分组信息
export function CreateGroup(data) {
  return request({
    url: "/UserGroup/CreateGroup",
    method: "post",
    data
  });
}
// 删除单条分组信息
export function RemoveGroup(groupID) {
  return request({
    url: "/UserGroup/RemoveGroup",
    method: "get",
    params: { groupID }
  });
}
// 添加多条足下人员
export function CreateUserGroup(data) {
  return request({
    url: "/UserGroup/CreateUserGroup",
    method: "post",
    data
  });
}
// 批量删除组下人员
export function RemoveUserGroup(data) {
  return request({
    url: "/UserGroup/RemoveUserGroup",
    method: "post",
    data
  });
}
// 修改分组信息
export function ModifyGroup(data) {
  return request({
    url: "/UserGroup/ModifyGroup",
    method: "post",
    data
  });
}
// 查询单条分组信息
export function GetGroup(groupID) {
  return request({
    url: "/UserGroup/GetGroup",
    method: "get",
    params: { groupID }
  });
}
//分组列表
export function ListGroup(data) {
  return request({
    url: "/UserGroup/ListGroup",
    method: "post",
    data
  });
}
// 获取部门列表信息
export function ListDept(data) {
  return request({
    url: "/UserGroup/ListDept",
    method: "post",
    data
  });
}

// 推送规则管理

//查询推送规则列表
export function ListPushRules(data) {
  return request({
    url: "/PushRules/ListPushRules",
    method: "post",
    data
  });
}
// 创建推送规则
export function CreatePushRules(data) {
  return request({
    url: "/PushRules/CreatePushRules",
    method: "post",
    data
  });
}
// 修改推送规则
export function ModifyPushRules(data) {
  return request({
    url: "/PushRules/ModifyPushRules",
    method: "post",
    data
  });
}
// 删除推送规则
export function RemovePushRules(pushRulesID) {
  return request({
    url: "/PushRules/RemovePushRules",
    method: "get",
    params: { pushRulesID }
  });
}
//查询单挑推送规则
export function GetPushRules(pushRulesID) {
  return request({
    url: "/PushRules/GetPushRules",
    method: "get",
    params: { pushRulesID }
  });
}

// 推送模板管理

// 创建推送模板信息
export function CreatePushTemplate(data) {
  return request({
    url: "/PushTemplate/CreatePushTemplate",
    method: "post",
    data
  });
}

// 推送模板信息列表
export function ListPushTemplate(data) {
  return request({
    url: "/PushTemplate/ListPushTemplate",
    method: "post",
    data
  });
}
// 获取单条推送模板信息
export function GetPushTemplate(pushTemplateID) {
  return request({
    url: "/PushTemplate/GetPushTemplate",
    method: "get",
    params: { pushTemplateID }
  });
}
// 修改单挑推送模板信息
export function ModifyPushTemplate(data) {
  return request({
    url: "/PushTemplate/ModifyPushTemplate",
    method: "post",
    data
  });
}
// 删除单条推送模板信息
export function RemovePushTemplate(pushTemplateID) {
  return request({
    url: "/PushTemplate/RemovePushTemplate",
    method: "get",
    params: { pushTemplateID }
  });
}

// 消息类型列表

export function ListPushRulesType(query) {
  return request({
    url: "/PushRulesType/ListPushRulesType",
    method: "get",
    params: { query }
  });
}

// 推送日志记录列表
export function ListPushLog(data) {
  return request({
    url: "/PushLog/ListPushLog",
    method: "post",
    data
  });
}
// 查询单条推送日志记录
export function GetPushLog(query) {
  return request({
    url: "/PushLog/GetPushLog",
    method: "get",
    params: { query }
  });
}

// 获取登录用户信息
export function GetLoginInfo() {
  return request({
    url: "/Login/GetLoginInfo",
    method: "get"
  });
}
// 获取用户权限
export function TicketValidate(ticket) {
  return request({
    url: "/Login/TicketValidate",
    method: "post",
    params: { ticket }
  });
}
// 退出登录
export function LogOut() {
  return request({
    url: "/Login/LogOut",
    method: "get"
  });
}
