import { Component, input } from '@angular/core';

@Component({
  selector: 'app-subscription',
  imports: [],
  template: `
    <div>TestId: {{ testId() }}</div>
    <div>Permission: {{ permission() }}</div>
    <div>User: {{ user() }}</div>
  `,
})
export default class TestComponent {
  readonly testId = input();
  readonly permission = input();
  readonly user = input();
}
