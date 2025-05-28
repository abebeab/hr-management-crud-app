import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalaryService } from '../../services/salary.service';
import { Salary } from '../../models/salary.model';

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.scss']
})
export class SalariesComponent implements OnInit {
  @ViewChild('salaryForm', { static: true }) salaryForm!: NgForm;
  salaries: Salary[] = [];
  selectedSalary: Salary = this.resetSalary();
  isLoading = false;
  isEditMode = false;
  // Update currencies array to include BIRR, perhaps as the first option
  currencies: string[] = ['BIRR', 'USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']; // Example currencies

  displayedColumns: string[] = ['amount', 'currency', 'actions'];

  constructor(
    private salaryService: SalaryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSalaries();
  }

  resetSalary(): Salary {
    return { id: 0, amount: 0, currency: 'BIRR' }; // <--- CHANGED DEFAULT CURRENCY HERE
  }

  loadSalaries(): void {
    this.isLoading = true;
    this.salaryService.getSalaries().subscribe(
      data => {
        this.salaries = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading salaries:', error);
        this.snackBar.open('Failed to load salaries.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.salaryForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    if (this.isEditMode && this.selectedSalary.id) {
      this.salaryService.updateSalary(this.selectedSalary).subscribe(
        () => this.operationSuccess('Salary updated successfully.'),
        error => this.operationError('Failed to update salary.', error)
      );
    } else {
      const newSalaryData: Omit<Salary, 'id'> = {
        amount: this.selectedSalary.amount,
        currency: this.selectedSalary.currency
      };
      this.salaryService.addSalary(newSalaryData as Salary).subscribe(
        () => this.operationSuccess('Salary added successfully.'),
        error => this.operationError('Failed to add salary.', error)
      );
    }
  }

  editSalary(salary: Salary): void {
    this.isEditMode = true;
    this.selectedSalary = { ...salary };
  }

  deleteSalary(id: number): void {
    if (confirm('Are you sure you want to delete this salary entry?')) {
      this.isLoading = true;
      this.salaryService.deleteSalary(id).subscribe(
        () => {
          this.operationSuccess('Salary deleted successfully.');
          if (this.selectedSalary.id === id) {
            this.clearForm();
          }
        },
        error => this.operationError('Failed to delete salary.', error)
      );
    }
  }

  clearForm(): void {
    // this.selectedSalary = this.resetSalary(); // resetSalary() is already called by resetForm
    this.isEditMode = false;
    if (this.salaryForm) {
      this.salaryForm.resetForm(this.resetSalary()); // Pass the new default state to resetForm
    }
  }

  private operationSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.loadSalaries();
    this.clearForm(); // This will use the new default
    this.isLoading = false;
  }

  private operationError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.isLoading = false;
  }
}