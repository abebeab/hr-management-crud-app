import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Candidate } from '../models/candidate.model';
import { Company } from '../models/company.model';
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { Salary } from '../models/salary.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const candidates: Candidate[] = [ /* ... your candidate data ... */ ];
     const companies: Company[] = [
  { id: 1, name: 'Tech Solutions Inc.', industry: 'Technology', location: 'New York' },
  { id: 2, name: 'BuildIt Corp.', industry: 'Construction', location: 'Chicago' },
  // ... add more if needed
];
    const departments: Department[] = [
      { id: 11, name: 'Human Resources' },
      { id: 12, name: 'Engineering' },
      { id: 13, name: 'Marketing' },
      { id: 14, name: 'Sales' },
      { id: 15, name: 'Finance' }
    ];
     const salaries: Salary[] = [ // <--- ADD SAMPLE SALARY DATA
      { id: 21, amount: 50000, currency: 'USD' },
      { id: 22, amount: 65000, currency: 'USD' },
      { id: 23, amount: 80000, currency: 'EUR' },
      { id: 24, amount: 4500000, currency: 'INR' }
    ];
       const employees: Employee[] = [ // <--- ADD SAMPLE EMPLOYEE DATA
      { id: 31, name: 'John Doe', departmentId: 12, salaryId: 22, companyId: 1 },
      { id: 32, name: 'Jane Smith', departmentId: 11, salaryId: 21, companyId: 1 },
      { id: 33, name: 'Peter Jones', departmentId: 13, salaryId: 22, companyId: 2 },
    ];
     

    return { candidates, companies, departments, employees, salaries };
  }

  genId(collection: {id: number}[], collectionName: string): number {
    // Ensure IDs are unique across all collections or per collection type if that's your design
    // This simple genId takes the max ID from the given collection and adds 1.
    // Or returns 11 if the collection is empty.
    return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 11;
  }
}