import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { Credit } from '../../models/credit.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  clientId!: number;
  client: Client | null = null;
  credits: Credit[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadClient();
    this.loadClientCredits();
  }

  loadClient(): void {
    this.loading = true;
    this.clientService.getClientById(this.clientId).subscribe({
      next: (data) => {
        this.client = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du client: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadClientCredits(): void {
    this.clientService.getClientCredits(this.clientId).subscribe({
      next: (data) => {
        this.credits = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des crédits du client:', err);
      }
    });
  }

  deleteClient(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ? Tous les crédits associés seront également supprimés.')) {
      this.clientService.deleteClient(this.clientId).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du client: ' + err.message;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}