import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAlert } from '../model/common-interfaces.interface';


@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private alertsApi = 'api/alerts';

  constructor(private http: HttpClient) {}

  public getAllAlerts(): Observable<Array<IAlert>> {
    return this.http.get<Array<IAlert>>(this.alertsApi);
  }
}
