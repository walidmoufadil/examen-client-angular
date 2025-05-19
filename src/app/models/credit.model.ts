// credit.model.ts
import { Statut, TypeBien } from './enums';

export interface Credit {
  id?: number;
  dateDemande: Date;
  statut: Statut;
  dateAcceptation?: Date;
  montant: number;
  dureeRemboursement: number;
  tauxInteret: number;
  clientId: number;
  typeCredit: string; // 'Personnel', 'Immobilier', 'Professionnel'
  motif?: string;
  typeBien?: TypeBien;
  raisonSociale?: string;
}
