/*
 * @Description:
 * @Autor: dong jun hua
 * @Date: 2020-03-13 10:03:58
 * @LastEditors: dong jun hua
 * @LastEditTime: 2020-04-21 11:13:30
 */
// import { login, logout, getInfo } from "@/api/user";

import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

import { GetLoginInfo, LogOut } from "@/api/network";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  user: {}
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USER: (state, user) => {
    state.user = user;
  }
};

const actions = {
  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      GetLoginInfo()
        .then(res => {
          console.log('res',res);
          const { data } = res;
          const { menuList, userID, userName, userNo } = data;
          const roles = menuList.map(t => t.menuID);

          commit("SET_TOKEN", userID);
          setToken(userID);
          commit("SET_ROLES", roles);
          commit("SET_NAME", userName);
          commit(
            "SET_AVATAR",
            "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
          ); // 头像
          commit("SET_INTRODUCTION", userNo);
          commit("SET_USER", data);

          resolve({ data, roles });
        })
        .catch(res => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch("tagsView/delAllViews", null, { root: true });

          window.location.href = res.data.loginUrl;
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      LogOut()
        .then(res => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch("tagsView/delAllViews", null, { root: true });

          window.location.href = res.data;
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";

      commit("SET_TOKEN", token);
      setToken(token);

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch("tagsView/delAllViews", null, { root: true });

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
