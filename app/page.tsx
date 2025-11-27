// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { Invoice, InvoiceItem } from "../src/lib/types";
import { InvoicePdfButton } from "../components/InvoicePdfButton";
import { SpeedInsights } from "@vercel/speed-insights/next"

const COMPANY_INFO = {
  name: "SmartInvoice SpA",
  taxId: "77.123.456-7",
  address: "Av. Providencia 1234, Oficina 501, Santiago, Chile",
  email: "facturacion@smartinvoice.cl",
  phone: "+56 9 1234 5678",
};

const emptyItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
});

const createInitialInvoice = (): Invoice => ({
  client: {
    name: "",
    email: "",
    taxId: "",
    address: "",
  },
  items: [emptyItem()],
  issueDate: new Date().toISOString().slice(0, 10),
  currency: "CLP",
  notes: "",
  taxRate: 19,
  discount: 0,
});

const getCurrencySymbol = (currency: Invoice["currency"]) => {
  switch (currency) {
    case "CLP":
      return "$";
    case "USD":
      return "US$";
    case "EUR":
      return "€";
    default:
      return currency;
  }
};

export default function HomePage() {
  const [invoice, setInvoice] = useState<Invoice>(createInitialInvoice());

  // Número de factura dinámico basado en fecha + tiempo
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);

useEffect(() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const suffix = String(now.getTime()).slice(-4);

  setInvoiceNumber(`F-${y}${m}${d}-${suffix}`);
}, []);


  const currencySymbol = getCurrencySymbol(invoice.currency);

  const handleClientChange = (
    field: keyof Invoice["client"],
    value: string
  ) => {
    setInvoice((prev: Invoice) => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value,
      },
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string
  ) => {
    setInvoice((prev: Invoice) => ({
      ...prev,
      items: prev.items.map((item: InvoiceItem) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "unitPrice"
                  ? Number(value) || 0
                  : value,
            }
          : item
      ),
    }));
  };

  const addItem = () => {
    setInvoice((prev: Invoice) => ({
      ...prev,
      items: [...prev.items, emptyItem()],
    }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev: Invoice) => ({
      ...prev,
      items: prev.items.filter((item: InvoiceItem) => item.id !== id),
    }));
  };

  const handleMetaChange = (
    field: keyof Omit<Invoice, "client" | "items">,
    value: string
  ) => {
    setInvoice((prev: Invoice) => ({
      ...prev,
      [field]:
        field === "taxRate" || field === "discount"
          ? Number(value) || 0
          : value,
    }));
  };

  const subtotal = invoice.items.reduce(
    (acc: number, item: InvoiceItem) =>
      acc + item.quantity * item.unitPrice,
    0
  );

  const discountAmount = subtotal * (invoice.discount ?? 0) * 0.01;
  const taxedBase = subtotal - discountAmount;
  const taxAmount = taxedBase * (invoice.taxRate ?? 0) * 0.01;
  const total = taxedBase + taxAmount;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Invoice submitted", {
      invoiceNumber,
      ...invoice,
    });
    alert("Factura generada (por ahora solo en consola 😄)");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row">
        {/* Formulario */}
        <section className="w-full rounded-xl bg-slate-900/70 p-6 shadow-lg md:w-2/3">
          <h1 className="mb-4 text-2xl font-semibold">Nueva factura</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Datos del cliente */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-100">
                Datos del cliente
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-slate-300">
                    Nombre / Razón social
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={invoice.client.name}
                    onChange={(e) =>
                      handleClientChange("name", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300">
                    Correo
                  </label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={invoice.client.email ?? ""}
                    onChange={(e) =>
                      handleClientChange("email", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300">
                    RUT / ID Fiscal
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={invoice.client.taxId ?? ""}
                    onChange={(e) =>
                      handleClientChange("taxId", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300">
                    Dirección
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={invoice.client.address ?? ""}
                    onChange={(e) =>
                      handleClientChange("address", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Metadatos */}
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="block text-sm text-slate-300">
                  Fecha emisión
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={invoice.issueDate}
                  onChange={(e) =>
                    handleMetaChange("issueDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300">
                  Moneda
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={invoice.currency}
                  onChange={(e) =>
                    handleMetaChange("currency", e.target.value as any)
                  }
                >
                  <option value="CLP">CLP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={invoice.discount ?? 0}
                  onChange={(e) =>
                    handleMetaChange("discount", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Ítems */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">
                  Ítems
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-md border border-indigo-500 px-3 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/10"
                >
                  + Agregar ítem
                </button>
              </div>

              <div className="space-y-3">
                {invoice.items.map((item: InvoiceItem) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 md:grid-cols-[2fr,1fr,1fr,auto]"
                  >
                    <div>
                      <label className="block text-xs text-slate-400">
                        Descripción
                      </label>
                      <input
                        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">
                        Precio unitario
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "unitPrice",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-md border border-red-500 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm text-slate-300">
                Notas para el cliente
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                rows={3}
                value={invoice.notes ?? ""}
                onChange={(e) =>
                  handleMetaChange("notes", e.target.value)
                }
              />
            </div>

            {/* Botones */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <InvoicePdfButton />
              <button
                type="submit"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-400"
              >
                Generar factura
              </button>
            </div>
          </form>
        </section>

        {/* Vista previa */}
        <section className="mt-6 w-full rounded-xl bg-slate-900/40 p-6 shadow-lg md:mt-0 md:w-1/3">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">
            Vista previa
          </h2>

          <div
  id="invoice-preview"
  className="mx-auto w-full max-w-[640px] space-y-6 rounded-lg bg-white p-8 text-sm text-slate-900 shadow-lg"
>

            {/* Encabezado: Empresa y datos de factura */}
<div className="flex flex-col gap-4 lg:gap-8 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
  <div>
    <h1 className="text-xl font-bold tracking-tight text-slate-900">
      {COMPANY_INFO.name}
    </h1>
    <p className="mt-1 text-xs text-slate-500">
      {COMPANY_INFO.address}
    </p>
    <p className="text-xs text-slate-500">
      {COMPANY_INFO.email} · {COMPANY_INFO.phone}
    </p>
    <p className="mt-1 text-xs text-slate-500">
      RUT: {COMPANY_INFO.taxId}
    </p>
  </div>

  <div className="text-right space-y-1 lg:max-w-[220px] lg:self-start lg:pr-2">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      FACTURA
    </p>
    <p className="text-lg font-semibold text-slate-900 break-all">
      N° {invoiceNumber ?? ""}
    </p>
    <p className="text-xs text-slate-500">
      Fecha emisión:{" "}
      <span className="font-medium text-slate-800">
        {invoice.issueDate}
      </span>
    </p>
    <p className="text-xs text-slate-500">
      Moneda:{" "}
      <span className="font-medium text-slate-800">
        {invoice.currency}
      </span>
    </p>
  </div>
</div>


            {/* Datos del cliente */}
            <div className="grid gap-4 border-b border-slate-200 pb-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Cliente
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {invoice.client.name || "—"}
                </p>
                {invoice.client.taxId && (
                  <p className="text-xs text-slate-500">
                    RUT / ID Fiscal: {invoice.client.taxId}
                  </p>
                )}
                {invoice.client.address && (
                  <p className="text-xs text-slate-500">
                    {invoice.client.address}
                  </p>
                )}
              </div>

              <div className="md:text-right">
                {invoice.client.email && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contacto
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {invoice.client.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de ítems */}
<div className="border-b border-slate-200 pb-4">
  <div className="max-w-full overflow-x-auto">
    <table className="min-w-full border-collapse text-xs md:text-sm">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50">
          <th className="py-2 pr-2 text-left font-semibold text-slate-600 whitespace-nowrap">
            Descripción
          </th>
          <th className="py-2 px-2 text-right font-semibold text-slate-600 whitespace-nowrap">
            Cantidad
          </th>
          <th className="py-2 px-2 text-right font-semibold text-slate-600 whitespace-nowrap">
            Precio unitario
          </th>
          <th className="py-2 pl-2 text-right font-semibold text-slate-600 whitespace-nowrap">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((item: InvoiceItem) => (
          <tr
            key={item.id}
            className="border-b border-slate-100 last:border-0"
          >
            <td className="py-2 pr-2 align-top">
              <p className="text-slate-800">
                {item.description || "Ítem sin descripción"}
              </p>
            </td>
            <td className="py-2 px-2 text-right align-top text-slate-700">
              {item.quantity}
            </td>
            <td className="py-2 px-2 text-right align-top text-slate-700">
              {currencySymbol}
              {item.unitPrice.toLocaleString()}
            </td>
            <td className="py-2 pl-2 text-right align-top font-medium text-slate-900">
              {currencySymbol}
              {(item.quantity * item.unitPrice).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


            {/* Resumen de totales */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-1 text-xs md:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>
                    {currencySymbol}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                {invoice.discount ? (
                  <div className="flex justify-between text-slate-600">
                    <span>Descuento ({invoice.discount}%)</span>
                    <span>
                      -{currencySymbol}
                      {discountAmount.toLocaleString()}
                    </span>
                  </div>
                ) : null}

                {invoice.taxRate ? (
                  <div className="flex justify-between text-slate-600">
                    <span>Impuesto ({invoice.taxRate}%)</span>
                    <span>
                      {currencySymbol}
                      {taxAmount.toLocaleString()}
                    </span>
                  </div>
                ) : null}

                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm font-semibold text-slate-900">
                  <span>Total</span>
                  <span>
                    {currencySymbol}
                    {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notas */}
            {invoice.notes && (
              <div className="mt-4 rounded-md bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notas
                </p>
                <p className="mt-1 text-xs text-slate-600 whitespace-pre-line">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Pie de página */}
            <div className="mt-6 border-t border-slate-200 pt-3 text-[10px] text-slate-500">
              <p>
                Esta factura ha sido generada con SmartInvoice. 
                El pago debe realizarse dentro de los 30 días siguientes a la fecha de emisión.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
