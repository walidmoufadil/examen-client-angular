import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RemboursementService } from '../../services/remboursement.service';
import { Remboursement } from '../../models/remboursement.model';

@Component({
  selector: 'app-remboursement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './remboursement-detail.component.html',
  styleUrls: ['./remboursement-detail.component.css']
})
export class RemboursementDetailComponent implements OnInit {
  remboursementId!: number;
  remboursement: Remboursement | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private remboursementService: RemboursementService
  ) { }

  ngOnInit(): void {
    this.remboursementId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRemboursement();
  }

  loadRemboursement(): void {
    this.loading = true;
    this.remboursementService.getRemboursementById(this.remboursementId).subscribe({
      next: (data) => {
        this.remboursement = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du remboursement: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteRemboursement(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce remboursement ?')) {
      this.remboursementService.deleteRemboursement(this.remboursementId).subscribe({
        next: () => {
          this.router.navigate(['/remboursements']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du remboursement: ' + err.message;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/remboursements']);
  }
}