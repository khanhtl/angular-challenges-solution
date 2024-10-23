import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { Student } from '../../model/student.model';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      class="bg-light-green"
      [list]="students()"
      (addNewItem)="handleAddItem()">
      <img src="assets/img/student.webp" width="200px" />
      <ng-template let-item>
        <app-list-item (deleteItem)="handleDeleteItem(item)">
          {{ item.firstName }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      :host {
        .bg-light-green {
          background-color: rgba(0, 250, 0, 0.1);
        }
      }
    `,
  ],
  imports: [CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent {
  #http = inject(FakeHttpService);
  #store = inject(StudentStore);

  students = toSignal(this.#store.students$);

  constructor() {
    this.#http.fetchStudents$
      .pipe(takeUntilDestroyed())
      .subscribe((s) => this.#store.addAll(s));
  }
  handleDeleteItem(item: Student) {
    this.#store.deleteOne(item.id);
  }

  handleAddItem() {
    this.#store.addOne(randStudent());
  }
}
