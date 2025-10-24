import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  listId: string;
}

interface TodoList {
  id: string;
  name: string;
}

interface TodoState {
  lists: TodoList[];
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
  lists: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addList: (state, action: PayloadAction<TodoList>) => {
      state.lists.push(action.payload);
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<Todo>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});

export const { addList, addTodo, toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;
