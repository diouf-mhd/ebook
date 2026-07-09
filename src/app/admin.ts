import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent {

  auth = false;
  code = '';
  readonly ACCESS_CODE = '2027';

  books: Book[] = [];
  editMode = false;
  editId: number | null = null;

  form = {
    title: '',
    description: '',
    price: 0,
    category: '',
    available: true,
    cover: ''
  };

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
    this.bookService.books$.subscribe(b => this.books = b);
  }

  login() {
    if (this.code === this.ACCESS_CODE) {
      this.auth = true;
      this.code = '';
    } else {
      alert('Code incorrect');
    }
  }

  logout() {
    this.auth = false;
    this.resetForm();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  onCoverUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.cover = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveBook() {
    if (!this.form.title || !this.form.price) {
      alert('Le titre et le prix sont requis.');
      return;
    }

    const data = {
      title: this.form.title,
      description: this.form.description,
      price: Number(this.form.price),
      category: this.form.category || 'Autre',
      available: this.form.available,
      cover: this.form.cover || ''
    };

    if (this.editMode && this.editId !== null) {
      this.bookService.update(this.editId, data);
      this.editMode = false;
      this.editId = null;
    } else {
      this.bookService.add(data);
    }

    this.resetForm();
  }

  editBook(book: Book) {
    this.editMode = true;
    this.editId = book.id;
    this.form = {
      title: book.title,
      description: book.description,
      price: book.price,
      category: book.category,
      available: book.available,
      cover: book.cover
    };
  }

  cancelEdit() {
    this.editMode = false;
    this.editId = null;
    this.resetForm();
  }

  deleteBook(id: number) {
    this.bookService.delete(id);
  }

  toggleAvailability(book: Book) {
    this.bookService.update(book.id, {
      available: !book.available
    });
  }

  private resetForm() {
    this.form = {
      title: '',
      description: '',
      price: 0,
      category: '',
      available: true,
      cover: ''
    };
  }
}
