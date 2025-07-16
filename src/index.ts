import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getUserByCUIL } from "./middlewares/userByCUIL";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	async init() {

		// User by CUIL tool
		this.server.tool(
			"userByCUIL",
			{
				pCUIT: z.string().describe("CUIT del cliente a consultar"),
			},
			async ({ pCUIT }, context) => {
				try {
					console.log('🔍 [userByCUIL] Iniciando llamada a la herramienta');
					console.log('🔍 [userByCUIL] pCUIT recibido:', pCUIT);
					console.log('🔍 [userByCUIL] Contexto completo:', JSON.stringify(context, null, 2));
					
					// Extraer headers de autenticación del contexto
					const contextProps = (this as any).props;
					console.log('🔍 [userByCUIL] Context props:', JSON.stringify(contextProps, null, 2));
					
					const headers = {
						'user': contextProps.user || '',
						'password': contextProps.password || ''
					};
					
					console.log('🔍 [userByCUIL] Headers extraídos:', JSON.stringify(headers, null, 2));

					// Validar que se proporcionen las credenciales
					if (!headers['user'] || !headers['password']) {
						console.log('❌ [userByCUIL] Error: Headers de autenticación faltantes');
						console.log('❌ [userByCUIL] user presente:', !!headers['user']);
						console.log('❌ [userByCUIL] password presente:', !!headers['password']);
						
						return {
							content: [
								{
									type: "text",
									text: `Error: Se requieren los headers user y password para la autenticación. 
 									Headers recibidos: ${JSON.stringify(headers, null, 2)}
									Context props: ${JSON.stringify(contextProps, null, 2)}`,
								},
							],
						};
					}

					console.log('✅ [userByCUIL] Headers válidos, llamando a getUserByCUIL...');
					const resultado = await getUserByCUIL(pCUIT, headers);

					console.log('✅ [userByCUIL] Resultado obtenido:', JSON.stringify(resultado, null, 2));
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(resultado, null, 2),
							},
						],
					};
				} catch (error) {
					console.error('💥 [userByCUIL] Error completo:', error);
					console.error('💥 [userByCUIL] Stack trace:', (error as Error).stack);
					
					return {
						content: [
							{
								type: "text",
								text: `Error al consultar cliente por CUIL: ${(error as Error).message || error}
Stack: ${(error as Error).stack || 'No disponible'}
pCUIT: ${pCUIT}
Context: ${JSON.stringify(context, null, 2)}`,
							},
						],
					};
				}
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {

		const url = new URL(request.url)

		// Extraer headers de autenticación
		const laburenUser = request.headers.get("user");
		const laburenPassword = request.headers.get("password");

	//	if (!laburenUser || !laburenPassword) {
//			return new Response("Faltan headers de autenticación pa", { status: 401 });
//		}
		
		// --- Inyectamos los headers de autenticación en las `props` del ExecutionContext ---
		const context: ExecutionContext = Object.assign(Object.create(ctx), ctx, {
			props: {
				...(ctx as any).props,
				user: laburenUser || "AgenteAI",
				password: laburenPassword || "Cargo2024-",
			},
		});
		
		console.log('🔍 [fetch] Context props configuradas:', JSON.stringify((context as any).props, null, 2));
		
		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			console.log('🔄 [fetch] Redirigiendo a SSE');
			return MyMCP.serveSSE("/sse").fetch(request, env, context);
		}

		if (url.pathname === "/mcp") {
			console.log('🔄 [fetch] Redirigiendo a MCP');
			return MyMCP.serve("/mcp").fetch(request, env, context);
		}

		console.log('❌ [fetch] Ruta no encontrada:', url.pathname);
		return new Response("Not found", { status: 404 });
	},
};
