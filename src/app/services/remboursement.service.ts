// remboursement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Remboursement } from '../models/remboursement.model';

@Injectable({
  providedIn: 'root'
})
export class RemboursementService {
  private baseUrl = '/api/remboursements';

  constructor(private http: HttpClient) { }

  getAllRemboursements(): Observable<Remboursement[]> {
    return this.http.get<Remboursement[]>(this.baseUrl);
  }

  getRemboursementById(id: number): Observable<Remboursement> {
    return this.http.get<Remboursement>(`${this.baseUrl}/${id}`);
  }

  createRemboursement(remboursement: Remboursement): Observable<Remboursement> {
    return this.http.post<Remboursement>(this.baseUrl, remboursement);
  }

  updateRemboursement(id: number, remboursement: Remboursement): Observable<Remboursement> {
    return this.http.put<Remboursement>(`${this.baseUrl}/${id}`, remboursement);
  }

  deleteRemboursement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
