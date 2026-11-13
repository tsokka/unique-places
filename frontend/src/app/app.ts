import {Component, computed, effect, signal} from '@angular/core';
import {Place, PlaceCategory} from './places/place';
import {PlaceCard} from './places/place-card/place-card';
import {PLACES} from './places/mock-places';
import {PlaceCategoryPipe} from './places/place-category-pipe';
import {PlaceDetails} from './places/place-details/place-details';

@Component({
  imports: [PlaceCard, PlaceCategoryPipe, PlaceDetails],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  private readonly favoriteStorageKey = 'unique-places-favorites';

  places = signal<Place[]>(PLACES);

  selectedCategory = signal<PlaceCategory | null>(null);

  selectedPlace = signal<Place | null>(null);

  filteredPlaces = computed(() => {
    const category = this.selectedCategory();

    return category === null
      ? this.places()
      : this.places().filter(place => place.category === category);
  });

  favoritesCount = computed(() =>
    this.places().filter(place => place.isFavorite).length
  );

  constructor() {
    const savedFavorites = localStorage.getItem(this.favoriteStorageKey);

    if (savedFavorites) {
      const favoriteIds: number[] = JSON.parse(savedFavorites);

      this.places.update((places) =>
        places.map((place) => ({
          ...place,
          isFavorite: favoriteIds.includes(place.id),
        }))
      );
    }

    effect(() => {
      const favoriteIds = this.places()
        .filter((place) => place.isFavorite)
        .map((place) => place.id);

      localStorage.setItem(this.favoriteStorageKey, JSON.stringify(favoriteIds));
    });
  }

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

  openPlace(place: Place) {
    this.selectedPlace.set(place);
  }

  closePlace() {
    this.selectedPlace.set(null);
  }

  toggleFavorite(place: Place) {
    this.places.update((places) =>
      places.map((item) =>
        item.id === place.id
          ? {...item, isFavorite: !item.isFavorite}
          : item
      )
    );
  }
}
