import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // For Angular Material 8
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  @ViewChild('departmentForm', { static: true }) departmentForm!: NgForm;
  departments: Department[] = [];
  selectedDepartment: Department = this.resetDepartment();
  isLoading = false;
  isEditMode = false;

  // Columns for the Material table
  displayedColumns: string[] = ['name', 'actions']; // Add 'id' if you want to display it

  constructor(
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  resetDepartment(): Department {
    return { id: 0, name: '' }; // Use 0 or null for new item ID
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe(
      data => {
        this.departments = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading departments:', error);
        this.snackBar.open('Failed to load departments.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    if (this.isEditMode && this.selectedDepartment.id) {
      this.departmentService.updateDepartment(this.selectedDepartment).subscribe(
        () => {
          this.operationSuccess('Department updated successfully.');
        },
        error => this.operationError('Failed to update department.', error)
      );
    } else {
      // Create a new department object without the ID for the add operation
      const newDepartmentData: Omit<Department, 'id'> = { name: this.selectedDepartment.name };
      this.departmentService.addDepartment(newDepartmentData as Department).subscribe( // Cast needed as service expects ID
        () => {
          this.operationSuccess('Department added successfully.');
        },
        error => this.operationError('Failed to add department.', error)
      );
    }
  }

  editDepartment(department: Department): void {
    this.isEditMode = true;
    // Create a shallow copy for editing to avoid direct mutation of the list item
    this.selectedDepartment = { ...department };
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.isLoading = true;
      this.departmentService.deleteDepartment(id).subscribe(
        () => {
          this.operationSuccess('Department deleted successfully.');
          if (this.selectedDepartment.id === id) { // If deleted item was in form
            this.clearForm();
          }
        },
        error => this.operationError('Failed to delete department.', error)
      );
    }
  }

  clearForm(): void {
    this.selectedDepartment = this.resetDepartment();
    this.isEditMode = false;
    if (this.departmentForm) {
      this.departmentForm.resetForm();
    }
  }

  private operationSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.loadDepartments(); // Refresh list
    this.clearForm();
    this.isLoading = false;
  }

  private operationError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.isLoading = false;
  }
}