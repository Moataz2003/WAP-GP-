import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackgroundRemovalComponent } from './background-removal.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  declarations: [
    BackgroundRemovalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BackgroundRemovalComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class BackgroundRemovalModule { } 