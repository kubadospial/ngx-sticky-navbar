import { Injectable } from '@angular/core';
import { Settings, DefinedSensitivity } from '../../models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxStickyNavbarService {

  changeSettings$ = new Subject<Settings>();
  initialSettings: Settings = {
    spacer: {
      autoHeight: false,
      height: 0
    },
    sensitivity: {
      top: DefinedSensitivity.veryLow,
      bottom: DefinedSensitivity.veryHigh
    },
    scroll: {
      offset: {
        autoTop: false,
        top: 300,
        bottom: 0
      }
    }
  };

  private _settings: Settings = this.initialSettings;

  mergeSettingObject(settings: Settings) {
    let sets: Settings = {
      ...this._settings,
      ...settings,
    };
    if (!!settings.spacer) {
      sets = {
        ...sets,
        spacer: {
          ...this._settings.spacer,
          ...settings.spacer,
        }
      }
    }
    if (!!settings.sensitivity) {
      sets = {
        ...sets,
        sensitivity: {
          ...this._settings.sensitivity,
          ...settings.sensitivity
        }
      }
    }
    if (!!settings.scroll) {
      sets = {
        ...sets,
        scroll: {
          ...this._settings.scroll,
          ...settings.scroll,
          offset: {
            ...this._settings.scroll.offset,
            ...settings.scroll.offset
          }
        }
      }
    }
    this._settings = sets;
    this.changeSettings$.next(sets);
  }

}
