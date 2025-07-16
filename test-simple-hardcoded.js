import { parseString } from 'xml2js';


export async function userByCUILtest (params, headers) 
{
  const { pCUIT } = params;
  const { 'Laburen-User': usuario, 'Laburen-Password': contrasena } = headers;

  // Validar que se proporcionen las credenciales
  if (!usuario || !contrasena) {
    throw new Error('Se requieren los headers Laburen-User y Laburen-Password');
  }

  // Construir el XML SOAP
  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <AI_ExisteCliente xmlns="http://grupocargo.sytes.net/">
          <usuario>${usuario}</usuario>
          <contrasena>${contrasena}</contrasena>
          <pCUIT>${pCUIT}</pCUIT>
        </AI_ExisteCliente>
      </soap:Body>
    </soap:Envelope>`;

  try {
    // Hacer la petición SOAP
    const response = await fetch('https://grupocargo.sytes.net/sigews.asmx', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://grupocargo.sytes.net/AI_ExisteCliente'
      },
      body: soapEnvelope
    });

    if (!response.ok) {
      throw new Error(`Error en la petición HTTP: ${response.status} ${response.statusText}`);
    }

    const xmlResponse = await response.text();

    // Parsear la respuesta XML
    return new Promise((resolve, reject) => {
      parseString(xmlResponse, (err, result) => {
        if (err) {
          reject(new Error(`Error al parsear XML: ${err.message}`));
          return;
        }

        try {
          // Extraer los datos de la respuesta SOAP
          const soapBody = result['soap:Envelope']['soap:Body'][0];
          const existeClienteResponse = soapBody['AI_ExisteClienteResponse'][0];
          const existeClienteResult = existeClienteResponse['AI_ExisteClienteResult'][0];
          
          // Buscar los datos en el diffgram
          const diffgram = existeClienteResult['diffgr:diffgram'][0];
          const newDataSet = diffgram['NewDataSet'][0];
          const tables = newDataSet['Table'] || [];

          // Convertir a formato JSON
          const addressData = tables.map((table) => ({
            domicilio: table.domicilio?.[0] || '',
            localidad: table.localidad?.[0] || ''
          }));

          resolve(addressData);
        } catch (parseError) {
          reject(new Error(`Error al extraer datos de la respuesta: ${parseError}`));
        }
      });
    });

  } catch (error) {
    throw new Error(`Error en userByCUIL: ${error}`);
  }
}

try {
  const response = await userByCUILtest({ pCUIT: "30717863387" }, { 'Laburen-User': "AgenteAI", 'Laburen-Password': "Cargo2024-" });
  console.log(response);
} catch (error) {
  console.error('❌ Error:', error.message);
}


/*
async function testUserByCUILHardcoded() {


  console.log('🧪 Probando userByCUIL con valores harcodeados...\n');
  
  const pCUIT = "30717863387";
  const usuario = "AgenteAI";
  const contrasena = "Cargo2024-";

  // Construir el XML SOAP
  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <AI_ExisteCliente xmlns="http://grupocargo.sytes.net/">
      <usuario>${usuario}</usuario>
      <contrasena>${contrasena}</contrasena>
      <pCUIT>${pCUIT}</pCUIT>
    </AI_ExisteCliente>
  </soap:Body>
</soap:Envelope>`;

  try {
    console.log('📡 Enviando petición SOAP...');
    
    // Hacer la petición SOAP
    const response = await fetch('https://grupocargo.sytes.net/sigews.asmx', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://grupocargo.sytes.net/AI_ExisteCliente'
      },
      body: soapEnvelope
    });

    if (!response.ok) {
      throw new Error(`Error en la petición HTTP: ${response.status} ${response.statusText}`);
    }

    const xmlResponse = await response.text();
    console.log('📥 Respuesta XML recibida, parseando...');

    // Parsear la respuesta XML
    return new Promise((resolve, reject) => {
      parseString(xmlResponse, (err, result) => {
        if (err) {
          reject(new Error(`Error al parsear XML: ${err.message}`));
          return;
        }

        try {
          // Extraer los datos de la respuesta SOAP
          const soapBody = result['soap:Envelope']['soap:Body'][0];
          const existeClienteResponse = soapBody['AI_ExisteClienteResponse'][0];
          const existeClienteResult = existeClienteResponse['AI_ExisteClienteResult'][0];
          
          // Buscar los datos en el diffgram
          const diffgram = existeClienteResult['diffgr:diffgram'][0];
          const newDataSet = diffgram['NewDataSet'][0];
          const tables = newDataSet['Table'] || [];

          // Convertir a formato JSON
          const addressData = tables.map((table) => ({
            domicilio: table.domicilio?.[0] || '',
            localidad: table.localidad?.[0] || ''
          }));

          console.log('✅ Resultado exitoso:');
          console.log(JSON.stringify(addressData, null, 2));
          resolve(addressData);
        } catch (parseError) {
          reject(new Error(`Error al extraer datos de la respuesta: ${parseError}`));
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}


// Ejecutar la prueba
testUserByCUILHardcoded()
  .then(() => {
    console.log('\n🎯 Prueba completada exitosamente!');
  })
  .catch((error) => {
    console.log('\n💥 La prueba falló:', error.message);
  }); 
*/