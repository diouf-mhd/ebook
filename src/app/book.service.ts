import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  description: string;
  price: number;
  cover: string;
  category: string;
  available: boolean;
}

@Injectable({ providedIn: 'root' })
export class BookService {

  private STORAGE_KEY = 'og_books';

  private booksSubject = new BehaviorSubject<Book[]>(this.load());
  books$ = this.booksSubject.asObservable();

  private load(): Book[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private save(books: Book[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    this.booksSubject.next(books);
  }

  getAll() {
    return this.booksSubject.getValue();
  }

  add(book: Omit<Book, 'id'>) {
    const newBook: Book = {
      ...book,
      id: Date.now()
    };
    this.save([...this.getAll(), newBook]);
  }

  update(id: number, data: Partial<Book>) {
    const updated = this.getAll().map(b =>
      b.id === id ? { ...b, ...data } : b
    );
    this.save(updated);
  }

  delete(id: number) {
    this.save(this.getAll().filter(b => b.id !== id));
  }
}