import {Component, computed, signal} from '@angular/core';
import {Place, PlaceCategory} from './places/place';
import {PlaceCard} from './places/place-card/place-card';
import {PLACES} from './places/mock-places';
import {PlaceCategoryPipe} from './places/place-category-pipe';

@Component({
  imports: [PlaceCard, PlaceCategoryPipe],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  places = signal<Place[]>(PLACES);

  selectedCategory = signal<PlaceCategory | null>(null);

  filteredPlaces = computed(() => {
    const category = this.selectedCategory();

    return category === null
      ? this.places()
      : this.places().filter(
        (place) => place.category === category
      );
  });

  favoritesCount = computed(() =>
    this.places().filter(
      (place) => place.isFavorite
    ).length
  );

  categories: PlaceCategory[] = [
    'hotel',
    'restaurant',
    'entertainment',
    'nature',
    'culture',
    'architecture',
    'spa',
  ];

  selectCategory(category: PlaceCategory | null) {
    this.selectedCategory.set(category);
  }

  togglePlace(place: Place) {
    this.places.update((places) =>
      places.map((item) =>
        item.id === place.id
          ? {...item, isOpened: !item.isOpened}
          : item
      )
    );
  }
}
