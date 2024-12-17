import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-list-item',
  template: `
    <ng-content />

    <button (click)="deleteItem.emit()">
      <img class="h-5" src="assets/svg/trash.svg" />
    </button>
  `,
  host: {
    class: 'border-grey-300 flex justify-between border px-2 py-1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  deleteItem = output<void>();
}
