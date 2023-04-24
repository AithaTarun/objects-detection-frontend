import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaptureImagePageRoutingModule } from './capture-image-routing.module';

import { CaptureImagePage } from './capture-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaptureImagePageRoutingModule
  ],
  declarations: [CaptureImagePage]
})
export class CaptureImagePageModule {}
