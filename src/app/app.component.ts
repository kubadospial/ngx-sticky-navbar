import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { map, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Settings, NgxStickyNavbarService, DefinedSensitivity, SpacerTypes } from 'ngx-sticky-navbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('spacerElement') spacerElement: ElementRef;

  sensGroup = new FormGroup({
    sensitivity: new FormGroup({
      top: new FormControl(),
      bottom: new FormControl(),
      checkboxesTop: new FormControl(false),
      checkboxesBottom: new FormControl(false)
    }),
    spacer: new FormGroup({
      spacerToggler: new FormControl(true)
    })
  });

  rangeLabelTop: string;
  rangeLabelBottom: string;
  settings: Settings = {
    scroll: {
      element: '.scrollable',
      offset: {
        autoTop: true
      }
    }
  };

  private get _settings(): Settings {
    return this.navbarService.settings;
  }

  constructor(private navbarService: NgxStickyNavbarService) {
    this.sensGroup.patchValue(this._settings);
    this._getRangeLabelTop(this._settings);
    this._getRangeLabelBottom(this._settings);
    this.sensGroup.valueChanges.pipe(
      map(settings => {
        if (settings.sensitivity.checkboxesTop) {
          settings.sensitivity = { ...settings.sensitivity, top: DefinedSensitivity.Locked };
        }
        if (settings.sensitivity.checkboxesBottom) {
          settings.sensitivity = { ...settings.sensitivity, bottom: DefinedSensitivity.Locked };
        }
        const sets: Settings = { sensitivity: {} };
        sets.sensitivity = { top: settings.sensitivity.top, bottom: settings.sensitivity.bottom };
        if (settings.spacer.spacerToggler) {
          sets.spacer = { ...this._settings.spacer, autoHeight: true };
        } else {
          sets.spacer = { autoHeight: false, height: 0 };
        }
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
      this.settings = { ...this.settings, ...settings };
      this.navbarService.mergeSettingObject(this.settings);
    });

    this.sensGroup.get('sensitivity').get('checkboxesTop').valueChanges.subscribe(status => {
      status ? this.sensGroup.get('sensitivity').get('top').disable() : this.sensGroup.get('sensitivity').get('top').enable();
    });

    this.sensGroup.get('sensitivity').get('checkboxesBottom').valueChanges.subscribe(status => {
      status ? this.sensGroup.get('sensitivity').get('bottom').disable() : this.sensGroup.get('sensitivity').get('bottom').enable();
    });
  }

  ngAfterViewInit() {
    this.settings = {
      ...this.settings,
      spacer: {
        autoHeight: true,
        type: SpacerTypes.PADDING,
        element: this.spacerElement,
      }
    };
    this.navbarService.mergeSettingObject(this.settings);
  }

  private _getRangeLabelTop(settings: Settings) {
    this.rangeLabelTop = DefinedSensitivity[settings.sensitivity.top];
  }

  private _getRangeLabelBottom(settings: Settings) {
    this.rangeLabelBottom = DefinedSensitivity[settings.sensitivity.bottom];
  }
}
