import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  public isLoggedIn = false;

  constructor (private authService: AuthService, private router: Router) {
    this.isLoggedIn = authService.accessToken !== '';
    authService.onLoginStatusChanged.subscribe(()=>{
      this.isLoggedIn = authService.accessToken !== '';
    });
  }

  public logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
