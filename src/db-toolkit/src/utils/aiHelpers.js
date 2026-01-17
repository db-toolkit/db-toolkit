const CONVERSATIONAL_RESPONSES = {
  'hi': 'Hello! I can help you generate SQL queries. Try asking me to "show all users" or "find orders from last week".',
  'hello': 'Hi there! Describe what data you want to query and I\'ll generate the SQL for you.',
  'hey': 'Hey! What would you like to query from your database?',
  'help': 'I can generate SQL queries from natural language. For example:\n• "Show all users created this month"\n• "Find top 10 products by sales"\n• "List orders with status pending"',
  'what can you do': 'I can convert your natural language descriptions into SQL queries. Just tell me what data you want to retrieve!',
  'who are you': 'I\'m DBAssist, your AI-powered SQL query generator. I help you write SQL queries using plain English.',
  'thanks': 'You\'re welcome! Let me know if you need help with any queries.',
  'thank you': 'Happy to help! Feel free to ask for more queries anytime.'
};

export function isQueryRequest(text) {
  const lowerText = text.toLowerCase().trim();

  const conversational = [
    'hi', 'hello', 'hey', 'thanks', 'thank you', 'bye', 'goodbye',
    'how are you', 'what can you do', 'help', 'who are you'
  ];

  if (conversational.some(phrase => lowerText === phrase || lowerText.startsWith(phrase + ' '))) {
    return false;
  }

  const queryKeywords = [
    'show', 'get', 'find', 'list', 'select', 'fetch', 'retrieve',
    'count', 'sum', 'average', 'total', 'how many', 'display',
    'all', 'where', 'from', 'with', 'having', 'group by'
  ];

  return queryKeywords.some(keyword => lowerText.includes(keyword));
}

export function getConversationalResponse(input) {
  const lowerInput = input.toLowerCase();
  return CONVERSATIONAL_RESPONSES[lowerInput] || 
    'I\'m here to help you generate SQL queries. Try describing what data you want to retrieve from your database.';
}
