import { Component } from '@angular/core';
import { ImagesService } from '../services/images.service';
import { AccountService } from '../services/account.service';
import Toastify from 'toastify-js';
import { ImgData } from '../models/image-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  userId: string | null = null;
  imageData: ImgData[] | null = null;

  constructor(
    private imagesService: ImagesService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.accountService.getUserId();
    console.log('Received ID:', this.userId);

    if(this.userId){
          this.imagesService.getFavorites(this.userId).subscribe(response => {
            this.imageData = response.map((img: any)=>({
              id: img.imageId,
              userId: img.userId,
              prompt: img.prompt,
              image: `data:${img.image.contentType};base64,${img.image.fileContents}`,
              isFavorite: img.isFavorite
            }));
          }, error => {
            console.error("Error Viewing Favorites:", error.error.error);
            this.showToast(error.error.error);
          });
        }
  }

  onRemoveFromFavoritesClicked(imageData: any) {
    console.log(imageData.id);

    this.imagesService.deleteFromFavorites(imageData).subscribe(response =>{
      console.log(response);
    }, error =>{
      this.showToast(error.error.error);
    })
      this.showToast("Deleted from Favorites");
  }

  onAddClicked(imageData: any) {
    this.imagesService.postAddToFavorites(imageData).subscribe(response =>{
      console.log(response);
    }, error =>{
      this.showToast(error.error.error);
    })
      this.showToast("Added To Favorites");

  }

  showToast(msg:string) {
    Toastify({
      text: msg,
      duration: 3000, // Duration in milliseconds
      close: true, // Adds a close button
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center`, or `right`
      backgroundColor: "#dc3545"
    }).showToast();
  }

  onDownloadClicked(img: any) {
    const link = document.createElement('a');
    link.href = img.image;
    link.download = `favorite-image-${img.id}.png`;
    link.click();
  }

  onEditClicked(img: any) {
    // Navigate to img2img with the image data using router state
    this.router.navigate(['/img2img'], {
      state: {
        image: img.image,
        prompt: img.prompt || ''
      }
    });
  }

  findSimilarLogos(image: any) {
    this.router.navigate(['/logo-similarity'], {
      queryParams: { imageUrl: image.image }
    });
  }

}
