<template>
  <div class="form-group">
    <label for="">添加待办事项</label>
    <div class="row">
      <div class="col-8">
        <input
          type="text"
          class="form-control"
          v-model="inputValue"
          @keydown.enter="add()"
        />
      </div>
      <div class="col-4">
        <!-- <select class="form-control" v-model="filterState" @change="changeState()"> -->
        <select class="form-control" v-model="filterState">
          <option :value="TodoItemState.ALL">选择以过滤</option>
          <option :value="TodoItemState.OPEN">待办中</option>
          <option :value="TodoItemState.DONE">已完成</option>
          <option :value="TodoItemState.DELETE">已删除</option>
        </select>
      </div>
    </div>
    <small class="form-text text-muted">回车即可加入</small>
  </div>
  <div class="list-group">
    <li
      class="list-group-item d-flex align-item-center justify-content-between"
      v-for="item in todos"
      :key="item.id"
      @click.stop="check(item)"
    >
      <div class="form-check">
        <input
          type="checkbox"
          class="form-checkinput"
          :id="item.id"
          :checked="item.state === TodoItemState.DONE"
          :disabled="item.state === TodoItemState.DELETE"
        />
        <!-- 点击删除的效果，state变成了3，input框是不可点击的(disabled:true),编辑和删除的按钮都被隐藏了 -->
        <label
          :for="item.id"
          @click.stop.prevent="check(item)"
          :class="{
            'text-black-50 line-through': item.state === TodoItemState.DONE,
          }"
          >
          <!-- {{ item }} -->
          {{ item.text }}
         </label>
      </div>
      <div
        class="float-right ctrls"
        :class="{ 'd-none': item.state !== TodoItemState.OPEN }"
      >
        <button class="btn btn-warning btn-sm mr-2 text-light" @click.stop="edit(item)">编辑</button>
        <!-- edit页面逻辑：edit页面刷新是不会保存数据的所以要返回add页面，刷新加了路由导航守卫 -->
        <!-- 编辑完返回add页的话，不加stop描述符会触发check,控制台也有打印check -->
        <button class="btn btn-danger btn-sm" @click.stop="remove(item.id)">
          删除
        </button>
      </div>
      <!-- 点击了没有删除成功，控制台有打印可以看见最后触发了check，事件冒泡问题，加阻止，@click.stop="remove(item.id)"，state变成了3
重新点击了还是没有删除成功，控制台最后打印了remove，页面上还是没有删除成功,下面的check函数因此加了判断，还是没有删除成功，是因为只是软删除，
要到已完成或已删除页面清除所有才是真正的删除成功
 -->

      <!-- 添加和点击都会打印vuex里mutation里add和check的内容 -->

      <!-- 选中(TodoItemState.DONE)，枚举类型的state为2，未选中(TodoItemState.OPEN)，枚举类型的state为1,如下：
 {"id": "98f384ec-3484-482e-b1de-6e5631b3d1ce","text": "a","state": 1} -->
    </li>
  </div>
  <button class="btn btn-danger float-right mt-4" type="button" @click="hide">
    {{ filterState === TodoItemState.OPEN ? "显示所有" : "隐藏已完成" }}
  </button>
</template>

<script lang="ts">
import { TodoItem } from "@/common/interface";
import router from "@/router";
import store from "@/store";
import { computed, defineComponent, reactive, ref } from "vue";
import { TodoItemState } from "../common/const";

export default defineComponent({
  setup() {
    const inputValue = ref("");

    const filterState = ref(TodoItemState.ALL);

    const add = () => {
      // console.log(inputValue.value)
      store.commit("add", inputValue.value);
      inputValue.value = "";
    };

    const check = (item: TodoItem) => {
      if (
        item.state === TodoItemState.OPEN ||
        item.state === TodoItemState.DONE
      ) {
        store.commit("check", item.id);
      }
    };

    const remove = (id: string) => {//id: string用了类型
      store.commit("remove", id);
    };

    //  const changeState=()=>{
    //  console.log(filterState.value) //v-model绑定了filterState和const filterState = ref(TodoItemState.ALL);
    //  }

    const filterItem = (value: TodoItemState) => {//value: TodoItemState，用了TodoItemState因为下面需要TodoItemState.ALL
      if (value === TodoItemState.ALL) {
        return store.state.todos;
      }
      return store.state.todos.filter((item) => item.state === value);
    };

    const hide = () => {
      if (filterState.value === TodoItemState.OPEN) {
            filterState.value=TodoItemState.ALL
      }else{
          filterState.value=TodoItemState.OPEN
      }
    }

    const edit = (item: TodoItem) => {
        store.commit('saveEditItem',item)
        router.push({name:'edit'}) //路由的name与这里的name(edit)一样
    }

    return reactive({//引入的store没有写在底下，而是写在computed里
      inputValue,//filterState有写在底下,也写在computed里
      add,
      todos: computed(() => filterItem(filterState.value)), //v-model绑定了filterState
      // todos: computed(() => store.state.todos),
      TodoItemState,
      check,
      remove,
      filterState,
      // changeState,
      hide,
      edit
    });
  },
});
</script>

<style lang="scss" scoped>
.line-through {
  text-decoration: line-through; //当用户选中加中横线
}
.list-group-item {
//   user-select: none; //不进行选中文本
  &:hover {
    .ctrls {
      display: block;
    }
  }
  .ctrls {
    display: none;
  }
}
</style>