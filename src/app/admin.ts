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
  auth = false;
  code = '';
  editMode = false;
  books: Book[] = [];
  cats = ['Roman', 'Poésie', 'Essai', 'Théâtre'];
  
  form: any = { 
    id: null,
    title: '', 
    price: null, 
    category: 'Roman', 
    description: '', 
    available: true, 
    cover: '' 
  };

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('admin_auth') === 'true') {
      this.auth = true;
    }
    this.bookService.books$.subscribe(b => this.books = b);
  }

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

  testOrder(book: any): void {
    const text = `Bonjour, je souhaite commander le livre "${book.title}" au prix de ${book.price} FCFA.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/221771308536?text=${encodedText}`, '_blank');
  }

  async saveBook(): Promise<void> {
    if (!this.form.title || !this.form.price) {
      alert('Veuillez remplir le titre et le prix.');
      return;
    }

    try {
      const bookData: any = {
        title: this.form.title,
        price: this.form.price,
        category: this.form.category,
        description: this.form.description,
        available: this.form.available,
        cover: this.form.cover
      };

      if (this.editMode) {
        bookData.id = this.form.id;
        await this.bookService.updateBook(bookData);
      } else {
        await this.bookService.addBook(bookData);
      }

      this.cancelEdit();
      alert('Enregistrement réussi avec succès !');
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  }

  editBook(book: Book): void {
    this.editMode = true;
    this.form = { ...book };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.form = { id: null, title: '', price: null, category: 'Roman', description: '', available: true, cover: '' };
  }

  async deleteBook(id: any): Promise<void> {
    if (confirm('Supprimer ce livre ?')) {
      await this.bookService.deleteBook(id);
    }
  }

  async toggleAvailability(book: Book): Promise<void> {
    const updatedBook = { ...book, available: !book.available };
    await this.bookService.updateBook(updatedBook);
  }

  onCoverUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.cover = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}