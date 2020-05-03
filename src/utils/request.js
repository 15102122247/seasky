import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { getConfig } from "@/utils/config";
import { startLoading, endLoading } from "@/utils/loading";
// try to get baseURL from config
let baseURL;
if (process.env.NODE_ENV === "production") {
  getConfig().then(config => {
    if (config.baseURL) {
      baseURL = config.baseURL;
    }
  });
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    startLoading();
    // do something before request is sent
    // use baseURL
    if (baseURL) {
      config.baseURL = baseURL;
    }

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["X-Token"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    endLoading();
    const res = response.data;
    if (res.isSuccess == true) {
      return res;
    } else {
      Message({
        message: res.errorMessage || "Error",
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(res);
    }
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || "Error",
    //     type: "error",
    //     duration: 5 * 1000
    //   });
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm(
    //       "You have been logged out, you can cancel to stay on this page, or log in again",
    //       "Confirm logout",
    //       {
    //         confirmButtonText: "Re-Login",
    //         cancelButtonText: "Cancel",
    //         type: "warning"
    //       }
    //     ).then(() => {
    //       store.dispatch("user/resetToken").then(() => {
    //         location.reload();
    //       });
    //     });
    //   }
    //   return Promise.reject(new Error(res.message || "Error"));
    // } else {
    //   return res;
    // }
  },
  error => {
    let errMsg = "";
    if (
      error.code == "ECONNABORTED" &&
      error.message.indexOf("timeout") != -1
    ) {
      errMsg = "no response from server";
    } else {
      switch (error.response.status) {
        case 401:
          errMsg = "no login or login is invalid";
          break;
        case 403:
          errMsg = "server reject";
          break;
        default:
          errMsg = error.response.statusText;
          break;
      }
    }

    const msg = `${error.response.status}: ${errMsg}`;

    console.log(error); // for debug

    Message({
      message: msg,
      type: "error",
      duration: 5 * 1000
    });

    return Promise.reject(error);
  }
);

export default service;
