import { getUserByCUIL } from './userByCUIL';

// Ejemplo de uso del middleware con headers
async function ejemploUso() {
  try {
    // Headers de autenticación
    const headers = {
      'Laburen-User': 'AgenteAI',
      'Laburen-Password': 'Cargo2024-'
    };

    const resultado = await getUserByCUIL(
      '30717863387',  // pCUIT
      headers         // headers de autenticación
    );

    console.log('Resultado:', JSON.stringify(resultado, null, 2));
    
    // El resultado será un array de objetos con esta estructura:
    // [
    //   {
    //     "domicilio": "AV. OHIGGINS 4600",
    //     "localidad": "CORDOBA"
    //   },
    //   {
    //     "domicilio": "AV. O'HIGGINS 4606",
    //     "localidad": "CORDOBA"
    //   },
    //   {
    //     "domicilio": "TANINGA 2882",
    //     "localidad": "CORDOBA"
    //   }
    // ]

  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejemplo de uso en un contexto de request HTTP
async function ejemploConRequest(request: Request) {
  try {
    // Extraer headers de la request
    const headers = {
      'Laburen-User': request.headers.get('Laburen-User') || '',
      'Laburen-Password': request.headers.get('Laburen-Password') || ''
    };

    // Extraer pCUIT del body (asumiendo que es JSON)
    const body = await request.json() as { pCUIT: string };
    const { pCUIT } = body;

    const resultado = await getUserByCUIL(pCUIT, headers);
    return resultado;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Ejecutar el ejemplo
// ejemploUso(); 