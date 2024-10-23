import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CityStore } from '../../data-access/city.store';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { City } from '../../model/city.model';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      class="bg-light-yellow"
      [list]="cities()"
      (addNewItem)="handleAddItem()">
      <img src="assets/img/city.png" width="200px" />
      <ng-template let-item>
        <app-list-item (deleteItem)="handleDeleteItem(item)">
          {{ item.name }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      :host {
        .bg-light-yellow {
          background-color: rgba(255, 250, 0, 0.1);
        }
      }
    `,
  ],
  imports: [CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent {
  #http = inject(FakeHttpService);
  #store = inject(CityStore);

  cities = toSignal(this.#store.cities$);

  constructor() {
    this.#http.fetchCities$
      .pipe(takeUntilDestroyed())
      .subscribe((s) => this.#store.addAll(s));
  }

  handleDeleteItem(item: City) {
    this.#store.deleteOne(item.id);
  }

  handleAddItem() {
    this.#store.addOne(randomCity());
  }
}
