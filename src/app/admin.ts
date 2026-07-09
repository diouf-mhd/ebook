import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',      // ← pas admin.component.html
  styleUrls: ['./admin.scss']       // ← pas admin.component.scss
})
export class AdminComponent implements OnInit {

  /* ── AUTH ── */
  auth     = false;
  code     = '';
  errMsg   = '';
  attempts = 0;
  locked   = false;
  readonly CODE = '2027';

  /* ── VUE ── */
  view: 'dash' | 'add' | 'edit' = 'dash';

  /* ── LIVRES ── */
  books: Book[]   = [];
  delId: number | null = null;
  okMsg           = '';
  editBook: Book | null = null;

  form = this.emptyForm();

  cats = [
    'Roman', 'Essai', 'Poésie',
    'Conte', 'Nouvelles', 'Biographie', 'Autre'
  ];

  constructor(
    private bs: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('og_admin') === '1') {
      this.auth = true;
    }
    this.bs.books$.subscribe(b => this.books = b);
  }

  /* ── AUTH ── */
  login() {
    if (this.locked) return;

    if (this.code === this.CODE) {
      this.auth = true;
      sessionStorage.setItem('og_admin', '1');
      this.errMsg = '';
    } else {
      this.attempts++;
      this.code = '';

      if (this.attempts >= 3) {
        this.locked  = true;
        this.errMsg  = 'Trop de tentatives. Attendez 30 secondes.';
        setTimeout(() => {
          this.locked   = false;
          this.attempts = 0;
          this.errMsg   = '';
        }, 30000);
      } else {
        const rest = 3 - this.attempts;
        this.errMsg = `Code incorrect (${rest} tentative${rest > 1 ? 's' : ''} restante${rest > 1 ? 's' : ''})`;
      }
    }
  }

  logout() {
    this.auth = false;
    sessionStorage.removeItem('og_admin');
    this.router.navigate(['/']);
  }

  goSite() { this.router.navigate(['/']); }

  /* ── NAVIGATION ── */
  showDash() {
    this.view     = 'dash';
    this.editBook = null;
    this.form     = this.emptyForm();
  }

  showAdd() {
    this.view = 'add';
    this.form = this.emptyForm();
  }

  showEdit(b: Book) {
    this.editBook = { ...b };
    this.form = {
      title:       b.title,
      description: b.description,
      price:       b.price,
      category:    b.category,
      available:   b.available,
      year:        b.year,
      cover:       b.cover,
      preview:     b.cover
    };
    this.view = 'edit';
  }

  /* ── FORMULAIRE ── */
  emptyForm() {
    return {
      title:       '',
      description: '',
      price:       0,
      category:    'Roman',
      available:   true,
      year:        new Date().getFullYear(),
      cover:       '',
      preview:     ''
    };
  }

  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      this.form.cover   = ev.target?.result as string;
      this.form.preview = ev.target?.result as string;
    };
    r.readAsDataURL(f);
  }

  submit() {
    if (!this.form.title || !this.form.description || !this.form.price) return;

    const data = {
      title:       this.form.title,
      description: this.form.description,
      price:       this.form.price,
      category:    this.form.category,
      available:   this.form.available,
      year:        this.form.year,
      cover:       this.form.cover
    };

    if (this.view === 'add') {
      this.bs.add(data);
      this.flash('Livre ajouté avec succès !');
    } else if (this.view === 'edit' && this.editBook) {
      this.bs.update(this.editBook.id, data);
      this.flash('Livre modifié avec succès !');
    }

    setTimeout(() => this.showDash(), 1400);
  }

  confirmDel(id: number) { this.delId = id; }
  cancelDel()             { this.delId = null; }

  del(id: number) {
    this.bs.delete(id);
    this.delId = null;
    this.flash('Livre supprimé.');
  }

  toggle(b: Book) {
    this.bs.update(b.id, { available: !b.available });
  }

  flash(m: string) {
    this.okMsg = m;
    setTimeout(() => this.okMsg = '', 3500);
  }

  get avail(): number {
    return this.books.filter(b => b.available).length;
  }
}