import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxStickyNavbarDirective } from './ngx-sticky-navbar.directive';
import { NgxStickyNavbarComponent } from './component/ngx-sticky-navbar.component';

@NgModule({
  declarations: [NgxStickyNavbarDirective, NgxStickyNavbarComponent],
  imports: [BrowserModule],
  exports: [NgxStickyNavbarComponent]
})
export class NgxStickyNavbarModule { }
