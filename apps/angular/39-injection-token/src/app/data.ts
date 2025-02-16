import { InjectionToken, ValueProvider } from '@angular/core';

export const DEFAULT_TIMER = 1000;

export const TIMER = new InjectionToken<number>('TIMER', {
  providedIn: 'root',
  factory: () => DEFAULT_TIMER,
});

export const getTimerProvider = (
  num: number = DEFAULT_TIMER,
): ValueProvider => ({
  provide: TIMER,
  useValue: num,
});
