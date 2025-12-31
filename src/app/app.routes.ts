import { Routes } from '@angular/router';
import { ListBooks } from './components/books/list-books/list-books';
import { NewBook } from './components/books/new-book/new-book';
import { EditBook } from './components/books/edit-book/edit-book';

export const routes: Routes = [
    {path:"", component:ListBooks},
    {path:"new", component:NewBook},
    {path: "edit/:id", component:EditBook}
];
