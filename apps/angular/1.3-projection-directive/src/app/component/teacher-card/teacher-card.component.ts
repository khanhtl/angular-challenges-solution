import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { Teacher } from '../../model/teacher.model';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      class="bg-light-red"
      [list]="teachers()"
      (addNewItem)="handleAddItem()">
      <img src="assets/img/teacher.png" width="200px" />
      <ng-template let-item>
        <app-list-item (deleteItem)="handleDeleteItem(item)">
          {{ item.firstName }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      :host {
        .bg-light-red {
          background-color: rgba(250, 0, 0, 0.1);
        }
      }
    `,
  ],
  standalone: true,
  imports: [CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCardComponent {
  #http = inject(FakeHttpService);
  #store = inject(TeacherStore);

  teachers = toSignal(this.#store.teachers$);

  constructor() {
    this.#http.fetchTeachers$
      .pipe(takeUntilDestroyed())
      .subscribe((t) => this.#store.addAll(t));
  }
  handleDeleteItem(item: Teacher) {
    this.#store.deleteOne(item.id);
  }

  handleAddItem() {
    this.#store.addOne(randTeacher());
  }
}
