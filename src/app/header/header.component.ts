import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {ModalController} from "@ionic/angular";
import {SignInPage} from "../authentication/signin/sign-in-page.component";
import {AuthenticationService} from "../authentication/authentication.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit
{
  public headerTitle= 'Home';
  public authenticationIcon: string;

  constructor(private router: Router, private modalController: ModalController,
              public authenticationService: AuthenticationService)
  { }

  ngOnInit()
  {
    this.router.events.subscribe
    (
      (routerEvent) =>
      {
        if (routerEvent instanceof NavigationEnd)
        {
          const activeRoute = routerEvent.urlAfterRedirects;

          if (activeRoute === '/home' || activeRoute === '')
          {
            this.headerTitle = 'Home';
          }
          else if (activeRoute === '/image-upload')
          {
            this.headerTitle = 'Image Upload';
          }
          else if (activeRoute === '/capture-image')
          {
            this.headerTitle = 'Image';
          }
          else if (activeRoute === '/capture-video')
          {
            this.headerTitle = 'Video';
          }
          else if (activeRoute === '/review')
          {
            this.headerTitle = 'Review';
          }
        }
      }
    );

    this.authenticationService.getAuthStatusListener().subscribe
    (
      (isAuthenticated) =>
      {
        this.authenticationIcon = isAuthenticated ? 'assets/icon/logout.png' : 'assets/icon/login.png';
      }
    );

    this.authenticationIcon = this.authenticationService.getIsAuthenticated() ? 'assets/icon/logout.png' : 'assets/icon/login.png';
  }

  public async openAuthenticationModal()
  {
    const modal = await this.modalController.create
    (
      {
        component: SignInPage
      }
    );

    await modal.present();
  }
}
