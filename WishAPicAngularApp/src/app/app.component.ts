import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AccountService } from './services/account.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './shared/services/loader.service';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public userId: string | null = null;
  title: any;
  isDropdownOpen = false;
  isSidebarOpen: boolean = false;
  private isBrowser: boolean;

  constructor(
    public accountService: AccountService,
    private router: Router,
    public loaderService: LoaderService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Subscribe to authentication state changes
    this.accountService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.userId;
      } else {
        this.userId = null;
        // If user becomes null (logged out), redirect to auth page
        if (this.isBrowser && !window.location.pathname.includes('/auth')) {
          this.router.navigate(['/auth'], { queryParams: { mode: 'login' } });
        }
      }
    });
  }

  ngOnInit() {
    // Check if user is already authenticated and load user data
    if (this.accountService.isAuthenticated()) {
      this.userId = this.accountService.getUserId();
      // Force a check of stored credentials
      this.accountService['loadStoredUser']();
    } else {
      // If not authenticated and not on auth page, redirect to login
      if (this.isBrowser && !window.location.pathname.includes('/auth')) {
        this.router.navigate(['/auth']);
      }
    }

    this.router.events
      .pipe(
        filter(event =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
      )
      .subscribe(event => {
        // Show loader on navigation start
        if (event instanceof NavigationStart) {
          this.loaderService.show();
        }
        // Hide loader on navigation end, cancel, or error
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loaderService.hide();
        }
      });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  toggleSidebar() {
    if (!this.isBrowser) return;

    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }

  closeSidebar() {
    if (!this.isBrowser) return;

    this.isSidebarOpen = false;
    document.body.classList.remove('sidebar-open');
  }

  onLogOutClicked() {
    // Close sidebar immediately
    this.closeSidebar();

    this.accountService.getLogout().subscribe({
      next: () => {
        // Navigate to auth page after successful logout
        this.router.navigate(['/auth'], { queryParams: { mode: 'login' } });
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate to auth page even if the server logout fails
        this.router.navigate(['/auth'], { queryParams: { mode: 'login' } });
      }
    });
  }
}
