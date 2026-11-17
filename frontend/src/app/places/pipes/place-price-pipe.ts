import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placePrice',
})
export class PlacePricePipe implements PipeTransform {
  transform(value: number | null): string {
    return value === null ? '' : '€'.repeat(value);
  }
}
