import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
} from '@angular/core';
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
    <app-card (addItem)="onAddItem()" [list]="teachers()">
      <img card-image src="assets/img/teacher.png" width="200px" />

      <ng-template #foo let-item>
        <app-list-item (deleteItem)="onDeleteItem(item.id)">
          {{ item.firstName }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      app-card {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  imports: [CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCardComponent implements OnInit {
  teachers: WritableSignal<Teacher[]> = this.store.teachers;

  constructor(
    private http: FakeHttpService,
    private store: TeacherStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchTeachers$.subscribe((t) => this.store.addAll(t));
  }

  onAddItem(): void {
    this.store.addOne(randTeacher());
  }

  onDeleteItem(id: number): void {
    this.store.deleteOne(id);
  }
}
