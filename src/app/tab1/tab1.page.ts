import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page implements OnInit {
  movies: any[] = [];
  currentPage = 1;
  totalPages = 1;
  loading = false;

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
    if (this.loading) return;
    if (this.currentPage > this.totalPages) {
      if (event) event.target.disabled = true;
      return;
    }

    this.loading = true;

    this.tmdbService.getMoviesByGenre(this.selectedGenre, this.currentPage).subscribe({
      next: (res: any) => {
        this.movies.push(...res.results);
        this.totalPages = res.total_pages;
        this.currentPage++;
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      },
      error: () => {
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  onGenreChange(value: any) {
    const genreId = String(value ?? '');
    if (!genreId) return;
    this.selectedGenre = genreId;
    this.movies = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.loadMovies();
  }

  getImageUrl(path: string) {
    return this.tmdbService.getImageUrl(path);
  }
}
