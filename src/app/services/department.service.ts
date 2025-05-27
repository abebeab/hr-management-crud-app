import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'api/Departments';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  addDepartment(Department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, Department);
  }

  updateDepartment(Department: Department): Observable<any> {
    return this.http.put(`${this.apiUrl}/${Department.id}`, Department);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
