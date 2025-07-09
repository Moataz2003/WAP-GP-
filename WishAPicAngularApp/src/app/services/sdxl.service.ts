import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
const API_BASE_URL = "http://wishapic.runasp.net/api/sdxl/";

@Injectable({
  providedIn: 'root'
})
export class SdxlService {
  private apiUrl = 'http://wishapic.runasp.net/api/sdxl/generate'; // Replace with your .NET API URL

  constructor(private http: HttpClient) { }

  generateImage(brandName: string,brandStyle: string,prompt: string): Observable<any> {
    // var header = {
    //   headers: new HttpHeaders()
    //       .set("Authorization", `Bearer ${localStorage['token']}`)
    // };

    const headers = {"Authorization": `Bearer ${localStorage['token']}`}

    // return this.http.post(this.apiUrl, { brandName, brandStyle, prompt }, { responseType: 'arraybuffer', headers}).pipe(
    //   map((response) => {
    //     let binary = '';
    //     const bytes = new Uint8Array(response);
    //     for (let i = 0; i < bytes.byteLength; i++) {
    //       binary += String.fromCharCode(bytes[i]);
    //     }
    //     return 'data:image/png;base64,' + btoa(binary); // Convert to Base64
    //   })
    // );

    return this.http.post<any>(this.apiUrl, { brandName, brandStyle, prompt }, {headers})


  }




}



