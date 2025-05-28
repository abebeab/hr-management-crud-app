import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
export class EmployeesComponent implements OnInit, AfterViewInit {
  @ViewChild('employeeForm', { static: false }) employeeForm!: NgForm;

  employees: Employee[] = [];
  selectedEmployee: Employee = this.resetEmployee();
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  isLoadingRelatedData = true;

  allDepartments: Department[] = [];
  allCompanies: Company[] = [];
  allSalaries: Salary[] = [];

  displayedColumns: string[] = ['name', 'department', 'company', 'salary', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private companyService: CompanyService,
    private salaryService: SalaryService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('EmployeesComponent: ngOnInit called');
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    console.log('EmployeesComponent: ngAfterViewInit called - employeeForm if visible:', this.employeeForm);
  }

  resetEmployee(): Employee {
    console.log('EmployeesComponent: resetEmployee called');
    return { id: 0, name: '', departmentId: null as any, salaryId: null as any, companyId: null as any };
  }

  loadInitialData(): void {
    console.log('EmployeesComponent: loadInitialData called');
    this.isLoading = true;
    this.isLoadingRelatedData = true;
    this.cdr.detectChanges();

    forkJoin([
      this.employeeService.getEmployees(),
      this.departmentService.getDepartments(),
      this.companyService.getCompanies(),
      this.salaryService.getSalaries()
    ]).pipe(
      finalize(() => {
        console.log('EmployeesComponent: loadInitialData - finalize block');
        this.isLoading = false;
        this.isLoadingRelatedData = false;
        this.cdr.detectChanges();
      })
    ).subscribe(
      ([employees, departments, companies, salaries]) => {
        this.employees = employees;
        this.allDepartments = departments;
        this.allCompanies = companies;
        this.allSalaries = salaries;
        console.log('EmployeesComponent: Initial data loaded successfully:', { employees, departments, companies, salaries });
      },
      error => {
        console.error('EmployeesComponent: Error loading initial data:', error);
        this.snackBar.open('Failed to load page data. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

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
    console.log('EmployeesComponent: onSubmit called');
    if (!this.employeeForm) {
        console.error('EmployeesComponent: onSubmit - employeeForm is NOT available.');
        this.snackBar.open('Form not ready. Please wait and try again.', 'Close', { duration: 3000 });
        return;
    }
    if (this.employeeForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', { duration: 3000 });
      console.log('EmployeesComponent: Form is invalid. Form Values:', this.employeeForm.value, 'Form Errors:', this.employeeForm.errors);
      Object.values(this.employeeForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.cdr.detectChanges();
      return;
    }

    console.log('EmployeesComponent: Form is valid. Raw selectedEmployee (ngModel):', JSON.stringify(this.selectedEmployee));
    console.log('EmployeesComponent: Is Edit Mode:', this.isEditMode);

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const employeePayload: Employee = {
      id: this.isEditMode ? Number(this.selectedEmployee.id) : 0,
      name: this.selectedEmployee.name.trim(),
      departmentId: Number(this.selectedEmployee.departmentId),
      companyId: Number(this.selectedEmployee.companyId),
      salaryId: Number(this.selectedEmployee.salaryId)
    };
    console.log('EmployeesComponent: Data prepared for save/update:', JSON.stringify(employeePayload));

    let operation$: Observable<Employee | any>;

    if (this.isEditMode && employeePayload.id) {
      console.log('EmployeesComponent: Attempting to UPDATE employee with data:', JSON.stringify(employeePayload));
      operation$ = this.employeeService.updateEmployee(employeePayload);
    } else {
      console.log('EmployeesComponent: Attempting to ADD employee (data before omitting ID for service):', JSON.stringify(employeePayload));
      const { id, ...newEmployeeData } = employeePayload;
      console.log('EmployeesComponent: Payload for ADD (ID omitted for service):', JSON.stringify(newEmployeeData));
      operation$ = this.employeeService.addEmployee(newEmployeeData as Omit<Employee, 'id'>);
    }

    operation$.pipe(
      finalize(() => {
        console.log('EmployeesComponent: onSubmit - operation finalize block');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
        const message = this.isEditMode ? 'Employee updated successfully.' : 'Employee added successfully.';
        console.log(`EmployeesComponent: ${message}`, response);
        this.operationSuccess(message);
      },
      error: (error) => {
        const message = this.isEditMode ? 'Failed to update employee.' : 'Failed to add employee.';
        console.error(`EmployeesComponent: ${message}`, error);
        this.operationError(message, error);
      }
    });
  }

  editEmployee(employee: Employee): void {
    console.log('EmployeesComponent: editEmployee called with (original from list):', JSON.stringify(employee));
    this.isEditMode = true;
    this.selectedEmployee = { ...employee };
    console.log('EmployeesComponent: selectedEmployee set for edit (form model):', JSON.stringify(this.selectedEmployee));

    if (this.employeeForm) {
      this.employeeForm.resetForm(this.selectedEmployee);
      console.log('EmployeesComponent: employeeForm reset with selectedEmployee data for edit.');
    } else {
      console.warn('EmployeesComponent: editEmployee - employeeForm not available to reset. Will populate on render.');
    }
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteEmployee(id: number): void {
    console.log('EmployeesComponent: Attempting to DELETE employee with ID:', id);
    if (!id) {
        console.error('EmployeesComponent: Delete error - ID is undefined or zero.');
        this.snackBar.open('Cannot delete employee: Invalid ID.', 'Close', { duration: 3000 });
        return;
    }
    if (confirm('Are you sure you want to delete this employee?')) {
      this.isSubmitting = true;
      this.cdr.detectChanges();
      this.employeeService.deleteEmployee(id).pipe(
        finalize(() => {
          console.log('EmployeesComponent: deleteEmployee - operation finalize block');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        })
      ).subscribe({
        next: () => {
          console.log('EmployeesComponent: DELETE successful in component for ID:', id);
          // Check if the deleted employee was the one currently in the form
          const deletedWasSelected = this.isEditMode && this.selectedEmployee.id === id;
          this.operationSuccess('Employee deleted successfully.'); // This calls clearForm
          // If the selected employee was deleted, clearForm (called by operationSuccess)
          // will correctly reset isEditMode and selectedEmployee.
          // If a different employee was deleted, clearForm still resets the form to 'add' mode, which is fine.
        },
        error: (error) => {
          console.error('EmployeesComponent: DELETE FAILED in component for ID:', id, error);
          this.operationError('Failed to delete employee.', error);
        }
      });
    } else {
      console.log('EmployeesComponent: Delete cancelled by user for ID:', id);
    }
  }

  clearForm(): void {
    console.log('EmployeesComponent: clearForm called. Current isEditMode before change:', this.isEditMode);
    this.isEditMode = false; // Ensure edit mode is off
    this.selectedEmployee = this.resetEmployee(); // Reset the bound model object

    // Only attempt to reset the NgForm instance if it's actually available (i.e., visible)
    if (this.employeeForm) {
      this.employeeForm.resetForm(this.resetEmployee());
      console.log('EmployeesComponent: Form reset. selectedEmployee after reset:', JSON.stringify(this.selectedEmployee));
    } else {
      console.warn('EmployeesComponent: clearForm - employeeForm was not available to reset. Model (selectedEmployee) has been reset.');
    }
    this.cdr.detectChanges(); // Help UI update if form was hidden/shown
  }

  private operationSuccess(message: string): void {
    console.log('EmployeesComponent: operationSuccess - message:', message);
    this.snackBar.open(message, 'Close', { duration: 3000 });
    // It's important to clear the form and reset edit mode BEFORE reloading data,
    // so that if loadInitialData is quick, the form doesn't briefly flash old edit data.
    this.clearForm();
    this.loadInitialData();
    // isSubmitting is handled by finalize in the specific operation (add/update/delete)
  }

  private operationError(message: string, error: any): void {
    console.error(`EmployeesComponent: ${message} - Full Error Object from component:`, error);
    this.snackBar.open(message + ' See console for details.', 'Close', { duration: 4000 });
    // isSubmitting is handled by finalize
  }
}