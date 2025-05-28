import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departmentsUrl = 'api/departments'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.departmentsUrl)
      .pipe(
        tap(_ => console.log('fetched departments')),
        catchError(this.handleError<Department[]>('getDepartments', []))
      );
  }

  getDepartment(id: number): Observable<Department> {
    const url = `${this.departmentsUrl}/${id}`;
    return this.http.get<Department>(url).pipe(
      tap(_ => console.log(`fetched department id=${id}`)),
      catchError(this.handleError<Department>(`getDepartment id=${id}`))
    );
  }

  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.departmentsUrl, department, this.httpOptions).pipe(
      tap((newDepartment: Department) => console.log(`added department w/ id=${newDepartment.id}`)),
      catchError(this.handleError<Department>('addDepartment'))
    );
  }

  updateDepartment(department: Department): Observable<any> {
    // The in-memory web API expects the whole collection URL for PUT
    return this.http.put(this.departmentsUrl, department, this.httpOptions).pipe(
      tap(_ => console.log(`updated department id=${department.id}`)),
      catchError(this.handleError<any>('updateDepartment'))
    );
  }

  deleteDepartment(id: number): Observable<Department> {
    const url = `${this.departmentsUrl}/${id}`;
    return this.http.delete<Department>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted department id=${id}`)),
      catchError(this.handleError<Department>('deleteDepartment'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error(error); // Log the full error
      return of(result as T);
    };
  }
}