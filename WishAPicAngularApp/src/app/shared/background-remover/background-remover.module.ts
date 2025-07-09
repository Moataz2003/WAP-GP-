import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackgroundRemoverComponent } from './background-remover.component';

@NgModule({
  declarations: [
    BackgroundRemoverComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    BackgroundRemoverComponent
  ]
})
export class BackgroundRemoverModule { }
