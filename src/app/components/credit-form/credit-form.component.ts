import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Credit } from '../../models/credit.model';
import { CreditService } from '../../services/credit.service';
import { Statut, TypeBien } from '../../models/enums';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent implements OnInit {
  creditForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  error = '';
  creditId?: number;

  // Enum values for the template
  typeBienValues = Object.values(TypeBien);
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.creditId = Number(id);
      this.loadCredit(this.creditId);
    }
  }

  get f() {
    return this.creditForm.controls;
  }

  initForm(): void {
    this.creditForm = this.formBuilder.group({
      montant: [0, [Validators.required, Validators.min(1000)]],
      dureeRemboursement: [12, [Validators.required, Validators.min(6), Validators.max(360)]],
      tauxInteret: [5, [Validators.required, Validators.min(0.1), Validators.max(20)]],
      clientId: [null, Validators.required],
      typeCredit: ['Personnel', Validators.required],
      motif: [''],
      typeBien: [null],
      raisonSociale: ['']
    });
  }

  loadCredit(id: number): void {
    this.loading = true;
    this.creditService.getCreditById(id).subscribe({
      next: (credit: Credit) => {
        this.creditForm.patchValue(credit);
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erreur lors du chargement du crédit: ' + error.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.creditForm.invalid) {
      return;
    }
    
    this.loading = true;
    const credit: Credit = this.creditForm.value;
    
    // Set default values for new credits
    if (!this.isEditMode) {
      credit.dateDemande = new Date();
      credit.statut = Statut.EN_COURS;
    }
    
    if (this.isEditMode && this.creditId) {
      this.creditService.updateCredit(this.creditId, credit).subscribe({
        next: () => {
          this.router.navigate(['/credits', this.creditId]);
        },
        error: (error: any) => {
          this.error = 'Erreur lors de la modification: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      this.creditService.createCredit(credit).subscribe({
        next: (newCredit: Credit) => {
          this.router.navigate(['/credits', newCredit.id]);
        },
        error: (error: any) => {
          this.error = 'Erreur lors de la création: ' + error.message;
          this.loading = false;
        }
      });
    }
  }
  
  goBack(): void {
    if (this.isEditMode && this.creditId) {
      this.router.navigate(['/credits', this.creditId]);
    } else {
      this.router.navigate(['/credits']);
    }
  }
}