import { Loading } from "element-ui";
let loading;
export function startLoading() {
  //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: "Loading",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, .5)"
  });
}
export function endLoading() {
  //使用Element loading-close 方法
  loading.close();
}
