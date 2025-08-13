// src/app/services/tmdb.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = '626b54cfe719e3b70b24332598458fb9';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'es-ES',
        page: page.toString()
      }
    });
  }

  getMoviesByGenre(genreId: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        language: 'es-ES',
        with_genres: genreId,
        page: page.toString()
      }
    });
  }

  searchMovies(query: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        language: 'es-ES',
        query,
        page: page.toString()
      }
    });
  }

  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${movieId}`, {
      params: {
        api_key: this.apiKey,
        language: 'es-ES'
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) {
      return 'assets/no-poster.svg'; // Fallback si no hay imagen
    }
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
