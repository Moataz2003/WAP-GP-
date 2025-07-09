import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading.asObservable();
  private minDisplayTime = 500; // Minimum time to show loader in milliseconds
  private showStartTime: number = 0;

  show() {
    this.showStartTime = Date.now();
    this.isLoading.next(true);
  }

  hide() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.showStartTime;

    if (elapsedTime >= this.minDisplayTime) {
      this.isLoading.next(false);
    } else {
      // Wait for the remaining time before hiding
      setTimeout(() => {
        this.isLoading.next(false);
      }, this.minDisplayTime - elapsedTime);
    }
  }
}
