import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs'; // For parallel API calls

import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { CompanyService } from '../../services/company.service';
import { SalaryService } from '../../services/salary.service';

import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { Company } from '../../models/company.model';
import { Salary } from '../../models/salary.model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  @ViewChild('employeeForm', { static: true }) employeeForm!: NgForm;

  employees: Employee[] = [];
  selectedEmployee: Employee = this.resetEmployee();
  isLoading = false;
  isEditMode = false;
  isLoadingRelatedData = false;

  // For dropdowns
  allDepartments: Department[] = [];
  allCompanies: Company[] = [];
  allSalaries: Salary[] = [];

  displayedColumns: string[] = ['name', 'department', 'company', 'salary', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private salaryService: SalaryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  resetEmployee(): Employee {
    return { id: 0, name: '', departmentId: 0, salaryId: 0, companyId: 0 };
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.isLoadingRelatedData = true;
    forkJoin([
      this.employeeService.getEmployees(),
      this.departmentService.getDepartments(),
      this.companyService.getCompanies(),
      this.salaryService.getSalaries()
    ]).subscribe(
      ([employees, departments, companies, salaries]) => {
        this.employees = employees;
        this.allDepartments = departments;
        this.allCompanies = companies;
        this.allSalaries = salaries;
        this.isLoading = false;
        this.isLoadingRelatedData = false;
      },
      error => {
        console.error('Error loading initial data:', error);
        this.snackBar.open('Failed to load data. Please try again.', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.isLoadingRelatedData = false;
      }
    );
  }

  // Helper methods to get names/details for display in the table
  getDepartmentName(departmentId: number): string {
    const department = this.allDepartments.find(d => d.id === departmentId);
    return department ? department.name : 'N/A';
  }

  getCompanyName(companyId: number): string {
    const company = this.allCompanies.find(c => c.id === companyId);
    return company ? company.name : 'N/A';
  }

  getSalaryDetails(salaryId: number): string {
    const salary = this.allSalaries.find(s => s.id === salaryId);
    return salary ? `${salary.amount} ${salary.currency}` : 'N/A';
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const employeeData = { ...this.selectedEmployee }; // Create a copy

    if (this.isEditMode && employeeData.id) {
      this.employeeService.updateEmployee(employeeData).subscribe(
        () => this.operationSuccess('Employee updated successfully.'),
        error => this.operationError('Failed to update employee.', error)
      );
    } else {
       const newEmployeeData: Omit<Employee, 'id'> = {
        name: employeeData.name,
        departmentId: +employeeData.departmentId, // Ensure IDs are numbers
        companyId: +employeeData.companyId,
        salaryId: +employeeData.salaryId
      };
      this.employeeService.addEmployee(newEmployeeData as Employee).subscribe(
        () => this.operationSuccess('Employee added successfully.'),
        error => this.operationError('Failed to add employee.', error)
      );
    }
  }

  editEmployee(employee: Employee): void {
    this.isEditMode = true;
    this.selectedEmployee = { ...employee };
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.isLoading = true;
      this.employeeService.deleteEmployee(id).subscribe(
        () => {
          this.operationSuccess('Employee deleted successfully.');
          if (this.selectedEmployee.id === id) {
            this.clearForm();
          }
        },
        error => this.operationError('Failed to delete employee.', error)
      );
    }
  }

  clearForm(): void {
    this.selectedEmployee = this.resetEmployee();
    this.isEditMode = false;
    if (this.employeeForm) {
      this.employeeForm.resetForm(this.resetEmployee());
    }
  }

  private operationSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.loadInitialData(); // Reload all data as employees list might change
    this.clearForm();
    this.isLoading = false;
  }

  private operationError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.isLoading = false;
  }
}