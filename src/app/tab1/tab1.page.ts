// src/app/tab1/tab1.page.ts
import { RouterModule } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class Tab1Page implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;

  movies: any[] = [];
  currentPage = 1;
  totalPages = 1;
  loading = false;

  // Mantener referencia a la suscripción activa para poder cancelarla
  private currentRequestSub: Subscription | null = null;
  // Mantener referencia al último evento (si hubo) para poder completarlo al resetear
  private lastInfiniteEvent: any = null;

  genres = [
    { id: '28', name: 'Acción' },
    { id: '27', name: 'Terror' },
    { id: '35', name: 'Comedia' },
    { id: '18', name: 'Drama' },
    { id: '878', name: 'Ciencia ficción' }
  ];

  selectedGenre = this.genres[0].id; // Por defecto Acción

  constructor(private tmdbService: TmdbService) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies(event?: any) {
    // Si ya hay una carga en curso, completa el event entrante y no arranca otra
    if (this.loading) {
      if (event) event.target.complete();
      return;
    }

    // Si ya pasamos la última página, deshabilitar infinite y completar evento si existe
    if (this.currentPage > this.totalPages) {
      if (event) {
        try { event.target.complete(); } catch {}
      }
      if (this.infiniteScroll) this.infiniteScroll.disabled = true;
      return;
    }

    // Guardar referencia al evento (para poder completarlo si hacemos reset)
    if (event) this.lastInfiniteEvent = event;
    this.loading = true;

    // Si hay una petición anterior en curso, cancelarla
    if (this.currentRequestSub) {
      this.currentRequestSub.unsubscribe();
      this.currentRequestSub = null;
    }

    this.currentRequestSub = this.tmdbService.getMoviesByGenre(this.selectedGenre, this.currentPage)
      .subscribe({
        next: (res: any) => {
          // Normalizar respuesta
          const results = (res && res.results) ? res.results : [];
          const total = (res && res.total_pages) ? res.total_pages : 1;

          this.movies.push(...results);
          this.totalPages = total;
          this.currentPage++;

          // completar evento si vino
          if (event) {
            try { event.target.complete(); } catch {}
            this.lastInfiniteEvent = null;
          }

          // deshabilitar infinite si llegamos al final
          if (this.currentPage > this.totalPages) {
            if (this.infiniteScroll) this.infiniteScroll.disabled = true;
          }

          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error cargando películas:', err);
          // asegurar que el evento no quede abierto
          if (event) {
            try { event.target.complete(); } catch {}
            this.lastInfiniteEvent = null;
          }
          this.loading = false;
        },
        complete: () => {
          // limpiar referencia a la suscripción al terminar
          if (this.currentRequestSub) {
            this.currentRequestSub.unsubscribe();
            this.currentRequestSub = null;
          }
        }
 
     });
  }

  onGenreChange(value: any) {
    const genreId = String(value ?? '');
    if (!genreId) return;

    // Si había un evento de infinite pendiente, complétalo para quitar el spinner
    if (this.lastInfiniteEvent) {
      try { this.lastInfiniteEvent.target.complete(); } catch {}
      this.lastInfiniteEvent = null;
    }

    // cancelar petición en curso
    if (this.currentRequestSub) {
      this.currentRequestSub.unsubscribe();
      this.currentRequestSub = null;
    }

    // reset del estado
    this.selectedGenre = genreId;
    this.movies = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.loading = false;

    // reactivar infinite scroll visualmente
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }

    // iniciar carga para el nuevo género
    this.loadMovies();
  }

  getImageUrl(path: string) {
    return this.tmdbService.getImageUrl(path);
  }
}
