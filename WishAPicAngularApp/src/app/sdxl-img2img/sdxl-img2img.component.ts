import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FaviconService } from '../services/favicon.service';

@Component({
  selector: 'app-sdxl-img2img',
  templateUrl: './sdxl-img2img.component.html',
  styleUrls: ['./sdxl-img2img.component.css']
})
export class SdxlImg2imgComponent {
  prompt = '';
  strength = 0.1;
  guidanceScale = 15;
  steps = 100;

  remainingSeconds = 0;
  totalSeconds = 0;

  selectedImage: File | null = null;
  previewUrl: string | null = null;
  defaultPreview = 'assets/upload-placeholder.png';
  generatedUrl: string | null = null;
  loading = false;
  error = '';
  progress = 0;

  constructor(
    private router: Router,
    private faviconService: FaviconService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { image?: string, prompt?: string };

    if (state?.image) {
      console.log('Received image data:', state.image.substring(0, 100) + '...');
      this.previewUrl = state.image;
      this.prompt = state.prompt || '';
      this.convertBase64ToFile(state.image);
    } else {
      console.log('No image data received in navigation state');
    }
  }

  async convertBase64ToFile(base64String: string) {
    try {
      // Extract the base64 data (remove data:image/type;base64, prefix)
      const base64Data = base64String.split(',')[1];
      const contentType = base64String.split(',')[0].split(':')[1].split(';')[0];

      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      this.selectedImage = new File([blob], 'image.png', { type: contentType });
    } catch (err) {
      this.error = 'Failed to process the image for editing.';
      console.error('Error converting base64 to file:', err);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Unsupported file type. Please upload an image.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.error = 'File size exceeds 5MB limit.';
      return;
    }

    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.generatedUrl = null;
      this.error = '';
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(input: HTMLInputElement) {
    input.click();
  }

  async replaceWithGenerated() {
    if (!this.generatedUrl) return;

    try {
      const response = await fetch(this.generatedUrl);
      const blob = await response.blob();
      const editedFile = new File([blob], 'edited.png', { type: blob.type });

      this.selectedImage = editedFile;
      this.previewUrl = URL.createObjectURL(editedFile);
      this.generatedUrl = null;
    } catch (err) {
      this.error = 'Failed to use generated image as input.';
    }
  }

  async generate() {
    if (!this.selectedImage) {
      this.error = 'Please upload an image before generating.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('prompt', this.prompt);
    formData.append('strength', this.strength.toString());
    formData.append('guidance_scale', this.guidanceScale.toString());
    formData.append('num_inference_steps', this.steps.toString());

    this.loading = true;
    this.generatedUrl = null;
    this.error = '';
    this.progress = 0;
    this.faviconService.setLoadingFavicon();

    const totalUnits = this.steps * this.strength;
    this.totalSeconds = Math.floor(Math.floor(totalUnits / 5) * 10.5);
    this.remainingSeconds = this.totalSeconds;

    const timer = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        clearInterval(timer);
        return;
      }

      this.remainingSeconds--;
      this.progress = 100 - (this.remainingSeconds / this.totalSeconds) * 100;
    }, 1000);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://870a-35-224-246-46.ngrok-free.app/generate', true);

      xhr.onload = () => {
        clearInterval(timer);
        this.loading = false;
        this.progress = 100;
        this.faviconService.setDefaultFavicon();

        if (xhr.status !== 200) {
          this.error = `Generation failed: ${xhr.statusText}`;
          return;
        }

        const blob = new Blob([xhr.response]);
        this.generatedUrl = URL.createObjectURL(blob);
      };

      xhr.onerror = () => {
        clearInterval(timer);
        this.loading = false;
        this.progress = 0;
        this.error = 'Network or server error occurred.';
        this.faviconService.setDefaultFavicon();
      };

      xhr.responseType = 'blob';
      xhr.send(formData);
    } catch (err: any) {
      clearInterval(timer);
      this.error = err.message || 'Unknown error';
      this.loading = false;
      this.progress = 0;
      this.faviconService.setDefaultFavicon();
    }
  }

  formatRemainingTime(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')} (${this.progress.toFixed(0)}%)`;
  }
}
