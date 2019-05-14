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
    navbarState = NavbarState;
    isNavbarState = NavbarState.SHOW;
    elementHeight = 0;
    private _destroy$ = new Subject<void>();

    @Input() settings: Settings;
    @ViewChild('navbar') navbar: ElementRef;
    constructor(private navbarService: NgxStickyNavbarService) { }

    ngOnInit() {
        this.navbarService.changeSettings$.pipe(
            takeUntil(this._destroy$),
            switchMap((settings: Settings) => of(settings).pipe(
                combineLatest(this._resizeEvent)
            )),
            startWith([this.settings, new Event('resize')])
        ).subscribe(([settings, _]: [Settings, Event]) => {
            this.navbarService.setGlobalSettings(settings);
            this.elementHeight = this.navbar.nativeElement.offsetHeight;

            let sets: Settings = {};
            if (this.navbarService.settings.spacer.autoHeight) {
                sets = {
                    ...this.navbarService.settings,
                    spacer: {
                        ...this.navbarService.settings.spacer,
                        height: this.elementHeight
                    }
                }
            }
            if (this.navbarService.settings.scroll.offset.autoTop) {
                sets = {
                    ...this.navbarService.settings,
                    ...sets,
                    scroll: {
                        ...this.navbarService.settings.scroll,
                        offset: {
                            ...this.navbarService.settings.scroll.offset,
                            top: this.elementHeight
                        }
                    }
                }
            }
            this.navbarService.mergeSettingObject(sets);
        });

    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.navbarService.settings.spacer.autoHeight) {
                this.elementHeight = this.navbar.nativeElement.offsetHeight;
                const settings = {
                    ...this.navbarService.settings,
                    spacer: {
                        ...this.navbarService.settings.spacer,
                        height: this.elementHeight
                    }
                }
                this.navbarService.mergeSettingObject(settings);
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
