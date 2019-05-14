import { Directive, OnInit, OnDestroy, Output, EventEmitter, Input, Inject, ElementRef, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Settings, DefinedSensitivity, NavbarState, SpacerTypes } from '../../models';
import { NgxStickyNavbarService } from './ngx-sticky-navbar.service';
import { DOCUMENT } from '@angular/common';

@Directive({ selector: '[ngxSpeedScroll]' })
export class NgxStickyNavbarDirective implements OnInit, OnDestroy {


    @Output() isScrollDetected = new EventEmitter<string>();

    private _scrollableElement: HTMLElement = this.document.body;
    private _previousScroll = 0;
    private _scrollTop = 0;
    private _destroy$ = new Subject<void>();
    private _breakSub$ = new Subject<void>();
    private _settings: Settings = {
        ...this.navbarService.initialSettings
    };

    constructor(
        @Inject(DOCUMENT) private document,
        private navbarService: NgxStickyNavbarService,
        private renderer: Renderer2) { }

    ngOnInit() {
        this.navbarService.changeSettings$.pipe(
            takeUntil(this._destroy$)
        ).subscribe((settings: Settings) => {
            this._settings = settings;
            if (!!this._settings.spacer.element) {
                this._spacerCreator(
                    this._settings.spacer.element,
                    this._settings.spacer.type,
                    this._settings.spacer.height
                );
            }
            this._initSubs(settings);
        });

    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        this._breakSub$.next();
        this._breakSub$.complete();
    }

    private _initSubs(settings: Settings) {
        this._breakSub$.next();
        this._functionSubs(settings);
    }

    private _functionSubs(settings: Settings) {
        this._settings = settings;
        if (!!this._settings.scroll.element) {
            const element = this.document.querySelector(this._settings.scroll.element);
            if (!!element) {
                this._scrollableElement = element;
            }
        }
        fromEvent(this._scrollableElement, 'scroll')
            .pipe(
                takeUntil(this._breakSub$)
            ).subscribe(_ => {
                this._scrollTop = this._scrollableElement.scrollTop;
                this._speedScrollDetection();
                this._previousScroll = this._scrollTop;
            });
    }

    private _spacerCreator(element: ElementRef, type: SpacerTypes, height: number) {
        this.renderer.setProperty(element.nativeElement, 'style', `${ type }:${ height }px`);
    }

    private _speedScrollDetection() {
        if (this._scrollTop <= this._settings.scroll.offset.top && this._isScrollingTop) {
            this.isScrollDetected.next(NavbarState.SHOW);
        }
        if (this._scrollTop + this._senseSpeedTop < this._previousScroll) {
            this.isScrollDetected.next(NavbarState.SHOW);
        } else if (this._scrollTop - this._senseSpeedBottom > this._previousScroll) {
            this.isScrollDetected.next(NavbarState.HIDE);
        }
    }

    private get _senseSpeedTop(): number {
        let speedSenseTop = 0;
        if (typeof this._settings.sensitivity.top === 'string') {
            speedSenseTop = DefinedSensitivity[this._settings.sensitivity.top];
        } else {
            speedSenseTop = this._settings.sensitivity.top;
        }
        return speedSenseTop;
    }

    private get _senseSpeedBottom(): number {
        let speedSenseBottom = 0;
        if (typeof this._settings.sensitivity.bottom === 'string') {
            speedSenseBottom = DefinedSensitivity[this._settings.sensitivity.bottom];
        } else {
            speedSenseBottom = this._settings.sensitivity.bottom;
        }
        return speedSenseBottom;
    }

    private get _isScrollingTop() {
        return this._scrollTop < this._previousScroll;
    }

}
