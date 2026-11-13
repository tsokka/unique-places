import {Component, input, output} from '@angular/core';
import {Place} from '../place';
import {PlaceCategoryPipe} from '../place-category-pipe';
import {PlacePricePipe} from '../place-price-pipe';
import {PlaceRatingPipe} from '../place-rating-pipe';

@Component({
  imports: [PlaceCategoryPipe, PlacePricePipe, PlaceRatingPipe],
  host: {'(document:keydown.escape)': 'close()'},
  selector: 'app-place-details',
  styleUrl: './place-details.scss',
  templateUrl: './place-details.html',
})
export class PlaceDetails {
  place = input.required<Place>();
  closed = output<void>({alias: 'close'});

  close() {
    this.closed.emit();
  }
}
