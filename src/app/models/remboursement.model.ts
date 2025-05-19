// remboursement.model.ts
import { TypeRemboursement } from './enums';

export interface Remboursement {
  id?: number;
  date: Date;
  montant: number;
  type: TypeRemboursement;
  creditId: number;
}
