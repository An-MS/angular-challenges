import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', pathMatch: 'full', redirectTo: 'video' },
      // { path: 'video', loadComponent: () => import('./video.component'), providers: [getTimerProvider()]},
      // { path: 'phone', loadComponent: () => import('./phone.component'), providers: [getTimerProvider(2000)]},
      { path: 'video', loadComponent: () => import('./video.component') },
      { path: 'phone', loadComponent: () => import('./phone.component') },
    ]),
  ],
};
