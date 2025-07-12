# Middleware userByCUIL

Este middleware permite consultar información de clientes a través del servicio SOAP de Grupo Cargo.

## Funcionalidad

El middleware `userByCUIL` realiza una petición SOAP al endpoint `https://grupocargo.sytes.net/sigews.asmx` para consultar si existe un cliente con un CUIT específico y devuelve sus direcciones asociadas.

## Uso

### Importar el middleware

```typescript
import { getUserByCUIL } from './userByCUIL';
```

### Llamar la función

```typescript
// Headers de autenticación
const headers = {
  'Laburen-User': 'usuario',      // string - Usuario para autenticación
  'Laburen-Password': 'contraseña' // string - Contraseña para autenticación
};

const resultado = await getUserByCUIL(
  '12345678901',  // string - CUIT del cliente a consultar
  headers         // object - Headers de autenticación
);
```

### Uso en contexto HTTP

```typescript
async function handleRequest(request: Request) {
  // Extraer headers de la request
  const headers = {
    'Laburen-User': request.headers.get('Laburen-User') || '',
    'Laburen-Password': request.headers.get('Laburen-Password') || ''
  };

  // Extraer pCUIT del body
  const body = await request.json() as { pCUIT: string };
  const { pCUIT } = body;

  const resultado = await getUserByCUIL(pCUIT, headers);
  return resultado;
}
```

### Estructura de respuesta

La función devuelve un array de objetos con la siguiente estructura:

```typescript
interface AddressData {
  domicilio: string;
  localidad: string;
}
```

### Ejemplo de respuesta

```json
[
  {
    "domicilio": "AV. OHIGGINS 4600",
    "localidad": "CORDOBA"
  },
  {
    "domicilio": "AV. O'HIGGINS 4606",
    "localidad": "CORDOBA"
  },
  {
    "domicilio": "TANINGA 2882",
    "localidad": "CORDOBA"
  }
]
```

## Headers requeridos

- `Laburen-User`: Usuario para autenticación con el servicio SOAP
- `Laburen-Password`: Contraseña para autenticación con el servicio SOAP

## Manejo de errores

El middleware incluye manejo de errores para:
- Headers de autenticación faltantes
- Errores de conexión HTTP
- Errores de parsing XML
- Errores en la estructura de la respuesta

Los errores se propagan con mensajes descriptivos para facilitar el debugging.

## Dependencias

- `xml2js`: Para parsear la respuesta XML del servicio SOAP
- `fetch`: Para realizar las peticiones HTTP (disponible globalmente en Node.js 18+)

## Notas

- El middleware utiliza el método `AI_ExisteCliente` del servicio SOAP
- La respuesta se parsea automáticamente de XML a JSON
- Si no hay direcciones asociadas, se devuelve un array vacío
- Las credenciales se manejan de forma segura a través de headers HTTP 