import { computed, Injectable, signal } from '@angular/core';
import { Todo, TodoState, TodoStatus } from '../model/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private _state = signal<TodoState>({
    isLoaded: false,
    data: [],
  });

  private _todoStatus = signal<TodoStatus>({});

  todos = computed(() => this._state().data);
  isLoading = computed(() => !this._state().isLoaded);
  todoStatus = computed(() => this._todoStatus());

  updateTodoStatus(todoStatus: TodoStatus) {
    this._todoStatus.set(todoStatus);
  }

  setUpdating(id: Todo['id']) {
    const todoStatus = structuredClone(this.todoStatus());
    if (todoStatus[id]) {
      todoStatus[id].isUpdating = true;
    } else {
      todoStatus[id] = {
        isUpdating: true,
      };
    }
    this._todoStatus.set(todoStatus);
  }

  setDeleting(id: Todo['id']) {
    const todoStatus = structuredClone(this.todoStatus());
    if (todoStatus[id]) {
      todoStatus[id].isDeleting = true;
    } else {
      todoStatus[id] = {
        isDeleting: true,
      };
    }
    this._todoStatus.set(todoStatus);
  }

  resetStatus(id: Todo['id']) {
    const todoStatus = structuredClone(this.todoStatus());
    if (todoStatus[id]) {
      todoStatus[id] = {};
    }
    this._todoStatus.set(todoStatus);
  }

  updateTodo(todo: Todo) {
    this.resetStatus(todo.id);
    this._state.update((state) => {
      const foundIndex = this.todos().findIndex((x) => x.id === todo.id);
      if (foundIndex < 0) {
        return state;
      }
      return {
        ...state,
        data: [
          ...this.todos().slice(0, foundIndex),
          todo,
          ...this.todos().slice(foundIndex + 1),
        ],
      };
    });
  }

  deleteTodo(id: Todo['id']) {
    this.resetStatus(id);
    this._state.update((state) => {
      const foundIndex = this.todos().findIndex((x) => x.id === id);
      if (foundIndex < 0) {
        return state;
      }
      return {
        ...state,
        data: [
          ...this.todos().slice(0, foundIndex),
          ...this.todos().slice(foundIndex + 1),
        ],
      };
    });
  }

  setTodos(todos: Todo[]) {
    this._state.set({
      isLoaded: true,
      data: todos,
    });
  }
}
