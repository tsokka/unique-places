import {NgOptimizedImage} from '@angular/common';
import {Component, input, output} from '@angular/core';
import {Place} from '../place';
import {PlacePricePipe} from '../place-price-pipe';
import {PlaceRatingPipe} from '../place-rating-pipe';
import {PlaceCategoryPipe} from '../place-category-pipe';

@Component({
  imports: [
    NgOptimizedImage,
    PlacePricePipe,
    PlaceRatingPipe,
    PlaceCategoryPipe,
  ],
  selector: 'app-place-card',
  styleUrl: './place-card.scss',
  templateUrl: './place-card.html',
})
export class PlaceCard {
  place = input.required<Place>();
  priority = input(false);
  toggled = output<Place>({alias: 'toggle'});

  toggle() {
    this.toggled.emit(this.place());
  }
}
