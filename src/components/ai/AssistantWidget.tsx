import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  MessageCircle,
  Send,
  Mic,
  ChevronUp,
  ChevronDown,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AssistantWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

const AssistantWidget = ({
  isOpen = true,
  onToggle = () => {},
  messages: initialMessages = [
    {
      id: "1",
      content:
        "Good morning! You have $45 left in your daily budget. Need any financial advice today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      content: "Can I afford to buy a $20 lunch today?",
      sender: "user",
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: "3",
      content:
        "Yes, you can buy that! You'll still have $25 left for the rest of the day, which is within your daily spending target.",
      sender: "ai",
      timestamp: new Date(),
    },
  ],
  onSendMessage = () => {},
}: AssistantWidgetProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOpen, setCurrentOpen] = useState(isOpen);

  useEffect(() => {
    setCurrentOpen(isOpen);
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, newUserMessage]);
      setInputValue("");
      setIsTyping(true);

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiResponses = [
          "Based on your spending habits, I recommend setting aside $100 for emergencies this month.",
          "Great choice! That purchase fits well within your budget.",
          "I've analyzed your expenses and found 3 subscriptions you might not be using. Want to review them?",
          "You're on track to meet your savings goal this month! Keep it up!",
          "I noticed an unusual transaction yesterday. Would you like me to help you investigate it?",
        ];

        const randomResponse =
          aiResponses[Math.floor(Math.random() * aiResponses.length)];

        const newAiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newAiMessage]);
        setIsTyping(false);
      }, 1500);

      onSendMessage(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop voice recording
    if (!isRecording) {
      // Simulate voice recognition after a delay
      setTimeout(() => {
        setInputValue("How much have I spent on food this week?");
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleToggle = () => {
    setCurrentOpen(!currentOpen);
    onToggle();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-full"
    >
      <Card className="w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 flex flex-col overflow-hidden">
        <Collapsible open={currentOpen} className="flex-1 flex flex-col w-full">
          <CardHeader className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center text-white">
                <motion.div
                  whileHover={{ rotate: 20, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="mr-2 bg-yellow-500/20 p-1 rounded-full"
                >
                  <Bot className="h-5 w-5 text-yellow-400" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Financial Buddy
                </motion.span>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
                  className="ml-2"
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
              </CardTitle>
              <CollapsibleTrigger asChild onClick={handleToggle}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {currentOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </motion.div>
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.8 }}
                      variants={messageVariants}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${message.sender === "user" ? "bg-yellow-500 text-gray-900" : "bg-gray-700 text-white border border-gray-600"}`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === "ai" && (
                            <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                              <Avatar className="h-6 w-6 bg-yellow-500/20 ring-2 ring-yellow-500/30">
                                <Bot className="h-4 w-4 text-yellow-400" />
                              </Avatar>
                            </motion.div>
                          )}
                          <div>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {message.sender === "user" && (
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: -10 }}
                            >
                              <Avatar className="h-6 w-6 bg-gradient-to-r from-yellow-500 to-yellow-600 ring-2 ring-yellow-300/30">
                                <User className="h-4 w-4 text-white" />
                              </Avatar>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-2xl p-3 bg-gray-700 border border-gray-600 text-white shadow-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 bg-yellow-500/20 ring-2 ring-yellow-500/30">
                          <Bot className="h-4 w-4 text-yellow-400" />
                        </Avatar>
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="h-2 w-2 bg-yellow-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                              delay: 0.1,
                            }}
                            className="h-2 w-2 bg-yellow-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                              delay: 0.2,
                            }}
                            className="h-2 w-2 bg-yellow-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 rounded-full border-gray-600 ${isRecording ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse" : "text-gray-400 hover:text-yellow-400 hover:border-yellow-500/30"}`}
                    onClick={toggleRecording}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </motion.div>
                <Input
                  placeholder="Ask about your finances..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="icon"
                    className={`h-8 w-8 rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 ${!inputValue.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <AnimatePresence>
          {!currentOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center p-2 m-2 w-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300 rounded-full"
                onClick={handleToggle}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mr-2"
                >
                  <MessageCircle className="h-4 w-4" />
                </motion.div>
                Chat with your Financial Buddy
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default AssistantWidget;
