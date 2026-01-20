# Reddit Insights MCP Server

A Model Context Protocol (MCP) server that provides AI-powered Reddit search and discovery capabilities.

## Installation

```bash
npm install -g reddit-insights-mcp
```

Or run directly with npx:

```bash
npx reddit-insights-mcp
```

## Configuration

### Environment Variables

Create a `.env` file in your working directory:

```bash
# API Key for premium features (optional)
REDDIT_INSIGHTS_API_KEY=your_api_key_here
```

### Claude Desktop Configuration

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

## Available Tools

### `reddit_search`

Search Reddit conversations using semantic AI search.

**Parameters:**
- `query` (string, required): Natural language search query
- `limit` (number, optional): Maximum results (1-100, default: 20)

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

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT
