import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

import * as cocoSSD from '@tensorflow-models/coco-ssd';

import "@tensorflow/tfjs";
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

import {DetectedObject} from "@tensorflow-models/coco-ssd";
import {TitleCasePipe} from "@angular/common";
import {AuthenticationService} from "../authentication/authentication.service";
import {CloudPredictionsService} from "../cloud-predictions.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.page.html',
  styleUrls: ['./image-upload.page.scss'],
})
export class ImageUploadPage
{
  public imageSRC: any;

  public currentImageName: string;

  public isPredicting = false;

  public predictions: DetectedObject[] = [];

  public isUploading: boolean = false;

  @ViewChildren('imagePreview') imagePreview: QueryList<any>;
  @ViewChild('imageCanvas') imageCanvas: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(document.createElement('canvas'));

  constructor(private sanitizer: DomSanitizer,
              public authenticationService: AuthenticationService,
              private cloudPredictionsService: CloudPredictionsService,
              private toastController: ToastController)
  { }

  public onUploadClick(fileUpload: HTMLInputElement)
  {
   fileUpload.click();
  }

  public onImageUploaded(fileUpload: HTMLInputElement)
  {
    if (fileUpload.files !== null && fileUpload.files.length > 0)
    {
      const reader = new FileReader();
      reader.readAsDataURL(fileUpload.files[0]);

      reader.onload = async () =>
      {
        if (reader.result !== null)
        {
          // this.imageSRC = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64," + reader.result.toString().replace(RegExp("data:image\\/(.*);base64,"), ""));
          this.currentImageName = fileUpload.files[0].name;

          this.imageSRC = reader.result;

          this.predictions = [];

          const imageElement: HTMLImageElement = <HTMLImageElement> this.imagePreview.first.el.shadowRoot.children.item(0);

          this.isPredicting = true;

          // Predicting
          const model = await cocoSSD.load({base: "mobilenet_v2"});
          this.predictions = await model.detect(imageElement);

          this.isPredicting = false;

          console.log("Predicted : ", this.predictions);

          this.renderPredictions();
        }
      };
    }
  }

  private renderPredictions()
  {
    this.imageCanvas.nativeElement.width = this.imagePreview.first.el.shadowRoot.children.item(0).width;
    this.imageCanvas.nativeElement.height = this.imagePreview.first.el.shadowRoot.children.item(0).height;

    const ctx = this.imageCanvas.nativeElement.getContext("2d");

    if (ctx !== null)
    {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      this.predictions.forEach
      (
        (prediction) =>
        {
          const x = prediction.bbox[0];
          const y = prediction.bbox[1];
          const width = prediction.bbox[2];
          const height = prediction.bbox[3];

          // Bounding box
          ctx.strokeStyle = "#007bff";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);

          // Label background
          ctx.fillStyle = "#007bff";
          const textWidth = ctx.measureText(prediction.class).width;
          const textHeight = parseInt("12px sans-serif", 10); // base 10
          ctx.fillRect(x, y, textWidth + 15, textHeight + 4);
        }
      );

      this.predictions.forEach
      (
        (prediction) =>
        {
          const titlecase: TitleCasePipe = new TitleCasePipe() ;

          const x = prediction.bbox[0];
          const y = prediction.bbox[1];
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 10px sans-serif";
          ctx.fillText(titlecase.transform(prediction.class), x + 5, y + 10);
        }
      );
    }
  }

  public async onCloudUpload()
  {
    this.isUploading = true;

    const uploadPredictionObservable: Observable<any> = await this.cloudPredictionsService.uploadPredictions
    (
      this.currentImageName, this.imageSRC, this.predictions
    );

    uploadPredictionObservable
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

            return throwError('Prediction Upload Failed');
          }
        )
      )
      .subscribe
      (
        async (response) =>
        {

          if (response.result)
          {
            const toast = await this.toastController.create
            (
              {
                message: "Prediction Uploaded Successfully",
                duration: 2000,
                color: "primary",
                icon: 'information-circle'
              }
            );
            await toast.present();
          }

          this.isUploading = false;
        }
      );
  }
}
