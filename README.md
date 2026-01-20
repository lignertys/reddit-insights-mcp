# Reddit Insights MCP Server

[![npm version](https://badge.fury.io/js/reddit-insights-mcp.svg)](https://www.npmjs.com/package/reddit-insights-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP-Registry-blue)](https://registry.modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides AI-powered Reddit search and discovery capabilities. Search millions of Reddit posts with semantic AI, explore subreddits, and discover trending topics.

## Installation

```bash
npm install -g reddit-insights-mcp
```

Or run directly with npx:

```bash
npx reddit-insights-mcp
```

## Configuration

### Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "reddit-insights": {
      "command": "npx",
      "args": ["reddit-insights-mcp"],
      "env": {
        "REDDIT_INSIGHTS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REDDIT_INSIGHTS_API_KEY` | No | API key for premium features |

Get your API key at [reddit-insights.com](https://reddit-insights.com)

## Available Tools

### `reddit_search`

Search Reddit conversations using semantic AI search.

**Parameters:**
- `query` (string, required): Natural language search query
- `limit` (number, optional): Maximum results (1-100, default: 20)

**Example:**
```
Search for discussions about mechanical keyboards for programming
```

### `reddit_list_subreddits`

Get a paginated list of available subreddits.

**Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (1-100, default: 20)
- `search` (string, optional): Filter by name, title, or description

### `reddit_get_subreddit`

Get detailed information about a specific subreddit.

**Parameters:**
- `subreddit` (string, required): Subreddit name without r/ prefix

### `reddit_get_trends`

Get Reddit trend articles and insights.

**Parameters:**
- `page` (number, optional): Page number (default: 1)
- `perPage` (number, optional): Results per page (default: 12)
- `filter` (string, optional): Time period - "latest", "today", "week", "month"
- `category` (string, optional): Filter by category

## Usage Examples

**Research a topic:**
```
You: What are developers saying about React Server Components?
Claude: [Uses reddit_search] Found 45 results...
```

**Explore a community:**
```
You: Tell me about r/typescript
Claude: [Uses reddit_get_subreddit] r/typescript has 285,432 subscribers...
```

**Find trends:**
```
You: What's trending in tech this week?
Claude: [Uses reddit_get_trends] Top trending topics...
```

## Links

- [Website](https://reddit-insights.com)
- [GitHub](https://github.com/lignertys/reddit-insights-mcp)
- [npm](https://www.npmjs.com/package/reddit-insights-mcp)
- [MCP Registry](https://registry.modelcontextprotocol.io)

## License

MIT
