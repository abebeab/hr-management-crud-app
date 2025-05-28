import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Company } from '../models/company.model';

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
        tap(_ => console.log('fetched companies')),
        catchError(this.handleError<Company[]>('getCompanies', []))
      );
  }

  getCompany(id: number): Observable<Company> {
    const url = `${this.companiesUrl}/${id}`;
    return this.http.get<Company>(url).pipe(
      tap(_ => console.log(`fetched company id=${id}`)),
      catchError(this.handleError<Company>(`getCompany id=${id}`))
    );
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.companiesUrl, company, this.httpOptions).pipe(
      tap((newCompany: Company) => console.log(`added company w/ id=${newCompany.id}`)),
      catchError(this.handleError<Company>('addCompany'))
    );
  }

  updateCompany(company: Company): Observable<any> {
    // angular-in-memory-web-api expects PUT to the collection URL for updates.
    // The body (company object) MUST contain the 'id' of the item to update.
    return this.http.put(this.companiesUrl, company, this.httpOptions).pipe(
      tap(_ => console.log(`CompanyService: updated company id=${company.id}`)),
      catchError(this.handleError<any>('updateCompany'))
    );
  }

  deleteCompany(id: number): Observable<Company> {
    const url = `${this.companiesUrl}/${id}`;
    return this.http.delete<Company>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted company id=${id}`)),
      catchError(this.handleError<Company>('deleteCompany'))
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