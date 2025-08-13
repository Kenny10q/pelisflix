import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab2Page {
  movies: any[] = [];
  searchQuery = '';
  currentPage = 1;
  totalPages = 1;
  loading = false;

  constructor(private tmdbService: TmdbService) {}

  onSearch(event?: any) {
    this.currentPage = 1;
    this.totalPages = 1;
    this.movies = [];

    if (!this.searchQuery.trim()) {
      return;
    }

    this.loadMovies();
  }

  loadMovies(event?: any) {
    if (this.loading || this.currentPage > this.totalPages) {
      if (event) event.target.disabled = true;
      return;
    }

    this.loading = true;
    this.tmdbService.searchMovies(this.searchQuery, this.currentPage).subscribe({
      next: (res: any) => {
        this.movies.push(...res.results);
        this.totalPages = res.total_pages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: () => {
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  getImageUrl(path: string | null) {
    // Si no hay poster_path, usamos el SVG de advertencia
    if (!path) {
      return 'assets/no-poster.svg';
    }
    return this.tmdbService.getImageUrl(path);
  }
}
