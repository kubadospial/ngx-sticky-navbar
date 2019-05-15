import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { NgxStickyNavbarService } from '../ngx-sticky-navbar.service';
import { Subject, fromEvent, of, Observable } from 'rxjs';
import { takeUntil, debounceTime, combineLatest, switchMap, startWith } from 'rxjs/operators';
import { Settings, NavbarState } from '../../../models';

@Component({
    selector: 'ngx-sticky-navbar',
    templateUrl: 'ngx-sticky-navbar.component.html',
    styleUrls: ['./ngx-sticky-navbar.component.scss']
})

export class NgxStickyNavbarComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() settings: Settings;
    @ViewChild('navbar') navbar: ElementRef;

    navbarState = NavbarState;
    isNavbarState = NavbarState.SHOW;
    private _destroy$ = new Subject<void>();
    private get _settings(): Settings {
        return this.navbarService.settings;
    }

    constructor(private navbarService: NgxStickyNavbarService) { }

    ngOnInit() {
        this.navbarService.changeSettings$.pipe(
            takeUntil(this._destroy$),
            switchMap((settings: Settings) => {
                this._createSettingsObject();
                return of(settings).pipe(
                    combineLatest(this._resizeEvent)
                )
            }),
            startWith([this.settings, new Event('resize')])
        ).subscribe(([settings, _]: [Settings, Event]) => this.navbarService.mergeSettingObject(settings));
    }

    ngAfterViewInit() {
        if (this._settings.spacer.autoHeight) {
            const settings = {
                ...this._settings,
                spacer: {
                    ...this._settings.spacer,
                    height: this._elementSpacerHeight
                }
            }
            this.navbarService.mergeSettingObject(settings);
        }
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }


    onScrollDetected(state: NavbarState) {
        this.isNavbarState = state;
    }

    private _createSettingsObject() {
        let settings: Settings = {};
        if (this._settings.spacer.autoHeight) {
            settings = {
                ...this._settings,
                spacer: {
                    ...this._settings.spacer,
                    height: this._elementOffsetTopHeight
                }
            }
        }
        if (this._settings.scroll.offset.autoTop) {
            settings = {
                ...this._settings,
                ...settings,
                scroll: {
                    ...this._settings.scroll,
                    offset: {
                        ...this._settings.scroll.offset,
                        top: this._elementSpacerHeight
                    }
                }
            }
        }
        this.navbarService.setGlobalSettings(settings);
    }

    private get _resizeEvent(): Observable<Event> {
        return fromEvent(window, 'resize')
            .pipe(debounceTime(100));
    }

    private get _elementOffsetTopHeight(): number {
        if (this._settings.scroll.offset.autoTop) {
            return this.navbar.nativeElement.offsetHeight;
        } else {
            return this._settings.scroll.offset.top;
        }
    }
    private get _elementSpacerHeight(): number {
        if (this._settings.spacer.autoHeight) {
            return this.navbar.nativeElement.offsetHeight;
        } else {
            return this._settings.spacer.height;
        }
    }

}
