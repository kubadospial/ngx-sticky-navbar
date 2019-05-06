import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NgxStickyNavbarService } from '../ngx-sticky-navbar.service';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Settings, NavbarState } from '../../../models';

@Component({
    selector: 'ngx-sticky-navbar',
    templateUrl: 'ngx-sticky-navbar.component.html',
    styleUrls: ['./ngx-sticky-navbar.component.scss']
})

export class NgxStickyNavbarComponent implements OnInit, OnDestroy {
    @Input() settings: Settings;
    @Input() isAutoTopOffsetDisabled = true;
    @Input() isSpacerDisabled = true;
    @ViewChild('navbar') navbar: ElementRef;

    navbarState = NavbarState;
    isNavbarState = NavbarState.SHOW;
    elementHeight = 0;

    private _destroy$ = new Subject<void>();

    constructor(private scrollService: NgxStickyNavbarService, @Inject(DOCUMENT) private document) { }

    ngOnInit() {
        if (!this.isAutoTopOffsetDisabled) {
            this.elementHeight = this.navbar.nativeElement.offsetHeight;
        }
        if (!this.isAutoTopOffsetDisabled) {
            this.scrollService.initialSettings.topOffset = this.navbar.nativeElement.offsetHeight;
            fromEvent(this.document.body, 'resize')
                .pipe(
                    debounceTime(100),
                    takeUntil(this._destroy$)
                )
                .subscribe(_ => {
                    this.elementHeight = this.navbar.nativeElement.offsetHeight;
                    const settings: Settings = {
                        topOffset: this.navbar.nativeElement.offsetHeight
                    };
                    this.scrollService.changeSettings$.next(settings);
                });
        }
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    onScrollDetected(state: NavbarState) {
        this.isNavbarState = state;
    }
}
