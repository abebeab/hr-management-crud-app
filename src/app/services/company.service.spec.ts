import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Company } from '../models/company.model'; // Ensure Company model is imported

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesUrl = 'api/companies'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.companiesUrl)
      .pipe(
        tap(_ => console.log('fetched companies')), // This log is important
        catchError(this.handleError<Company[]>('getCompanies', []))
      );
  }

  // Add getCompany(id), addCompany, updateCompany, deleteCompany methods
  // similar to your other services if you haven't already.

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`--- ${operation} FAILED ---`); // Make sure this log is present
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('URL:', error.url);
      console.error('Message:', error.message);
      console.error('Full Error Object:', JSON.stringify(error, null, 2));
      return of(result as T);
    };
  }
}