// Script para simular exactamente cómo se llama desde el MCP
// Ejecutar con: node test-mcp-simulation.js

const { getUserByCUIL } = require('./src/middlewares/userByCUIL.ts');

async function simulateMCPCall() {
  console.log('🧪 Simulando llamada desde MCP...\n');
  
  // Simular los parámetros que llegan desde el MCP
  const pCUIT = "30717863387";
  const headers = {
    'Laburen-User': 'AgenteAI',
    'Laburen-Password': 'Cargo2024-'
  };

  console.log('📋 Parámetros simulados:');
  console.log('pCUIT:', pCUIT);
  console.log('headers:', JSON.stringify(headers, null, 2));
  console.log('');

  try {
    console.log('🔍 Llamando a getUserByCUIL...');
    const resultado = await getUserByCUIL(pCUIT, headers);
    
    console.log('✅ Resultado exitoso:');
    console.log(JSON.stringify(resultado, null, 2));
    
    return resultado;
  } catch (error) {
    console.error('❌ Error en la simulación:', error);
    throw error;
  }
}

// Función para probar con diferentes valores
async function testMultipleValues() {
  console.log('\n🧪 Probando con diferentes valores...\n');
  
  const testCases = [
    {
      pCUIT: "30717863387",
      headers: {
        'Laburen-User': 'AgenteAI',
        'Laburen-Password': 'Cargo2024-'
      }
    },
    {
      pCUIT: "20123456789",
      headers: {
        'Laburen-User': 'AgenteAI',
        'Laburen-Password': 'Cargo2024-'
      }
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n--- Prueba ${i + 1} ---`);
    console.log('pCUIT:', testCase.pCUIT);
    
    try {
      const resultado = await getUserByCUIL(testCase.pCUIT, testCase.headers);
      console.log('✅ Éxito:', JSON.stringify(resultado, null, 2));
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

// Ejecutar las pruebas
async function main() {
  try {
    await simulateMCPCall();
    await testMultipleValues();
    console.log('\n🎯 Todas las pruebas completadas!');
  } catch (error) {
    console.log('\n💥 Error en las pruebas:', error.message);
  }
}

main(); 