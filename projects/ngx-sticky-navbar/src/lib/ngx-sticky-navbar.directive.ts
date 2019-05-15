import { Directive, OnInit, OnDestroy, Output, EventEmitter, Inject, ElementRef, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { DefinedSensitivity, NavbarState, SpacerTypes } from '../../models';
import { NgxStickyNavbarService } from './ngx-sticky-navbar.service';
import { DOCUMENT } from '@angular/common';

@Directive({ selector: '[ngxSpeedScroll]' })
export class NgxStickyNavbarDirective implements OnInit, OnDestroy {

    @Output() isScrollDetected = new EventEmitter<string>();

    private _scrollableElement: HTMLElement = this.document.body;
    private _previousScroll = 0;
    private _scrollTop = 0;
    private _destroy$ = new Subject<void>();

    constructor(
        @Inject(DOCUMENT) private document,
        private navbarService: NgxStickyNavbarService,
        private renderer: Renderer2) { }

    ngOnInit() {
        this.navbarService.changeSettings$.pipe(
            takeUntil(this._destroy$),
            switchMap(_ => {
                this._defineScrollableElement();
                if (!!this.navbarService.settings.spacer.element) {
                    this._showSpacer();
                }
                return fromEvent(this._scrollableElement, 'scroll');
            })
        ).subscribe(_ => {
            this._scrollTop = this._scrollableElement.scrollTop;
            this._isScrolledToTopWithOffset();
            this._speedScrollDetection();
            this._previousScroll = this._scrollTop;
        });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _showSpacer() {
        if (!!this.navbarService.settings.spacer.type && !!this.navbarService.settings.spacer.height) {
            this._spacerCreator(
                this.navbarService.settings.spacer.element,
                this.navbarService.settings.spacer.type,
                this.navbarService.settings.spacer.height
            );
        } else {
            console.error('[ERROR] Spacer requires type and height definitions. One or both of those defs are not provided!');
        }
    }

    private _defineScrollableElement() {
        if (!!this.navbarService.settings.scroll.element) {
            const element = this.document.querySelector(this.navbarService.settings.scroll.element);
            if (!!element) {
                this._scrollableElement = element;
            }
        }
    }
    private _spacerCreator(element: ElementRef, type: SpacerTypes, height: number) {
        this.renderer.setProperty(element.nativeElement, 'style', `${ type }:${ height }px`);
    }

    private _isScrolledToTopWithOffset() {
        if (this._scrollTop <= this.navbarService.settings.scroll.offset.top && this._isScrollingTop) {
            this.isScrollDetected.next(NavbarState.SHOW);
        }
    }

    private _speedScrollDetection() {
        if (this._scrollTop + this._senseSpeedTop < this._previousScroll) {
            this.isScrollDetected.next(NavbarState.SHOW);
        } else if (this._scrollTop - this._senseSpeedBottom > this._previousScroll) {
            this.isScrollDetected.next(NavbarState.HIDE);
        }
    }

    private get _senseSpeedTop(): number {
        let speedSenseTop = 0;
        if (typeof this.navbarService.settings.sensitivity.top === 'string') {
            speedSenseTop = DefinedSensitivity[this.navbarService.settings.sensitivity.top];
        } else {
            speedSenseTop = this.navbarService.settings.sensitivity.top;
        }
        return speedSenseTop;
    }

    private get _senseSpeedBottom(): number {
        let speedSenseBottom = 0;
        if (typeof this.navbarService.settings.sensitivity.bottom === 'string') {
            speedSenseBottom = DefinedSensitivity[this.navbarService.settings.sensitivity.bottom];
        } else {
            speedSenseBottom = this.navbarService.settings.sensitivity.bottom;
        }
        return speedSenseBottom;
    }

    private get _isScrollingTop() {
        return this._scrollTop < this._previousScroll;
    }

}
