import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const excludedUrls: string[] = [
  '/sign-up',
  '/sign-in'
]

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

  const shouldSkip = excludedUrls.some(url => req.url.includes(url))

  if (shouldSkip) {
    return next(req);
  }

  let session = JSON.parse(localStorage.getItem('sesion_actual')!) || undefined;

  console.log('Agregando token: ' + session.token);

  const reqWithHeaders = req.clone({
    setHeaders: {
      Authorization: `Bearer ${session.token}`
    }
  })
  return next(reqWithHeaders);
};


