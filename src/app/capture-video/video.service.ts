import { Injectable } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {VideoModalPage} from "./video-modal/video-modal.page";
import {DetectedObject} from "@tensorflow-models/coco-ssd";
import {Subject} from "rxjs";

@Injectable
({
  providedIn: 'root'
})
export class VideoService
{
  predictionsSubject: Subject<string[]> = new Subject<string[]>();

  constructor(private modalController: ModalController) { }

  private videoModal: HTMLIonModalElement;

  private predictions: DetectedObject[] = [];

  public async createModal()
  {
    this.videoModal = await this.modalController.create
    ({
      component: VideoModalPage,
    });

    await this.videoModal.present();
  }

  public async dismissModal(predictions: string[])
  {
    await this.videoModal.dismiss({ 'dismissed': true});

    this.predictionsSubject.next(predictions);
  }
}
