import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Place, PlaceCategory} from './places/place';
import {PLACES} from './places/mock-places';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  places: Place[] = PLACES;

  categoryNames: Record<PlaceCategory, string> = {
    hotel: 'Отель',
    restaurant: 'Ресторан',
    entertainment: 'Развлечения',
    nature: 'Природа',
    culture: 'Культура',
    architecture: 'Архитектура',
    spa: 'СПА и релакс',
  };

  getPrice(priceLevel: number): string {
    return '€'.repeat(priceLevel);
  }
}
