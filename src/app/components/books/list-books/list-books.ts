import { Component } from '@angular/core';
import { BooksService } from '../../../services/books-service';
import { Book } from '../../../models/book';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-books',
  imports: [CommonModule],
  templateUrl: './list-books.html',
  styleUrl: './list-books.css',
})
export class ListBooks {
  public books:Book[] = [];
  public isLoading = false;
  public isError = false;
  public errorMessage = '';

  constructor (private booksService: BooksService, private router: Router) {
    this.isLoading = true;
    this.booksService.getBooks().subscribe({
      next:(data)=> {      
        this.books = data;
        this.isLoading = false;
      },
      error:(data)=> {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = "Error occured while loading data";
      }
    })
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
}
