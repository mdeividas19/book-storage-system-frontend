import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  public isMenuOpen = false;
  public isLoggedIn = false;

  constructor (private authService: AuthService, private router: Router) {
    this.isLoggedIn = authService.accessToken !== '';
    authService.onLoginStatusChanged.subscribe(()=>{
      this.isLoggedIn = authService.accessToken !== '';
    });
  }

  public logout() {
    this.authService.logout().subscribe(() => {
      this.isMenuOpen = false;
      this.router.navigate(['/login']);
    });
  }
}
