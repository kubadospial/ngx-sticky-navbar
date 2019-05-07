import { Component } from '@angular/core';
import { Settings, DefinedSensitivity } from 'projects/ngx-sticky-navbar/models';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxStickyNavbarService } from 'projects/ngx-sticky-navbar';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sensGroup: FormGroup;
  definedSensitivity = DefinedSensitivity;
  settings: Settings = {
    scrollableElement: '.scrollable'
  };
  rangeLabelTop: string;
  rangeLabelBottom: string;

  constructor(private navbarService: NgxStickyNavbarService) {
    this.sensGroup = new FormGroup({
      senseSpeed: new FormGroup({
        top: new FormControl(),
        bottom: new FormControl(),
        checkboxesTop: new FormControl(false),
        checkboxesBottom: new FormControl(false)
      })
    });
    this.sensGroup.patchValue(this.navbarService.initialSettings);
    this._getRangeLabelTop(this.navbarService.initialSettings);
    this._getRangeLabelBottom(this.navbarService.initialSettings);
    this.sensGroup.valueChanges.pipe(
      map(settings => {
        if (settings.senseSpeed.checkboxesTop) {
          settings.senseSpeed = { ...settings.senseSpeed, top: DefinedSensitivity.Locked };
        }
        if (settings.senseSpeed.checkboxesBottom) {
          settings.senseSpeed = { ...settings.senseSpeed, bottom: DefinedSensitivity.Locked };
        }
        const sets = { senseSpeed: {} };
        sets.senseSpeed = { top: settings.senseSpeed.top, bottom: settings.senseSpeed.bottom };
        
        return sets;
      }),
      tap((stngs: Settings) => {
        this._getRangeLabelTop(stngs);
        this._getRangeLabelBottom(stngs);
      })
    ).subscribe((stngs: Settings) => this.navbarService.changeSettings$.next(stngs));

    this.sensGroup.get('senseSpeed').get('checkboxesTop').valueChanges.subscribe(status => {
      status ? this.sensGroup.get('senseSpeed').get('top').disable() : this.sensGroup.get('senseSpeed').get('top').enable();
    });

    this.sensGroup.get('senseSpeed').get('checkboxesBottom').valueChanges.subscribe(status => {

      status ? this.sensGroup.get('senseSpeed').get('bottom').disable() : this.sensGroup.get('senseSpeed').get('bottom').enable();
    });
  }

  private _getRangeLabelTop(settings: Settings) {
    this.rangeLabelTop = this.definedSensitivity[settings.senseSpeed.top];
  }

  private _getRangeLabelBottom(settings: Settings) {
    this.rangeLabelBottom = this.definedSensitivity[settings.senseSpeed.bottom];
  }
}
