# 🔍 Verificación para Producción - userByCUIL

## 📋 Problemas comunes y verificaciones

### 1️⃣ **Verificar que los headers lleguen correctamente**

**Síntoma**: Error "Se requieren los headers Laburen-User y Laburen-Password"

**Verificaciones**:
- ✅ Los headers se envían con el nombre exacto: `Laburen-User` y `Laburen-Password`
- ✅ Los headers no están vacíos
- ✅ Los headers no tienen espacios extra
- ✅ El cliente envía los headers correctamente

**Logs a revisar**:
```
🔍 [fetch] Laburen-User extraído: PRESENTE/AUSENTE
🔍 [fetch] Laburen-Password extraído: PRESENTE/AUSENTE
🔍 [fetch] Headers recibidos: {...}
```

### 2️⃣ **Verificar que el pCUIT llegue correctamente**

**Síntoma**: Error en la función SOAP o respuesta vacía

**Verificaciones**:
- ✅ El pCUIT se envía como string
- ✅ El pCUIT tiene el formato correcto (11 dígitos)
- ✅ El pCUIT no está vacío

**Logs a revisar**:
```
🔍 [userByCUIL] pCUIT recibido: 30717863387
```

### 3️⃣ **Verificar la conexión SOAP**

**Síntoma**: Error de conexión o timeout

**Verificaciones**:
- ✅ El endpoint `https://grupocargo.sytes.net/sigews.asmx` es accesible
- ✅ Las credenciales SOAP son correctas
- ✅ No hay problemas de red/firewall

### 4️⃣ **Verificar el formato JSON-RPC**

**Síntoma**: Error "Invalid JSON-RPC message"

**Formato correcto**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "userByCUIL",
    "arguments": {
      "pCUIT": "30717863387"
    }
  }
}
```

**Headers requeridos**:
```
Laburen-User: AgenteAI
Laburen-Password: Cargo2024-
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: test-session-123
```

## 🧪 Scripts de prueba

### **Prueba local del middleware:**
```bash
node test-simple-hardcoded.js
```

### **Simulación de llamada MCP:**
```bash
node test-mcp-simulation.js
```

### **Prueba con el servidor MCP:**
```bash
npm run dev
# Luego usar cURL o Postman con el formato JSON-RPC
```

## 📝 Logs detallados agregados

He agregado logging detallado que te mostrará:

1. **En el fetch handler**:
   - Todos los headers recibidos
   - Estado de los headers de autenticación
   - Configuración del contexto

2. **En la herramienta userByCUIL**:
   - pCUIT recibido
   - Contexto completo
   - Headers extraídos
   - Estado de la validación
   - Resultado obtenido
   - Errores detallados con stack trace

## 🔧 Comandos para diagnosticar

### **Verificar logs en producción:**
```bash
# Buscar logs específicos
grep "userByCUIL" logs.txt
grep "fetch" logs.txt
grep "Error" logs.txt
```

### **Probar conectividad SOAP:**
```bash
curl --location 'https://grupocargo.sytes.net/sigews.asmx' \
--header 'Content-Type: text/xml' \
--data '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                         xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                         xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
              <AI_ExisteCliente xmlns="http://grupocargo.sytes.net/">
                <usuario>AgenteAI</usuario>
                <contrasena>Cargo2024-</contrasena>
                <pCUIT>30717863387</pCUIT>
              </AI_ExisteCliente>
            </soap:Body>
          </soap:Envelope>'
```

## 🎯 Pasos de diagnóstico

1. **Ejecuta los scripts de prueba locales** para verificar que el middleware funciona
2. **Revisa los logs detallados** en producción para identificar dónde falla
3. **Verifica el formato de la petición** JSON-RPC
4. **Confirma que los headers** se envían correctamente
5. **Prueba la conectividad SOAP** directamente

## 📞 Información para debugging

Cuando reportes el error, incluye:

- ✅ Logs completos del servidor
- ✅ Formato exacto de la petición enviada
- ✅ Headers enviados
- ✅ Respuesta de error recibida
- ✅ Stack trace completo si está disponible 