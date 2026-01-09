import { Routes } from '@angular/router';
import { InvoiceComponent } from './pages/invoices/invoice';
import { QueriesComponent } from './pages/queries/queries';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/invoices' },
  { path: 'invoices', component: InvoiceComponent },
  { path: 'queries', component: QueriesComponent },
];
