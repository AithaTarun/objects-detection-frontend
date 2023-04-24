import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaptureImagePage } from './capture-image.page';

const routes: Routes = [
  {
    path: '',
    component: CaptureImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaptureImagePageRoutingModule {}
