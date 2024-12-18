import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Todo } from './models/todo.model';
import { StoreService } from './services/store.service';

@Component({
  selector: 'app-root',
  template: `
    @if (hasError()) {
      <p>{{ hasError() }}</p>
    }

    @if (isLoading()) {
      <p>Loading Users...</p>
      <mat-spinner></mat-spinner>
    } @else {
      @for (todo of todos(); track todo.id) {
        <div>
          {{ todo.title }}
          <button (click)="update(todo)">Update</button>
          <button (click)="delete(todo)">Delete</button>
        </div>
      } @empty {
        <p>Nothing to do</p>
      }
    }
  `,
  imports: [MatProgressSpinnerModule],
  styles: [],
})
export class AppComponent implements OnInit {
  #store = inject(StoreService);

  todos: WritableSignal<Todo[]> = this.#store.todos;
  isLoading = this.#store.isLoading;
  hasError = this.#store.hasError;

  ngOnInit(): void {
    console.log('foo');
  }

  update(todo: Todo) {
    this.#store.update(todo);
  }

  delete(todo: Todo) {
    this.#store.delete(todo);
  }
}
