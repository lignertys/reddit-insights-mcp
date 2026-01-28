#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_BASE_URL = "https://reddit-insights.com";
const API_KEY = process.env.REDDIT_INSIGHTS_API_KEY || "";

// Tool definitions
const tools = [
  {
    name: "reddit_search",
    description: "Search Reddit conversations using semantic AI search. Find relevant discussions, opinions, and insights from millions of Reddit posts.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Natural language search query (e.g., 'best programming languages for beginners')",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (1-100, default: 20)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "reddit_list_subreddits",
    description: "Get a paginated list of available subreddits with their information.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        limit: {
          type: "number",
          description: "Results per page (1-100, default: 20)",
        },
        search: {
          type: "string",
          description: "Filter subreddits by name, title, or description",
        },
      },
    },
  },
  {
    name: "reddit_get_subreddit",
    description: "Get detailed information about a specific subreddit including recent posts.",
    inputSchema: {
      type: "object" as const,
      properties: {
        subreddit: {
          type: "string",
          description: "Subreddit name without r/ prefix (e.g., 'programming', 'webdev')",
        },
      },
      required: ["subreddit"],
    },
  },
  {
    name: "reddit_get_trends",
    description: "Get Reddit trend articles and insights about what's trending.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        perPage: {
          type: "number",
          description: "Results per page (default: 12)",
        },
        filter: {
          type: "string",
          description: "Time period filter: 'latest', 'today', 'week', 'month'",
        },
        category: {
          type: "string",
          description: "Filter by category",
        },
      },
    },
  },
];

// API request helper
async function apiRequest(
  endpoint: string, 
  options: { 
    method?: "GET" | "POST"; 
    params?: Record<string, any>; 
    body?: Record<string, any>;
  } = {}
) {
  const { method = "GET", params = {}, body } = options;
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  // Add query parameters for GET requests
  if (method === "GET") {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "reddit-insights-mcp/0.1.1",
  };

  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (method === "POST" && body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Tool handlers
async function handleRedditSearch(args: { query: string; limit?: number }) {
  const { query, limit = 20 } = args;

  try {
    const result = await apiRequest("/api/v1/search/semantic", {
      method: "POST",
      body: {
        query,
        limit,
      },
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error searching Reddit: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
}

async function handleListSubreddits(args: { page?: number; limit?: number; search?: string }) {
  const { page = 1, limit = 20, search } = args;

  try {
    const result = await apiRequest("/api/v1/subreddits", {
      method: "GET",
      params: {
        page,
        limit,
        search,
      },
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error listing subreddits: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
}

async function handleGetSubreddit(args: { subreddit: string }) {
  const { subreddit } = args;

  try {
    const result = await apiRequest(`/api/v1/subreddits/${subreddit}`, {
      method: "GET",
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error getting subreddit: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
}

async function handleGetTrends(args: { page?: number; perPage?: number; filter?: string; category?: string }) {
  const { page = 1, perPage = 12, filter, category } = args;

  try {
    const result = await apiRequest("/api/v1/trends", {
      method: "POST",
      body: {
        page,
        per_page: perPage,
        filter,
        category,
      },
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error getting trends: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
}

// Main server setup
async function main() {
  const server = new Server(
    {
      name: "reddit-insights-mcp",
      version: "0.1.2",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "reddit_search":
        return handleRedditSearch(args as { query: string; limit?: number });

      case "reddit_list_subreddits":
        return handleListSubreddits(args as { page?: number; limit?: number; search?: string });

      case "reddit_get_subreddit":
        return handleGetSubreddit(args as { subreddit: string });

      case "reddit_get_trends":
        return handleGetTrends(args as { page?: number; perPage?: number; filter?: string; category?: string });

      default:
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Reddit Insights MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
