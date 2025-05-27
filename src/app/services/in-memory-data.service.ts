import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const candidates = [
      { id: 1, name: 'Abebe Tafere', appliedPosition: 'Developer', companyId: 1 },
      { id: 2, name: 'Dejen Aschalew', appliedPosition: 'Designer', companyId: 2 }
    ];
    const companies = [
      { id: 1, name: 'Tech Corp', location: 'New York' },
      { id: 2, name: 'Design Studio', location: 'San Francisco' }
    ];
    const departments = [
      { id: 1, name: 'Development' },
      { id: 2, name: 'Design' }
    ];
    const salaries = [
      { id: 1, amount: 60000, currency: 'USD' },
      { id: 2, amount: 70000, currency: 'USD' }
    ];
    const employees = [
      { id: 1, name: 'John', departmentId: 1, salaryId: 1, companyId: 1 },
      { id: 2, name: 'Yosef', departmentId: 2, salaryId: 2, companyId: 2 }
    ];
    return { candidates, companies, departments, salaries, employees };
  }
}
