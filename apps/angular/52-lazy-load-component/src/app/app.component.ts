import { NgComponentOutlet } from '@angular/common';
import { Component, signal, Type } from '@angular/core';
import { PlaceholderComponent } from './placeholder.component';
import { TopComponent } from './top.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="h-screen bg-gray-500">
      @defer (on interaction(button)) {
        <app-top />
      } @placeholder {
        <app-placeholder />

        <button
          #button
          class="rounded-sm border border-blue-500 bg-blue-300 p-2">
          Load Top
        </button>
      }

      <!-- @if (topLoaded()) {
         @defer () {
          <app-top />
        }
      } @else {
        <app-placeholder />
        <button
          class="rounded-sm border border-blue-500 bg-blue-300 p-2"
          (click)="topLoaded.set(true)">
          Load Top
        </button>
      } -->

      <!-- @if (topLoaded()) {
        <ng-container *ngComponentOutlet="topcomp" />
      } @else {
        <app-placeholder />
        <button
          class="rounded-sm border border-blue-500 bg-blue-300 p-2"
          (click)="loadAdvanced()">
          Load Top
        </button>
      } -->
    </div>
  `,
  imports: [NgComponentOutlet, PlaceholderComponent, TopComponent],
  standalone: true,
})
export class AppComponent {
  topLoaded = signal(false);

  topcomp: Type<TopComponent> | null = null;

  async loadAdvanced() {
    this.topLoaded.set(true);
    const component: {
      TopComponent: Type<TopComponent>;
    } = await import('./top.component');
    this.topcomp = component.TopComponent;
    // this.topcomp = await import('./top.component');
  }
}
