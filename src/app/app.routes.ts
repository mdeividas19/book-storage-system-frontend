import { Routes } from '@angular/router';
import { ListBooks } from './components/books/list-books/list-books';
import { NewBook } from './components/books/new-book/new-book';
import { EditBook } from './components/books/edit-book/edit-book';
import { LoginForm } from './components/login-form/login-form';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [
    {path:"", component:ListBooks},
    {path:"new", component:NewBook, canActivate: [authGuard]},
    {path: "edit/:id", component:EditBook, canActivate: [authGuard]},
    {path:"login", component:LoginForm, canActivate: [noAuthGuard]}
];
