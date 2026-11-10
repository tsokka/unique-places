import {NgOptimizedImage} from '@angular/common';
import {Component, input, output} from '@angular/core';
import {Place, PlaceCategory} from '../place';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-place-card',
  styleUrl: './place-card.scss',
  templateUrl: './place-card.html',
})
export class PlaceCard {
  place = input.required<Place>();
  priority = input(false);
  toggled = output<Place>({alias: 'toggle'});

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

  toggle() {
    this.toggled.emit(this.place());
  }
}
