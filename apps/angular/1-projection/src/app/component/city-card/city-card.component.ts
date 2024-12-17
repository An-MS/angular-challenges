import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
} from '@angular/core';
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
    <app-card (addItem)="onAddItem()" [list]="cities()">
      <img card-image src="assets/img/city.png" width="200px" />

      <ng-template #foo let-item>
        <app-list-item (deleteItem)="onDeleteItem(item.id)">
          {{ item.name }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      app-card {
        background-color: rgba(228, 217, 13, 0.1);
      }
    `,
  ],
  imports: [CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent implements OnInit {
  cities: WritableSignal<City[]> = this.store.cities;

  constructor(
    private http: FakeHttpService,
    private store: CityStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchCities$.subscribe((s) => this.store.addAll(s));
  }

  onAddItem(): void {
    this.store.addOne(randomCity());
  }

  onDeleteItem(id: number): void {
    this.store.deleteOne(id);
  }
}
