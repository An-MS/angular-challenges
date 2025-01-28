import { NgFor } from '@angular/common';
import {
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  TemplateRef,
  untracked,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngFor][ngForOf]',
  standalone: true,
  hostDirectives: [{ directive: NgFor, inputs: ['ngForOf'] }],
})
export class NgForEmptyDirective<T> {
  readonly ngForOf = input.required<T[] | undefined>();
  readonly ngForEmpty = input.required<TemplateRef<unknown>>();

  private readonly vcr = inject(ViewContainerRef);
  private ref?: EmbeddedViewRef<unknown>;

  constructor() {
    effect(() => {
      this.ref?.destroy();

      if (!this.ngForOf()?.length) {
        this.ref = this.vcr.createEmbeddedView(
          untracked(() => this.ngForEmpty()),
        );
      }
    });
  }
}
