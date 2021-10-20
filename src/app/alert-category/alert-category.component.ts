import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IAlert } from '../model/common-interfaces.interface';

@Component({
  selector: 'alert-category',
  templateUrl: './alert-category.component.html',
  styleUrls: ['./alert-category.component.scss'],
})
export class ShowStatisticsComponent implements OnInit {

  @Input()
  public inputDataMap: Record<string, Array<IAlert>>;

  @Input()
  public title: string;

  @Output()
  public emitSelectedfilters: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  public selectedFilters: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
  }

  public emitFilterItem(item: KeyValue<string, Array<IAlert>>) {
    // remove the space from the title to match the object property
    const str: string = this.title.replace(/\s/g, '');
    // will emit key, value
    this.selectedFilters = [ str, item.key ];
    this.emitSelectedfilters.emit(this.selectedFilters);
  }

  public getSelectedFilters$(): Observable<string[]> {
    return this.emitSelectedfilters.asObservable();
  }

}
