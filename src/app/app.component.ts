import { Component } from '@angular/core';
import { Settings, DefinedSensitivity } from 'projects/ngx-sticky-navbar/models';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxStickyNavbarService } from 'projects/ngx-sticky-navbar';
import { settings } from 'cluster';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sensGroup: FormGroup;
  toTopSensitivity = new FormControl;
  settings: Settings = {
    scrollableElement: '.scrollable'
  };

  constructor(private navbarService: NgxStickyNavbarService) {
    this.sensGroup = new FormGroup({
      senseSpeed: new FormGroup({
        top: new FormControl('veryLow'),
        bottom: new FormControl('veryHigh')
      })
    });
    this.sensGroup.valueChanges.pipe(
      map((stngs: Settings) => {
        return stngs = {
          senseSpeed: {
            top: DefinedSensitivity[stngs.senseSpeed.top],
            bottom: DefinedSensitivity[stngs.senseSpeed.bottom]
          }
        };
      })
    ).subscribe((stngs: Settings) => this.navbarService.changeSettings$.next(stngs));

  }

}
