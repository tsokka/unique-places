import {Component} from '@angular/core';
import {Place} from './places/place';
import {PLACES} from './places/mock-places';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  places: Place[] = PLACES;
}
