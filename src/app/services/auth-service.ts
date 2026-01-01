import { EventEmitter, Injectable } from '@angular/core';
import { AuthResponse } from '../models/authResponse';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  public accessToken: string = "";
  public onLoginStatusChanged = new EventEmitter();

  constructor(private httpClient: HttpClient) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token') || '';
    }
  }

  private onLogin(token: string) {
    this.accessToken = token;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
    this.onLoginStatusChanged.emit();
  }

  public signin(email: string, password: string) {
    return this.httpClient.post<AuthResponse>(this.apiUrl + "/login", {
      email: email,
      password: password
    }).pipe(
      tap((data) => {
        this.onLogin(data.access_token);
      })
    );
  }

  public signup(email: string, password: string) {
    return this.httpClient.post<AuthResponse>(this.apiUrl + "/register", {
      email: email,
      password: password
    }).pipe(
      tap((data) => {
        this.onLogin(data.access_token);
      })
    );
  }

  public logout() {
    return this.httpClient.post(this.apiUrl + "/logout", {}, {
      headers: {
        Authorization: "Bearer " + this.accessToken
      }
    }).pipe(
      tap(() => {
        this.accessToken = '';
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        this.onLoginStatusChanged.emit();
      })
    );
  }

}
