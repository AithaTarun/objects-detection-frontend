import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {SignInPage} from "../signin/sign-in-page.component";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPage implements OnInit
{
  form: FormGroup;

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

  onSignUp()
  {
    this.formMessage = '';
    this.messageColor = 'success';

    if (this.form.invalid)
    {
      return;
    }

    const createUserObservable: Observable<any> = this.authenticationService.createUser
    (
      this.form.get('username').value,
      this.form.get('password').value
    );

    createUserObservable
      .pipe
      (
        catchError
        (
          (error: any) =>
          {
            const errorMessages: string[] = error.error.message;

            errorMessages.forEach
            (
              (message) =>
              {
                if (message === 'username')
                {
                  this.formMessage = "Username already taken";
                  this.messageColor = 'danger';
                  this.form.get('username').setErrors({'incorrect': true});
                }
              }
            )

            return throwError('Error occurred');
          }
        )
      )
      .subscribe
      (
        (response: any) =>
        {
          this.formMessage = "User created successfully";
          this.messageColor = 'success';
          this.form.reset();
        }
      )
  }

  public async closeSignUp()
  {
    await this.modalController.dismiss(null, 'cancel');
  }

  public async openSignIn()
  {
    await this.closeSignUp();

    const modal = await this.modalController.create
    (
      {
        component: SignInPage
      }
    );

    await modal.present();
  }
}
