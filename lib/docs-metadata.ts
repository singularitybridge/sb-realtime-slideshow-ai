/**
 * Documentation Metadata
 *
 * Provides searchable metadata for each documentation section to enable
 * AI-powered search and navigation.
 */

export interface DocSection {
  id: string
  label: string
  description: string
  keywords: string[]
  content: string // Short summary for AI context
}

export const docsMetadata: DocSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Introduction to the project, quick start guide, key features, and technology stack',
    keywords: [
      'overview', 'introduction', 'what is', 'about', 'quick start', 'getting started',
      'features', 'key features', 'tech stack', 'technology', 'openai', 'realtime api',
      'webrtc', 'voice', 'slides', 'presentation', 'ai assistant', 'multilingual'
    ],
    content: 'Real-time AI slideshow application using OpenAI Realtime API with WebRTC. Features voice interaction, dynamic slides, multilingual support (English/Hebrew), responsive design, and state persistence.'
  },
  {
    id: 'architecture',
    label: 'Architecture',
    description: 'System architecture, project structure, component hierarchy, data flow, and state management patterns',
    keywords: [
      'architecture', 'structure', 'project structure', 'folders', 'organization',
      'components', 'hierarchy', 'data flow', 'state', 'zustand', 'how it works',
      'system design', 'flow', 'pattern', 'app router', 'next.js structure'
    ],
    content: 'Modern client-server architecture with Next.js App Router. Uses Zustand for state management with localStorage persistence. WebRTC for real-time communication. Component-based structure with layouts, hooks, and API routes.'
  },
  {
    id: 'claude-agents',
    label: 'Claude Agents',
    description: 'Claude Code agent architecture, agent hierarchy, and specialized sub-agents',
    keywords: [
      'claude', 'agents', 'ai', 'claude code', 'sub-agents', 'automation',
      'qa', 'testing', 'ui/ux', 'design', 'assets', 'workspace', 'hierarchy',
      'specialized', 'task', 'nextjs-qa-tester', 'ui-ux-guru', 'design-asset-generator'
    ],
    content: 'Hierarchical agent system with CLAUDE.md for global instructions and specialized sub-agents for QA testing, UI/UX design, asset generation, and workspace management.'
  },
  {
    id: 'components',
    label: 'Components',
    description: 'React component documentation including SecuritySlides, BroadcastButton, layouts, and UI components',
    keywords: [
      'components', 'react', 'ui', 'security slides', 'broadcast button', 'layout',
      'mobile', 'desktop', 'avatar', 'mute', 'status', 'slides', 'navigation',
      'responsive', 'broadcast', 'controls', 'button', 'display'
    ],
    content: 'Main components include SecuritySlides for presentations, BroadcastButton for session control, MobileLayout/DesktopLayout for responsive design, AvatarInfo, MuteButton, and StatusDisplay for UI feedback.'
  },
  {
    id: 'hooks',
    label: 'Hooks',
    description: 'Custom React hooks including useSlideStore, useLanguageStore, useWebRTC, and useIsMobile',
    keywords: [
      'hooks', 'custom hooks', 'react hooks', 'use', 'slide store', 'language',
      'webrtc', 'mobile', 'zustand', 'state management', 'persistence',
      'localStorage', 'detection', 'store', 'useSlideStore', 'useLanguageStore',
      'useWebRTC', 'useIsMobile', 'how hooks work', 'hook usage'
    ],
    content: 'Custom hooks for state management (useSlideStore for slides, useLanguageStore for i18n), WebRTC session management (useWebRTC), and mobile detection (useIsMobile).'
  },
  {
    id: 'api-routes',
    label: 'API Routes',
    description: 'Next.js API routes including session creation endpoint and AI tools configuration',
    keywords: [
      'api', 'routes', 'endpoints', 'session', 'openai', 'ephemeral token',
      'tools', 'function calling', 'backend', 'server', 'next.js api',
      '/api/session', 'realtime', 'authentication', 'configuration'
    ],
    content: 'POST /api/session endpoint creates OpenAI Realtime API sessions and returns ephemeral tokens for WebRTC authentication. Includes AI tools configuration for slide manipulation.'
  },
  {
    id: 'configuration',
    label: 'Configuration',
    description: 'Environment variables, OpenAI configuration, and site settings',
    keywords: [
      'configuration', 'config', 'environment', 'env', 'variables', 'openai',
      'api key', 'settings', 'setup', 'system prompt', 'voice', 'model',
      'instructions', '.env', 'environment variables', 'api key'
    ],
    content: 'Requires OPENAI_API_KEY environment variable. OpenAI configuration in config/openai.ts includes model selection, voice settings, system prompt (Pixel AI personality), and tool definitions.'
  },
  {
    id: 'local-development',
    label: 'Local Development',
    description: 'Prerequisites, setup steps, development scripts, and troubleshooting',
    keywords: [
      'development', 'local', 'setup', 'install', 'run', 'dev server',
      'prerequisites', 'node', 'npm', 'start', 'troubleshooting', 'errors',
      'hydration', 'microphone', 'hot reload', 'npm run dev', 'port 3000'
    ],
    content: 'Requires Node.js 18.17+, OpenAI API key with Realtime access. Setup: npm install, configure .env.local, npm run dev. Runs on port 3000. Common issues: hydration errors, API key access, microphone permissions.'
  },
  {
    id: 'deployment',
    label: 'Deployment',
    description: 'Production deployment guide for Vercel, Docker, and self-hosted options',
    keywords: [
      'deployment', 'deploy', 'production', 'vercel', 'docker', 'hosting',
      'build', 'publish', 'launch', 'go live', 'self-hosted', 'vps',
      'cloud', 'https', 'ssl', 'domain', 'environment'
    ],
    content: 'Recommended: Vercel deployment with automatic HTTPS and serverless functions. Also supports Docker and self-hosted VPS deployment. Requires OpenAI API key in production environment.'
  }
]

/**
 * Search documentation by keywords
 */
export function searchDocs(query: string): DocSection[] {
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return []

  const results = docsMetadata.filter(section => {
    // Search in label, description, keywords, and content
    const searchText = `
      ${section.label}
      ${section.description}
      ${section.keywords.join(' ')}
      ${section.content}
    `.toLowerCase()

    return searchText.includes(lowerQuery)
  })

  // Sort by relevance (more keyword matches = higher rank)
  return results.sort((a, b) => {
    const aMatches = a.keywords.filter(k => k.includes(lowerQuery)).length
    const bMatches = b.keywords.filter(k => k.includes(lowerQuery)).length
    return bMatches - aMatches
  })
}

/**
 * Get section by ID
 */
export function getDocSection(id: string): DocSection | undefined {
  return docsMetadata.find(section => section.id === id)
}

/**
 * Get all section IDs
 */
export function getAllSectionIds(): string[] {
  return docsMetadata.map(section => section.id)
}
