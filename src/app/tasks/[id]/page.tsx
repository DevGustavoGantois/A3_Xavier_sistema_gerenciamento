// src/app/dashboard/orders/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalhes do Pedido</h1>
      <p>ID do pedido: {id}</p>

      {/* Aqui entrariam detalhes simulados ou mockados */}
      <div>
        <p><strong>Cliente:</strong> João da Silva</p>
        <p><strong>Status:</strong> Em andamento</p>
        <p><strong>Itens:</strong> Produto A, Produto B</p>
        <p><strong>Data:</strong> 30/05/2025</p>
      </div>
    </div>
  );
}
