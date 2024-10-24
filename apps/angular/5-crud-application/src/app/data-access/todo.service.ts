import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Todo } from '../model/todo.model';
import { TodoStore } from './toto.store';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  #http = inject(HttpClient);
  #todoStore = inject(TodoStore);

  private _baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  getTodos() {
    return this.#http.get<Todo[]>(this._baseUrl).pipe(
      tap((todos) => {
        this.#todoStore.setTodos(todos);
      }),
    );
  }

  updateTodo(todo: Todo) {
    this.#todoStore.setUpdating(todo.id);
    return this.#http.put<Todo>(`${this._baseUrl}/${todo.id}`, todo).pipe(
      tap((updatedTodo) => {
        this.#todoStore.updateTodo(updatedTodo);
      }),
      catchError((error) => {
        return this._handleError(error, todo.id);
      }),
    );
  }

  deleteTodo(todo: Todo) {
    this.#todoStore.setDeleting(todo.id);
    return this.#http.put<Todo>(`${this._baseUrl}/${todo.id}`, todo).pipe(
      tap((deletedTodo) => {
        this.#todoStore.deleteTodo(deletedTodo.id);
      }),
      catchError((error) => {
        return this._handleError(error, todo.id);
      }),
    );
  }

  private _handleError(error: unknown, id: Todo['id']) {
    this.#todoStore.resetStatus(id);
    console.log(error);
    return of([]);
  }


}
