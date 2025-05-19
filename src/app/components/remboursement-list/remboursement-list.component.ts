import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RemboursementService } from '../../services/remboursement.service';
import { Remboursement } from '../../models/remboursement.model';

@Component({
  selector: 'app-remboursement-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './remboursement-list.component.html',
  styleUrls: ['./remboursement-list.component.css']
})
export class RemboursementListComponent implements OnInit {
  remboursements: Remboursement[] = [];
  loading = true;
  error: string | null = null;

  constructor(private remboursementService: RemboursementService) { }

  ngOnInit(): void {
    this.loadRemboursements();
  }

  loadRemboursements(): void {
    this.loading = true;
    this.remboursementService.getAllRemboursements().subscribe({
      next: (data) => {
        this.remboursements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des remboursements: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteRemboursement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce remboursement ?')) {
      this.remboursementService.deleteRemboursement(id).subscribe({
        next: () => {
          this.remboursements = this.remboursements.filter(r => r.id !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du remboursement: ' + err.message;
        }
      });
    }
  }
}