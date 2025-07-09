import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { ImgData } from '../models/image-data';
import { map } from 'rxjs/operators';

const API_BASE_URL = "http://wishapic.runasp.net/api/";

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private baseUrl = 'https://localhost:7777/api';

  constructor(private http: HttpClient) { }

  async getHistoryImages(userId: string): Promise<ImgData[]> {
    const response = await lastValueFrom(
      this.http.get<any[]>(`${this.baseUrl}/images/history/${userId}`).pipe(
        map(images => images.map(img => ({
          id: img.imageId,
          userId: img.userId,
          prompt: img.prompt,
          image: `data:${img.image.contentType};base64,${img.image.fileContents}`,
          isFavorite: img.isFavorite,
          createdAt: new Date(img.createdAt)
        })))
      )
    );
    return response;
  }

  async addToFavorites(userId: string, imageId: string): Promise<void> {
    await lastValueFrom(
      this.http.post(`${this.baseUrl}/images/favorites/add`, { userId, imageId })
    );
  }

  async removeFromFavorites(userId: string, imageId: string): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.baseUrl}/images/favorites/${userId}/${imageId}`)
    );
  }

  async removeFromHistory(userId: string, imageId: string): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.baseUrl}/images/history/${userId}/${imageId}`)
    );
  }

  public getHistory(userId: string, page: number = 1, pageSize: number = 12): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage['token']}` };
    const params = {
      userId,
      page: page.toString(),
      pageSize: pageSize.toString(),
      thumbnailsOnly: 'true'
    };

    return this.http.get<any>(`${API_BASE_URL}sdxl/GetAllImages`, {
      headers,
      params
    }).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(img => ({
            ...img,
            image: img.image ? {
              ...img.image,
              fileContents: img.image.thumbnailContents || img.image.fileContents
            } : null
          }));
        }
        return response;
      })
    );
  }

  public postAddToFavorites(imageData: ImgData): Observable<any> {
    return this.http.post<ImgData>(`${API_BASE_URL}Images/AddToFavorites`, imageData);
  }

  public getFavorites(userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<any[]>(`${API_BASE_URL}Images/GetFavorites`, { params });
  }

  public deleteFromFavorites(imageData: ImgData): Observable<any> {
    return this.http.delete<ImgData>(`${API_BASE_URL}Images/DeleteFromFavorites`, { body: imageData });
  }

  public deleteFromHistory(imageData: ImgData): Observable<any> {
    return this.http.delete<ImgData>(`${API_BASE_URL}Images/DeleteFromHistory`, { body: imageData });
  }

  public toggleFavorite(imageId: number | null): Observable<any> {
    if (!imageId) {
      throw new Error('Image ID is required');
    }
    return this.http.post<any>(`${API_BASE_URL}Images/ToggleFavorite/${imageId}`, {});
  }

  postAddToHistory(image: ImgData) {
    return this.http.post(`${this.baseUrl}/images/history`, image);
  }

  postAddToFavorites1(image: ImgData) {
    return this.http.post(`${this.baseUrl}/images/favorites`, image);
  }
}
