import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-background-removal',
  templateUrl: './background-removal.component.html',
  styleUrls: ['./background-removal.component.css']
})
export class BackgroundRemovalComponent {
  selectedImage: string | null = null;
  processedImage: string | null = null;
  isProcessing = false;

  constructor(private router: Router) {
    // Check if we have an image from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { image?: string };
    if (state?.image) {
      this.selectedImage = state.image;
    }
  }

  async onFileSelected(event: Event) {
    let file: File | null = null;

    // Handle both drag and drop and file input events
    if (event instanceof DragEvent) {
      event.preventDefault();
      file = event.dataTransfer?.files[0] || null;
    } else {
      file = (event.target as HTMLInputElement).files?.[0] || null;
    }

    if (file) {
      this.selectedImage = URL.createObjectURL(file);
    }
  }

  async removeBackground() {
    if (!this.selectedImage) return;

    this.isProcessing = true;

    try {
      // Convert base64/URL to blob
      const response = await fetch(this.selectedImage);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append('image', blob);

      // Send to background removal API
      const result = await fetch('https://ab63-34-16-247-39.ngrok-free.app/remove-bg', {
        method: 'POST',
        body: formData
      });

      if (result.ok) {
        const processedBlob = await result.blob();
        this.processedImage = URL.createObjectURL(processedBlob);
      } else {
        throw new Error('Background removal failed');
      }
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Failed to remove background. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  downloadImage(imageUrl: string) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}