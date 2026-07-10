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

  // 1. On déclare l'Observable (sans utiliser "this" ici)
  books$!: Observable<Book[]>;

  // 2. Le service est proprement injecté ici
  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    // 3. On fait l'affectation en toute sécurité au démarrage du composant
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

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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