import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FaviconService {
  private defaultFavicon = './../../assets/myicon.png';
  private loadingFavicon = './../../assets/myicon1.png';
  private faviconElement: HTMLLinkElement | null = null;

  constructor() {
    this.faviconElement = document.querySelector('link[rel="icon"]');
  }

  setLoadingFavicon() {
    if (this.faviconElement) {
      this.faviconElement.href = this.loadingFavicon;
    }
  }

  setDefaultFavicon() {
    if (this.faviconElement) {
      this.faviconElement.href = this.defaultFavicon;
    }
  }
}
