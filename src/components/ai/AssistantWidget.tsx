import * as React from "react";
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
  Coffee,
  ShoppingBag,
  HeartPulse,
  SunMoon,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../context/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "normal" | "future-self" | "emotional" | "location";
  icon?: React.ReactNode;
}

interface AssistantWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

const MorningCheckIn = () => {
  return (
    <div className="space-y-3 py-2">
      <h3 className="text-sm font-medium text-yellow-400 flex items-center">
        <SunMoon className="h-4 w-4 mr-1.5" />
        Morning Check-in
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Button variant="outline" size="sm" className="h-9 justify-start text-left border-gray-700 hover:bg-gray-700/50 hover:text-yellow-400">
          <HeartPulse className="h-3.5 w-3.5 mr-2 text-green-400" /> Feeling good
        </Button>
        <Button variant="outline" size="sm" className="h-9 justify-start text-left border-gray-700 hover:bg-gray-700/50 hover:text-yellow-400">
          <HeartPulse className="h-3.5 w-3.5 mr-2 text-blue-400" /> Feeling tired
        </Button>
      </div>
      <p className="text-xs text-gray-400">Any big expenses today?</p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <Button variant="outline" size="sm" className="h-9 justify-start text-left border-gray-700 hover:bg-gray-700/50 hover:text-yellow-400">
          <Coffee className="h-3.5 w-3.5 mr-2 text-amber-400" /> Coffee
        </Button>
        <Button variant="outline" size="sm" className="h-9 justify-start text-left border-gray-700 hover:bg-gray-700/50 hover:text-yellow-400">
          <ShoppingBag className="h-3.5 w-3.5 mr-2 text-purple-400" /> Shopping
        </Button>
        <Button variant="outline" size="sm" className="h-9 justify-start text-left border-gray-700 hover:bg-gray-700/50 hover:text-yellow-400">
          None
        </Button>
      </div>
      <div className="flex flex-col space-y-2">
        <p className="text-xs text-gray-400">Today's budget goal?</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700/50 hover:text-yellow-400">
            Strict
          </Button>
          <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700/50 hover:text-yellow-400">
            Flexible
          </Button>
        </div>
      </div>
    </div>
  );
};

const AssistantWidget = ({
  isOpen = true,
  onToggle = () => {},
  messages: initialMessages = [],
  onSendMessage = () => {},
}: AssistantWidgetProps) => {
  const [inputValue, setInputValue] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentOpen, setCurrentOpen] = React.useState(isOpen);
  const [currentTab, setCurrentTab] = React.useState("chat");
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();

  // Fetch initial data
  React.useEffect(() => {
    const fetchInitialMessages = async () => {
      setLoading(true);
      try {
        // In a real app, fetch messages from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, check if we should show welcome message for new users
        if (messages.length === 0) {
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            content: "Welcome to your Financial Buddy! I'm here to help with your financial questions. How can I assist you today?",
            sender: "ai",
            timestamp: new Date(),
            type: "normal",
            icon: <Sparkles className="h-4 w-4 text-yellow-400" />,
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialMessages();
  }, [user]);

  React.useEffect(() => {
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
          "Based on your available spending data, I recommend budgeting more carefully for the next week.",
          "I don't have enough data to provide specific advice yet. Try adding some expenses first!",
          "As you add more financial information, I'll be able to give you more personalized tips.",
          "Let me know if you need help tracking your expenses or setting up a budget.",
          "Check the Expenses section to start tracking your spending habits.",
          "The Financial Wellness section has some great tips for managing your finances better.",
        ];

        const randomResponse =
          aiResponses[Math.floor(Math.random() * aiResponses.length)];
          
        const isFutureSelf = randomResponse.includes("personalized");

        const newAiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          sender: "ai",
          timestamp: new Date(),
          type: isFutureSelf ? "future-self" : "normal",
          icon: isFutureSelf ? <Sparkles className="h-4 w-4 text-purple-400" /> : undefined
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
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 mx-4 mt-2">
                <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
                <TabsTrigger value="check-in" className="text-xs">Daily Check-in</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="flex-1 flex flex-col data-[state=inactive]:hidden">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => {
                        const isFutureSelf = message.type === "future-self";
                        const isEmotional = message.type === "emotional";
                        const isLocation = message.type === "location";
                        
                        let messageClassName = "bg-gray-700 text-white border border-gray-600";
                        if (isFutureSelf) {
                          messageClassName = "bg-gradient-to-r from-purple-900/80 to-purple-700/80 text-white border border-purple-500/30";
                        } else if (isEmotional) {
                          messageClassName = "bg-gradient-to-r from-pink-900/80 to-pink-700/80 text-white border border-pink-500/30";
                        } else if (isLocation) {
                          messageClassName = "bg-gradient-to-r from-blue-900/80 to-blue-700/80 text-white border border-blue-500/30";
                        }
                        
                        return (
                          <motion.div
                            key={message.id}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.8 }}
                            variants={messageVariants}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${message.sender === "user" ? "bg-yellow-500 text-gray-900" : messageClassName}`}
                            >
                              <div className="flex items-start gap-2">
                                {message.sender === "ai" && (
                                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                                    <Avatar className={`h-6 w-6 ${isFutureSelf ? "bg-purple-500/20 ring-2 ring-purple-500/30" : isEmotional ? "bg-pink-500/20 ring-2 ring-pink-500/30" : isLocation ? "bg-blue-500/20 ring-2 ring-blue-500/30" : "bg-yellow-500/20 ring-2 ring-yellow-500/30"}`}>
                                      {message.icon || <Bot className="h-4 w-4 text-yellow-400" />}
                                    </Avatar>
                                  </motion.div>
                                )}
                                <div>
                                  {isFutureSelf && (
                                    <div className="text-xs font-medium text-purple-300 mb-1">Message from Future You</div>
                                  )}
                                  {isEmotional && (
                                    <div className="text-xs font-medium text-pink-300 mb-1">Emotional Coach</div>
                                  )}
                                  {isLocation && (
                                    <div className="text-xs font-medium text-blue-300 mb-1">Location Alert</div>
                                  )}
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
                        );
                      })}
                    </AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-700 text-white rounded-2xl p-3 shadow-sm border border-gray-600 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 bg-yellow-500/20 ring-2 ring-yellow-500/30">
                              <Bot className="h-4 w-4 text-yellow-400" />
                            </Avatar>
                            <div className="flex space-x-1">
                              <motion.div
                                animate={{
                                  opacity: [0.4, 1, 0.4],
                                  scale: [0.8, 1, 0.8],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: 0,
                                }}
                                className="h-2 w-2 bg-gray-300 rounded-full"
                              />
                              <motion.div
                                animate={{
                                  opacity: [0.4, 1, 0.4],
                                  scale: [0.8, 1, 0.8],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: 0.2,
                                }}
                                className="h-2 w-2 bg-gray-300 rounded-full"
                              />
                              <motion.div
                                animate={{
                                  opacity: [0.4, 1, 0.4],
                                  scale: [0.8, 1, 0.8],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: 0.4,
                                }}
                                className="h-2 w-2 bg-gray-300 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-gray-700 mt-auto">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask me anything about your finances..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 bg-gray-700/50 border-gray-600 focus:border-yellow-500/50 text-sm"
                    />
                    <Button
                      size="icon"
                      type="button"
                      onClick={toggleRecording}
                      variant="outline"
                      className={`shrink-0 ${isRecording ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:text-yellow-400"}`}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      type="button"
                      onClick={handleSendMessage}
                      className="shrink-0 bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="check-in" className="flex-1 flex flex-col p-4 data-[state=inactive]:hidden">
                <MorningCheckIn />
              </TabsContent>
            </Tabs>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
};

export default AssistantWidget;
