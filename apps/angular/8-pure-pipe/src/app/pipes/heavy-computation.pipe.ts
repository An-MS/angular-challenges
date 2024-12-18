import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'heavyComputation' })
export class HeavyComputationPipe implements PipeTransform {
  transform(person: string, index: number): string {
    return `${person} - ${index}`;
  }
}
