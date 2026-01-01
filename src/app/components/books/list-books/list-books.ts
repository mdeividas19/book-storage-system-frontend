import { Component } from '@angular/core';
import { BooksService } from '../../../services/books-service';
import { Book } from '../../../models/book';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-list-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './list-books.html',
  styleUrl: './list-books.css',
})
export class ListBooks {
  public books:Book[] = [];
  public booksList:Book[] = [];
  public isLoading = false;
  public isError = false;
  public errorMessage = '';

  public filterTitle = '';
  public filterISBN = '';

  public isLoggedIn = false;

  constructor (private booksService: BooksService, private authService: AuthService, private router: Router) {
    this.isLoading = true;
    this.booksService.getBooks().subscribe({
      next:(data)=> {      
        this.booksList = data;
        this.isLoading = false;
        this.filterBooks();
      },
      error:(data)=> {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = "Error occured while loading data";
      }
    })
    this.isLoggedIn = authService.accessToken !== '';
    authService.onLoginStatusChanged.subscribe(()=>{
      this.isLoggedIn = authService.accessToken !== '';
    });
  }

  onEdit(book: Book): void {
    this.router.navigate(['/edit', book.id]);
  }

  onDelete(book: Book): void {
    if (confirm('Are you sure you want to delete "' + book.title + '"?')) {
      this.booksService.deleteBook(book).subscribe({
        next:()=> {
          this.books = this.books.filter(b => b.id !== book.id);
        },
        error:()=> {
          this.isError = true;
          this.errorMessage = "Failed to delete book";
        }
      });
    }
  }

  public filterBooks() {
    if (this.filterTitle !== '') {
      this.books = this.booksList.filter((book)=>(book.title?.toLowerCase().includes(this.filterTitle.toLowerCase())));
    } else {
      this.books = this.booksList;
    }

    if (this.filterISBN !== '') {
      this.books = this.books.filter((book)=>(book.isbn?.toLowerCase().includes(this.filterISBN.toLowerCase())));
    }
  }
}
