// src/lib/types.ts

export type Currency = "CLP" | "USD" | "EUR";

export interface Client {
  id?: string;
  name: string;
  email?: string;
  taxId?: string; // RUT, etc.
  address?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id?: string;
  client: Client;
  items: InvoiceItem[];
  issueDate: string;     // ISO string
  dueDate?: string;      // opcional
  currency: Currency;
  notes?: string;
  taxRate?: number;      // % IVA u otro
  discount?: number;     // % descuento global
}
