import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { Credit } from '../../models/credit.model';

@Component({
  selector: 'app-credit-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.css']
})
export class CreditListComponent implements OnInit {
  credits: Credit[] = [];
  loading = true;
  error: string | null = null;

  constructor(private creditService: CreditService) { }

  ngOnInit(): void {
    this.loadCredits();
  }

  loadCredits(): void {
    this.loading = true;
    this.creditService.getAllCredits().subscribe({
      next: (data) => {
        this.credits = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des crédits: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteCredit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce crédit ? Tous les remboursements associés seront également supprimés.')) {
      this.creditService.deleteCredit(id).subscribe({
        next: () => {
          this.credits = this.credits.filter(c => c.id !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du crédit: ' + err.message;
        }
      });
    }
  }
}