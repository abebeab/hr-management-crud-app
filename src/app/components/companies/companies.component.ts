import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // For Angular Material 8
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  @ViewChild('companyForm', { static: true }) companyForm!: NgForm;
  companies: Company[] = [];
  selectedCompany: Company = this.resetCompany();
  isLoading = false;
  isEditMode = false;

  displayedColumns: string[] = ['name', 'industry', 'location', 'actions'];

  constructor(
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  resetCompany(): Company {
    return { id: 0, name: '', industry: '', location: '' };
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.companyService.getCompanies().subscribe(
      data => {
        this.companies = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading companies:', error);
        this.snackBar.open('Failed to load companies.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    // Ensure we are working with a copy that has numbers for IDs if they came from form fields as strings
    const companyDataToSave: Company = {
      ...this.selectedCompany,
      id: Number(this.selectedCompany.id) // Ensure id is a number if it's part of the form
    };


    if (this.isEditMode && companyDataToSave.id) {
      console.log('Attempting to update company:', JSON.stringify(companyDataToSave));
      this.companyService.updateCompany(companyDataToSave).subscribe(
        () => this.operationSuccess('Company updated successfully.'),
        error => this.operationError('Failed to update company.', error)
      );
    } else {
      // For adding, create a new object without the 'id' property, as the backend will assign it.
      // Or if your service expects an ID (even 0 for new), adjust accordingly.
      // For in-memory API, it's often better to let it generate the ID.
      const { id, ...newCompanyData } = companyDataToSave; // Destructure to omit id if backend generates it

      console.log('Attempting to add company:', JSON.stringify(newCompanyData));
      this.companyService.addCompany(newCompanyData as Company).subscribe( // Cast might be needed if id is omitted
        () => this.operationSuccess('Company added successfully.'),
        error => this.operationError('Failed to add company.', error)
      );
    }
  }

  editCompany(company: Company): void {
    this.isEditMode = true;
    this.selectedCompany = { ...company }; // Create a shallow copy for editing
    console.log('Editing company:', JSON.stringify(this.selectedCompany));
    // Optional: Scroll to form for better UX on small screens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCompany(id: number): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.isLoading = true;
      this.companyService.deleteCompany(id).subscribe(
        () => {
          this.operationSuccess('Company deleted successfully.');
          if (this.selectedCompany.id === id) {
            this.clearForm();
          }
        },
        error => this.operationError('Failed to delete company.', error)
      );
    }
  }

  clearForm(): void {
    this.selectedCompany = this.resetCompany();
    this.isEditMode = false;
    if (this.companyForm) {
      // Reset form state and values to initial (or specific object)
      this.companyForm.resetForm(this.resetCompany());
    }
  }

  private operationSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.loadCompanies();
    this.clearForm();
    this.isLoading = false;
  }

  private operationError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.isLoading = false;
  }
}