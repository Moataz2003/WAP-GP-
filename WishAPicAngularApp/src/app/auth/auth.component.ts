import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { compareValidation } from '../validators/custom-validators';
import { RegisterUser } from '../models/register-user';
import { LoginUser } from '../models/login-user';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginActive = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginFormSubmitted = false;
  isRegisterFormSubmitted: boolean = false;
  registrationError: string = '';
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoggingIn: boolean = false;
  isRegistering: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });

    this.registerForm = new FormGroup(
      {
        fullName: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        ]),
        confirmPassword: new FormControl(null, [Validators.required])
      },
      {
        validators: [compareValidation('password', 'confirmPassword')]
      }
    );
  }

  ngOnInit() {
    // Subscribe to query params to determine which form to show
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.isLoginActive = mode !== 'register';
    });
  }

  toggleForm() {
    this.isLoginActive = !this.isLoginActive;
    this.router.navigate(['/auth'], {
      queryParams: { mode: this.isLoginActive ? 'login' : 'register' }
    });
  }

  togglePasswordVisibility(field: 'login' | 'register' | 'confirm') {
    switch (field) {
      case 'login':
        this.showLoginPassword = !this.showLoginPassword;
        break;
      case 'register':
        this.showRegisterPassword = !this.showRegisterPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  // Login form accessors
  get login_emailControl() {
    return this.loginForm.controls['email'];
  }

  get login_passwordControl() {
    return this.loginForm.controls['password'];
  }

  // Register form accessors
  get register_fullNameControl() {
    return this.registerForm.controls['fullName'];
  }

  get register_emailControl() {
    return this.registerForm.controls['email'];
  }

  get register_passwordControl() {
    return this.registerForm.controls['password'];
  }

  get register_confirmPasswordControl() {
    return this.registerForm.controls['confirmPassword'];
  }

  loginSubmitted(){
    this.isLoginFormSubmitted = true;

    this.isLoggingIn = true;

    this.accountService.postLogin(this.loginForm.value).subscribe({
      next: (response: any) =>{
        console.log(response);
        this.isLoginFormSubmitted = false;
        this.accountService.currentUserName = response.fullName;
        this.accountService.setUserId(response.userId)
        localStorage["token"] = response.token;
        localStorage["refreshToken"] = response.refreshToken;
        console.log("Login: "+this.accountService.getUserId());

        this.router.navigate(['/app-home']);
        this.loginForm.reset();
      },
      error: (error:any) =>{
        console.log(error);
        if (error.status === 401) {
          this.showToast('Invalid email or password. Please try again.', 'error');
        } else if (error.status === 400) {
          this.showToast('Please enter a valid email and password.', 'error');
        } else {
          this.showToast('An error occurred during login. Please try again.', 'error');
        }
        this.isLoggingIn = false;
      },
      complete: () =>{
        this.isLoggingIn = false;
      },
    })
  }

  registerSubmitted() {
    this.isRegisterFormSubmitted = true;
    this.registrationError = '';

    if (this.registerForm.valid) {
      this.isRegistering = true;
      const registerData: RegisterUser = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword
      };

      this.accountService.postRegister(registerData).subscribe({
        next: (response: any) => {
          this.isRegisterFormSubmitted = false;
          this.accountService.currentUserName = response.fullName;
          this.accountService.setUserId(response.userId);
          localStorage["token"] = response.token;
          localStorage["refreshToken"] = response.refreshToken;
          this.router.navigate(['/generate-image']);
          this.registerForm.reset();
          this.showToast('Registration successful!', 'success');
        },
        error: (error) => {
          console.error('Registration error:', error);
          if (error.error && error.error.message) {
            this.registrationError = error.error.message;
          } else if (error.error && error.error.errors) {
            // Handle validation errors
            const errors = error.error.errors;
            if (errors.Email) {
              this.registrationError = errors.Email[0];
            } else if (errors.Password) {
              this.registrationError = errors.Password[0];
            } else {
              this.registrationError = 'Registration failed. Please try again.';
            }
          } else {
            this.registrationError = 'An unexpected error occurred. Please try again.';
          }
          this.showToast(this.registrationError, 'error');
        },
        complete: () => {
          this.isRegistering = false;
        }
      });
    } else {
      // Show validation errors
      if (this.register_passwordControl.errors?.['pattern']) {
        this.registrationError = 'Password must contain at least one letter, one number, and be at least 6 characters long';
      } else if (this.register_passwordControl.errors?.['minlength']) {
        this.registrationError = 'Password must be at least 6 characters long';
      } else if (this.registerForm.errors?.['compareValidator']) {
        this.registrationError = 'Passwords do not match';
      }
      this.showToast(this.registrationError || 'Please fill in all required fields correctly', 'error');
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'error') {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: type === 'success' ? "#28a745" : "#dc3545"
    }).showToast();
  }
}
