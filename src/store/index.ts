import { createStore, createLogger, Store } from 'vuex'
import { TodoItem } from '../common/interface'
import { v4 as uuidv4 } from 'uuid'
import { TodoItemState } from '@/common/const'
import { storage } from '@/common/utils'

const debug = process.env.NODE_ENV !== 'production'
// console.log(process.env.NODE_ENV)//development

// const savePlugin=(store)=>{
//   store.subscribe((mutation,state)=>{
//     console.log('savePlugin->state',state)
//     console.log('savePlugin->mutation',mutation)
//   })
// }

//mutation发生变化的时候保存在缓存，第一种如下，另外一种是在check add remove每个mutation中添加到缓存
const savePlugin = (store: Store<{//添加mutations add，删除mutations remove，编辑saveEditItem，编辑后保存update
  todos: TodoItem[];
  item: TodoItem;
}>) => {
  console.log('todos init')
  // store.commit('init', storage.get()) //第a种
  store.state.todos=storage.get() //第b种
  store.subscribe((mutation, state) => {
    console.log('savePlugin->state', state)
    console.log('savePlugin->mutation', mutation)
    storage.set(state.todos)
  })
}

export default createStore({
  state: {
    todos: [] as TodoItem[],
    item: {} as TodoItem
  },
  mutations: { //添加和点击都会打印vuex里mutation里add和check的内容
    
    // init(state,todos){ //第a种
    //   state.todos=todos
    // },

    add(state, value) {//添加
      state.todos.push({
        id: uuidv4(), //uuid保证唯一的id
        text: value,
        state: TodoItemState.OPEN
      })
    },
    check(state, id) {//选中和取消选中
      const index = state.todos.findIndex((item) => item.id === id)
      state.todos[index].state = state.todos[index].state === TodoItemState.DONE ? TodoItemState.OPEN : TodoItemState.DONE
    },
    remove(state, id) {//删除
      const index = state.todos.findIndex((item) => item.id === id)
      state.todos[index].state = TodoItemState.DELETE
    },
    clear(state, type: TodoItemState) {//清除所有
      state.todos = state.todos.filter((item) => item.state !== type)
    },
    saveEditItem(state, item: TodoItem) {//编辑
      state.item = item
    },
    update(state, item: TodoItem) {//编辑后保存
      const index = state.todos.findIndex((i) => i.id === item.id)
      console.log(state.todos[index], 'state.todos[index]')
      state.todos[index] = item
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    dones: (state) => state.todos.filter((item) => item.state === TodoItemState.DONE),
    deletes: (state) => state.todos.filter((item) => item.state === TodoItemState.DELETE),
    opens: (state) => state.todos.filter((item) => item.state === TodoItemState.OPEN),
  },

  //没写savePlugin前用这个
  // plugins: debug ? [createLogger()] : [] //添加和点击都会打印vuex里mutation里add和check的内容,check会多次重复是因为需要加上stop和prevent

  // 写了savePlugin后用这个
  plugins: debug ? [createLogger(), savePlugin] : [savePlugin] //plugins持久化存储是保存在localStorage
})
