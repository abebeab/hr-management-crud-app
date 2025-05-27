import { Component } from '@angular/core';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
})
export class CompaniesComponent {
  companies: Company[] = [];
  selectedCompany: Company = this.getEmptyCompany();
  displayedColumns: string[] = ['name', 'location', 'actions'];

  getEmptyCompany(): Company {
    return { id: 0, name: '', location: '' };
  }

  onSubmit() {
    if (this.selectedCompany.id) {
      const index = this.companies.findIndex(c => c.id === this.selectedCompany.id);
      this.companies[index] = { ...this.selectedCompany };
    } else {
      const newId = this.companies.length ? Math.max(...this.companies.map(c => c.id)) + 1 : 1;
      this.companies.push({ ...this.selectedCompany, id: newId });
    }
    this.clearForm();
  }

  editCompany(company: Company) {
    this.selectedCompany = { ...company };
  }

  deleteCompany(id: number) {
    this.companies = this.companies.filter(c => c.id !== id);
  }

  clearForm() {
    this.selectedCompany = this.getEmptyCompany();
  }
}
