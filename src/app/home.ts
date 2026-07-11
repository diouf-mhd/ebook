import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class HomeComponent implements OnInit {
  currentLang: 'FR' | 'WO' = 'FR';
  menuOpen = false;
  year = new Date().getFullYear();
  fabUrl = "https://wa.me/221771308536";
  email = "Ogning196@gmail.com";

  // 1. Déclaration de l'Observable pour le pipe async
  books$!: Observable<Book[]>;

  // 2. Injection des dépendances dans le constructeur
  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    // 3. Liaison sécurisée au flux de données de Supabase au démarrage
    this.books$ = this.bookService.books$;
  }

  setLanguage(lang: 'FR' | 'WO'): void {
    this.currentLang = lang;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  selectMenuRoute(targetId: string): void {
    this.menuOpen = false;
    this.scrollTo(targetId);
  }

  // Correction de la méthode pour stabiliser le DOM avant le scroll fluide
  scrollTo(id: string): void {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 50); // Ce délai de 50ms laisse le temps aux animations CSS et au DOM de se synchroniser
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  order(book: Book): void {
    const text = `Bonjour, je souhaite commander le livre "${book.title}" au prix de ${book.price} FCFA.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/221771308536?text=${encodedText}`, '_blank');
  }
}