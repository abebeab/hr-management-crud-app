import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added ReactiveFormsModule for more complex forms later

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InMemoryDataService } from './services/in-memory-data.service';

import { MaterialModule } from './material.module'; // <--- IMPORT MaterialModule

// Components
import { CandidatesComponent } from './components/candidates/candidates.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { SalariesComponent } from './components/salaries/salaries.component';
import { EmployeesComponent } from './components/employees/employees.component';

@NgModule({
  declarations: [
    AppComponent,
    CandidatesComponent,
    CompaniesComponent,
    DepartmentsComponent,
    SalariesComponent,
    EmployeesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, // Add ReactiveFormsModule
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false, delay: 300 }),
    MaterialModule // <--- USE MaterialModule HERE
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }