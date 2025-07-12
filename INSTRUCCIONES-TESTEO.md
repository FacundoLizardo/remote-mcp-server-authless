# 🧪 Instrucciones para Testear userByCUIL

## 📋 Pasos para testear

### 1️⃣ **Iniciar el servidor**
```bash
npm run dev
```
Esto iniciará el servidor en `http://localhost:8787`

### 2️⃣ **Opción A: Usar el script de prueba automático**
```bash
node test-simple.js
```

### 3️⃣ **Opción B: Usar cURL manualmente**
```bash
curl --location 'http://localhost:8787/mcp' \
--header 'Laburen-User: AgenteAI' \
--header 'Laburen-Password: Cargo2024-' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json, text/event-stream' \
--header 'Mcp-Session-Id: test-session-123' \
--data '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "userByCUIL",
    "arguments": {
      "pCUIT": "30717863387"
    }
  }
}'
```

### 4️⃣ **Opción C: Usar PowerShell**
```powershell
Invoke-RestMethod -Uri 'http://localhost:8787/mcp' `
-Method POST `
-Headers @{
  'Laburen-User' = 'AgenteAI'
  'Laburen-Password' = 'Cargo2024-'
  'Content-Type' = 'application/json'
  'Accept' = 'application/json, text/event-stream'
  'Mcp-Session-Id' = 'test-session-123'
} `
-Body '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "userByCUIL",
    "arguments": {
      "pCUIT": "30717863387"
    }
  }
}'
```

### 5️⃣ **Opción D: Usar Postman**
- **URL**: `http://localhost:8787/mcp`
- **Method**: `POST`
- **Headers**:
  - `Laburen-User`: `AgenteAI`
  - `Laburen-Password`: `Cargo2024-`
  - `Content-Type`: `application/json`
  - `Accept`: `application/json, text/event-stream` ⭐ **IMPORTANTE**
  - `Mcp-Session-Id`: `test-session-123` ⭐ **IMPORTANTE**
- **Body** (raw JSON):
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

## 🎯 **Respuesta esperada**

Si todo funciona correctamente, deberías recibir algo como:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "[\n  {\n    \"domicilio\": \"AV. OHIGGINS 4600\",\n    \"localidad\": \"CORDOBA\"\n  },\n  {\n    \"domicilio\": \"AV. O'HIGGINS 4606\",\n    \"localidad\": \"CORDOBA\"\n  },\n  {\n    \"domicilio\": \"TANINGA 2882\",\n    \"localidad\": \"CORDOBA\"\n  }\n]"
      }
    ]
  }
}
```

## 🔍 **Troubleshooting**

### ❌ **Error: "Connection refused"**
- Asegúrate de que el servidor esté corriendo con `npm run dev`
- Verifica que el puerto 8787 esté disponible

### ❌ **Error: "406 Not Acceptable"**
- **SOLUCIÓN**: Agrega el header `Accept: application/json, text/event-stream`
- Este header es requerido por el protocolo MCP

### ❌ **Error: "400 Bad Request - Mcp-Session-Id header is required"**
- **SOLUCIÓN**: Agrega el header `Mcp-Session-Id: test-session-123`
- Este header es requerido por el protocolo MCP para manejar sesiones

### ❌ **Error: "400 Bad Request - Parse error: Invalid JSON-RPC message"**
- **SOLUCIÓN**: Usa el formato JSON-RPC correcto con `jsonrpc`, `id`, `method` y `params`
- El protocolo MCP requiere este formato específico

### ❌ **Error: "Unauthorized"**
- Verifica que los headers `Laburen-User` y `Laburen-Password` estén correctos
- Asegúrate de que las credenciales sean válidas para el servicio SOAP

### ❌ **Error: "Not found"**
- Verifica que estés usando la URL correcta: `http://localhost:8787/mcp`
- Asegúrate de que el método sea `POST`

### ❌ **Error de parsing XML**
- Verifica que el CUIT sea válido
- Revisa la conectividad con el servicio SOAP

## 🚀 **Pruebas adicionales**

### **Probar con diferentes CUITs:**
```bash
# Cambia el pCUIT en el body
"pCUIT": "20123456789"
"pCUIT": "30123456789"
```

### **Probar sin headers de autenticación:**
Debería devolver un error indicando que faltan las credenciales.

### **Probar con credenciales incorrectas:**
Debería devolver un error del servicio SOAP.

## 📝 **Logs del servidor**

Mientras el servidor esté corriendo, verás logs en la consola que te ayudarán a debuggear:
- Conexiones entrantes
- Headers recibidos
- Errores de autenticación
- Errores de parsing

## ✅ **Verificación exitosa**

Si ves la respuesta JSON-RPC con el contenido de las direcciones del cliente, ¡el middleware está funcionando correctamente!

## ⚠️ **Notas importantes**

1. **Header Accept**: El protocolo MCP requiere que el cliente acepte tanto `application/json` como `text/event-stream`
2. **Header Mcp-Session-Id**: El protocolo MCP requiere este header para manejar sesiones
3. **Formato JSON-RPC**: El protocolo MCP usa JSON-RPC 2.0, que requiere campos específicos como `jsonrpc`, `id`, `method` y `params`
4. **Método tools/call**: Para llamar herramientas en MCP, se usa el método `tools/call` con el nombre de la herramienta en `params.name` 