// credit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit } from '../models/credit.model';
import { Remboursement } from '../models/remboursement.model';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private baseUrl = '/api/credits';

  constructor(private http: HttpClient) { }

  getAllCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.baseUrl);
  }

  getCreditById(id: number): Observable<Credit> {
    return this.http.get<Credit>(`${this.baseUrl}/${id}`);
  }

  createCredit(credit: Credit): Observable<Credit> {
    return this.http.post<Credit>(this.baseUrl, credit);
  }

  updateCredit(id: number, credit: Credit): Observable<Credit> {
    return this.http.put<Credit>(`${this.baseUrl}/${id}`, credit);
  }

  deleteCredit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCreditRemboursements(id: number): Observable<Remboursement[]> {
    return this.http.get<Remboursement[]>(`${this.baseUrl}/${id}/remboursements`);
  }
}
