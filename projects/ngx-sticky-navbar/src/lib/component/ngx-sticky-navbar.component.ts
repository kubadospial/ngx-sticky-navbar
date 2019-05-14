import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgxStickyNavbarService } from '../ngx-sticky-navbar.service';
import { Subject, fromEvent, of, Observable } from 'rxjs';
import { takeUntil, debounceTime, combineLatest, switchMap } from 'rxjs/operators';
import { Settings, NavbarState } from '../../../models';

@Component({
    selector: 'ngx-sticky-navbar',
    templateUrl: 'ngx-sticky-navbar.component.html',
    styleUrls: ['./ngx-sticky-navbar.component.scss']
})

export class NgxStickyNavbarComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('navbar') navbar: ElementRef;
    navbarState = NavbarState;
    isNavbarState = NavbarState.SHOW;
    elementHeight = 0;

    private _settings: Settings = this.navbarService.initialSettings;
    private _destroy$ = new Subject<void>();

    constructor(private navbarService: NgxStickyNavbarService) { }

    ngOnInit() {
        this.navbarService.changeSettings$.pipe(
            takeUntil(this._destroy$),
            switchMap((settings: Settings) => of(settings).pipe(
                combineLatest(this._resizeEvent)
            ))
        ).subscribe(([settings, _]: [Settings, Event?]) => {
            this._settings = { ...this._settings, ...settings };
            this.navbarService.initialSettings.scroll.offset.top = this.navbar.nativeElement.offsetHeight;
            this.elementHeight = this.navbar.nativeElement.offsetHeight;
            if (this._settings.spacer.autoHeight) {
                settings = {
                    ...this._settings,
                    spacer: {
                        ...this._settings.spacer,
                        height: this.elementHeight
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
                            top: this.elementHeight
                        }
                    }
                }
            }
            this.navbarService.mergeSettingObject(settings);
        });

    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this._settings.spacer.autoHeight) {
                this.elementHeight = this.navbar.nativeElement.offsetHeight;
                this._settings = {
                    ...this._settings,
                    spacer: {
                        ...this._settings.spacer,
                        height: this.elementHeight
                    }
                }
                this.navbarService.mergeSettingObject(this._settings);
            }
        }, 0);
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }


    onScrollDetected(state: NavbarState) {
        this.isNavbarState = state;
        if (state === NavbarState.HIDE) {
            this.elementHeight = 0;
        } else {
            this.elementHeight = this.navbar.nativeElement.offsetHeight;
        }
    }
    private get _resizeEvent(): Observable<Event> {
        return fromEvent(window, 'resize')
            .pipe(
                debounceTime(100)
            )
    }

}
