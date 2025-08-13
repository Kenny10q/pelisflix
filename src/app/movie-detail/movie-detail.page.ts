import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [IonicModule, CommonModule], // ✅ Importa módulos necesarios para standalone
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss']
})
export class MovieDetailPage implements OnInit {
  movieId!: number;
  movie: any;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  ngOnInit() {
    // Obtiene el parámetro de la URL
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.movieId) {
      this.tmdbService.getMovieDetails(this.movieId).subscribe({
        next: (res: any) => {
          this.movie = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar detalles de la película:', err);
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      console.error('No se proporcionó ID de película');
      this.error = true;
      this.loading = false;
    }
  }

  getImageUrl(path: string): string {
  return this.tmdbService.getImageUrl(path);
    }
}
