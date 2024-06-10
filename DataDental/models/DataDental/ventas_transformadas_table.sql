{{ config(materialized='table') }}

select
    id_venta,
    ID_Usuario,
    id_cita,
    lower(tratamiento) as tratamiento,  -- Convertir tratamiento a minúsculas
    cast(replace(costo_total, '$', '') as decimal(10,2)) as costo_total,  -- Limpiar y convertir costo_total a decimal
    date(fecha) as fecha,  -- Normalizar fecha a solo la parte de la fecha
    strftime('%Y', fecha) as año,  -- Crear columna derivada para el año
    strftime('%m', fecha) as mes,  -- Crear columna derivada para el mes
    ID_Especialista,
    case 
        when lower(trim(metodo_pago)) = 'tarjeta de crédito' then 1
        when lower(trim(metodo_pago)) = 'efectivo' then 2
        when lower(trim(metodo_pago)) = 'tarjeta de débito' then 3
        when lower(trim(metodo_pago)) = 'transferencia bancaria' then 4
        else null
    end as metodo_pago_codificado,  -- Codificar metodo_pago
    lower(trim(metodo_pago)) as metodo_pago,  -- Limpiar y estandarizar metodo_pago original
    case
        when lower(trim(estado_pago)) = 'meses sin intereses' then 2
        when lower(trim(estado_pago)) = 'pagado' then 3
        when lower(trim(estado_pago)) = 'pendiente' then 1
        else null
    end as estado_pago_codificado,  -- Codificar estado_pago
    lower(trim(estado_pago)) as estado_pago,  -- Limpiar y estandarizar estado_pago original
    replace(medicamentos_recetados, '\n', ' ') as medicamentos_recetados,  -- Limpiar caracteres especiales en medicamentos_recetados
    length(replace(medicamentos_recetados, ' ', '')) - length(replace(replace(medicamentos_recetados, ' ', ''), ',', '')) + 1 as cantidad_medicamentos  -- Contar cantidad de medicamentos
from
    ventas

