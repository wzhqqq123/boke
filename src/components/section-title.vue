<template>
    <h1 class="section-title"><slot></slot></h1>
</template>

<script>
    export default {
        name: "section-title"
    }
</script>

<style scoped lang="scss">
h1.section-title {
    color: #757575;
    font-size: 16px;
    font-weight: 400;
    padding-bottom: 15px;
    border-bottom: 1px dashed #ECECEC;
}

@media (max-width: 500px) {
    .section-title>div {
        display: block!important;
        div:nth-of-type(2){
            margin-top: 10px;
            span:nth-of-type(2){
                position: absolute;
                right: 0;
            }
        }
    }
}
</style>
