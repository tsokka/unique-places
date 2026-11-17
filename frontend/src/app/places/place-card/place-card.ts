import {NgOptimizedImage} from '@angular/common';
import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {Place} from '../place';
import {PlacePricePipe} from '../pipes/place-price-pipe';
import {PlaceRatingPipe} from '../pipes/place-rating-pipe';
import {PlaceCategoryPipe} from '../pipes/place-category-pipe';
import {TooltipDirective} from '../../shared/ui/tooltip';

@Component({
  imports: [
    NgOptimizedImage,
    PlacePricePipe,
    PlaceRatingPipe,
    PlaceCategoryPipe,
    TooltipDirective,
  ],
  selector: 'app-place-card',
  styleUrl: './place-card.scss',
  templateUrl: './place-card.html',
})
export class PlaceCard {
  place: InputSignal<Place> = input.required<Place>();
  priority: InputSignal<boolean> = input(false);
  toggled: OutputEmitterRef<Place> = output<Place>({alias: 'toggle'});
  favoriteToggled: OutputEmitterRef<Place> = output<Place>();

  toggle(): void {
    this.toggled.emit(this.place());
  }

  toggleFavorite(): void {
    this.favoriteToggled.emit(this.place());
  }
}
