import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Salary } from '../models/salary.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private salariesUrl = 'api/salaries'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.salariesUrl)
      .pipe(
        tap(_ => console.log('fetched salaries')),
        catchError(this.handleError<Salary[]>('getSalaries', []))
      );
  }

  getSalary(id: number): Observable<Salary> {
    const url = `${this.salariesUrl}/${id}`;
    return this.http.get<Salary>(url).pipe(
      tap(_ => console.log(`fetched salary id=${id}`)),
      catchError(this.handleError<Salary>(`getSalary id=${id}`))
    );
  }

  addSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(this.salariesUrl, salary, this.httpOptions).pipe(
      tap((newSalary: Salary) => console.log(`added salary w/ id=${newSalary.id}`)),
      catchError(this.handleError<Salary>('addSalary'))
    );
  }

  updateSalary(salary: Salary): Observable<any> {
    return this.http.put(this.salariesUrl, salary, this.httpOptions).pipe(
      tap(_ => console.log(`updated salary id=${salary.id}`)),
      catchError(this.handleError<any>('updateSalary'))
    );
  }

  deleteSalary(id: number): Observable<Salary> {
    const url = `${this.salariesUrl}/${id}`;
    return this.http.delete<Salary>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted salary id=${id}`)),
      catchError(this.handleError<Salary>('deleteSalary'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`--- ${operation} FAILED ---`);
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('URL:', error.url);
      console.error('Message:', error.message);
      console.error('Full Error Object:', JSON.stringify(error, null, 2));
      return of(result as T);
    };
  }
}