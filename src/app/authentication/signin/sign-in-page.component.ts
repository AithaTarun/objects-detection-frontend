import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {AuthenticationService} from "../authentication.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {SignUpPage} from "../signup/sign-up-page.component";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
})
export class SignInPage implements OnInit
{
  public form: FormGroup;

  formMessage = '';
  messageColor = 'danger';

  constructor(private modalController: ModalController, private authenticationService: AuthenticationService)
  { }

  ngOnInit()
  {
    this.form = new FormGroup
    (
      {
        // Username
        'username': new FormControl
        (
          '',
          {
            validators:
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(10)
              ]
          }
        ),

        // Password
        'password': new FormControl
        (
          '',
          {
            validators:
              [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(10)
              ]
          }
        ),

        // Remember Me
        'remember': new FormControl
        (
          false
        ),
      }
    )
  }

  onFormChange()
  {
    if (this.form.get('username').hasError('incorrect'))
    {
      this.form.get('username').setErrors(null);
    }

    let isUsernameValid: boolean;

    // Username validation
    if (this.form.get('username').value.length === 0)
    {
      this.formMessage = 'Username is required';
      this.messageColor = 'danger';
      isUsernameValid = false;
    }
    else if (this.form.get('username').value.length < 5)
    {
      this.formMessage = 'Username should be minimum of 5 characters';
      this.messageColor = 'danger';
      isUsernameValid = false;
    }
    else
    {
      this.formMessage = '';
      this.messageColor = 'success';
      isUsernameValid = true;
    }

    if (isUsernameValid)
    {
      // Password validation
      if (this.form.get('password').value.length === 0)
      {
        this.formMessage = 'Password is required';
        this.messageColor = 'danger';
      }
      else if (this.form.get('password').value.length < 5)
      {
        this.formMessage = 'Password should be minimum of 5 characters';
        this.messageColor = 'danger';
      }
      else
      {
        this.formMessage = '';
        this.messageColor = 'success';
      }
    }
  }

  onSignIn()
  {
    const loginUserObservable: Observable<any> = this.authenticationService.loginUser
    (
      this.form.get('username').value,
      this.form.get('password').value,
      this.form.get('remember').value
    );

    loginUserObservable
      .pipe
      (
        catchError
        (
          (error: any) =>
          {
            const errorMessage: string = error.error.message;

            if (errorMessage === "Username doesn't exits")
            {
              this.formMessage = errorMessage;
              this.messageColor = "danger";

              this.form.get('username').setErrors({'incorrect': true});
            }
            else if (errorMessage === 'Wrong username and password combination')
            {
              this.formMessage = errorMessage;
              this.messageColor = "danger";

              this.form.get('password').setErrors({'incorrect': true});
            }

            return throwError('Authentication failed');
          }
        )
      )
      .subscribe
      (
        async (response) =>
        {
          await this.authenticationService.login(response);
        }
      );
  }

  public async closeSignIn()
  {
    await this.modalController.dismiss(null, 'cancel');
  }

  public async openSignUp()
  {
    await this.closeSignIn();

    const modal = await this.modalController.create
    (
      {
        component: SignUpPage
      }
    );

    await modal.present();
  }
}
