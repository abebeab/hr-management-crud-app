import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Ensure HttpHeaders is imported if you add httpOptions
import { Observable, of } from 'rxjs'; // Ensure 'of' is imported
import { catchError, tap } from 'rxjs/operators'; // Ensure these are imported
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'api/companies'; // Corrected URL

  // Optional: add httpOptions if you plan to use POST, PUT, DELETE with specific headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl)
      .pipe(
        tap(_ => console.log('fetched companies')), // Add this log
        catchError(this.handleError<Company[]>('getCompanies', [])) // Add error handling
      );
  }

  // It's good practice to have a consistent handleError in all services
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

  // Add other CRUD methods (getCompany(id), addCompany, updateCompany, deleteCompany)
  // Make sure their method names are conventional (e.g., addCompany, not addcompany)
  // and that they also use .pipe(tap(...), catchError(...))
  // Example for addCompany:
  addCompany(company: Company): Observable<Company> { // Conventional casing
    return this.http.post<Company>(this.apiUrl, company, this.httpOptions) // Use httpOptions
      .pipe(
        tap((newCompany: Company) => console.log(`added company w/ id=${newCompany.id}`)),
        catchError(this.handleError<Company>('addCompany'))
      );
  }

  updateCompany(company: Company): Observable<any> { // Conventional casing
    // For in-memory API, PUT usually targets the collection URL, not specific ID in URL for update
    // However, your other services use PUT with the collection URL and it works.
    // If PUT fails, try just this.apiUrl for the first argument.
    // But the more common pattern for PUT is to have the ID in the URL.
    // Let's assume your other services for PUT work against the collection URL.
    // If not, change to: return this.http.put(`${this.apiUrl}/${company.id}`, company, this.httpOptions)
    return this.http.put(this.apiUrl, company, this.httpOptions) // Use httpOptions
      .pipe(
        tap(_ => console.log(`updated company id=${company.id}`)),
        catchError(this.handleError<any>('updateCompany'))
      );
  }

  deleteCompany(id: number): Observable<Company> { // Conventional casing, return type often Company or {}
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Company>(url, this.httpOptions) // Use httpOptions
      .pipe(
        tap(_ => console.log(`deleted company id=${id}`)),
        catchError(this.handleError<Company>('deleteCompany'))
      );
  }
}