import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, Atom } from "lucide-react";

interface StructurePanelProps {
  open: boolean;
  onClose: () => void;
}

const StructurePanel = ({ open, onClose }: StructurePanelProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 w-[380px] h-full bg-card border-l border-border flex flex-col z-50 shadow-[-4px_0_30px_hsl(var(--primary)/0.1)]"
        >
          {/* Header */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">材料结构</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D Viewer Placeholder */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 grid-pattern">
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-primary/5 animate-[spin_15s_linear_infinite_reverse]" />
              <Atom className="w-16 h-16 text-primary/40" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              3D 结构查看器
            </p>
            <p className="text-xs text-muted-foreground/60 text-center mt-1">
              上传结构文件后自动渲染
            </p>

            {/* Simulated data */}
            <div className="mt-8 w-full space-y-2">
              {[
                { label: "空间群", value: "Pnma (62)" },
                { label: "晶格常数", value: "a=8.21, b=6.12, c=5.07 Å" },
                { label: "原子数", value: "32" },
                { label: "化学式", value: "Li₃PS₄" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center px-3 py-2 rounded-md bg-muted/30 border border-border/50"
                >
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-mono-code text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StructurePanel;
