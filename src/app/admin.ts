import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from './book.service'; // Ajuste le chemin si besoin

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  // ... Garde tes variables existantes ici (auth, code, books, form, editMode, etc.) ...
  auth = false;
  code = '';
  books: Book[] = [];
  cats = ['Roman', 'Poésie', 'Essai', 'Théâtre']; // Exemple de catégories
  editMode = false;
  form: any = { title: '', price: null, category: '', description: '', available: true, cover: '' };

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    // Ta logique existante pour charger les livres
    this.bookService.books$.subscribe(b => this.books = b);
  }

  /* ════════════════════════════════════════
     ✅ AJOUTE CETTE MÉTHODE ICI 
  ════════════════════════════════════════ */
  testOrder(book: any): void {
    const text = `Bonjour, je souhaite commander le livre "${book.title}" au prix de ${book.price} FCFA.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/221771308536?text=${encodedText}`, '_blank');
  }

  // ... Garde le reste de tes fonctions existantes en dessous ...
  login(): void { /* ... */ }
  logout(): void { /* ... */ }
  goHome(): void { this.router.navigate(['/']); }
  saveBook(): void { /* ... */ }
  editBook(book: Book): void { /* ... */ }
  cancelEdit(): void { /* ... */ }
  deleteBook(id: number): void { /* ... */ }
  toggleAvailability(book: Book): void { /* ... */ }
  onCoverUpload(event: any): void { /* ... */ }
}