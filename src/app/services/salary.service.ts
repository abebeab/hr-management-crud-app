import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salary } from '../models/salary.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = 'api/Salarys';

  constructor(private http: HttpClient) {}

  getSalarys(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.apiUrl);
  }

  addSalary(Salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(this.apiUrl, Salary);
  }

  updateSalary(Salary: Salary): Observable<any> {
    return this.http.put(`${this.apiUrl}/${Salary.id}`, Salary);
  }

  deleteSalary(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
