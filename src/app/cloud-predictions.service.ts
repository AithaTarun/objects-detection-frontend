import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DetectedObject} from "@tensorflow-models/coco-ssd";

import {environment} from '../environments/environment';

const BACKEND_URL = environment.backend_URL;

@Injectable
({
  providedIn: 'root'
})
export class CloudPredictionsService
{
  constructor(private http: HttpClient)
  {

  }

  public async uploadPredictions(imageName: string, image: string, predictions: DetectedObject[])
  {
    let tempData = await fetch(image);
    const imageBlob = await tempData.blob();

    const formData: FormData = new FormData();
    formData.append('image', imageBlob, imageName);
    formData.append('predictions', JSON.stringify(predictions))

    return this.http
      .post
      (
        BACKEND_URL + '/prediction/upload',
        formData
      );
  }

  public fetchPredictions()
  {
    return this.http.get
    (
      BACKEND_URL + `/prediction/fetchAll`,
    );
  }

  public deletePrediction(id: string)
  {
    return this.http.delete
    (
      BACKEND_URL + `/prediction/delete`,
      {
        body:
          {
            id: id
          }
      }
    );
  }
}
