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

  settings: Settings = this.initialSettings;
  
  setGlobalSettings(settings: Settings) {
    this.settings = this.parseNewSettingsObject(this.settings, settings);
  }

  mergeSettingObject(settings: Settings) {
    this.setGlobalSettings(settings);
    this.changeSettings$.next(this.settings);
  }

  parseNewSettingsObject(oldSets: Settings, newSets: Settings): Settings {
    let sets: Settings = {
      ...oldSets,
      ...newSets,
    };
    if (!!newSets.spacer) {
      sets = {
        ...sets,
        ...this._setSpace(oldSets, newSets)
      }
    }
    if (!!newSets.sensitivity) {
      sets = {
        ...sets,
        ...this._setSensitivity(oldSets, newSets)
      }
    }
    if (!!newSets.scroll) {
      sets = {
        ...sets,
        ...this._setScroll(oldSets, newSets)
      }
    }
    return sets;
  }

  private _setSpace(oldSets: Settings, newSets: Settings) {
    return {
      spacer: {
        ...oldSets.spacer,
        ...newSets.spacer,
      }
    }
  }
  private _setSensitivity(oldSets: Settings, newSets: Settings) {
    return {
      sensitivity: {
        ...oldSets.sensitivity,
        ...newSets.sensitivity
      }
    }
  }

  private _setScroll(oldSets: Settings, newSets: Settings) {
    return {
      scroll: {
        ...oldSets.scroll,
        ...newSets.scroll,
        offset: {
          ...oldSets.scroll.offset,
          ...newSets.scroll.offset
        }
      }
    }
  }

}
