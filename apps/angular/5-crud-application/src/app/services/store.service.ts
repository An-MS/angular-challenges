import { Injectable, linkedSignal, resource } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  #todoResource = resource<Todo[], unknown>({
    loader: async ({ abortSignal }) => {
      console.log('loader');
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos',
        {
          signal: abortSignal,
        },
      );

      if (!response.ok) {
        throw new Error('Unable to load.');
      }

      const result: Todo[] = await response.json();

      console.log('result', result);

      return result;
    },
  });

  todos = linkedSignal<Todo[]>(() => this.#todoResource.value() ?? []);
  readonly isLoading = this.#todoResource.isLoading;
  readonly hasError = this.#todoResource.error;

  reload(): void {
    this.#todoResource.reload();
  }

  async fetchTodos(): Promise<void> {
    this.#todoResource.value(); // Access resource to trigger loader
  }

  async update(todo: Todo): Promise<void> {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          todo: todo.id,
          title: randText(),
          body: todo.body,
          userId: todo.userId,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Unable to update.');
    }

    const result: Todo = await response.json();

    this.#todoResource.update((currentTodos) => {
      const todos = currentTodos ?? [];

      if (todos.length === 0) {
        todos.push(result);
        return todos;
      }

      const updatedTodos = todos.reduce((updateArray, currentTodo) => {
        if (currentTodo.id === result.id) {
          updateArray.push(result);
        } else {
          updateArray.push(currentTodo);
        }

        return updateArray;
      }, [] as Todo[]);

      return updatedTodos;
    });
  }

  async delete(todo: Todo): Promise<void> {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Unable to delete.');
    }

    this.#todoResource.update((currentTodos) => {
      return currentTodos?.filter((t) => t.id !== todo.id);
    });
  }
}
