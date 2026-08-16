create table T_TABLAS (
    MSTOCK numeric(1), -- Manejo de Stock (1 Permite Vender con Stock , 2 Permite Vender sin Stock)
    MCANCEL numeric(1), -- puntos de venta (1 Cargar Cta Cte Cancelada, 2 Carga Cta Cte Pendiente)
    NRUC varchar(20), -- Nombre del RUC
    NIGV varchar(20), -- Nombre IGV
    NPORIGV numeric(15, 2), -- Porc. de IGV
    N1 numeric(1), -- Punto de Venta (Facturación) (1 Facturación Varios Puntos, 2 Facturación Múltiple)
    N2 numeric(1), -- Correlativo de Pedido: (1 Correlativo Automático, 2 Correlativo con N° Serie)
    N3 numeric(1), -- '' (vacío)
    N4 varchar(20), -- Fecha de Inicio
    N5 varchar(20), -- Porc. de Retención
    N6 varchar(20), -- Importe Max. Retención
    N7 numeric(1), -- '' (vacío)
    NREF1 numeric(10, 2), -- Correlativo de Informe de Cobranza (1 Correlativo Automático, 2 Correlativo con Serie)
    CREF1 varchar(30), -- % Max de Exceso Orden Compra / N.Ingreso
    NREF2 numeric(10, 2), -- Costeo de Producción (1 Último Costo, 2 Costo Promedio)
    CREF2 varchar(30), -- Modificación de Precios (1 Permite modificar los precios y dsctos, 2 No Permite modificar precios y dsctos)
    NREF3 numeric(10, 2), -- Correlativo de Orden de Compra (1 Correlativo Automático, 2 Poner N°. Correlativo)
    CREF3 varchar(30), -- Agente de Percepción (1 no afecto, 2 afecto)
    NREF4 numeric(10, 2), -- deuda vencida
    CREF4 varchar(30) -- '' (vacío)
)