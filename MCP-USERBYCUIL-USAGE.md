# Uso de userByCUIL en MCP

## Configuración

La herramienta `userByCUIL` está disponible en el MCP y requiere autenticación a través de headers HTTP.

## Headers requeridos

Para usar la herramienta, debes incluir los siguientes headers en tu petición:

```
Laburen-User: tu-usuario-soap
Laburen-Password: tu-contraseña-soap
```

## Uso de la herramienta

### Parámetros

- `pCUIT` (string): El CUIT del cliente que deseas consultar

### Ejemplo de uso

```json
{
  "tool": "userByCUIL",
  "params": {
    "pCUIT": "30717863387"
  }
}
```

### Respuesta esperada

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

## Endpoints disponibles

- **SSE**: `/sse` o `/sse/message`
- **MCP**: `/mcp`

## Ejemplo de petición cURL

```bash
curl --location 'http://localhost:8787/mcp' \
--header 'Laburen-User: AgenteAI' \
--header 'Laburen-Password: Cargo2024-' \
--header 'Content-Type: application/json' \
--data '{
  "tool": "userByCUIL",
  "params": {
    "pCUIT": "30717863387"
  }
}'
```

## Manejo de errores

La herramienta devolverá mensajes de error descriptivos para:

- Headers de autenticación faltantes
- Errores de conexión con el servicio SOAP
- Errores de parsing XML
- CUITs inválidos o no encontrados

## Notas importantes

1. **Seguridad**: Las credenciales se manejan de forma segura a través de headers HTTP
2. **Validación**: Se valida que todos los headers requeridos estén presentes
3. **Respuesta**: La respuesta se devuelve en formato JSON con las direcciones del cliente
4. **Múltiples direcciones**: Un cliente puede tener múltiples direcciones asociadas
5. **Uso interno**: Sistema diseñado para uso interno sin necesidad de API key adicional 