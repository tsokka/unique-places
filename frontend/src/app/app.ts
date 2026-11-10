import {Component} from '@angular/core';
import {Place} from './places/place';
import {PlaceCard} from './places/place-card/place-card';
import {PLACES} from './places/mock-places';


@Component({
  imports: [PlaceCard],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  places: Place[] = PLACES;

  togglePlace(place: Place) {
    place.isOpened = !place.isOpened;
  }
}
