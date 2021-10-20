import { Component, OnInit } from '@angular/core';
import { groupBy, map, mergeMap, tap, toArray } from 'rxjs/operators'
import { Observable, of, zip } from 'rxjs';
import { ProviderService } from '../service/provider-service.service';
import { IAlert } from '../model/common-interfaces.interface';
import { isNgTemplate } from '@angular/compiler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public totalCount: number;
  private allAlerts: Array<IAlert> = [];

  public filtersMap: Record<string, string> = {} as Record<string, string>;
  public severityMap: Record<string, Array<IAlert>> = {} as Record<string, Array<IAlert>>;
  public clientIpMap: Record<string, Array<IAlert>> = {} as Record<string, Array<IAlert>>;
  public protocolMap: Record<string, Array<IAlert>> = {} as Record<string, Array<IAlert>>;
  public clientCountryMap: Record<string, Array<IAlert>> = {} as Record<string, Array<IAlert>>;

  constructor(private providerService: ProviderService) { }

  public ngOnInit(): void {

    //#region 
    // // another way of doing it using groupBy Operator
    // this.providerService.getAllAlerts()
    //   .pipe(
    //     map((data: Array<IAlert>) => {
    //       this.allAlerts = data;
    //       this.totalCount = data.length
    //       return data;
    //     }),
    //     mergeMap((alerts: Array<IAlert>) => alerts),
    //     groupBy(alert => alert.Severity),
    //     mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
    //     tap((item) => this.severityMap[item[0]] = item[1].length),
    //     mergeMap(() => this.allAlerts),

    //     groupBy(alert => alert.ClientIP),
    //     mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
    //     tap((item) => this.clientIpMap[item[0]] = item[1].length),
    //     mergeMap(() => this.allAlerts),

    //     groupBy(alert => alert.Protocol),
    //     mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
    //     tap((item) => this.protocolMap[item[0]] = item[1].length),
    //     mergeMap(() => this.allAlerts),

    //     groupBy(alert => alert.ClientCountry),
    //     mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
    //     tap((item) => this.clientCountryMap[item[0]] = item[1].length),
    //     mergeMap(() => this.allAlerts)
    //   )
    //   .subscribe((res) => { });
    //#endregion

    this.loadAlerts();
  }

  protected loadAlerts(): void {
    this.providerService.getAllAlerts()
      .pipe(
        // unwind the array
        mergeMap((alerts: Array<IAlert>) => {
          this.allAlerts = alerts;
          return alerts;
        }),
        map((alert: IAlert) => {
          this.addIfAbsent(this.severityMap, alert.Severity as string, alert);
          this.addIfAbsent(this.clientIpMap, alert.ClientIP as string, alert);
          this.addIfAbsent(this.protocolMap, alert.Protocol as string, alert);
          this.addIfAbsent(this.clientCountryMap, alert.ClientCountry as string, alert);
          return alert;
        }),
        toArray()
      ).subscribe((res: Array<IAlert>) => {
        this.totalCount = res.length;
      });
  }

  protected addIfAbsent(map: Record<string, Array<IAlert>>, key: string, value: IAlert) {
    const count: Array<IAlert> = map[key];
    if (!count) {
      map[key] = [value];
    } else {
      map[key].push(value);
    }
  }

  public filterReceived(filters: Array<string>) {
    // update the filter in the header
    this.filtersMap[filters[0]] = filters[1];
    // update all the map objects using the emitted filter 
    this.severityMap = this.filterObject(this.severityMap, filters);
    this.clientIpMap = this.filterObject(this.clientIpMap, filters);
    this.protocolMap = this.filterObject(this.protocolMap, filters);
    this.clientCountryMap = this.filterObject(this.clientCountryMap, filters);

    this.updateTotalCount();
  }

  // filter each object
  protected filterObject(obj: Record<string, IAlert[]>, filter: string[]) {
    let result: Record<string, IAlert[]> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const filteredArray = obj[key].filter((alert: IAlert) => alert[filter[0]] === filter[1]);

        if (filteredArray.length) {
          result[key] = filteredArray;
        }
      }
    }

    return result;
  };

  public resetReceived(flag: boolean) {
    if (flag) {
      this.resetOldMaps();
      this.loadAlerts();
      this.updateTotalCount();
    }
  }

  protected updateTotalCount() {
    this.totalCount = Object.values(this.severityMap).reduce((item, acc) => item + acc.length, 0);
  }

  public resetOldMaps(): void {
    this.severityMap = {} as Record<string, Array<IAlert>>;
    this.clientIpMap = {} as Record<string, Array<IAlert>>;
    this.protocolMap = {} as Record<string, Array<IAlert>>;
    this.clientCountryMap = {} as Record<string, Array<IAlert>>;
    this.filtersMap = {} as Record<string, string>;
  }
}
