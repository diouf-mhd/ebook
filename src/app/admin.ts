import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  /* ── ÉTAT INTERFACE & AUTHENTIFICATION ── */
  auth = false;
  code = '';
  editMode = false;

  /* ── DONNÉES CATALOGUE ── */
  books: Book[] = [];
  cats = ['Roman', 'Poésie', 'Essai', 'Théâtre'];
  
  // Modèle initial pour le formulaire
  form: any = { 
    id: null,
    title: '', 
    price: null, 
    category: 'Roman', 
    description: '', 
    available: true, 
    cover: '' 
  };

  constructor(
    private bookService: BookService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Session automatique si déjà connecté précédemment
    if (localStorage.getItem('admin_auth') === 'true') {
      this.auth = true;
    }
    // Abonnement au flux de données en temps réel
    this.bookService.books$.subscribe(b => this.books = b);
  }

  /* ── SYSTÈME DE CONNEXION (CODE: 2027) ── */
  login(): void {
    if (this.code === '2027') {
      this.auth = true;
      this.code = '';
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Code d\'accès incorrect !');
    }
  }

  logout(): void {
    this.auth = false;
    localStorage.removeItem('admin_auth');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  /* ── ACTIONS DE REQUÊTES WHATSAPP (TEST) ── */
  testOrder(book: any): void {
    const text = `Bonjour, je souhaite commander le livre "${book.title}" au prix de ${book.price} FCFA.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/221771308536?text=${encodedText}`, '_blank');
  }

  /* ── CRUD CATALOGUE LIVRES ── */
  saveBook(): void {
    if (!this.form.title || !this.form.price) {
      alert('Veuillez remplir au moins le titre et le prix.');
      return;
    }

    if (this.editMode && this.form.id !== null) {
      // Mode Modification
      this.bookService.update(this.form.id, {
        title: this.form.title,
        description: this.form.description,
        price: this.form.price,
        category: this.form.category,
        available: this.form.available,
        cover: this.form.cover
      });
    } else {
      // Mode Ajout
      this.bookService.add({
        title: this.form.title,
        description: this.form.description,
        price: this.form.price,
        category: this.form.category,
        available: this.form.available,
        cover: this.form.cover
      });
    }

    this.cancelEdit(); // Réinitialise l'état du formulaire
  }

  editBook(book: Book): void {
    this.editMode = true;
    this.form = { ...book }; // Copie profonde pour éviter l'édition directe dans le tableau
  }

  cancelEdit(): void {
    this.editMode = false;
    this.form = { 
      id: null,
      title: '', 
      price: null, 
      category: 'Roman', 
      description: '', 
      available: true, 
      cover: '' 
    };
  }

  deleteBook(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.bookService.delete(id);
    }
  }

  toggleAvailability(book: Book): void {
    const updatedBook = { ...book, available: !book.available };
    this.bookService.update(book.id, {
      available: updatedBook.available
    });
  }

  /* ── CHARGEMENT ET CONVERSION IMAGE (BASE64) ── */
  onCoverUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.cover = reader.result as string; // Stocke la chaîne Base64
      };
      reader.readAsDataURL(file);
    }
  }
}