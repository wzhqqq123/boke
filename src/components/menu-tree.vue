<template>
  <ul class="menus">
    <li v-for="item in menus" :key="item.id">
      <span
        class="menu-item"
        @click="active(item.offsetTop)"
        :data-top="item.offsetTop"
        :data-id="item.id"
        >● {{ item.title }}</span
      >
      <ul v-if="item[childLabel].length" class="child">
        <menu-tree
          :menus="item[childLabel]"
          :child-label="childLabel"
        ></menu-tree>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: "menuTree",
  props: {
    menus: {
      type: [Object, Array],
      required: true,
    },
    childLabel: {
      type: String,
      default: "child",
    },
  },
  data() {
    return {};
  },
  methods: {
    active(top) {
      document.documentElement.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
    // 根据当前滑动距离获取当前激活的目录
    getCurrentMenu: _.throttle(function (top) {
      let minDistance = {};
      document
        .querySelector("#article-menus")
        .querySelectorAll(".menu-item")
        .forEach((item) => {
          if (
            !minDistance.id ||
            Math.abs(item.getAttribute("data-top") - top) < minDistance.distance
          ) {
            minDistance.id = item.getAttribute("data-id");
            minDistance.distance = Math.abs(
              item.getAttribute("data-top") - top
            );
          }
        });
      let choseSpan = document
        .querySelector("#article-menus")
        .querySelector(`[data-id=${minDistance.id}]`);
      if (choseSpan && choseSpan.classList.contains("active")) {
        return;
      }
      document.querySelectorAll(".menu-item").forEach((item) => {
        item.classList.remove("active");
      });
      choseSpan.classList.add("active");
    }, 100),
  },
  watch: {
    scrollTop(newVal, oldVal) {
      this.getCurrentMenu(newVal);
    },
  },
  computed: {
    scrollTop() {
      return this.$store.state.scrollTop;
    },
  },
};
</script>

<style scoped lang="less">
.menus {
  line-height: 1.7em;
}

.menu-item {
  user-select: none;
  cursor: pointer;
}

.active {
  font-weight: 700;
  color: #a0dad0;
}

.child {
  padding-left: 15px;
}
</style>
