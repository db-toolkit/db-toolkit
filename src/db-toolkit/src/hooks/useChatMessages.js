import { useEffect, useRef } from 'react';

export function useChatMessages(chatHistory) {
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return { chatContainerRef, messagesEndRef };
}
