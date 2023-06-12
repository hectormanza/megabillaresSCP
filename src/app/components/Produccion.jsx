import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const Produccion = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const ventasCollection = collection(db, 'ventas');
        const ventasSnapshot = await getDocs(ventasCollection);
        const ventasData = ventasSnapshot.docs.map((doc) => ({
          id: doc.id,
          modelo: doc.data().modelo,
          cliente: doc.data().cliente,
          pasos: doc.data().pasos
        }));
        setVentas(ventasData);
      } catch (error) {
        console.error('Error fetching ventas: ', error);
        // Mostrar un mensaje de error al usuario si es necesario
      }
    };

    fetchVentas();
  }, []);

  const obtenerVentaIndex = (ventaId) => {
    return ventas.findIndex((venta) => venta.id === ventaId);
  };

  const handleActualizarEstadoPaso = async (ventaId, pasoIndex, nuevoEstado) => {
    try {
      const ventaRef = doc(db, 'ventas', ventaId);

      await updateDoc(ventaRef, {
        [`pasos.${pasoIndex}.estado`]: nuevoEstado
      });

      setVentas((prevVentas) => {
        const ventasActualizadas = [...prevVentas];
        const ventaIndex = obtenerVentaIndex(ventaId);
        ventasActualizadas[ventaIndex].pasos[pasoIndex].estado = nuevoEstado;
        return ventasActualizadas;
      });
    } catch (error) {
      console.error('Error actualizando estado del paso: ', error);
      // Mostrar un mensaje de error al usuario si es necesario
    }
  };

  return (
    <div>
      <h2>Proceso de producción</h2>
      {ventas.map((venta) => (
        <div key={venta.id}>
          <h3>Venta: {venta.modelo} - {venta.cliente}</h3>
          {Array.isArray(venta.pasos) && venta.pasos.length > 0 ? (
            venta.pasos.map((paso, index) => (
              <div key={index}>
                <button
                  onClick={() =>
                    handleActualizarEstadoPaso(venta.id, index, paso.estado === 'Completado' ? 'Pendiente' : 'Completado')
                  }
                >
                  {paso.nombre} - {paso.estado === 'Completado' ? 'Completado' : 'Pendiente'}
                </button>
              </div>
            ))
          ) : (
            <div>No hay pasos disponibles para esta venta.</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Produccion;
