import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Send, BookOpen } from "lucide-react";
import { aiTutorSeedMessages } from "../data/mockData";
import { useProgress } from "../context/ProgressContext";

export default function AITutor() {
  const [messages, setMessages] = useState(aiTutorSeedMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);
  const { enrolledSubjects } = useProgress();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: crypto.randomUUID(), sender: "user", text, time: nowLabel() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: "This is a placeholder response — connect this to your AI backend to get real answers.",
          time: nowLabel(),
        },
      ]);
      setIsThinking(false);
    }, 900);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-110px)]">
      <div className="lg:w-72 shrink-0 bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Ask about a course
          </p>
          {enrolledSubjects.length === 0 ? (
            <p className="text-xs text-gray-400">
              You're not enrolled in any subject yet.{" "}
              <Link to="/my-courses" className="text-brand-500 hover:underline">
                Enroll here
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {enrolledSubjects.map((c) => (
                <button
                  key={c.id}
                  className="flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <BookOpen size={16} className="text-brand-500 shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Try asking
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Explain pointers in C with an example",
              "What's the difference between SQL joins?",
              "Give me a quiz on recursion",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-left text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg px-3 py-2"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">AI Tutor</p>
            <p className="text-xs text-gray-400">Your personal AI learning assistant</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {isThinking && (
            <div className="bg-gray-50 text-gray-500 rounded-xl rounded-tl-sm px-3 py-2 text-sm w-fit">
              Thinking<span className="animate-pulse">...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your course..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-300"
          />
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white p-2.5 rounded-lg shrink-0"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ message }) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[75%] whitespace-pre-line px-3.5 py-2.5 rounded-xl text-sm ${
          isUser
            ? "bg-brand-500 text-white rounded-tr-sm"
            : "bg-gray-50 text-gray-800 rounded-tl-sm"
        }`}
      >
        {message.text}
      </div>
      <span className="text-[10px] text-gray-300 mt-1">{message.time}</span>
    </div>
  );
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}