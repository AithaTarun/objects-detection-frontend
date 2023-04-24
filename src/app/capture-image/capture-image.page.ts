import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import * as cocoSSD from "@tensorflow-models/coco-ssd";
import {DetectedObject} from "@tensorflow-models/coco-ssd";

import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';

import "@tensorflow/tfjs";
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {Subject} from "rxjs";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-capture-image',
  templateUrl: './capture-image.page.html',
  styleUrls: ['./capture-image.page.scss'],
})
export class CaptureImagePage implements OnInit
{
  public isPredicting = false;

  public predictions: DetectedObject[] = [];

  public base64Image;

  private imageSubject: Subject<string> = new Subject<string>();

  @ViewChildren('imagePreview') imagePreview: QueryList<any>;
  @ViewChild('imageCanvas') imageCanvas: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(document.createElement('canvas'));

  constructor()
  {

  }

  ngOnInit()
  {
    this.openCamera();

    this.imageSubject.subscribe
    (
      async (imageData) =>
      {
        if (imageData)
        {
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
      }
    )
  }

  public async openCamera()
  {
    try
    {
      const photo: Photo = await Camera.getPhoto
      (
        {
          quality: 100,
          source: CameraSource.Camera,
          correctOrientation: true,
          resultType: CameraResultType.Base64
        }
      );

      console.log(photo);

      this.base64Image = "data:Image/*;base64," + photo.base64String;
      this.imageSubject.next(this.base64Image);
    }
    catch (e)
    {
      console.log("Error while Taking Picture : ", e)
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
}
