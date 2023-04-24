import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IonicRatingComponent} from "ionic-rating-component";
import {HttpClient} from "@angular/common/http";
import {environment} from '../../environments/environment';
import {NavController, ToastController} from "@ionic/angular";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {AuthenticationService} from "../authentication/authentication.service";

const BACKEND_URL = environment.backend_URL;

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit, AfterViewInit
{

  public form: FormGroup;

  @ViewChild('ratingComponent') ratingComponentRef: ElementRef<IonicRatingComponent>;

  constructor(private http: HttpClient,
              private navController: NavController,
              private toastController: ToastController,
              private authenticationService: AuthenticationService
              ) {}

  ngOnInit()
  {
    this.authenticationService.getAuthStatusListener()
      .subscribe
      (
        async (isAuthenticated) =>
        {
          if (!isAuthenticated)
          {
            await this.navController.navigateRoot('/home')
          }
        }
      )

    this.form = new FormGroup
    (
      {
        // Comment
        'comment': new FormControl
        (
          '',
          {
            validators:
              [
                Validators.required,
              ]
          }
        ),
      }
    )
  }

  ngAfterViewInit(): void 
  {
    this.ratingComponentRef.nativeElement.rating = 3.5;
  }

  public onReviewSubmit(ratingComponent: IonicRatingComponent)
  {
    const data = {comment: this.form.get('comment').value, rating: ratingComponent.rating}

    this.http
      .post
      (
        BACKEND_URL + '/review/save',
        data
      )
      .pipe
      (
        catchError
        (
          async (error: any) =>
          {
            const toast = await this.toastController.create
            (
              {
                message: "You have already submitted your review",
                duration: 2000,
                color: "danger",
                icon: 'bug'
              }
            );
            await toast.present();

            return throwError('Saving Review Failed');
          }
        )
      )
      .subscribe
      (
        async (response: any) =>
        {
          if (response.message)
          {
            const toast = await this.toastController.create
            (
              {
                message: "Submitted your review successfully",
                duration: 2000,
                color: "primary",
                icon: 'information-circle'
              }
            );
            await toast.present();

            this.form.reset();
          }
        }
      )
  }

  public changedRating(ratingComponent: IonicRatingComponent)
  {
    const rating = ratingComponent.rating;

    if (rating <= 1.5)
    {
      ratingComponent.activeColor = '#EB445A'
    }
    else if (rating <= 3.5)
    {
      ratingComponent.activeColor = '#FFC409'
    }
    else
    {
      ratingComponent.activeColor = '#2DD36F'
    }
  }
}
