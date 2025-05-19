import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Credit } from '../../models/credit.model';
import { CreditService } from '../../services/credit.service';
import { Statut } from '../../models/enums';

@Component({
  selector: 'app-credit-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-detail.component.html',
  styleUrls: ['./credit-detail.component.css']
})
export class CreditDetailComponent implements OnInit {
  credit: Credit | null = null;
  loading = true;
  error = '';
  Statut = Statut; // Make enum available in template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCredit(Number(id));
    } else {
      this.error = 'ID de cr�dit non trouv�';
      this.loading = false;
    }
  }

  loadCredit(id: number): void {
    this.creditService.getCreditById(id).subscribe({
      next: (credit: Credit) => {
        this.credit = credit;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erreur lors du chargement du cr�dit: ' + error.message;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/credits']);
  }

  goToEdit(): void {
    if (this.credit) {
      this.router.navigate([`/credits/${this.credit.id}/edit`]);
    }
  }

  deleteCredit(): void {
    if (!this.credit) return;
    
    if (confirm('�tes-vous s�r de vouloir supprimer ce cr�dit?')) {
      this.loading = true;
      this.creditService.deleteCredit(this.credit.id!).subscribe({
        next: () => {
          this.router.navigate(['/credits']);
        },
        error: (error: any) => {
          this.error = 'Erreur lors de la suppression: ' + error.message;
          this.loading = false;
        }
      });
    }
  }
}
