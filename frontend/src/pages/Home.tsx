import { Send, Plus, MessageSquare, TrendingUp, BarChart3, PieChart, Clock, Mic, Paperclip, FileText, Sparkles, ChevronRight, Edit2, ArrowDown, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { chatService, Message as DBMessage, Chat as DBChat } from '../services/chatService';
import { aiService } from '../services/aiService';
import LandingSections from '../components/LandingSections';
import AIVisualization from '../components/AIVisualization';

interface HomeProps {
  isLoggedIn: boolean;
  forceLanding?: boolean;
  onOpenChat?: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

type Message = DBMessage;
type Chat = DBChat;

export default function Home({ isLoggedIn, forceLanding, onOpenChat }: HomeProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [previousChats, setPreviousChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  // Track dark/light theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadChats();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Detect scroll position to show/hide scroll button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  const loadChats = async () => {
    const chats = await chatService.getChats();
    setPreviousChats(chats);
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  };

  const loadMessages = async (chatId: string) => {
    const msgs = await chatService.getMessages(chatId);
    setMessages(msgs);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleNewChat = async () => {
    const newChat = await chatService.createChat('New Conversation');
    if (newChat) {
      setPreviousChats([newChat, ...previousChats]);
      setSelectedChatId(newChat.id);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isLoggedIn) return;

    let currentChatId = selectedChatId;
    if (!currentChatId) {
      const newChat = await chatService.createChat("New Conversation");
      if (newChat) {
        currentChatId = newChat.id;
        setSelectedChatId(newChat.id);
        setPreviousChats([newChat, ...previousChats]);
      } else {
        return;
      }
    }

    const userMessage: Partial<Message> = {
      text: inputMessage,
      is_user: true,
    };

    const savedUserMsg = await chatService.sendMessage(currentChatId, userMessage);
    if (savedUserMsg) {
      setMessages((prev) => [...prev, savedUserMsg]);
    }

    const query = inputMessage;
    setInputMessage('');

    try {
      // Call Python Backend for Analysis
      const aiResponse = await aiService.analyzeQuery(query);

      // Intelligent Auto-naming logic based on Backend Analysis
      if (messages.length === 0) {
        let intelligentTitle = "New Analysis";

        if (aiResponse.intent === "GREETING") {
          intelligentTitle = "Greeting";
        } else if (aiResponse.entities && aiResponse.entities.length > 0) {
          const entityStr = aiResponse.entities.join(', ').replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
          const truncatedEntities = entityStr.length > 15 ? entityStr.substring(0, 15) + '...' : entityStr;
          intelligentTitle = `${aiResponse.intent}: ${truncatedEntities}`;
        } else {
          intelligentTitle = `${aiResponse.intent} Analysis`;
        }

        await chatService.updateChat(currentChatId, intelligentTitle);
        setPreviousChats(prev => prev.map(c =>
          c.id === currentChatId ? { ...c, title: intelligentTitle } : c
        ));
      }

      let botMessage: Partial<Message> = {
        is_user: false,
        text: '',
        analysis: aiResponse.ai_analysis || `Intent: ${aiResponse.intent} | Entities: ${aiResponse.entities.join(', ')}`
      };

      // Universal Data Transformation Engine for all 20+ Visualization Types
      botMessage.chartType = aiResponse.chart_type;
      const rawData = aiResponse.response;

      if (aiResponse.intent === 'PREDICT') {
        botMessage.text = "Here is the intelligent forecast for the next period.";
      } else if (aiResponse.intent === 'TREND') {
        botMessage.text = "I've analyzed the historical trajectory of your business metrics.";
      } else if (aiResponse.intent === 'SUMMARIZE' || aiResponse.intent === 'COMPARE') {
        botMessage.text = "Analysis complete. Here is the categorized breakdown of your request.";
      } else {
        botMessage.text = "Analysis processed successfully.";
      }

      // Universal Data Mapping
      const sourceData = rawData.summary || rawData.trend_analysis || rawData.monthly_comparisons || rawData;

      if (sourceData && !sourceData.message) {
        if (Array.isArray(sourceData)) {
          botMessage.chartData = sourceData.map((item: any) => ({
            name: item.name || item.month || 'Data',
            value: item.value || item.Sales_units || 0,
            sales: item.Sales_units || item.sales || 0,
            profits: item.Profit || item.profits || 0,
            size: item.size || item.value || 100, // For treemap
            x: item.x || item.Sales_units || 0,   // For scatter
            y: item.y || item.Profit || 0         // For scatter
          }));
        } else if (typeof sourceData === 'object' && Object.keys(sourceData).length > 0) {
          botMessage.chartData = Object.keys(sourceData).map(key => ({
            name: key.replace('_', ' ').replace('+', ' '),
            value: sourceData[key].total || sourceData[key].latest || sourceData[key].sales || sourceData[key].revenue || sourceData[key] || 0,
            sales: sourceData[key].Sales_units || sourceData[key].sales || 0,
            profits: sourceData[key].Profit || sourceData[key].profits || 0,
            size: sourceData[key].total || sourceData[key] || 100,
            x: sourceData[key].rolling_average || sourceData[key].sales || 0,
            y: sourceData[key].latest_value || sourceData[key].profits || 0
          }));
        }
      }

      if (!botMessage.chartData) {
        botMessage.text = typeof rawData === 'string' ? rawData : (rawData.message || botMessage.text);
      }

      const savedBotMsg = await chatService.sendMessage(currentChatId, botMessage);
      if (savedBotMsg) {
        setMessages((prev) => [...prev, savedBotMsg]);
      }
    } catch (error) {
      console.error('Error in send message:', error);
      const errorMsg: Partial<Message> = {
        is_user: false,
        text: "I'm having trouble connecting to my analysis engine. Please ensure the backend server is running."
      };
      const savedErrorMsg = await chatService.sendMessage(currentChatId, errorMsg);
      if (savedErrorMsg) {
        setMessages((prev) => [...prev, savedErrorMsg]);
      }
    }
  };

  const handleUpdateChartTitle = async (messageId: string, newTitle: string) => {
    const success = await chatService.updateMessage(messageId, { chartTitle: newTitle });
    if (success) {
      setMessages(messages.map(m => m.id === messageId ? { ...m, chartTitle: newTitle } : m));
    }
  };

  const handleRenameChat = async (chatId: string) => {
    if (!editingTitle.trim()) return;
    const success = await chatService.updateChat(chatId, editingTitle);
    if (success) {
      setPreviousChats(prev => prev.map(c => c.id === chatId ? { ...c, title: editingTitle } : c));
    }
    setEditingChatId(null);
  };

  const handleDeleteChat = async () => {
    if (!deleteChatId) return;
    const success = await chatService.deleteChat(deleteChatId);
    if (success) {
      setPreviousChats(prev => prev.filter(c => c.id !== deleteChatId));
      if (selectedChatId === deleteChatId) {
        const remaining = previousChats.filter(c => c.id !== deleteChatId);
        setSelectedChatId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
    setShowDeleteModal(false);
    setDeleteChatId(null);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isLoggedIn && selectedChatId) {
      const allowedExtensions = ['.xlsx', '.xls', '.xlsm', '.xlsb', '.csv', '.tsv', '.ods', '.numbers', '.xml', '.xltx', '.xlt'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        alert(`File type ${fileExtension} is not supported. Please upload: ${allowedExtensions.join(', ')}`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const userMessage: Partial<Message> = {
        text: `Uploaded file: ${file.name}`,
        is_user: true,
        attachment: {
          name: file.name,
          type: file.type,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }
      };

      const savedMsg = await chatService.sendMessage(selectedChatId, userMessage);
      if (savedMsg) {
        setMessages((prev) => [...prev, savedMsg]);
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      if (isListening) {
        setIsListening(false);
        return;
      }

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Voice input error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isLoggedIn || (isLoggedIn && forceLanding)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#14b8a6]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#0ea5e9]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] dark:opacity-[0.1]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-8xl font-black text-[var(--text-primary)] mb-8 tracking-tighter">
              ASK. VISUALIZE.
              <span className="block bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] bg-clip-text text-transparent">
                ACHIEVE.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
              Transform natural language questions into powerful data insights with automatic visualizations and AI-generated summaries.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <button
                onClick={onOpenChat}
                className="px-10 py-4 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-2xl font-bold flex items-center space-x-3 hover:scale-105 transition-all shadow-xl shadow-[#14b8a6]/20 group"
              >
                <span className="text-lg">{isLoggedIn ? 'Back to Analysis' : 'GENERATE NOW'}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] backdrop-blur-sm px-6 py-3 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <TrendingUp className="w-5 h-5 text-[#14b8a6]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Trend Analysis</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] backdrop-blur-sm px-6 py-3 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <BarChart3 className="w-5 h-5 text-[#0ea5e9]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Custom Reports</span>
              </div>
              <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] backdrop-blur-sm px-6 py-3 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <PieChart className="w-5 h-5 text-[#14b8a6]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Data Visualization</span>
              </div>
            </div>
          </div>
        </div>

        <LandingSections />

        {!isLoggedIn && (
          <div className="bg-[#0a1a1a] pb-32 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#14b8a6]/20 to-transparent"></div>
            <button
              onClick={() => onOpenChat?.()}
              className="px-16 py-6 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(20,184,166,0.3)]"
            >
              GENERATE NOW
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-5rem)] bg-[var(--bg-primary)] flex transition-colors duration-300 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-data-pattern opacity-10 pointer-events-none"></div>
          <div className="relative p-6 border-b border-[var(--border-color)]">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-[#14b8a6]/20 font-bold"
            >
              <Plus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-history">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">Recent History</h3>
            <div className="space-y-2">
              {previousChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all group border ${selectedChatId === chat.id
                    ? 'bg-white/5 border-[#14b8a6]/30 shadow-lg'
                    : 'hover:bg-white/5 border-transparent hover:border-white/5'}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${selectedChatId === chat.id ? 'bg-[#14b8a6]/10 text-[#14b8a6]' : 'bg-white/5 text-gray-500'}`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => handleRenameChat(chat.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameChat(chat.id)}
                          autoFocus
                          className="w-full bg-slate-800 border border-[#14b8a6]/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex items-center justify-between group/title">
                          <p
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingChatId(chat.id);
                              setEditingTitle(chat.title);
                            }}
                            className={`text-sm font-bold truncate cursor-text ${selectedChatId === chat.id ? 'text-[var(--text-primary)]' : 'text-gray-400 group-hover:text-gray-300'}`}
                          >
                            {chat.title}
                          </p>
                          <div className="flex items-center opacity-0 group-hover/title:opacity-100 transition-all">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingChatId(chat.id);
                                setEditingTitle(chat.title);
                              }}
                              className="p-1 hover:bg-white/10 rounded transition-all ml-1"
                              title="Rename chat"
                            >
                              <Edit2 className="w-3 h-3 text-[#14b8a6]" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteChatId(chat.id);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 hover:bg-red-500/20 rounded transition-all ml-1"
                              title="Delete chat"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center mt-1 space-x-2">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600 font-medium">
                          {new Date(chat.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          <div className="absolute inset-0 bg-gradient-mesh opacity-50"></div>
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none"></div>
          <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02] pointer-events-none"></div>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 scrollbar-chat relative">
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center relative z-10">
                  <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-[var(--border-color)]">
                    <Sparkles className="w-10 h-10 text-[#14b8a6]" />
                  </div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Ready to analyze?</h2>
                  <p className="text-[var(--text-secondary)] max-w-sm">Ask a question about your data or upload a file to get started.</p>
                </div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.is_user ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div
                    className={`max-w-2xl px-6 py-4 rounded-3xl ${message.is_user
                      ? 'bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-tr-none shadow-xl shadow-[#14b8a6]/10'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none shadow-sm'
                      }`}
                  >
                    <p className="text-[15px] leading-relaxed font-medium">{message.text}</p>

                    {message.chartData && (
                      <AIVisualization
                        data={message.chartData}
                        type={message.chartType || 'bar'}
                        title={message.chartTitle || message.text || 'Intelligence Report'}
                        explanation={message.analysis || ''}
                        onTitleChange={(newTitle) => handleUpdateChartTitle(message.id, newTitle)}
                      />
                    )}

                    {!message.chartData && message.analysis && (
                      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-xs font-black uppercase tracking-widest mb-2 flex items-center text-[#14b8a6]">
                          <Sparkles className="w-3 h-3 mr-2" /> AI Analysis
                        </p>
                        <p className="text-[13px] leading-relaxed text-gray-400 font-light italic">{message.analysis}</p>
                      </div>
                    )}

                    {message.attachment && (
                      <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                        {message.attachment.type.startsWith('image/') ? (
                          <img src={message.attachment.url} alt={message.attachment.name} className="max-w-full h-auto rounded-xl" />
                        ) : (
                          <div className="flex items-center space-x-3 p-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <FileText className="w-5 h-5 text-gray-300" />
                            </div>
                            <span className="text-sm font-bold text-gray-300 underline">{message.attachment.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-28 right-8 p-4 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-full shadow-2xl shadow-[#14b8a6]/30 hover:scale-110 transition-all duration-300 z-20 animate-in fade-in slide-in-from-bottom-4 group"
              title="Scroll to bottom"
            >
              <ArrowDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}

          {/* Chat Input */}
          <div className="p-8 pb-10 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] p-4 shadow-2xl transition-all focus-within:border-[#14b8a6]/30">
                <div className="flex items-end space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.tsv,.ods,.numbers,.xml,.xltx,.xlt"
                    className="hidden"
                  />
                  <button
                    onClick={handleFileUpload}
                    className="p-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all mb-1"
                    title="Upload file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Ask me anything about your data..."}
                    className={`flex-1 px-4 py-4 bg-transparent text-[var(--text-primary)] placeholder-gray-500 focus:outline-none resize-none font-medium leading-relaxed ${isListening ? 'animate-pulse' : ''}`}
                    rows={1}
                  />
                  <div className="flex items-center space-x-2 mb-1">
                    <button
                      onClick={handleVoiceInput}
                      className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-bounce' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                      title="Voice input"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="p-4 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-[#14b8a6]/20 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal — reacts to light / dark theme */}
      {showDeleteModal && (() => {
        // ── Dark theme tokens ──────────────────────────────────────────
        const overlay = isDark ? 'rgba(10,26,26,0.80)' : 'rgba(15,30,40,0.45)';
        const cardBg = isDark ? 'linear-gradient(135deg,#0f2323 0%,#1a2e2e 100%)'
          : 'linear-gradient(160deg,#ffffff 0%,#f0faf9 100%)';
        const cardBorder = isDark ? '1px solid rgba(20,184,166,0.25)' : '1px solid rgba(20,184,166,0.35)';
        const cardShadow = isDark
          ? '0 25px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(20,184,166,0.08), inset 0 1px 0 rgba(255,255,255,0.04)'
          : '0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(20,184,166,0.12), inset 0 1px 0 rgba(255,255,255,0.9)';
        const topGlow = isDark
          ? 'linear-gradient(90deg,transparent,rgba(20,184,166,0.45),transparent)'
          : 'linear-gradient(90deg,transparent,rgba(20,184,166,0.55),transparent)';
        const iconBg = isDark ? 'rgba(245,158,11,0.10)' : 'rgba(245,158,11,0.08)';
        const iconBorder = isDark ? '1px solid rgba(245,158,11,0.28)' : '1px solid rgba(245,158,11,0.35)';
        const titleColor = isDark ? '#e2f0ef' : '#0f2d2d';
        const bodyColor = isDark ? '#6b9e9a' : '#4a7a76';
        const accentColor = '#14b8a6';
        const cancelBorder = isDark ? '1px solid rgba(20,184,166,0.20)' : '1px solid rgba(20,184,166,0.30)';
        const cancelColor = isDark ? '#6b9e9a' : '#4a7a76';
        const cancelHoverBg = isDark ? 'rgba(20,184,166,0.08)' : 'rgba(20,184,166,0.10)';
        const cancelHoverColor = '#14b8a6';

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: overlay, backdropFilter: 'blur(10px)' }}
            onClick={() => { setShowDeleteModal(false); setDeleteChatId(null); }}
          >
            <div
              className="relative rounded-3xl p-8 max-w-sm w-full mx-4"
              style={{ background: cardBg, border: cardBorder, boxShadow: cardShadow }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px rounded-full"
                style={{ background: topGlow }} />

              {/* ── Icon ── */}
              <div className="flex items-center justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: iconBg, border: iconBorder }}>
                  <AlertTriangle className="w-8 h-8" style={{ color: '#f59e0b' }} />
                </div>
              </div>

              {/* ── Title ── */}
              <h3 className="text-xl font-black text-center mb-2" style={{ color: titleColor }}>
                Delete Chat?
              </h3>

              {/* ── Body ── */}
              <p className="text-sm text-center mb-7 leading-relaxed" style={{ color: bodyColor }}>
                This will permanently delete&nbsp;
                <span className="font-bold" style={{ color: accentColor }}>
                  {previousChats.find(c => c.id === deleteChatId)?.title || 'this chat'}
                </span>
                &nbsp;and all its messages. This action cannot be undone.
              </p>

              {/* ── Divider ── */}
              <div className="mb-5 h-px w-full"
                style={{ background: isDark ? 'rgba(20,184,166,0.10)' : 'rgba(20,184,166,0.15)' }} />

              {/* ── Actions ── */}
              <div className="flex space-x-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteChatId(null); }}
                  className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all"
                  style={{ border: cancelBorder, color: cancelColor, background: 'transparent' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = cancelHoverBg;
                    (e.currentTarget as HTMLButtonElement).style.color = cancelHoverColor;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = cancelColor;
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteChat}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg,#14b8a6 0%,#0ea5e9 100%)',
                    boxShadow: '0 4px 20px rgba(20,184,166,0.28)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(20,184,166,0.45)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(20,184,166,0.28)';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
