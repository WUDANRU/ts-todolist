<template>
<ul class="list-group">
    <li class="list-group-item d-flex align-item center justify-content-between" v-for="item in deletes" :key="item.id">
        {{item.text}}
    </li>
</ul>
<!-- <button class="btn btn-danger float-right mt-4" type="button" @click="clear"> -->
    <button class="btn btn-danger float-right mt-4" type="button" @click="clear(TodoItemState.DELETE)">
清除所有
</button>
</template>

<script lang="ts">
// import { TodoItemState } from '@/common/const'
// import store from '@/store'
import { utils } from '@/common/utils'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
    setup () {
    //    const clear=()=>{ //clear共用的，放在utils.ts里了
    //        store.commit('clear',TodoItemState.DELETE)
    //    }
    //    return {
    //        clear
    //    

const {clear,TodoItemState}=utils() //clear函数共用的页面：Delete.vue/Done.vue
return {clear,TodoItemState}
    },
computed:{
    ...mapGetters(['deletes'])
}
})
</script>

<style lang="scss" scoped>

</style>