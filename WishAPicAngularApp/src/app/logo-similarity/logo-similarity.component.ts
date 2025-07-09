import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

interface MatchResult {
  filename: string;
  similarity: number;
  url: string;  // This will now contain the base64 image data
}

@Component({
  selector: 'app-logo-similarity',
  templateUrl: './logo-similarity.component.html',
  styleUrls: ['./logo-similarity.component.css']
})
export class LogoSimilarityComponent implements OnInit {
  results: MatchResult[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  loading = false;
  matchedOnce = false;
  error: string | null = null;

  // Replace with your Flask backend URL when deployed
  private backendUrl = 'https://f64e-34-42-121-59.ngrok-free.app/match';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for image URL in query params
    this.route.queryParams.subscribe(params => {
      if (params['imageUrl']) {
        try {
          this.previewUrl = params['imageUrl'];
          // Convert base64 URL to File object
          this.convertUrlToFile(params['imageUrl']).then(file => {
            this.selectedFile = file;
            // Automatically trigger the similarity search
            this.uploadAndMatch();
          }).catch(error => {
            console.error('Error processing image:', error);
            this.error = 'Failed to process the image. Please try uploading manually.';
          });
        } catch (error) {
          console.error('Error in query params processing:', error);
          this.error = 'Failed to process the image URL. Please try uploading manually.';
        }
      }
    });
  }

  private async convertUrlToFile(url: string): Promise<File> {
    try {
      // Convert base64 to blob
      const base64Response = await fetch(url);
      const blob = await base64Response.blob();

      // Create a File from the blob
      const file = new File([blob], 'uploaded-image.png', { type: 'image/png' });
      return file;
    } catch (error) {
      console.error('Error converting URL to file:', error);
      throw error;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file (PNG, JPG, JPEG)';
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      this.error = 'File size must be less than 5MB';
      return;
    }

    this.selectedFile = file;
    this.error = null;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadAndMatch(): void {
    if (!this.selectedFile) {
      this.error = "Please upload an image first.";
      return;
    }

    this.loading = true;
    this.matchedOnce = false;
    this.results = [];
    this.error = null;

    const formData = new FormData();
    formData.append("image", this.selectedFile);

    this.http.post<{ results: MatchResult[] }>(this.backendUrl, formData).subscribe({
      next: (response) => {
        this.results = response.results || [];
        this.matchedOnce = true;
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.error = error.error?.message || 'An error occurred while matching logos.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  downloadImage(result: MatchResult): void {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = result.url;  // URL is now the base64 data
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  clearUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.error = null;
    this.results = [];
    this.matchedOnce = false;
  }

  editInImg2Img(imageUrl: string) {
    // Navigate to img2img component with the image URL
    this.router.navigate(['/img2img'], {
      queryParams: {
        imageUrl: imageUrl
      }
    });
  }
}
