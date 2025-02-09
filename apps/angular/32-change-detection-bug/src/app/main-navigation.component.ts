import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject, Input, Pipe, PipeTransform } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FakeServiceService } from './fake.service';

interface MenuItem {
  path: string;
  name: string;
}

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, NgFor],
  template: `
    <ng-container *ngFor="let menu of menus">
      <a
        class="rounded-md border px-4 py-2"
        [routerLink]="menu.path"
        routerLinkActive="isSelected">
        {{ menu.name }}
      </a>
    </ng-container>
  `,
  styles: [
    `
      a.isSelected {
        @apply bg-gray-600 text-white;
      }
    `,
  ],
  host: {
    class: 'flex flex-col p-2 gap-2',
  },
})
export class NavigationComponent {
  @Input() menus!: MenuItem[];
}

// other way would be to use trackby
@Pipe({ name: 'memo' })
export class MemoPipe implements PipeTransform {
  transform(prop: string): MenuItem[] {
    return [
      { path: '/foo', name: `Foo ${prop}` },
      { path: '/bar', name: `Bar ${prop}` },
    ];
  }
}

@Component({
  imports: [NavigationComponent, AsyncPipe, MemoPipe],
  template: `
    @if (info$ | async; as info) {
      @if (info !== null) {
        <app-nav [menus]="info | memo"></app-nav>
      } @else {
        <app-nav [menus]="'' | memo"></app-nav>
      }
    }
  `,
  host: {},
})
export class MainNavigationComponent {
  private fakeBackend = inject(FakeServiceService);

  readonly info$ = this.fakeBackend.getInfoFromBackend();

  // getMenu(prop: string) {
  //   return [
  //     { path: '/foo', name: `Foo ${prop}` },
  //     { path: '/bar', name: `Bar ${prop}` },
  //   ];
  // }
}
