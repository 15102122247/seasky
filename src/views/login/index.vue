<template>
  <div
    class="login-container"
    v-loading="loading"
    style="width: 100%;height: 100%"
  ></div>
</template>

<script>
// 接口
import { TicketValidate } from "@/api/network";
export default {
  name: "Login",
  data() {
    return {
      loading: true,
      redirect: undefined,
      query: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        console.log('route',route);
        this.redirect = route.query && route.query.redirect;
        this.query = route.query;
      },
      immediate: true
    }
  },
  mounted() {
    if (!this.query.ticket) {
      this.handleLogin();
    } else {
      TicketValidate(this.query.ticket).then(res => {
        this.handleLogin();
      });
    }
  },
  methods: {
    handleLogin() {
      this.$store
        .dispatch("user/getInfo")
        .then(({ roles }) => {
          // generate accessible routes map based on roles
          this.$store
            .dispatch("permission/generateRoutes", roles)
            .then(accessRoutes => {
              this.$router.addRoutes(accessRoutes);
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
