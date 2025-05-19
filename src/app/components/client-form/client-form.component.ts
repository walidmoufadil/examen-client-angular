import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  clientId?: number;
  isEditMode = false;
  loading = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = +id;
      this.isEditMode = true;
      this.loadClient(this.clientId);
    }
  }

  get f() { return this.clientForm.controls; }

  initForm(): void {
    this.clientForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  loadClient(id: number): void {
    this.loading = true;
    this.clientService.getClientById(id).subscribe({
      next: (data) => {
        this.clientForm.patchValue({
          nom: data.nom,
          email: data.email
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du client: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.clientForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const client: Client = {
      nom: this.clientForm.value.nom,
      email: this.clientForm.value.email
    };
    
    if (this.isEditMode && this.clientId) {
      client.id = this.clientId;
      this.clientService.updateClient(this.clientId, client).subscribe({
        next: () => {
          this.router.navigate(['/clients', this.clientId]);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour du client: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      this.clientService.createClient(client).subscribe({
        next: (data) => {
          this.router.navigate(['/clients', data.id]);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la création du client: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    if (this.isEditMode && this.clientId) {
      this.router.navigate(['/clients', this.clientId]);
    } else {
      this.router.navigate(['/clients']);
    }
  }
}