import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'alert-list-header',
  templateUrl: './alert-list-header.component.html',
  styleUrls: ['./alert-list-header.component.scss']
})
export class FilterNameComponent {

  @Input()
  filterKeyValuePair: Record<string, string>;

  @Input()
  public count: number;

  @Output()
  public resetClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  public reset() {
    this.filterKeyValuePair = {} as Record<string, string>;
    this.resetClicked.emit(true);
  }
}
