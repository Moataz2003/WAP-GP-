import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { RegisterUser } from '../models/register-user';
import { Observable, BehaviorSubject, tap, finalize, map } from 'rxjs';
import { LoginUser } from '../models/login-user';
import { AuthResponse } from '../models/auth-response';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

const API_BASE_URL = "http://wishapic.runasp.net/api/account/";

export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  public currentUserName: string | null = null;
  private currentUserId: string | null = null;
  private isBrowser: boolean;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    if (this.isBrowser) {
      this.loadStoredUser();
    }
  }

  private getLocalStorage(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  private loadStoredUser() {
    const token = this.getLocalStorage('token');
    const refreshToken = this.getLocalStorage('refreshToken');
    const userName = this.getLocalStorage('currentUserName');
    const userId = this.getLocalStorage('userId');
    const email = this.getLocalStorage('email');

    if (token && userId && userName) {
      const user: User = {
        userId,
        username: userName,
        email: email || '',
        fullName: userName,
        token,
        refreshToken: refreshToken || ''
      };
      this.currentUserSubject.next(user);
      this.currentUserName = userName;
      this.currentUserId = userId;
    } else {
      // Clear any partial data if we don't have all required fields
      this.clearAuth();
    }
  }

  getUserId(): string | null {
    return this.currentUserId || this.getLocalStorage('userId');
  }

  setUserId(id: string) {
    this.currentUserId = id;
    this.setLocalStorage('userId', id);
  }

  isAuthenticated(): boolean {
    const token = this.getLocalStorage('token');
    const userId = this.getLocalStorage('userId');
    const userName = this.getLocalStorage('currentUserName');
    return !!token && !!userId && !!userName && !!this.currentUserSubject.value;
  }

  private convertAuthResponseToUser(response: AuthResponse): User {
    return {
      userId: response.userId,
      username: response.fullName, // Using fullName as username since we don't have a separate username
      email: response.email,
      fullName: response.fullName,
      token: response.token,
      refreshToken: response.refreshToken
    };
  }

  public postRegister(registerUser: RegisterUser): Observable<User> {
    return this.httpClient.post<AuthResponse>(`${API_BASE_URL}register`, registerUser)
      .pipe(
        map(response => this.convertAuthResponseToUser(response)),
        tap(user => this.handleAuthResponse(user))
      );
  }

  public postLogin(loginUser: LoginUser): Observable<User> {
    return this.httpClient.post<AuthResponse>(`${API_BASE_URL}login`, loginUser)
      .pipe(
        map(response => this.convertAuthResponseToUser(response)),
        tap(user => this.handleAuthResponse(user))
      );
  }

  private handleAuthResponse(user: User) {
    this.setLocalStorage('token', user.token);
    this.setLocalStorage('refreshToken', user.refreshToken);
    this.setLocalStorage('currentUserName', user.fullName);
    this.setLocalStorage('email', user.email);
    this.setLocalStorage('userId', user.userId);

    this.currentUserName = user.fullName;
    this.currentUserId = user.userId;
    this.currentUserSubject.next(user);
  }

  public getLogout(): Observable<string> {
    // Clear auth state first
    this.clearAuth();
    // Then make the server request
    return this.httpClient.get<string>(`${API_BASE_URL}logout`);
  }

  private clearAuth() {
    // Clear all local storage items
    this.removeLocalStorage('token');
    this.removeLocalStorage('refreshToken');
    this.removeLocalStorage('currentUserName');
    this.removeLocalStorage('userId');
    this.removeLocalStorage('email');

    // Reset service state
    this.currentUserName = null;
    this.currentUserId = null;
    this.currentUserSubject.next(null);
  }

  public postGenerateNewToken(): Observable<AuthResponse> {
    const refreshToken = this.getLocalStorage('refreshToken');
    return this.httpClient.post<AuthResponse>(`${API_BASE_URL}refresh-token`, { refreshToken });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
