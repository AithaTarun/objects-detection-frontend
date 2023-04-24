import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";
import {AuthenticationService} from "./authentication/authentication.service";

import {Keyboard} from "@capacitor/keyboard";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit
{
  public isKeyboardOpen: boolean = false;

  constructor(private navController: NavController, private authenticationService: AuthenticationService)
  {
    Keyboard.addListener
    (
      'keyboardWillShow',
      ()=>
      {
        this.isKeyboardOpen = true;
      }
    );

    Keyboard.addListener
    (
      'keyboardDidHide',
      ()=>
      {
        this.isKeyboardOpen = false;
      }
    );
  }

  ngOnInit()
  {
    this.authenticationService.autoAuthenticateUser();
  }

  public async navigate(route: string)
  {
    if (route === 'image')
    {
      await this.navController.navigateRoot('/capture-image');
    }
    else
    {
      await this.navController.navigateRoot('/capture-video');
    }
  }
}
