import {Component, computed, effect, signal, Signal, WritableSignal} from '@angular/core';
import {Place, PlaceCategory} from './places/place';
import {PlaceCard} from './places/place-card/place-card';
import {PLACES} from './places/mock-places';
import {PlaceCategoryPipe} from './places/pipes/place-category-pipe';
import {PlaceDetails} from './places/place-details/place-details';

@Component({
  imports: [PlaceCard, PlaceCategoryPipe, PlaceDetails],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  private readonly favoriteStorageKey: string = 'unique-places-favorites';

  places: WritableSignal<Place[]> = signal<Place[]>(PLACES);
  selectedCategory: WritableSignal<PlaceCategory | null> = signal<PlaceCategory | null>(null);
  selectedPlaceId: WritableSignal<number | null> = signal<number | null>(null);
  selectedPlace: Signal<Place | null> = computed(() => this.places().find(place =>
    place.id === this.selectedPlaceId()) ?? null);

  filteredPlaces: Signal<Place[]> = computed(() => {
    const category = this.selectedCategory();

    return category === null
      ? this.places()
      : this.places().filter(place => place.category === category);
  });

  favoritesCount: Signal<number> = computed(() =>
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

  selectCategory(category: PlaceCategory | null): void {
    this.selectedCategory.set(category);
  }

  openPlace(place: Place): void {
    this.selectedPlaceId.set(place.id);
  }

  closePlace(): void {
    this.selectedPlaceId.set(null);
  }

  toggleFavorite(place: Place): void {
    this.places.update((places) =>
      places.map((item) =>
        item.id === place.id
          ? {...item, isFavorite: !item.isFavorite}
          : item
      )
    );
  }
}
