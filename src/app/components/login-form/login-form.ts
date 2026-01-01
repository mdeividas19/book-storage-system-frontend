import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  public loginForm: FormGroup;
  public isLogin = true;
  public errorMessage = "";
  public isLoading = false;
  public isError = false;


  constructor (private authService:AuthService, private router:Router) {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  public submitForm() {
    this.isLoading = true;
    this.isError = false;
    if (this.isLogin) {
      this.authService.signin(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next:(data)=>{
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error:(data)=>{
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = data.error.message;
        }
      });
    } else {
      this.authService.signup(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next:(data)=>{
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error:(data)=>{
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = data.error.message;
        }
      });
    }
  }

  public toggleMode() {
    this.isLogin = !this.isLogin;

    if (this.isLogin) { this.loginForm.get('password')?.setValidators([Validators.required]) }
    else { this.loginForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]) }
    
    this.loginForm.get('password')?.updateValueAndValidity();
  }
}
