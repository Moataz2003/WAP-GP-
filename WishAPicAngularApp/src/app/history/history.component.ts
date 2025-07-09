import { Component, OnInit, HostListener } from '@angular/core';
import { SdxlService } from '../services/sdxl.service';
import Toastify from 'toastify-js';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ImagesService } from '../services/images.service';
import { ImgData } from '../models/image-data';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  userId: string | null = null;
  imageData: ImgData[] = [];
  currentPage = 1;
  pageSize = 24;
  isLoading = false;
  hasMoreImages = true;
  loadingFullImage: { [key: string]: boolean } = {};

  constructor(
    private accountService: AccountService,
    private imagesService: ImagesService,
    private router: Router
  ) {}

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isNearBottom() && !this.isLoading && this.hasMoreImages) {
      this.loadMoreImages();
    }
  }

  private isNearBottom(): boolean {
    const threshold = 200;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;
    return position > height - threshold;
  }

  ngOnInit() {
    // Check authentication first
    if (!this.accountService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return;
    }

    // Get userId and load images only if authenticated
    this.userId = this.accountService.getUserId();
    if (this.userId) {
      this.loadImages();
    } else {
      // If no userId but authenticated, something is wrong with the auth state
      this.accountService.getLogout().subscribe({
        next: () => {
          this.router.navigate(['/auth']);
        }
      });
    }
  }

  loadImages() {
    if (!this.userId || !this.accountService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return;
    }

    this.loadMoreImages();
  }

  loadMoreImages() {
    if (this.isLoading || !this.hasMoreImages) return;

    this.isLoading = true;
    this.imagesService.getHistory(this.userId!, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const newImages = response.map((img: any) => ({
          id: img.imageId,
          userId: img.userId,
          prompt: img.prompt,
          image: `data:${img.image.contentType};base64,${img.image.fileContents}`,
          isFavorite: img.isFavorite
        }));

        this.imageData = [...this.imageData, ...newImages];
        this.hasMoreImages = newImages.length === this.pageSize;
        this.currentPage++;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          // If unauthorized, clear auth state and redirect to login
          this.accountService.getLogout().subscribe({
            next: () => {
              this.router.navigate(['/auth']);
            }
          });
        } else {
          this.showToast(error.error.error || 'Failed to load images');
        }
        this.isLoading = false;
      }
    });
  }

  onEditClicked(imageData: ImgData) {
    if (imageData.image) {
      this.router.navigate(['/img2img'], {
        state: {
          image: imageData.image,
          prompt: imageData.prompt
        }
      });
    }
  }

  onDownloadClicked(imageData: ImgData) {
    if (!imageData.image) {
      this.showToast("Image not available for download");
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = imageData.image;

      // Set the download filename
      const filename = `wishapic-${Date.now()}.png`;
      link.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showToast("Download started", "success");
    } catch (error) {
      this.showToast("Failed to download image");
    }
  }

  onRemoveFromFavoritesClicked(imageData: ImgData) {
    if (!imageData.id) return;

    this.imagesService.deleteFromFavorites(imageData).subscribe({
      next: (response) => {
        imageData.isFavorite = false;
        this.showToast("Removed from Favorites", "success");
      },
      error: (error) => {
        this.showToast(error.error.error);
      }
    });
  }

  onAddClicked(imageData: ImgData) {
    if (!imageData.id) return;

    this.imagesService.postAddToFavorites(imageData).subscribe({
      next: (response) => {
        imageData.isFavorite = true;
        this.showToast("Added to Favorites", "success");
      },
      error: (error) => {
        this.showToast(error.error.error);
      }
    });
  }

  onRemoveFromHistoryClicked(imageData: ImgData) {
    if (!imageData.id) return;

    this.imagesService.deleteFromHistory(imageData).subscribe({
      next: (response) => {
        this.imageData = this.imageData?.filter(img => img.id !== imageData.id) || null;
        this.showToast("Removed from History", "success");
      },
      error: (error) => {
        this.showToast(error.error.error);
      }
    });
  }

  findSimilarLogos(image: any) {
    this.router.navigate(['/logo-similarity'], {
      queryParams: { imageUrl: image.image }
    });
  }

  showToast(msg: string, type: 'error' | 'success' = 'error') {
    Toastify({
      text: msg,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: type === 'success' ? "#28a745" : "#dc3545"
    }).showToast();
  }
}
