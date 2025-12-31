import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { BooksService } from '../../../services/books-service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-edit-book',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-book.html',
  styleUrl: './edit-book.css',
})
export class EditBook {
  public editBookForm: FormGroup;
  public isLoading = false;
  public isError = false;
  public errorMessage = "";
  public bookId : string | null = null;
  public originalISBN = "";


  constructor(private booksService: BooksService, private router: Router, private route: ActivatedRoute) {
    this.editBookForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      'pages': new FormControl(null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]),
      'isbn': new FormControl(null, [Validators.required, this.validateISBN]),
      'short_description': new FormControl(null),
      'authors': new FormArray([
        new FormGroup({
          'name': new FormControl(null, [Validators.required, Validators.maxLength(255)]),
          'surname': new FormControl(null, [Validators.required, Validators.maxLength(255)])
        })
      ], [Validators.minLength(1)])
    });
  }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');

    if (this.bookId) {
      this.booksService.getBook(this.bookId).subscribe({
        next: (book) => {
          this.originalISBN = book.isbn;
          
          let authorsArray = this.editBookForm.get('authors') as FormArray;
          authorsArray.clear();
          
          book.authors.forEach((author: any) => {
            authorsArray.push(new FormGroup({
              'name': new FormControl(author.name, [Validators.required, Validators.maxLength(255)]),
              'surname': new FormControl(author.surname, [Validators.required, Validators.maxLength(255)])
            }));
          });
          
          this.editBookForm.patchValue({
            title: book.title,
            pages: book.pages,
            isbn: book.isbn,
            short_description: book.short_description
          });

          this.editBookForm.get('isbn')?.setAsyncValidators(
            EditBook.createUniqueISBNValidator(this.booksService, this.originalISBN)
          );
        },
        error: () => {
          this.isError = true;
          this.errorMessage = "Error occurred while loading book data";
        }
      });
    }
  }

  public submitForm() {
    if (!this.bookId) {
      this.isError = true;
      this.errorMessage = "Book ID is missing";
      return;
    }
    this.isLoading = true;
    this.isError = false;
    console.log(this.editBookForm.value);
    this.booksService.updateBook(this.bookId, this.editBookForm.value).subscribe({
      next:()=>{
        this.isLoading = false;
        this.router.navigate(['']);
      },
      error:()=>{
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error occured while data was being uploaded";
      }
    });
  }

  get authors() {
    return (this.editBookForm.get('authors') as FormArray).controls;
  }

  public validateISBN(control: FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    let isbn = control.value.replace(/[-\s]/g, '');
    if (/^\d{10}$/.test(isbn) || /^\d{13}$/.test(isbn)) {
      return null;
    }
    return {error:"Invalid ISBN number"};
  }

  static createUniqueISBNValidator(booksService: BooksService, originalISBN: string) {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>=>{
      if (control.value == originalISBN) {
        return new Observable(observer => {
          observer.next(null);
          observer.complete();
        });
      }

      return booksService.getBooks().pipe( 
        map((data)=>{
          if (data.some(i=> i.isbn == control.value)) {
            return { error:"This ISBN already exists" };
          } else { return null; }
        })
      );
    }
  }

  public addAuthor() {
    (this.editBookForm.get('authors') as FormArray).push(
        new FormGroup({
          'name': new FormControl(null, [Validators.required, Validators.maxLength(255)]),
          'surname': new FormControl(null, [Validators.required, Validators.maxLength(255)])
        })
    );
  }

  public removeAuthor(index: number) {
    let authorsArray = this.editBookForm.get('authors') as FormArray;
    if (authorsArray.length > 1) {
      authorsArray.removeAt(index);
    }
  }
}