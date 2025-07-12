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
		// Simple addition tool
		this.server.tool(
			"add",
			{ a: z.number(), b: z.number() },
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }],
			})
		);

		// Calculator tool with multiple operations
		this.server.tool(
			"calculate",
			{
				operation: z.enum(["add", "subtract", "multiply", "divide"]),
				a: z.number(),
				b: z.number(),
			},
			async ({ operation, a, b }) => {
				let result: number;
				switch (operation) {
					case "add":
						result = a + b;
						break;
					case "subtract":
						result = a - b;
						break;
					case "multiply":
						result = a * b;
						break;
					case "divide":
						if (b === 0)
							return {
								content: [
									{
										type: "text",
										text: "Error: Cannot divide by zero",
									},
								],
							};
						result = a / b;
						break;
				}
				return { content: [{ type: "text", text: String(result) }] };
			}
		);

		// User by CUIL tool
		this.server.tool(
			"userByCUIL",
			{
				pCUIT: z.string().describe("CUIT del cliente a consultar"),
			},
			async ({ pCUIT }, context) => {
				try {
					// Extraer headers de autenticación del contexto
					const headers = {
						'Laburen-User': (context as any)?.props?.laburen_user || '',
						'Laburen-Password': (context as any)?.props?.laburen_password || ''
					};

					// Validar que se proporcionen las credenciales
					if (!headers['Laburen-User'] || !headers['Laburen-Password']) {
						return {
							content: [
								{
									type: "text",
									text: "Error: Se requieren los headers Laburen-User y Laburen-Password para la autenticación",
								},
							],
						};
					}

					const resultado = await getUserByCUIL(pCUIT, headers);
					
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(resultado, null, 2),
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error al consultar cliente por CUIL: ${error}`,
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
		console.log('env', env);
		const url = new URL(request.url);

		// --- Inyectamos los headers de autenticación en las `props` del ExecutionContext ---
		const context: ExecutionContext = Object.assign(Object.create(ctx), ctx, {
			props: {
				...(ctx as any).props,
				laburen_user: request.headers.get("Laburen-User"),
				laburen_password: request.headers.get("Laburen-Password"),
			},
		});
		console.log('context', context);
		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, context);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, context);
		}

		return new Response("Not found", { status: 404 });
	},
};
