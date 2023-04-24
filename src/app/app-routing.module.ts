import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    },
    {
      path: 'image-upload',
      loadChildren: () => import('./image-upload/image-upload.module').then( m => m.ImageUploadPageModule)
    },
    {
      path: 'capture-image',
      loadChildren: () => import('./capture-image/capture-image.module').then( m => m.CaptureImagePageModule)
    },
    {
      path: 'capture-video',
      loadChildren: () => import('./capture-video/capture-video.module').then( m => m.CaptureVideoPageModule)
    },
  {
    path: 'signup',
    loadChildren: () => import('./authentication/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./authentication/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then( m => m.ReviewPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
