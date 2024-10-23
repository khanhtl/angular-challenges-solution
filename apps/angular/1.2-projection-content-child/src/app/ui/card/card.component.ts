import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { Item } from '../../model/item.model';

@Component({
  selector: 'app-card',
  template: `
    <ng-content></ng-content>
    <section>
      @if (list()?.length) {
        @for (item of list(); track $index) {
          <ng-container
            *ngTemplateOutlet="
              itemTemplate();
              context: { $implicit: item }
            "></ng-container>
        }
      } @else {
        No data
      }
    </section>

    <button
      class="rounded-sm border border-blue-500 bg-blue-300 p-2"
      (click)="addNewItem.emit()">
      Add
    </button>
  `,
  standalone: true,
  imports: [NgTemplateOutlet],
  host: {
    class:
      'flex w-fit card-container flex-col gap-3 rounded-md border-2 border-black p-4',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent<T extends Item> {
  addNewItem = output();
  list = input<T[]>();
  itemTemplate = contentChild.required(TemplateRef);
}
