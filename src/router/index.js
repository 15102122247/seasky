import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
import componentsRouter from "./modules/components";
import chartsRouter from "./modules/charts";
import tableRouter from "./modules/table";
import nestedRouter from "./modules/nested";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/Index"),
        name: "Home",
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/rules",
    component: Layout,
    redirect: "/rules/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/rules/Index"),
        name: "Rules",
        meta: { title: "推送规则管理", icon: "dashboard", noCache: true },
        roles: ["A140EC76-E8E8-4572-82C4-FD1BEAEAD31A"]
      }
    ]
  },
  {
    path: "/person",
    component: Layout,
    redirect: "/person/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/person/Index"),
        name: "Person",
        meta: { title: "人员管理", icon: "dashboard", noCache: true },
        roles: ["7511054E-929F-4AEA-B84A-E6DF506A5CC8"]
      }
    ]
  },
  {
    path: "/group",
    component: Layout,
    redirect: "/group/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/group/Index"),
        name: "group",
        meta: { title: "人员分组管理", icon: "dashboard", noCache: true },
        roles: ["79B03013-FF4F-44DE-8253-C88C1B5231B4"]
      }
    ]
  },
  {
    path: "/infoedit",
    component: Layout,
    redirect: "/infoedit/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/infoedit/Index"),
        name: "infoedit",
        meta: { title: "信息编辑推送管理", icon: "dashboard", noCache: true },
        roles: ["B72F84DD-B3FE-4A40-9980-2774BEB5F945"]
      }
    ]
  },
  {
    path: "/log",
    component: Layout,
    redirect: "/log/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/log/Index"),
        name: "log",
        meta: { title: "推送日志管理", icon: "dashboard", noCache: true },
        roles: ["2931B0A4-E1D4-4B8C-960C-43B9B338A5C8"]
      }
    ]
  },
  {
    path: "/config",
    component: Layout,
    redirect: "/config/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/config/Index"),
        name: "config",
        meta: { title: "配置信息管理", icon: "dashboard", noCache: true },
        roles: ["1FDD609D-9759-4677-AF11-A60501AB8383"]
      }
    ]
  },
  {
    path: "/template",
    component: Layout,
    redirect: "/template/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/template/Index"),
        name: "template",
        meta: { title: "推送模板管理", icon: "dashboard", noCache: true },
        roles: ["EFD6484A-7414-427D-BFA4-8B244D6AEF01"]
      }
    ]
  },
  // {
  //   path: "/permission",
  //   component: Layout,
  //   redirect: "/permission/page",
  //   alwaysShow: true, // will always show the root menu
  //   name: "Permission",
  //   meta: {
  //     title: "Permission",
  //     icon: "lock",
  //     roles: ["admin", "editor"] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "Page Permission",
  //         roles: ["admin"] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "Directive Permission"
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: "role",
  //       component: () => import("@/views/permission/role"),
  //       name: "RolePermission",
  //       meta: {
  //         title: "Role Permission",
  //         roles: ["admin"]
  //       }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
