import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentLang: 'FR' | 'WO' = 'FR';
  menuOpen = false;
  year = new Date().getFullYear();
  fabUrl = "https://wa.me/221771308536";
  email = "ogning196@gmail.com"; // E-mail corrigé

  books$!: Observable<Book[]>;

  constructor(
    private bookService: BookService, 
    private router: Router,
    private elRef: ElementRef // Injecté pour cibler les éléments du DOM
  ) {}

  ngOnInit(): void {
    this.books$ = this.bookService.books$;
  }

  ngAfterViewInit(): void {
    // Initialise l'apparition dynamique en fondu des éléments au défilement
    this.initScrollReveal();
  }

  setLanguage(lang: 'FR' | 'WO'): void {
    this.currentLang = lang;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  selectMenuRoute(targetId: string): void {
    this.menuOpen = false;
    this.scrollTo(targetId);
  }

  // Défilement fluide, plus stable et dynamique vers les sections
  scrollTo(id: string): void {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 80); // Léger délai augmenté pour laisser l'animation respirer
  }

  // Gestionnaire de fondu dynamique (Fade-In Reveal)
  private initScrollReveal(): void {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // L'élément commence à apparaître dès que 10% est visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ajoute la classe CSS qui déclenche le fondu dynamique
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    // On cible toutes les sections et les cartes à animer
    setTimeout(() => {
      const targets = this.elRef.nativeElement.querySelectorAll('.reveal-effect, .book-card');
      targets.forEach((target: HTMLElement) => {
        target.classList.add('reveal-hidden');
        observer.observe(target);
      });
    }, 500); // Laisse le temps aux livres de Supabase d'être injectés dans le DOM
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  order(book: Book): void {
    const text = `Bonjour, je souhaite commander le livre "${book.title}" au prix de ${book.price} FCFA.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/221771308536?text=${encodedText}`, '_blank');
  }
}