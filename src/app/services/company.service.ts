import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class companyService {
  private apiUrl = 'api/companys';

  constructor(private http: HttpClient) {}

  getcompanys(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  addcompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  updatecompany(company: Company): Observable<any> {
    return this.http.put(`${this.apiUrl}/${company.id}`, company);
  }

  deletecompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
