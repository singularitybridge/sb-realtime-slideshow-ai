// Add interface for tools
interface Tool {
    type: 'function';
    name: string;
    description: string;
    parameters?: {
      type: string;
      properties: Record<string, {
        type: string;
        description: string;
      }>;
    };
}

const toolDefinitions = {
    getCurrentSlide: {
        description: 'Gets the content of the current slide including title, description, and key points',
        parameters: {}
    },
    nextSlide: {
        description: 'Moves to the next slide in the presentation. Returns an error if already at the last slide.',
        parameters: {}
    },
    prevSlide: {
        description: 'Moves to the previous slide in the presentation. Returns an error if already at the first slide.',
        parameters: {}
    },
    getCurrentTime: {
        description: 'Gets the current time in the user\'s timezone',
        parameters: {}
    }
} as const;

const tools: Tool[] = Object.entries(toolDefinitions).map(([name, config]) => ({
    type: "function",
    name,
    description: config.description,
    parameters: {
    type: 'object',
    properties: config.parameters
    }
}));


export type { Tool };
export { tools };
