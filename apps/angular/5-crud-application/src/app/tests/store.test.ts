import { TestBed } from '@angular/core/testing';
import { Todo } from '../models/todo.model';
import { StoreService } from '../services/store.service';

describe('StoreService', () => {
  let storeService: StoreService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [StoreService],
    });

    storeService = TestBed.inject(StoreService);
  });

  describe('todos loader', () => {
    it('loads todos successfully', async () => {
      TestBed.runInInjectionContext(() => {
        const mockTodos = [
          { id: 1, title: 'Test Todo', completed: false, userId: 1 },
        ];

        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: async () => [
            { id: 1, title: 'Test Todo', completed: false, userId: 1 },
          ],
        });
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockTodos),
        });
        // await storeService.fetchTodos();
        const todos = storeService.todos();

        expect(todos).toEqual(mockTodos);
        expect(storeService.isLoading()).toBe(false);
        expect(storeService.hasError()).toBe(null);
        expect(fetch).toHaveBeenCalledWith(
          'https://jsonplaceholder.typicode.com/todos',
          expect.anything(),
        );
      });
    });

    it('handles loading error', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(storeService.reload()).rejects.toThrow('Unable to load.');

      expect(storeService.todos()).toEqual([]);
      expect(storeService.hasError()).toBeInstanceOf(Error);
      expect(fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/todos',
        expect.anything(),
      );
    });
  });

  describe('update', () => {
    it('updates a todo successfully', async () => {
      const todo: Todo = {
        id: 1,
        title: 'Old Title',
        completed: false,
        userId: 1,
        body: 'Old Body',
      };
      const updatedTodo = { ...todo, title: 'Updated Title' };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(updatedTodo),
      });

      await storeService.update(todo);

      expect(storeService.todos()).toContainEqual(updatedTodo);
      expect(fetch).toHaveBeenCalledWith(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }),
      );
    });

    it('throws an error when the update fails', async () => {
      const todo: Todo = {
        id: 1,
        title: 'Old Title',
        completed: false,
        userId: 1,
        body: 'Old Body',
      };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(storeService.update(todo)).rejects.toThrow(
        'Unable to update.',
      );

      expect(fetch).toHaveBeenCalledWith(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        expect.objectContaining({
          method: 'PUT',
        }),
      );
    });
  });

  describe('delete', () => {
    it('deletes a todo successfully', async () => {
      const todo: Todo = {
        id: 1,
        title: 'Old Title',
        completed: false,
        userId: 1,
        body: 'Old Body',
      };
      storeService.todos.update(() => [todo]);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
      });

      storeService.delete(todo);

      expect(storeService.todos()).not.toContainEqual(todo);
      expect(fetch).toHaveBeenCalledWith(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });

    it('throws an error when the delete fails', async () => {
      const todo: Todo = {
        id: 1,
        title: 'Old Title',
        completed: false,
        userId: 1,
        body: 'Old Body',
      };
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(storeService.delete(todo)).rejects.toThrow(
        'Unable to delete.',
      );

      expect(fetch).toHaveBeenCalledWith(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });
});
