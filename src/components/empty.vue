<template>
  <div class="empty">
    <span class="emptyImg"></span>
    <span class="tips"><slot></slot></span>
  </div>
</template>
<script>
export default {
  name: "empty",
};
</script>
<style scoped lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  .emptyImg {
    display: block;
    width: 250px;
    height: 250px;
    background-size: 100% 100%;
    background-image: url(@/imgs/empty.png);
  }
  .tips {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    margin-bottom: 30px;
  }
}
</style>
