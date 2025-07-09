import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-background-remover',
  templateUrl: './background-remover.component.html',
  styleUrls: ['./background-remover.component.css']
})
export class BackgroundRemoverComponent {
  @Input() imageUrl: string | null | undefined = null;
  @Output() processedImageUrl = new EventEmitter<string>();

  isProcessing = false;

  constructor(private http: HttpClient) {}

  async removeBackground() {
    if (!this.imageUrl) return;

    this.isProcessing = true;

    try {
      // Convert base64/URL to blob
      const response = await fetch(this.imageUrl);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append('image', blob);

      // Send to background removal API
      const result = await fetch('https://969b-34-132-177-7.ngrok-free.app/remove-bg', {
        method: 'POST',
        body: formData
      });

      if (result.ok) {
        const processedBlob = await result.blob();
        const processedUrl = URL.createObjectURL(processedBlob);
        this.processedImageUrl.emit(processedUrl);
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
}