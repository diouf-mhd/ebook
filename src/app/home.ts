import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService, Book } from './book.service'; // Dans le même dossier

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html', // Utilise ton HTML vitrine actuel
  styleUrl: './app.scss'     // Utilise tes styles vitrine actuels
})
export class HomeComponent implements OnInit, OnDestroy {
  /* ── ÉTAT INTERFACE ── */
  menuOpen = false;
  year = new Date().getFullYear();
  fabUrl = "https://wa.me/221771308536"; // Ton WhatsApp

  /* ── DONNÉES ── */
  books: Book[] = [];
  private bookSub!: Subscription;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookSub = this.bookService.books$.subscribe(b => {
      this.books = b;
    });
  }

  ngOnDestroy(): void {
    if (this.bookSub) {
      this.bookSub.unsubscribe();
    }
  }

  /* ── NAVIGATION RESPONSIVE ── */
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
    this.menuOpen = false;
    this.router.navigate(['/admin']);
  }

  /* ── ACTION DE COMMANDE ── */
  order(book: Book): void {
    const text = `Bonjour, je souhaite commander le livre "${book.title}" au prix de ${book.price} FCFA.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/221771308536?text=${encodedText}`, '_blank');
  }
}