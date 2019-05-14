import { Component, ViewChild, ElementRef } from '@angular/core';
import { Settings, DefinedSensitivity, SpacerTypes } from 'projects/ngx-sticky-navbar/models';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxStickyNavbarService } from 'projects/ngx-sticky-navbar';
import { map, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('spacerElement') spacerElement: ElementRef;

  sensGroup: FormGroup;
  definedSensitivity = DefinedSensitivity;
  rangeLabelTop: string;
  rangeLabelBottom: string;
  private _settings: Settings = {
    scroll: {
      element: '.scrollable',
      offset: {
        autoTop: true
      }
    },
  };

  constructor(private _navbarService: NgxStickyNavbarService) {
    this.sensGroup = new FormGroup({
      sensitivity: new FormGroup({
        top: new FormControl(),
        bottom: new FormControl(),
        checkboxesTop: new FormControl(false),
        checkboxesBottom: new FormControl(false)
      })
    });
    this.sensGroup.patchValue(this._navbarService.initialSettings);
    this._getRangeLabelTop(this._navbarService.initialSettings);
    this._getRangeLabelBottom(this._navbarService.initialSettings);
    this.sensGroup.valueChanges.pipe(
      map(settings => {
        if (settings.sensitivity.checkboxesTop) {
          settings.sensitivity = { ...settings.sensitivity, top: DefinedSensitivity.Locked };
        }
        if (settings.sensitivity.checkboxesBottom) {
          settings.sensitivity = { ...settings.sensitivity, bottom: DefinedSensitivity.Locked };
        }
        const sets = { sensitivity: {} };
        sets.sensitivity = { top: settings.sensitivity.top, bottom: settings.sensitivity.bottom };
        return sets;
      }),
      tap((stngs: Settings) => {
        this._getRangeLabelTop(stngs);
        this._getRangeLabelBottom(stngs);
      })
    ).pipe(
      distinctUntilChanged(),
      debounceTime(100)
    ).subscribe((settings: Settings) => {
      this._settings = { ...this._settings, ...settings };
      this._navbarService.mergeSettingObject(this._settings);
    });

    this.sensGroup.get('sensitivity').get('checkboxesTop').valueChanges.subscribe(status => {
      status ? this.sensGroup.get('sensitivity').get('top').disable() : this.sensGroup.get('sensitivity').get('top').enable();
    });

    this.sensGroup.get('sensitivity').get('checkboxesBottom').valueChanges.subscribe(status => {
      status ? this.sensGroup.get('sensitivity').get('bottom').disable() : this.sensGroup.get('sensitivity').get('bottom').enable();
    });
  }

  ngAfterViewInit() {
    // this._settings = {
    //   ...this._settings,
    //   spacer: {
    //     ...this._settings.spacer,
    //     element: this.spacerElement,
    //     autoHeight: true,
    //     type: SpacerTypes.PADDING
    //   }
    // };
    this._navbarService.mergeSettingObject(this._settings);
  }

  private _getRangeLabelTop(settings: Settings) {
    this.rangeLabelTop = this.definedSensitivity[settings.sensitivity.top];
  }

  private _getRangeLabelBottom(settings: Settings) {
    this.rangeLabelBottom = this.definedSensitivity[settings.sensitivity.bottom];
  }
}
