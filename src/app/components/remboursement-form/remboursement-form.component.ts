import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RemboursementService } from '../../services/remboursement.service';
import { CreditService } from '../../services/credit.service';
import { Remboursement } from '../../models/remboursement.model';
import { Credit } from '../../models/credit.model';
import { TypeRemboursement } from '../../models/enums';

@Component({
  selector: 'app-remboursement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './remboursement-form.component.html',
  styleUrls: ['./remboursement-form.component.css']
})
export class RemboursementFormComponent implements OnInit {
  remboursementForm!: FormGroup;
  remboursementId?: number;
  isEditMode = false;
  loading = false;
  submitted = false;
  error: string | null = null;
  credits: Credit[] = [];
  typeOptions = Object.values(TypeRemboursement);

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private remboursementService: RemboursementService,
    private creditService: CreditService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCredits();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.remboursementId = +id;
      this.isEditMode = true;
      this.loadRemboursement(this.remboursementId);
    }
  }

  get f() { return this.remboursementForm.controls; }

  initForm(): void {
    this.remboursementForm = this.formBuilder.group({
      date: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]],
      type: ['', Validators.required],
      creditId: ['', Validators.required]
    });
  }

  loadCredits(): void {
    this.creditService.getAllCredits().subscribe({
      next: (data) => {
        this.credits = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des crédits: ' + err.message;
      }
    });
  }

  loadRemboursement(id: number): void {
    this.loading = true;
    this.remboursementService.getRemboursementById(id).subscribe({
      next: (data) => {
        // Convertir la date en format approprié pour l'input date
        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toISOString().split('T')[0];
        
        this.remboursementForm.patchValue({
          date: formattedDate,
          montant: data.montant,
          type: data.type,
          creditId: data.creditId
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du remboursement: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.remboursementForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const formValues = this.remboursementForm.value;
    const remboursement: Remboursement = {
      date: new Date(formValues.date),
      montant: formValues.montant,
      type: formValues.type,
      creditId: parseInt(formValues.creditId, 10)
    };
    
    if (this.isEditMode && this.remboursementId) {
      remboursement.id = this.remboursementId;
      this.remboursementService.updateRemboursement(this.remboursementId, remboursement).subscribe({
        next: () => {
          this.router.navigate(['/remboursements', this.remboursementId]);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour du remboursement: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      this.remboursementService.createRemboursement(remboursement).subscribe({
        next: (data) => {
          this.router.navigate(['/remboursements', data.id]);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la création du remboursement: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    if (this.isEditMode && this.remboursementId) {
      this.router.navigate(['/remboursements', this.remboursementId]);
    } else {
      this.router.navigate(['/remboursements']);
    }
  }
}
