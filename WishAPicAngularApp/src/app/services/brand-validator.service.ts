import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BrandValidatorService {
  private famousBrands: string[] = [
    'Apple', 'Microsoft', 'Google', 'Amazon', 'Facebook', 'Tesla', 'Samsung', 'Intel', 'IBM', 'Sony',
    'Dell', 'HP', 'Nvidia', 'Lenovo', 'Cisco', 'Oracle', 'Adobe', 'ASUS', 'LG', 'Qualcomm',
    'Panasonic', 'Xiaomi', 'Huawei', 'AMD', 'Fujitsu', 'BlackBerry', 'Ericsson', 'SAP', 'Dropbox',
    'Twitter', 'Salesforce', 'Zoom', 'Slack', 'Uber', 'Airbnb', 'Spotify', 'Netflix', 'Twitch',
    'eBay', 'PayPal', 'Square', 'Pinterest', 'WeWork', 'TikTok', 'Alibaba', 'Baidu', 'Tencent',
    'Yahoo', 'Nokia', 'GoPro'
    // ... add more brands as needed
  ];

  constructor(private http: HttpClient) {}

  isFamousBrand(brandName: string): boolean {
    if (!brandName) return false;
    
    // Convert both to lowercase for case-insensitive comparison
    const normalizedBrandName = brandName.toLowerCase().trim();
    
    return this.famousBrands.some(brand => 
      brand.toLowerCase() === normalizedBrandName
    );
  }

  validateBrandName(brandName: string): { isValid: boolean; message: string } {
    if (!brandName) {
      return { isValid: false, message: 'Brand name is required' };
    }

    if (this.isFamousBrand(brandName)) {
      return { 
        isValid: false, 
        message: 'This brand name is already taken by a famous brand. Please choose a different name.' 
      };
    }

    return { isValid: true, message: 'Brand name is valid' };
  }
} 