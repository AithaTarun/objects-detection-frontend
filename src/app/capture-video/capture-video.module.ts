import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaptureVideoPageRoutingModule } from './capture-video-routing.module';

import { CaptureVideoPage } from './capture-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaptureVideoPageRoutingModule
  ],
  declarations: [CaptureVideoPage]
})
export class CaptureVideoPageModule {}
