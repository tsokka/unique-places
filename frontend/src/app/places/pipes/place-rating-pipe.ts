import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'placeRating',
})
export class PlaceRatingPipe implements PipeTransform {
  transform(value: number | null): string {
    return value === null ? '' : value.toFixed(1);
  }
}
