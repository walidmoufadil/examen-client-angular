import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { CreditListComponent } from './components/credit-list/credit-list.component';
import { RemboursementListComponent } from './components/remboursement-list/remboursement-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { CreditFormComponent } from './components/credit-form/credit-form.component';
import { RemboursementFormComponent } from './components/remboursement-form/remboursement-form.component';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';
import { CreditDetailComponent } from './components/credit-detail/credit-detail.component';
import { RemboursementDetailComponent } from './components/remboursement-detail/remboursement-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/:id', component: ClientDetailComponent },
  { path: 'clients/:id/edit', component: ClientFormComponent },
  { path: 'credits', component: CreditListComponent },
  { path: 'credits/new', component: CreditFormComponent },
  { path: 'credits/:id', component: CreditDetailComponent },
  { path: 'credits/:id/edit', component: CreditFormComponent },
  { path: 'remboursements', component: RemboursementListComponent },
  { path: 'remboursements/new', component: RemboursementFormComponent },
  { path: 'remboursements/:id', component: RemboursementDetailComponent },
  { path: 'remboursements/:id/edit', component: RemboursementFormComponent },
];
