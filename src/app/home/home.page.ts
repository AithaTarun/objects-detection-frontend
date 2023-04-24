import {Component} from '@angular/core';
import {AuthenticationService} from "../authentication/authentication.service";
import {CloudPredictionsService} from "../cloud-predictions.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {IonImg, IonItemOption, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage
{
  public isFetching: boolean = false;

  public predictions: any[] = [];

  constructor(public authenticationService: AuthenticationService,
              private cloudPredictionsService: CloudPredictionsService,
              private toastController: ToastController)
  {

  }

  async ionViewWillEnter()
  {
    if (this.authenticationService.getIsAuthenticated())
    {
      await this.fetchData();
    }

    this.authenticationService.getAuthStatusListener().subscribe
    (
      async (isAuthenticated)=>
      {
        this.predictions = [];

        if (isAuthenticated)
        {
          await this.fetchData();
        }
      }
    )
  }

  private async fetchData()
  {
    this.isFetching = true;

    const fetchPredictionsObservable: Observable<any> = await this.cloudPredictionsService.fetchPredictions();

    fetchPredictionsObservable
      .pipe
      (
        catchError
        (
          async (error: any) =>
          {
            const errorMessage: string = error.message;

            const toast = await this.toastController.create
            (
              {
                message: errorMessage,
                duration: 2000,
                color: "danger",
                icon: 'bug'
              }
            );
            await toast.present();

            return throwError('Fetching Predictions Failed');
          }
        )
      )
      .subscribe
      (
        async (response) =>
        {
          this.predictions = response.predictions;

          this.isFetching = false;
        }
      );
  }

  public async deletePrediction(item: IonItemOption, itemImage: IonImg, id: string)
  {
    item.disabled = true;
    itemImage.src = 'assets/icon/deleting.gif';

    const deletePredictionObservable: Observable<any> = await this.cloudPredictionsService.deletePrediction(id);

    deletePredictionObservable
      .pipe
      (
        catchError
        (
          async (error: any) =>
          {
            const errorMessage: string = error.message;

            const toast = await this.toastController.create
            (
              {
                message: errorMessage,
                duration: 2000,
                color: "danger",
                icon: 'bug'
              }
            );
            await toast.present();

            item.disabled = false;
            itemImage.src = 'assets/icon/delete.png';

            return throwError('Deleting Prediction Failed');
          }
        )
      )
      .subscribe
      (
        async (response) =>
        {
          const toast = await this.toastController.create
          (
            {
              message: "Successfully Deleted Prediction",
              duration: 2000,
              color: "primary",
              icon: 'information-circle'
            }
          );
          await toast.present();

          this.predictions = this.predictions.filter
          (
            (prediction) =>
            {
              return prediction._id !== id;
            }
          );
        }
      );
  }

}
