import { Directive, OnInit, OnDestroy, Output, EventEmitter, Input, Inject } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Settings, DefinedSensitivity, NavbarState } from '../../models';
import { NgxStickyNavbarService } from './ngx-sticky-navbar.service';
import { DOCUMENT } from '@angular/common';

@Directive({ selector: '[ngxSpeedScroll]' })
export class NgxStickyNavbarDirective implements OnInit, OnDestroy {

    @Input('settings')
    set settings(settings: Settings) {
        this._settings = {
            ...this._settings,
            ...settings
        };
    }
    @Input() scrollableElement: string;

    @Output() isScrollDetected = new EventEmitter<string>();

    private _scrollableElement = this.document.body;
    private _previousScroll = 0;
    private _scrollTop = 0;
    private _destroy$ = new Subject<void>();
    private _settings: Settings = {
        ...this.scrollService.initialSettings
    };

    constructor(@Inject(DOCUMENT) private document, private scrollService: NgxStickyNavbarService) { }

    ngOnInit() {
        if (!!this.scrollableElement) {
            const element = this.document.querySelector(this.scrollableElement);
            if (!!element) {
                this._scrollableElement = element;
            }
        }
        fromEvent(this._scrollableElement, 'scroll')
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(_ => {
                this._scrollTop = this._scrollableElement.scrollTop;
                this._speedScrollDetection();
                this._previousScroll = this._scrollTop;
            });

        this.scrollService.changeSettings$.pipe(
            takeUntil(this._destroy$)
        ).subscribe((settings: Settings) => {
            this._settings = {
                ...this._settings,
                ...settings
            };
        });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _speedScrollDetection() {
        let speedSenseTop = 0;
        let speedSenseBottom = 0;
        if (typeof this._settings.senseSpeed.top === 'string') {
            speedSenseTop = DefinedSensitivity[this._settings.senseSpeed.top];
        } else {
            speedSenseTop = this._settings.senseSpeed.top;
        }
        if (typeof this._settings.senseSpeed.bottom === 'string') {
            speedSenseBottom = DefinedSensitivity[this._settings.senseSpeed.bottom];
        } else {
            speedSenseBottom = this._settings.senseSpeed.bottom;
        }
        if (this._scrollTop + speedSenseTop < this._previousScroll) {
            this.isScrollDetected.next(NavbarState.SHOW);
        } else if (this._scrollTop - speedSenseBottom > this._previousScroll) {
            this.isScrollDetected.next(NavbarState.HIDE);
        }
        if (this._scrollTop <= this._settings.topOffset) {
            this.isScrollDetected.next(NavbarState.SHOW);
        }
    }

}
