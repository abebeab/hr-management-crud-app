import { NgModule } from '@angular/core';

// Import all the Angular Material modules you will use
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list'; // For Sidenav navigation
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading indicators
import { MatSelectModule } from '@angular/material/select'; // For dropdowns in forms
import { MatSidenavModule } from '@angular/material/sidenav'; // For Sidenav layout
import { MatSnackBarModule } from '@angular/material/snack-bar'; // For notifications
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
// Add MatSortModule and MatPaginatorModule if you plan to add sorting/pagination to tables
// import { MatSortModule } from '@angular/material/sort';
// import { MatPaginatorModule } from '@angular/material/paginator';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  // MatSortModule,
  // MatPaginatorModule
];

@NgModule({
  imports: [
    ...materialModules
  ],
  exports: [
    ...materialModules
  ]
})
export class MaterialModule { }