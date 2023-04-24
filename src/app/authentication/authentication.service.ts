import { Injectable } from '@angular/core';

import {environment} from '../../environments/environment';
import {AuthenticationData} from "./authentication-data";

import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ModalController} from "@ionic/angular";

const BACKEND_URL = environment.backend_URL;

@Injectable
({
  providedIn: 'root'
})
export class AuthenticationService
{
  private token: string;
  private authenticationStatusListener : Subject<boolean> = new Subject<boolean>();

  private isAuthenticated = false;

  private tokenTimer: any;

  constructor(private http: HttpClient, private modalController: ModalController)
  {

  }

  createUser(username: string, password: string): Observable<any>
  {
    const authenticationData: AuthenticationData = {username, password };

    return this.http
      .post
      (
        BACKEND_URL + '/user/signup',
        authenticationData
      );
  }

  loginUser(username: string, password: string, remember: boolean): Observable<any>
  {
    const authenticationData = {username, password, remember};

    return this.http
      .post
      (
        BACKEND_URL + '/user/signin',
        authenticationData
      );
  }

  async login(response)  // Called after user has successfully logged in.
  {
    this.token = response.token;
    if (this.token)
    {
      const expiresInDuration = response.expiresIn;
      this.setAuthenticationTimer(expiresInDuration);

      this.authenticationStatusListener.next(true);
      this.isAuthenticated = true;

      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      AuthenticationService.saveAuthenticationData(this.token, expirationDate);

      await this.modalController.dismiss(null, 'cancel');
    }
  }

  getAuthStatusListener()
  {
    return this.authenticationStatusListener.asObservable();
  }

  getIsAuthenticated()
  {
    return this.isAuthenticated;
  }

  logout()
  {
    this.token = null;
    this.isAuthenticated = false;

    this.authenticationStatusListener.next(false);

    clearTimeout(this.tokenTimer);

    AuthenticationService.clearAuthenticationData();
  }

  private static saveAuthenticationData(token: string, expirationDate: Date)
  {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private static clearAuthenticationData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  autoAuthenticateUser()
  {
    const authInformation = AuthenticationService.getAuthenticationData();

    if (!authInformation)
    {
      return;
    }

    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0)
    {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthenticationTimer(expiresIn / 1000);

      this.authenticationStatusListener.next(true);
    }
  }

  private static getAuthenticationData()
  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate)
    {
      return;
    }

    return {
      token,
      expirationDate : new Date(expirationDate),
    }
  }

  private setAuthenticationTimer(duration: number)
  {
    this.tokenTimer = setTimeout
    (
      () =>
      {
        this.logout();
      },
      duration * 1000 // Seconds -> Milliseconds.
    );
  }

  public getToken()
  {
    return this.token;
  }
}
