import {Component, OnInit} from '@angular/core';

import "@tensorflow/tfjs";
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {VideoService} from "./video.service";

@Component({
  selector: 'app-capture-video',
  templateUrl: './capture-video.page.html',
  styleUrls: ['./capture-video.page.scss'],
})
export class CaptureVideoPage implements OnInit
{
  public predictions: string[] = [];

  constructor(private videoService: VideoService)
  {
  }

  ngOnInit()
  {
    this.videoService.predictionsSubject.subscribe
    (
      (predictions) =>
      {
        this.predictions = predictions;
      }
    );
  }

  public async openVideo()
  {
    await this.videoService.createModal();
  }
}
