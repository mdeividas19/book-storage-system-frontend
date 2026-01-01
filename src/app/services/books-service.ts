import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private url = "http://127.0.0.1:8000/api/books";
  public books: Book[] = [];

  constructor (private http: HttpClient, private authService: AuthService) {}

  public getBooks() {
    return this.http.get<Book[]>(this.url).pipe(
      map((data) => data.sort((a, b) => a.title.localeCompare(b.title))),
      tap((data)=> { this.books = data; })
    );
  }

  public getBook(id: string) {
    return this.http.get<Book>(this.url + "/" + id);
  }

  public addBook(book: Book) {
    return this.http.post(this.url, book, {
      headers:{
        Authorization: "Bearer " + this.authService.accessToken
      }
    });
  }

  public updateBook(id: string, book: Book) {
    return this.http.put(this.url + '/' + id, book, {
      headers:{
        Authorization: "Bearer " + this.authService.accessToken
      }
    });
  }

  public deleteBook(book: Book) {
    return this.http.delete(this.url + '/' + book.id, {
      headers:{
        Authorization: "Bearer " + this.authService.accessToken
      }
    });
  }

}