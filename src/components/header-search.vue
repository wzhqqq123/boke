<template>
    <div class="header-search">
        <i class="iconfont iconsearch" @click.stop="click"></i>
        <input ref="searchInput" :placeholder="placeholder" :class="{'show':show}" v-model="searchValue" type="text" @click.stop="" @keyup.enter="search"/>
    </div>
</template>

<script>
    export default {
        name: "header-search",
        data(){
          return{
              searchValue: '',
              show: false
          }
        },
        computed:{
            placeholder(){
                return this.$route.path.includes('square')? "文章标题或摘要或作者" :"文章标题或摘要"
            }
        },  
        watch:{
            show(value) {
                if (value) {
                    document.body.addEventListener('click', this.close)
                } else {
                    document.body.removeEventListener('click', this.close)
                }
            }
        },
        methods:{
            search(){
                if(this.$route.path.includes('square')){
                    this.$router.push({name:'squareSearch',params:{words:this.searchValue}});
                } else {
                    this.$router.push({name:'search',params:{words:this.searchValue}});
                }
                // console.log(this.searchValue)
                this.close()
            },
            click(){
                this.searchValue = ''
                this.show = !this.show
                if (this.show) {
                    this.$refs.searchInput && this.$refs.searchInput.focus()
                }
            },
            close(){
                this.$refs.searchInput && this.$refs.searchInput.blur()
                this.show = false
            }
        }
    }
</script>

<style scoped lang="less">
.header-search{
    display: inline-block;
    position: relative;
    cursor: pointer;
    i{
        font-size: 18px;
        position: relative;
        top: 3px;
    }
    input{
        border:none;
        outline:none;
        overflow: hidden;
        background: transparent;
        height: 30px;
        width: 0;
        transition: .2s all;
        &.show{
            width: 200px;
            margin-left: 10px;
            font-size: 16px;
            color: darkcyan;
        }
        &:focus{
            border-bottom: 1px solid #8fd0cc;
        }
    }
}
</style>
