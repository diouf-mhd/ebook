import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
 templateUrl: './app.html',
styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  /* ── NAVBAR ── */
  scrolled      = false;
  menuOpen      = false;
  activeSection = 'hero';

  navLinks = [
    { id: 'hero',    label: 'Accueil'  },
    { id: 'about',   label: 'À propos' },
    { id: 'books',   label: 'Livres'   },
    { id: 'contact', label: 'Contact'  }
  ];

  /* ── HERO ── */
  year = new Date().getFullYear();

  /* ── LIVRES ── */
  books: Book[]        = [];
  filterCat            = 'Tous';
  categories: string[] = ['Tous'];
  private bookSub: any;

  /* ── CONTACT ── */
  form = { name: '', phone: '', message: '' };

  /* ── WHATSAPP FAB ── */
  fabVisible = false;

  /* ── OBSERVER ── */
  private observer!: IntersectionObserver;

  constructor(
    @Inject(PLATFORM_ID) private pid: Object,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    /* abonnement livres */
    this.bookSub = this.bookService.books$.subscribe(books => {
      this.books = books;
      const cats = [...new Set(books.map(b => b.category))];
      this.categories = ['Tous', ...cats];
    });

    if (!isPlatformBrowser(this.pid)) return;

    /* fade-in au scroll */
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });

    setTimeout(() => {
      document.querySelectorAll('.fi')
        .forEach(el => this.observer.observe(el));
    }, 400);

    /* fab visible dès le départ */
    setTimeout(() => this.fabVisible = true, 2500);
  }

  ngOnDestroy() {
    this.bookSub?.unsubscribe();
    this.observer?.disconnect();
  }

  /* ── SCROLL ── */
  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.pid)) return;
    this.scrolled   = window.scrollY > 60;
    this.fabVisible = window.scrollY > 300;
    this.detectSection();
  }

  detectSection() {
    for (const l of this.navLinks) {
      const el = document.getElementById(l.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= 90 && r.bottom >= 90) {
        this.activeSection = l.id;
        break;
      }
    }
  }

  /* ── NAVIGATION ── */
  scrollTo(id: string) {
    this.menuOpen = false;
    if (!isPlatformBrowser(this.pid)) return;
    document.getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollTop() {
    if (isPlatformBrowser(this.pid))
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goAdmin() { this.router.navigate(['/admin']); }

  /* ── LIVRES ── */
  get filteredBooks(): Book[] {
    return this.filterCat === 'Tous'
      ? this.books
      : this.books.filter(b => b.category === this.filterCat);
  }

  order(book: Book) {
    const msg = encodeURIComponent(
      `Bonjour Ousseynou Gningue 👋\nJe souhaite commander :\n📚 *${book.title}*\n💰 ${book.price.toLocaleString('fr-FR')} FCFA`
    );
    window.open(`https://wa.me/221771308536?text=${msg}`, '_blank');
  }

  /* ── CONTACT ── */
  sendMsg() {
    const msg = encodeURIComponent(
      `*Message depuis le site*\n👤 ${this.form.name}\n📱 ${this.form.phone}\n💬 ${this.form.message}`
    );
    window.open(`https://wa.me/221771308536?text=${msg}`, '_blank');
    this.form = { name: '', phone: '', message: '' };
  }

  /* ── FAB WHATSAPP ── */
  get fabUrl(): string {
    return `https://wa.me/221771308536?text=${encodeURIComponent(
      'Bonjour Ousseynou Gningue ! 👋 Je vous contacte depuis votre site.'
    )}`;
  }
}