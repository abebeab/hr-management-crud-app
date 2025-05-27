import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav; // <--- UPDATED
  isSidenavOpened = true;
  isMobileView = false;
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall, // More specific for mobile
      Breakpoints.Small
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      this.isMobileView = result.matches;
      if (this.isMobileView) {
        this.isSidenavOpened = false;
      } else {
        this.isSidenavOpened = true;
      }
    });
  }

  ngAfterViewInit() {
    // Handle initial state for mobile if sidenav mode needs to change
    if (this.isMobileView && this.sidenav) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
    } else if (this.sidenav) {
        this.sidenav.mode = 'side';
        this.sidenav.open();
    }
    this.cdr.detectChanges(); // Trigger change detection
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}