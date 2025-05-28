import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesUrl = 'api/employees'; // Matches key in InMemoryDataService

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl)
      .pipe(
        tap(_ => console.log('EmployeeService: fetched employees')),
        catchError(this.handleError<Employee[]>('getEmployees', []))
      );
  }

  // Add getEmployee(id) if needed for any specific logic

  addEmployee(employeeData: Omit<Employee, 'id'>): Observable<Employee> {
    console.log('EmployeeService: Attempting to ADD employee (data received):', JSON.stringify(employeeData));
    // InMemoryWebApi will assign the ID. The object sent should not have an 'id' if it's new.
    return this.http.post<Employee>(this.employeesUrl, employeeData, this.httpOptions).pipe(
      tap((newEmployee: Employee) => console.log(`EmployeeService: ADD successful. Added employee w/ id=${newEmployee.id}`, newEmployee)),
      catchError(this.handleError<Employee>('addEmployee'))
    );
  }

  updateEmployee(employee: Employee): Observable<any> {
    // The employee object MUST have the 'id' property for in-memory API to find it.
    if (!employee || typeof employee.id === 'undefined' || employee.id === 0 || employee.id === null) {
      const errorMsg = 'EmployeeService: updateEmployee FAILED - Invalid employee ID provided for update.';
      console.error(errorMsg, employee);
      // Optionally return an observable that emits an error
      // return throwError(() => new Error(errorMsg));
      return of(null); // Or return an observable of null/error as per your app's error handling strategy
    }
    console.log('EmployeeService: Attempting to UPDATE employee:', JSON.stringify(employee));
    // In-memory API expects PUT to the collection URL, ID is in the body for update.
    return this.http.put(this.employeesUrl, employee, this.httpOptions).pipe(
      tap(_ => console.log(`EmployeeService: PUT request potentially successful for employee id=${employee.id}`)),
      // For PUT, in-memory-api often returns null or 204 No Content, so the response might not be the updated object.
      // The 'tap' above just confirms the HTTP call itself likely succeeded.
      catchError(this.handleError<any>('updateEmployee'))
    );
  }

  deleteEmployee(id: number): Observable<Employee> { // Or Observable<{}> if API returns empty body
    if (!id) {
        const errorMsg = 'EmployeeService: deleteEmployee FAILED - Invalid ID provided for delete.';
        console.error(errorMsg, id);
        return of(null as any); // Or throwError
    }
    const url = `${this.employeesUrl}/${id}`;
    console.log('EmployeeService: Attempting to DELETE employee with URL:', url);
    return this.http.delete<Employee>(url, this.httpOptions).pipe(
      tap(_ => console.log(`EmployeeService: DELETE request successful for employee id=${id}`)),
      catchError(this.handleError<Employee>('deleteEmployee'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`--- EmployeeService: ${operation} FAILED ---`);
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('URL:', error.url);
      console.error('Message:', error.message);
      console.error('Full Error Object received by service:', JSON.stringify(error, null, 2));
      return of(result as T); // Let the app keep running by returning an empty result.
    };
  }
}