import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Eye, Activity, ChevronDown, Sparkles, Atom, FlaskConical, Table2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import StructurePanel from "./StructurePanel";
import RunMonitorPanel from "./RunMonitorPanel";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "请帮我计算 Li₃PS₄ 的晶格能量，使用 PBE 泛函。",
  },
  {
    id: "2",
    role: "agent",
    content:
      "好的，我将为您设置 Li₃PS₄ 的能量计算任务。\n\n**计算参数：**\n- 交换关联泛函：PBE (GGA)\n- 截断能：520 eV\n- k-point 网格：4×4×4 (Gamma centered)\n- 收敛标准：1.0×10⁻⁶ eV\n\n计算已提交到队列，预计运行时间约 15 分钟。您可以点击「运行监控」查看实时进度。",
  },
  {
    id: "3",
    role: "user",
    content: "计算完成后请展示结构和能量结果。",
  },
  {
    id: "4",
    role: "agent",
    content:
      "计算已完成！以下是结果摘要：\n\n| 参数 | 值 |\n|------|------|\n| 总能量 | -42.367 eV |\n| 形成能 | -1.82 eV/atom |\n| 带隙 | 3.15 eV |\n| 晶格常数 a | 8.21 Å |\n\n结构已优化，您可以点击「显示结构」在 3D 视图中查看。该材料表现出较好的离子导电性潜力。",
  },
];

const ChatArea = () => {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const [showIntro, setShowIntro] = useState(false);
  const [structureOpen, setStructureOpen] = useState(false);
  const [runPanelOpen, setRunPanelOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "收到您的请求，正在分析材料参数并准备计算流程。请稍候…",
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/80 glass flex flex-col z-10">
        <div
          className="h-14 px-5 flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-colors"
          onClick={() => setShowIntro(!showIntro)}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              AI 固态电池材料科学家
            </span>
            <span className="text-[10px] text-muted-foreground font-mono-code bg-muted px-2 py-0.5 rounded">
              AI SSB Materials Scientist
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showIntro ? "rotate-180" : ""}`}
          />
        </div>

        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border bg-muted/50"
            >
              <div className="p-4 text-sm text-muted-foreground">
                <p className="mb-3">我是一个支持材料计算与模拟的 Materials Simulation AI Agent。你可以向我询问材料结构、计算流程与模拟结果。</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Atom, text: "可展示材料结构 (3Dmol)", color: "text-primary" },
                    { icon: Table2, text: "可生成计算结果表", color: "text-terminal" },
                    { icon: FlaskConical, text: "可给出计算流程建议", color: "text-glow-secondary" },
                    { icon: AlertCircle, text: "不保证所有问题都可回答", color: "text-muted-foreground" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Chat Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto scrollbar-thin grid-pattern p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "whitespace-pre-wrap bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md shadow-[0_4px_20px_hsl(var(--primary)/0.25)]"
                    : "bg-card border border-border px-5 py-4 rounded-2xl rounded-bl-md glow-border"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-2">
                        <table className="w-full text-xs border-collapse">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="border-b border-border">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="text-left px-3 py-1.5 font-semibold text-muted-foreground">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-1.5 border-t border-border/50">{children}</td>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-primary">{children}</strong>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-muted/60 text-primary px-1.5 py-0.5 rounded text-xs font-mono-code">{children}</code>
                      ) : (
                        <code className={`block bg-muted/40 p-3 rounded-lg text-xs font-mono-code overflow-x-auto my-2 ${className}`}>{children}</code>
                      );
                    },
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1">{children}</ol>,
                    p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border px-5 py-3 rounded-2xl rounded-bl-md glow-border flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground mr-2">思考中</span>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                      style={{
                        animation: `typingDot 1.4s ease-in-out ${i * 0.16}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/80 glass p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="输入您的材料计算问题…"
            className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:glow-border transition-all"
          />
          <button
            onClick={handleSend}
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_4px_20px_hsl(var(--primary)/0.3)]"
          >
            <Send className="w-4 h-4" />
            发送
          </button>
          <button
            onClick={() => setStructureOpen(!structureOpen)}
            className="px-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground transition-all"
          >
            <Eye className="w-4 h-4" />
            结构
          </button>
          <button
            onClick={() => setRunPanelOpen(!runPanelOpen)}
            className="px-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground transition-all"
          >
            <Activity className="w-4 h-4" />
            监控
          </button>
        </div>
      </div>

      {/* Panels */}
      <StructurePanel open={structureOpen} onClose={() => setStructureOpen(false)} />
      <RunMonitorPanel open={runPanelOpen} onClose={() => setRunPanelOpen(false)} />
    </div>
  );
};

export default ChatArea;
