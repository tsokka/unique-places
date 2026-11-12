import {Pipe, PipeTransform} from '@angular/core';
import {PlaceCategory} from './place';

@Pipe({
  name: 'placeCategory',
})
export class PlaceCategoryPipe implements PipeTransform {

  transform(category: PlaceCategory, forTab = false): string {
    switch (category) {
      case 'hotel':
        return forTab ? 'Отели' : 'Отель';
      case 'restaurant':
        return forTab ? 'Рестораны' : 'Ресторан';
      case 'entertainment':
        return 'Развлечения';
      case 'nature':
        return 'Природа';
      case 'culture':
        return 'Культура';
      case 'architecture':
        return 'Архитектура';
      case 'spa':
        return 'СПА и релакс';
      default:
        return category;
    }
  }
}
