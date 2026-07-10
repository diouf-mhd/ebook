import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Book {
  id?: number;
  title: string;
  price: number;
  category: string;
  description: string;     // Français
  description_wo?: string;  // Wolof
  available: boolean;
  cover: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private supabaseUrl = 'https://zzrkitcfzjgvdgvynbrn.supabase.co';
  private supabaseKey = 'sb_publishable_ccQPCKjeZUrgaO91EKXKvQ_uv3BKrvh';
  private supabase: SupabaseClient;

  private booksSubject = new BehaviorSubject<Book[]>([]);
  books$ = this.booksSubject.asObservable();

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.fetchBooks(); // Charge automatiquement les livres au démarrage
  }

  // LIRE LES LIVRES (Cloud)
  async fetchBooks() {
    const { data, error } = await this.supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération:', error);
    } else {
      this.booksSubject.next(data || []);
    }
  }

  // AJOUTER UN LIVRE
  async addBook(book: Book) {
    const { data, error } = await this.supabase
      .from('books')
      .insert([book])
      .select();

    if (error) console.error('Erreur ajout:', error);
    this.fetchBooks(); // Rafraîchit la liste pour tout le monde
  }

  // MODIFIER UN LIVRE
  async updateBook(book: Book) {
    const { data, error } = await this.supabase
      .from('books')
      .update(book)
      .eq('id', book.id)
      .select();

    if (error) console.error('Erreur modification:', error);
    this.fetchBooks();
  }

  // SUPPRIMER UN LIVRE
  async deleteBook(id: number) {
    const { error } = await this.supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) console.error('Erreur suppression:', error);
    this.fetchBooks();
  }
}