import {Component, ElementRef, ViewChild} from '@angular/core';
import {ModalController, Platform} from "@ionic/angular";
import * as cocoSSD from "@tensorflow-models/coco-ssd";
import {TitleCasePipe} from "@angular/common";
import {VideoService} from "../video.service";
import {DetectedObject} from "@tensorflow-models/coco-ssd";

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.page.html',
  styleUrls: ['./video-modal.page.scss'],
})
export class VideoModalPage
{
  @ViewChild("capture") video: ElementRef<HTMLVideoElement> = new ElementRef<HTMLVideoElement>(document.createElement('video'));
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(document.createElement('canvas'));

  private currentFacingMode: string = 'environment';

  private predictions: string[] = [];

  private stream: MediaStream;

  constructor(private platform: Platform, private videoService: VideoService, private modalController: ModalController)
  {
  }

  async ionViewDidEnter()
  {
    await this.createStream();
    await this.predict();
  }

  async createStream()
  {
    await navigator.mediaDevices.getUserMedia
    (
      {
        audio: false,
        video:
          {
            facingMode: this.currentFacingMode,
            height: this.platform.platforms().includes('mobileweb') ? this.platform.height() : this.platform.width(),
            width: this.platform.platforms().includes('mobileweb') ? this.platform.width() :this.platform.height(),
          }
      })
      .then
      (
        (stream) =>
        {
          this.stream = stream;

          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.onloadedmetadata = () =>
          {
            this.video.nativeElement.play();
          };
        }
      );
  }

  async flipCamera()
  {
    if (this.video.nativeElement.srcObject !== null  && "getTracks" in this.video.nativeElement.srcObject)
    {
      this.video.nativeElement.srcObject.getTracks()[0].stop();
    }

    await this.renderPredictions([]);

    this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';

    await this.createStream();
    await this.predict();
  }

  public async predict()
  {
    const model = await cocoSSD.load({base: "lite_mobilenet_v2"});

    this.detectFrame(this.video.nativeElement,model);
  }

  detectFrame = (video: HTMLVideoElement, model: cocoSSD.ObjectDetection) =>
  {
    model.detect(video).then
    (
      predictions =>
      {
        this.renderPredictions(predictions);

        this.updatePredictions(predictions);

        requestAnimationFrame
        (
          () =>
          {
            this.detectFrame(video, model);
          }
        );
      }
    );
  }

  renderPredictions = (predictions: any[]) =>
  {
    this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;

    const ctx = this.canvas.nativeElement.getContext("2d");

    if (ctx !== null)
    {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      predictions.forEach
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

      predictions.forEach
      (
        (prediction) =>
        {
          const titlecase: TitleCasePipe = new TitleCasePipe() ;

          const x = prediction.bbox[0];
          const y = prediction.bbox[1];
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 10px sans-serif";
          ctx.fillText(titlecase.transform(prediction.class), x + 5, y + 10);

          console.log(prediction.class);
        }
      );
    }
  }

  private updatePredictions(predictions: DetectedObject[])
  {
    predictions.forEach
    (
      (prediction) =>
      {
        if (!this.predictions.includes(prediction.class))
        {
          this.predictions.push(prediction.class);
        }
      }
    );
  }

  async stopCamera()
  {
    this.stream.getTracks().forEach
    (
      (track)=>
      {
        track.stop();
      }
    )

    await this.modalController.dismiss({ 'dismissed': true});
    await this.videoService.dismissModal(this.predictions);
    this.predictions = [];
  }
}
