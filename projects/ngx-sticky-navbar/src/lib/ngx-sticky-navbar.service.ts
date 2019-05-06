import { Injectable } from '@angular/core';
import { Settings, DefinedSensitivity } from '../../models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxStickyNavbarService {

  changeSettings$ = new Subject<Settings>();
  initialSettings: Settings = {
    senseSpeed: {
      top: DefinedSensitivity.veryLow,
      bottom: DefinedSensitivity.veryHigh
    },
    topOffset: 300
  };

}
