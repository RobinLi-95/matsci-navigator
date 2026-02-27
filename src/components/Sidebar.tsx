import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Atom, FlaskConical, Upload, Play, User, Zap } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
}

const Sidebar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Li₃PS₄ 结构优化" },
    { id: "2", title: "LLZO 能量计算" },
    { id: "3", title: "LiFePO₄ 分子动力学" },
  ]);
  const [activeId, setActiveId] = useState("1");
  const [calcType, setCalcType] = useState("energy");

  const addConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `新对话 ${conversations.length + 1}`,
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newConv.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (activeId === id && conversations.length > 1) {
      setActiveId(conversations.find((c) => c.id !== id)?.id || "");
    }
  };

  return (
    <aside className="w-[280px] min-w-[280px] bg-card flex flex-col border-r border-border relative overflow-hidden">
      {/* Decorative scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
      </div>

      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center glow-border">
            <Atom className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-foreground">
              B-<span className="text-primary glow-text">MatMod</span>
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Materials Agent</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pt-3">
        <button
          onClick={addConversation}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-dashed border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          新建对话
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
        <AnimatePresence>
          {conversations.map((conv) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg mx-1 my-0.5 cursor-pointer text-sm transition-all duration-200 ${
                activeId === conv.id
                  ? "bg-primary/10 text-primary border border-primary/20 glow-border"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              onClick={() => setActiveId(conv.id)}
            >
              <div className="flex items-center gap-2 truncate">
                <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Workbench */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">计算工作台</h4>
        </div>

        <label className="block text-[11px] text-muted-foreground mb-1.5">上传材料结构文件</label>
        <div className="relative mb-3">
          <input type="file" className="hidden" id="file-upload" />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 w-full py-2 px-3 rounded-md border border-border bg-muted/50 text-xs text-muted-foreground cursor-pointer hover:border-primary/40 hover:bg-muted transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            选择文件…
          </label>
        </div>

        <label className="block text-[11px] text-muted-foreground mb-1.5">计算类型</label>
        <select
          value={calcType}
          onChange={(e) => setCalcType(e.target.value)}
          className="w-full py-2 px-3 rounded-md border border-border bg-muted/50 text-xs text-foreground mb-3 outline-none focus:border-primary/50 transition-colors appearance-none"
        >
          <option value="energy">能量计算</option>
          <option value="optimize">材料结构优化</option>
          <option value="md">分子动力学</option>
          <option value="fem">有限元电芯分析</option>
        </select>

        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
          <Play className="w-3.5 h-3.5" />
          运行计算
        </button>
      </div>

      {/* User Panel */}
      <div className="border-t border-border p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Research User</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal animate-glow-pulse" />
            <span className="text-[10px] text-muted-foreground">Agent Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
