import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent implements OnInit, OnDestroy {

  /* ── AUTHENTIFICATION ── */
  auth = false;
  code = '';
  readonly ACCESS_CODE = '2027';

  /* ── DONNÉES LIVRES ── */
  books: Book[] = [];
  private bookSub!: Subscription;

  /* ── MODE ÉDITION & FORMULAIRE ── */
  editMode = false;
  currentBookId: number | null = null;
  form = this.initForm();

  cats = [
    'Roman', 'Essai', 'Poésie',
    'Conte', 'Nouvelles', 'Biographie', 'Autre'
  ];

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('og_admin') === '1') {
      this.auth = true;
    }

    this.bookSub = this.bookService.books$.subscribe(b => {
      this.books = b;
    });
  }

  ngOnDestroy(): void {
    if (this.bookSub) {
      this.bookSub.unsubscribe();
    }
  }

  /* ── AUTH ── */
  login(): void {
    if (this.code === this.ACCESS_CODE) {
      this.auth = true;
      sessionStorage.setItem('og_admin', '1');
      this.code = '';
    } else {
      alert('Code d’accès incorrect !');
      this.code = '';
    }
  }

  logout(): void {
    this.auth = false;
    this.code = '';
    sessionStorage.removeItem('og_admin');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  /* ── ACTIONS LIVRE ── */
  private initForm() {
    return {
      title: '',
      description: '',
      price: null as number | null,
      category: 'Roman',
      available: true,
      cover: ''
    };
  }

  saveBook(): void {
    if (!this.form.title.trim() || this.form.price === null || this.form.price <= 0) {
      alert('Veuillez remplir correctement les champs obligatoires (Titre et Prix valide).');
      return;
    }

    const bookData = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      price: this.form.price,
      category: this.form.category,
      available: this.form.available,
      cover: this.form.cover
    };

    if (this.editMode && this.currentBookId !== null) {
      // Mode Modification
      this.bookService.update(this.currentBookId, bookData);
      alert('Livre mis à jour avec succès !');
    } else {
      // Mode Ajout
      this.bookService.add(bookData);
      alert('Livre ajouté avec succès !');
    }

    this.cancelEdit();
  }

  editBook(book: Book): void {
    this.editMode = true;
    this.currentBookId = book.id;
    this.form = {
      title: book.title,
      description: book.description || '',
      price: book.price,
      category: book.category,
      available: book.available,
      cover: book.cover || ''
    };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentBookId = null;
    this.form = this.initForm();
  }

  deleteBook(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce livre ?')) {
      this.bookService.delete(id);
      if (this.currentBookId === id) {
        this.cancelEdit();
      }
    }
  }

  toggleAvailability(book: Book): void {
    this.bookService.update(book.id, {
      available: !book.available
    });
  }

  /* ── GESTION DE LA COUVERTURE ── */
  onCoverUpload(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.form.cover = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}