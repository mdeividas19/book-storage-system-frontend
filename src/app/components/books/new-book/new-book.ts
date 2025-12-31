import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { BooksService } from '../../../services/books-service';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-new-book',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-book.html',
  styleUrl: './new-book.css',
})
export class NewBook {
  public newBookForm:FormGroup;
  public isLoading = false;
  public isError = false;
  public errorMessage = "";

  constructor(private booksService: BooksService, private router: Router){
    this.newBookForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      'pages': new FormControl(null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]),
      'isbn': new FormControl(null, [Validators.required, this.validateISBN], [NewBook.createUniqueISBNValidator(booksService)]),
      'short_description': new FormControl(null),
      'authors': new FormArray([
        new FormGroup({
          'name': new FormControl(null, [Validators.required, Validators.maxLength(255)]),
          'surname': new FormControl(null, [Validators.required, Validators.maxLength(255)])
        })
      ], [Validators.minLength(1)])
    });
  }

  public submitForm() {
    this.isLoading = true;
    this.isError = false;
    this.booksService.addBook(this.newBookForm.value).subscribe({
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
    return (this.newBookForm.get('authors') as FormArray).controls;
  }

  public validateISBN(control:FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    let isbn = control.value.replace(/[-\s]/g, '');
    if (/^\d{10}$/.test(isbn) || /^\d{13}$/.test(isbn)) {
      return null;
    }
    return {error:"Invalid ISBN number"};
  }

  static createUniqueISBNValidator(booksService: BooksService) {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>=>{
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
    (this.newBookForm.get('authors') as FormArray).push(
        new FormGroup({
          'name': new FormControl(null, [Validators.required, Validators.maxLength(255)]),
          'surname': new FormControl(null, [Validators.required, Validators.maxLength(255)])
        })
    );
  }

  public removeAuthor(index: number) {
    let authorsArray = this.newBookForm.get('authors') as FormArray;
    if (authorsArray.length > 1) {
      authorsArray.removeAt(index);
    }
  }
}