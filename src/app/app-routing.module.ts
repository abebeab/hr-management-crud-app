import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatesComponent } from './components/candidates/candidates.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { SalariesComponent } from './components/salaries/salaries.component';
import { EmployeesComponent } from './components/employees/employees.component';

const routes: Routes = [
  { path: '', redirectTo: '/candidates', pathMatch: 'full' },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'salaries', component: SalariesComponent },
  { path: 'employees', component: EmployeesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
