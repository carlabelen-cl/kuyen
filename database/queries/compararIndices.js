
const path = require('path');

require('../../backend/node_modules/dotenv').config({
  path: path.join(__dirname, '../../backend/.env'),
});

const mongoose = require('../../backend/node_modules/mongoose');

const ejecutarComparacion = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a MongoDB Atlas');

    const coleccion = mongoose.connection.collection('symptoms');

    const filtro = {
      categoriaId: 'dolor',
      activo: true,
    };

    // 1. Consulta utilizando el índice disponible.
    const conIndice = await coleccion
      .find(filtro)
      .explain('executionStats');

    // 2. Consulta forzando un recorrido completo.
    const sinIndice = await coleccion
      .find(filtro)
      .hint({ $natural: 1 })
      .explain('executionStats');

    // Buscar la etapa principal del plan de ejecución.
    const buscarEtapa = (plan, etapaBuscada) => {
      if (!plan || typeof plan !== 'object') return null;

      if (plan.stage === etapaBuscada) return plan;

      for (const valor of Object.values(plan)) {
        if (Array.isArray(valor)) {
          for (const elemento of valor) {
            const resultado = buscarEtapa(elemento, etapaBuscada);
            if (resultado) return resultado;
          }
        } else if (valor && typeof valor === 'object') {
          const resultado = buscarEtapa(valor, etapaBuscada);
          if (resultado) return resultado;
        }
      }

      return null;
    };

    const mostrarResultados = (titulo, resultado, tipo) => {
      const plan = resultado.queryPlanner.winningPlan;

      const etapa =
        buscarEtapa(plan, tipo)?.stage || 'No identificada';

      const indice = buscarEtapa(plan, 'IXSCAN')?.indexName || 'Ninguno';

      console.log(`\n--- ${titulo} ---`);
      console.log('Etapa de ejecución:', etapa);
      console.log('Índice utilizado:', indice);
      console.log('Documentos devueltos:', resultado.executionStats.nReturned);
      console.log('Claves examinadas:', resultado.executionStats.totalKeysExamined);
      console.log('Documentos examinados:', resultado.executionStats.totalDocsExamined);
      console.log('Tiempo (ms):', resultado.executionStats.executionTimeMillis);
    };

    mostrarResultados('CONSULTA CON ÍNDICE', conIndice, 'IXSCAN');
    mostrarResultados('CONSULTA SIN ÍNDICE', sinIndice, 'COLLSCAN');

  } catch (error) {
    console.error('Error al comparar índices:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

ejecutarComparacion();
