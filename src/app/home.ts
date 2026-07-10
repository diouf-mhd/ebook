import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  currentLang: 'FR' | 'WO' = 'FR';
  menuOpen = false;
  year = new Date().getFullYear();
  fabUrl = "https://wa.me/221771308536";
  email = "Ogning196@gmail.com";

  books: Book[] = [];
  private bookSub!: Subscription;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.bookSub = this.bookService.books$.subscribe({
      next: (data) => {
        // Log de sécurité pour inspecter la structure réelle reçue dans la console
        console.log('Livres chargés dans la vitrine:', data);
        this.books = data;
      },
      error: (err) => console.error('Erreur flux vitrine:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.bookSub) this.bookSub.unsubscribe();
  }

  setLanguage(lang: 'FR' | 'WO'): void {
    this.currentLang = lang;
    // On ne touche pas au tableau de livres ici pour éviter les ruptures d'affichage
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