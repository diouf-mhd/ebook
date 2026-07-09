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
  year: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private STORAGE_KEY = 'og_books';

  private defaults: Book[] = [
    {
      id: 1,
      title: 'Titre du Livre 1',
      description: 'Une œuvre captivante qui plonge le lecteur dans un univers riche et authentique.',
      price: 5000,
      cover: '',
      category: 'Roman',
      available: true,
      year: 2024
    },
    {
      id: 2,
      title: 'Titre du Livre 2',
      description: 'Une exploration profonde des valeurs humaines et culturelles africaines.',
      price: 4500,
      cover: '',
      category: 'Essai',
      available: true,
      year: 2023
    },
    {
      id: 3,
      title: 'Titre du Livre 3',
      description: 'Entre poésie et prose, une œuvre qui touche les cœurs et illumine les esprits.',
      price: 3500,
      cover: '',
      category: 'Poésie',
      available: true,
      year: 2022
    }
  ];

  private booksSubject = new BehaviorSubject<Book[]>(this.load());
  books$ = this.booksSubject.asObservable();

  private load(): Book[] {
    try {
      const s = localStorage.getItem(this.STORAGE_KEY);
      return s ? JSON.parse(s) : this.defaults;
    } catch {
      return this.defaults;
    }
  }

  private save(books: Book[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    this.booksSubject.next(books);
  }

  getAll() { return this.booksSubject.getValue(); }

  add(book: Omit<Book, 'id'>) {
    this.save([...this.getAll(), { ...book, id: Date.now() }]);
  }

  update(id: number, data: Partial<Book>) {
    this.save(this.getAll().map(b => b.id === id ? { ...b, ...data } : b));
  }

  delete(id: number) {
    this.save(this.getAll().filter(b => b.id !== id));
  }
}