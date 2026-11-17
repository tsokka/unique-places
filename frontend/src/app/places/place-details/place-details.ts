import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {Place} from '../place';
import {PlaceCategoryPipe} from '../pipes/place-category-pipe';
import {PlacePricePipe} from '../pipes/place-price-pipe';
import {PlaceRatingPipe} from '../pipes/place-rating-pipe';

@Component({
  imports: [PlaceCategoryPipe, PlacePricePipe, PlaceRatingPipe],
  host: {'(document:keydown.escape)': 'close()'},
  selector: 'app-place-details',
  styleUrl: './place-details.scss',
  templateUrl: './place-details.html',
})
export class PlaceDetails {
  place: InputSignal<Place> = input.required<Place>();
  closed: OutputEmitterRef<void> = output<void>({alias: 'close'});
  favoriteToggled: OutputEmitterRef<Place> = output<Place>();

  close(): void {
    this.closed.emit();
  }

  toggleFavorite(): void {
    this.favoriteToggled.emit(this.place());
  }
}
