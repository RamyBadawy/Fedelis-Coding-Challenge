import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable, of } from 'rxjs';
import * as allAlerts from './api/alerts.json';
import { IAlert } from './model/common-interfaces.interface';


// this class is used to emulate the response coming as observable
@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    let alerts: Array<IAlert> = allAlerts;
    return { alerts };
  }
}

// another way of doing it
export class InMemoryDataService2 {

  constructor() { }

  getDataFromApi(): Observable<Array<IAlert>> {
    return of(allAlerts);
  }
}