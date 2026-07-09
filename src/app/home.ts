import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from './book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  year = new Date().getFullYear();

  constructor(
    private bookService: BookService,
    private router: Router,
    @Inject(PLATFORM_ID) private pid: Object
  ) {}

  ngOnInit(): void {
    this.bookService.books$.subscribe(b => {
      this.books = b;
    });

    if (!isPlatformBrowser(this.pid)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    setTimeout(() => {
      document.querySelectorAll('.fade-slide')
        .forEach(el => observer.observe(el));
    }, 300);
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  order(book: Book): void {
    const msg = encodeURIComponent(
      `Bonjour 👋 Je souhaite commander ${book.title}`
    );
    window.open(`https://wa.me/221771308536?text=${msg}`, '_blank');
  }

  get fabUrl(): string {
    return `https://wa.me/221771308536?text=${encodeURIComponent(
      'Bonjour 👋 Je vous contacte depuis votre site.'
    )}`;
  }
}
