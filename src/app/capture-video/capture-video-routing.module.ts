import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaptureVideoPage } from './capture-video.page';

const routes: Routes = [
  {
    path: '',
    component: CaptureVideoPage
  },
  {
    path: 'video-modal',
    loadChildren: () => import('./video-modal/video-modal.module').then( m => m.VideoModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptureVideoPageRoutingModule {}
