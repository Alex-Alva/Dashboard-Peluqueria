import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF', // Fondo blanco puro para el PDF
    fontFamily: 'Helvetica',
    color: '#334155', // slate-700 para texto principal
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#7C3AED', // purple-600
    paddingBottom: 18,
    marginBottom: 25,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#581C87', // purple-900
  },
  companyDetails: {
    fontSize: 9,
    color: '#64748B', // slate-500
    marginTop: 4,
    lineHeight: 1.3,
  },
  receiptCard: {
    borderWidth: 2,
    borderColor: '#7C3AED', // purple-600
    backgroundColor: '#F5F3FF', // purple-50
    borderRadius: 6,
    padding: 12,
    textAlign: 'center',
    minWidth: 155,
  },
  receiptTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#581C87', // purple-900
  },
  receiptNumber: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
    color: '#6366F1', // indigo-500
  },
  metaText: {
    fontSize: 9,
    color: '#7C3AED', // purple-600
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#7C3AED', // purple-600
    marginBottom: 6,
    fontWeight: 'bold',
  },
  clientBox: {
    marginBottom: 25,
    backgroundColor: '#F8FAFC', // slate-50
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate-200
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED', // purple-600
  },
  clientText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#334155', // slate-700
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED', // purple-600 sólido
    borderRadius: 4,
    padding: 7,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // slate-200
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: '#FAFAFA', // Alternado muy sutil
  },
  colDesc: { flex: 3, fontSize: 10, color: '#0F172A' }, // slate-900
  colCant: { flex: 1, textAlign: 'center', fontSize: 10, color: '#475569' }, // slate-600
  colPrecio: { flex: 1, textAlign: 'right', fontSize: 10, color: '#475569' }, // slate-600
  colSubtotal: { flex: 1, textAlign: 'right', fontSize: 10, color: '#581C87', fontWeight: 'bold' }, // purple-900
  
  totalsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsBox: {
    width: 210,
    backgroundColor: '#F8FAFC', // slate-50
    borderWidth: 2,
    borderColor: '#7C3AED', // purple-600
    borderRadius: 6,
    padding: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalLabel: { fontSize: 10, color: '#64748B' }, // slate-500
  totalValue: { fontSize: 10, textAlign: 'right', color: '#334155' }, // slate-700
  
  cashDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  cashDetailLabel: { fontSize: 9, color: '#7C3AED', fontStyle: 'italic' }, // purple-600
  cashDetailValue: { fontSize: 9, textAlign: 'right', color: '#6366F1' }, // indigo-500
  
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#7C3AED', // purple-600
    paddingTop: 6,
    marginTop: 6,
    marginBottom: 4,
    backgroundColor: '#F5F3FF', // purple-50
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  grandTotalLabel: { fontSize: 11, fontWeight: 'bold', color: '#581C87' }, // purple-900
  grandTotalValue: { fontSize: 11, fontWeight: 'bold', color: '#6366F1' }, // indigo-500
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0', // slate-200
    paddingTop: 12,
    fontSize: 8,
    color: '#94A3B8', // slate-400
    lineHeight: 1.4,
  },
  
  // Estilos adicionales para degradados visuales (simulados con bordes)
  headerAccent: {
    height: 4,
    backgroundColor: '#7C3AED', // Simula degradado purple-indigo
    marginBottom: 10,
    borderRadius: 2,
  }
});

export const BoletaPDF = ({ data }) => {
  const esEfectivo = data.metodoPago?.toLowerCase() === 'efectivo';
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Barra decorativa superior con acento morado */}
        <View style={styles.headerAccent} />
        
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>{data.nombreEmpresa || "Mi Negocio / Salon"}</Text>
            <Text style={styles.companyDetails}>RUC: {data.rucEmpresa || "10XXXXXXXXX"}</Text>
            <Text style={styles.companyDetails}>{data.direccionEmpresa || "Av. Principal 123, Lima"}</Text>
          </View>
          
          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Boleta de Venta</Text>
            <Text style={styles.receiptTitle}>Electrónica</Text>
            <Text style={styles.receiptNumber}>{data.nroComprobante || "B001-000001"}</Text>
            <Text style={styles.metaText}>Fecha: {data.fecha}</Text>
          </View>
        </View>

        {/* Datos del Cliente */}
        <Text style={styles.sectionTitle}>Datos del Cliente</Text>
        <View style={styles.clientBox}>
          <Text style={styles.clientText}>
            <Text style={{ color: '#7C3AED', fontWeight: 'bold' }}>Cliente: </Text>
            {data.nombreCliente}
          </Text>
          {data.documentoCliente && (
            <Text style={[styles.clientText, { marginTop: 3 }]}>
              <Text style={{ color: '#7C3AED', fontWeight: 'bold' }}>DNI/RUC: </Text>
              {data.documentoCliente}
            </Text>
          )}
        </View>

        {/* Tabla de Detalles */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Descripción / Concepto</Text>
          <Text style={styles.colCant}>Cant.</Text>
          <Text style={styles.colPrecio}>P. Unit</Text>
          <Text style={styles.colSubtotal}>Subtotal</Text>
        </View>

        {data.items?.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? { backgroundColor: '#FFFFFF' } : {}]}>
            <Text style={styles.colDesc}>{item.nombre}</Text>
            <Text style={styles.colCant}>{item.cantidad}</Text>
            <Text style={styles.colPrecio}>S/ {Number(item.precio_unitario || 0).toFixed(2)}</Text>
            <Text style={styles.colSubtotal}>S/ {Number(item.subtotal || 0).toFixed(2)}</Text>
          </View>
        ))}

        {/* Bloque de Totales */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal Neto:</Text>
              <Text style={styles.totalValue}>S/ {Number(data.subtotal || 0).toFixed(2)}</Text>
            </View>
            
            {data.descuento > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Descuento:</Text>
                <Text style={[styles.totalValue, { color: '#DC2626' }]}>- S/ {Number(data.descuento).toFixed(2)}</Text>
              </View>
            )}
            
            {data.comision > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Recargo Tarjeta:</Text>
                <Text style={[styles.totalValue, { color: '#7C3AED' }]}>S/ {Number(data.comision).toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Venta:</Text>
              <Text style={styles.grandTotalValue}>S/ {Number(data.totalFinal || 0).toFixed(2)}</Text>
            </View>

            <View style={[styles.totalRow, { marginTop: 4, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 4 }]}>
              <Text style={styles.totalLabel}>Método de Pago:</Text>
              <Text style={[styles.totalValue, { fontWeight: 'bold', color: '#581C87' }]}>
                {data.metodoPago?.toUpperCase() || 'EFECTIVO'}
              </Text>
            </View>

            {esEfectivo && data.montoRecibido !== undefined && data.montoRecibido > 0 && (
              <>
                <View style={styles.cashDetailRow}>
                  <Text style={styles.cashDetailLabel}>Monto Recibido:</Text>
                  <Text style={styles.cashDetailValue}>S/ {Number(data.montoRecibido).toFixed(2)}</Text>
                </View>
                <View style={styles.cashDetailRow}>
                  <Text style={styles.cashDetailLabel}>Vuelto:</Text>
                  <Text style={[styles.cashDetailValue, { fontWeight: 'bold', color: '#10B981' }]}>
                    S/ {Number(data.montoRecibido - data.totalFinal).toFixed(2)}
                  </Text>
                </View>
              </>
            )}

          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={{ color: '#581C87', fontWeight: 'bold' }}>
            Gracias por su preferencia. ¡Esperamos verte pronto!
          </Text>
          <Text style={{ marginTop: 2, fontSize: 7, color: '#CBD5E1' }}>
            Este es un comprobante de simulación interna o emisión electrónica.
          </Text>
        </View>
        
      </Page>
    </Document>
  );
};