import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <ng-content select="[card-image]" />

    <section>
      @for (item of list(); track item.id) {
        <ng-template
          [ngTemplateOutlet]="listTemplate()"
          [ngTemplateOutletContext]="{ $implicit: item }" />
      }
    </section>

    <button
      class="rounded-sm border border-blue-500 bg-blue-300 p-2"
      (click)="addItem.emit()">
      Add
    </button>
  `,
  host: {
    class: 'flex w-fit flex-col gap-3 rounded-md border-2 border-black p-4',
  },
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent<T extends { id: number }> {
  list = input<T[] | null>(null);

  addItem = output<void>();

  listTemplate = contentChild.required('foo', {
    read: TemplateRef<{ $implicit: T }>,
  });
}
