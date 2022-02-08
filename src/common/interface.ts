import { TodoItemState } from './const'
export interface TodoItem { //interface,接口
    id: string;
    text: string;
    state: TodoItemState; //包含3个属性
}