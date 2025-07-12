// Script para probar userByCUIL con valores harcodeados
// Ejecutar con: node test-hardcoded.js

const { testUserByCUILHardcoded } = require('./src/middlewares/userByCUIL.ts');

async function main() {
  console.log('🚀 Iniciando prueba de userByCUIL harcodeado...\n');
  
  try {
    const resultado = await testUserByCUILHardcoded();
    console.log('\n🎯 Prueba completada exitosamente!');
  } catch (error) {
    console.log('\n💥 La prueba falló:', error.message);
  }
}

main(); 