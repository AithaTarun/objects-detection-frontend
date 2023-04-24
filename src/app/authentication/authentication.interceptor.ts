import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor
{
  constructor(private authenticationService: AuthenticationService)
  {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler)
  {
    const authenticationToken = this.authenticationService.getToken();

    const authenticationRequest = request.clone
    (
      // Clone and edit that request.
      {
        headers : request.headers.set('Authorization', 'Bearer ' + authenticationToken)
      }
    );


    return next.handle(authenticationRequest);
  }

}
