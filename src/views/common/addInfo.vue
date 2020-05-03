<template>
  <div class="multipleSelection">
    <div
      v-for="(item, index) in multipleSelectionProp"
      :key="index + 'multipleSelection'"
      class="multipleSelection-item"
      @mouseover="suIcon(index)"
      @mouseleave="erIcon(index)"
    >
      <span class="multipleSelection-item-text">{{ item.userName }}</span>
      <span class="multipleSelection-item-icon">
        <img :src="item.src" @click="delSeltion(item.userCode)" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      multipleSelectionProp: []
    };
  },
  props: {
    multipleSelection: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    multipleSelection(val, oldVal) {
      this.multipleSelectionProp = JSON.parse(JSON.stringify(val));
    }
  },
  methods: {
    // 鼠标画上事件
    suIcon(index) {
      this.multipleSelectionProp[index].src = require("@/assets/svg/error.svg");
    },
    // 鼠标离开事件
    erIcon(index) {
      this.multipleSelectionProp[
        index
      ].src = require("@/assets/svg/success.svg");
    },
    // 删除所添加的
    delSeltion(id) {
      this.$emit("sendData", id);
    }
  }
};
</script>

<style scoped>
.multipleSelection {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  justify-content: space-between;
}
.multipleSelection-item {
  display: flex;
  width: 80px;
  justify-content: space-between;
  align-items: center;
  background: #eee;
  padding: 4px 8px;
  cursor: pointer;
  margin-bottom: 20px;
}
.multipleSelection-item:hover {
  color: #409eff;
  background: #f5f7fa;
}
</style>
