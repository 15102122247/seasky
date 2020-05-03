let ruleListResult = {
  isSuccess: true,
  data: [
    {
      pushRulesID: "00000000-0000-0000-0000-000000000000",
      pushRulesType: 0,
      pushType: true,
      timingPushTime: "2020-04-24T00:24:45.611Z",
      pushTimeDelay: "2020-04-24T00:24:45.611Z",
      pushStartTime: "2020-04-24T00:24:45.611Z",
      pushEndTime: "2020-04-24T00:24:45.611Z",
      configID: "00000000-0000-0000-0000-000000000000",
      pushTemplateID: "00000000-0000-0000-0000-000000000000",
      gmtCreateUser: "string",
      gmtCreateDate: "2020-04-24T00:24:45.611Z",
      gmtUpdateUser: "string",
      gmtUpdateDate: "2020-04-24T00:24:45.611Z",
      timestamp: "string"
    }
  ],
  errorCode: "string",
  errorMessage: "string"
};

export default [
  // user login
  {
    url: "/PushRules/ListPushRules",
    type: "post",
    response: config => {
      return ruleListResult;
    }
  }
];
