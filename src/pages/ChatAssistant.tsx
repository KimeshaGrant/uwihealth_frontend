import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hello! I'm the MedQueue AI Assistant. I can help you with booking appointments, checking availability, and answering clinic-related questions. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const botResponses: Record<string, string> = {
  book: "I can help you book an appointment! We have availability with Dr.Brown. Would you like me to reserve one of these slots?",
  availability: "Here's today's availability:\n• Dr. Goldson — slots remaining (10:30 AM, 1:00 PM, 3:00 PM)\n• Dr. Brown — slots remaining (11:00 AM, 2:00 PM)\n• Dr. Sarah Williams — Unavailable today",
  wait: "The current estimated wait time for walk-ins is approximately 18 minutes. The queue has 5 patients waiting. Would you like to join the virtual queue?",
  hours: "The UWI Health Centre operates Monday to Friday, 8:30 AM to 4:30 PM. We're closed on weekends and public holidays.",
  cancel: "To cancel an appointment, please go to 'My Appointments' and click the X button next to the appointment you'd like to cancel. Cancellations must be made at least 2 hours before the scheduled time.",
  contact: "You can contact the UWI Health Center at:\n📞 Phone: (876)970-0017\n📧 Email: healthservs@uwimona.edu.jm.",
};

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simple keyword matching for demo
    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = "I'm not sure I understand. You can ask me about booking appointments, checking availability, wait times, clinic hours, cancellation policies or contact information.";
      
      for (const [key, val] of Object.entries(botResponses)) {
        if (lower.includes(key)) {
          response = val;
          break;
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <MessageSquare className="size-6 text-primary" /> AI Assistant
        </h1>
        <p className="text-muted-foreground mt-1">Ask about bookings, availability, wait times, and more.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "bot" ? "bg-primary/10" : "bg-muted"
              }`}>
                {msg.sender === "bot" ? <Bot className="size-4 text-primary" /> : <User className="size-4 text-muted-foreground" />}
              </div>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === "bot"
                  ? "bg-surface text-foreground"
                  : "bg-primary text-primary-foreground"
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about appointments, wait times, clinic hours..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} size="icon">
              <Send className="size-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            {["Check availability", "Wait times", "Clinic hours"].map((q) => (
              <Button key={q} variant="outline" size="sm" className="text-xs" onClick={() => { setInput(q); }}>
                {q}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatAssistant;
