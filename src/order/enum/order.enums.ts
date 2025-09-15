export enum OrderStatus {
  NEW = 'NUEVA',
  PENDING_PAYMENT = 'PENDIENTE_PAGO',
  PAID = 'PAGADA',
  IN_PREPARATION = 'EN_PREPARACION',
  SENT = 'ENVIADA',
  DELIVERED = 'ENTREGADA',
  CANCELED = 'CANCELADA',
  REFUNDED = 'REEMBOLSADA',
}

export enum PaymentStatus {
  PENDING = 'PENDIENTE',
  AUTHORIZED = 'AUTORIZADO',
  CAPTURED = 'CAPTURADO',
  REJECTED = 'RECHAZADO',
  REFUNDED = 'DEVUELTO',
  CANCELED = 'CANCELADO',
}

export enum PaymentMethod {
  CASH = 'EFECTIVO',
  CARD = 'TARJETA',
  TRANSFER = 'TRANSFERENCIA',
  WALLET = 'WALLET',
  CASH_ON_DELIVERY = 'CONTRAENTREGA',
}

export enum ShippingStatus {
  PENDING = 'PENDIENTE',
  PREPARING = 'PREPARANDO',
  DISPATCHED = 'DESPACHADO',
  IN_TRANSIT = 'EN_TRANSITO',
  DELIVERED = 'ENTREGADO',
  FAILED = 'FALLIDO',
  RETURNED = 'DEVUELTO',
}

export enum InvoiceType {
  A = 'A',
  B = 'B',
  C = 'C',
  E = 'E',
  ND = 'ND', // Nota de Débito
  NC = 'NC', // Nota de Crédito
}

export enum ReturnStatus {
  OPEN = 'ABIERTA',
  APPROVED = 'APROBADA',
  REJECTED = 'RECHAZADA',
  CLOSED = 'CERRADA',
}

export enum ReturnItemResolution {
  REFUND = 'REEMBOLSO',
  REPLACEMENT = 'REEMPLAZO',
}
