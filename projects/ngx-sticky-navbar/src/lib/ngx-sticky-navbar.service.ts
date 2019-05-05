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
      top: DefinedSensitivity.veryHigh,
      bottom: DefinedSensitivity.Low
    },
    topOffset: 100
  };

}
