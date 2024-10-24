import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { randText } from '@ngneat/falso';
import { TodoService } from './data-access/todo.service';
import { TodoStore } from './data-access/toto.store';
import { Todo } from './model/todo.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-root',
  template: `
    @if(!isLoading()) {
      @for (todo of todos(); track todo.title) {
        @let $status = todoStatus()[todo.id];
        @let $isUpdating = !!$status?.isUpdating;
        @let $isDeleting = !!$status?.isDeleting;
        @let $disabled = $isUpdating || $isDeleting;
        <div>
          {{ todo.title }}
          <button [disabled]="$disabled" (click)="update(todo)">Update</button>
          <button [disabled]="$disabled" (click)="delete(todo)">Delete</button>
          @if($isDeleting) {
            Deleting...
          }

          @if($isUpdating) {
            Updating...
          }

        </div>
      }
    } @else {
      Loading...
    }
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  #todoService = inject(TodoService);
  #todoStore = inject(TodoStore);

  todos = this.#todoStore.todos;
  isLoading = this.#todoStore.isLoading;
  todoStatus = this.#todoStore.todoStatus;

  constructor() {
    this.#todoService.getTodos().subscribe();
  }

  delete(todo: Todo) {
    this.#todoService.deleteTodo(todo).subscribe();
  }

  update(todo: Todo) {
    const totoWillbeUpdate: Todo = {
      id: todo.id,
      title: randText(),
      userId: todo.userId,
    }
    this.#todoService.updateTodo(totoWillbeUpdate).subscribe();
  }
}
