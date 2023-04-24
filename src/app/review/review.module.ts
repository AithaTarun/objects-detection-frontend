import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewPageRoutingModule } from './review-routing.module';

import { ReviewPage } from './review.page';
import {IonicRatingComponentModule} from "ionic-rating-component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewPageRoutingModule,
    IonicRatingComponentModule,

    ReactiveFormsModule
  ],
  declarations: [ReviewPage]
})
export class ReviewPageModule {}
