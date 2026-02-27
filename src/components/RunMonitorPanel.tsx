import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, BarChart3 } from "lucide-react";

interface RunMonitorPanelProps {
  open: boolean;
  onClose: () => void;
}

const TERMINAL_LINES = [
  "$ vasp_std",
  "running on    4 total cores",
  "distrk:  each k-point on    4 cores,    1 groups",
  "distr:  one band on NCORE=   1 cores,    4 groups",
  " ",
  "--------------------------------------------",
  "INCAR: ENCUT  =  520.00 eV",
  "INCAR: EDIFF  =  0.1E-05",
  "INCAR: ISMEAR =  0;  SIGMA = 0.05",
  "INCAR: PREC   =  Accurate",
  "--------------------------------------------",
  " ",
  "POSCAR: Li3PS4",
  "POSCAR: positions in direct lattice",
  " ",
  "k-points:  NKPTS =    64",
  " ",
  "entering main loop",
  "       N       E                     dE          d eps       ncg     rms",
  "DAV:   1    -0.394852E+02   -0.39485E+02   -0.13264E+03    72   0.345E+02",
  "DAV:   2    -0.418731E+02   -0.23879E+01   -0.22681E+01    96   0.429E+01",
  "DAV:   3    -0.419204E+02   -0.47299E-01   -0.47013E-01   108   0.621E+00",
  "DAV:   4    -0.419218E+02   -0.14317E-02   -0.14295E-02    84   0.108E+00",
  "DAV:   5    -0.419218E+02   -0.27654E-05   -0.27629E-05    72   0.437E-02",
  "   1 F= -.41921840E+02 E0= -.41921840E+02 d E =0.000000E+00",
  " ",
  "reaching required accuracy - Loss converged.",
  "Total CPU time used (sec):    842.31",
];

const RunMonitorPanel = ({ open, onClose }: RunMonitorPanelProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setLines([]);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (i < TERMINAL_LINES.length) {
        setLines((prev) => [...prev, TERMINAL_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-x-0 top-0 h-[65vh] bg-background z-[100] flex flex-col border-b border-primary/20 shadow-[0_8px_40px_hsl(var(--primary)/0.15)]"
        >
          {/* Header */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-terminal" />
              <span className="text-sm font-semibold text-foreground">计算运行监控</span>
              <span className="text-[10px] font-mono-code bg-terminal/15 text-terminal px-2 py-0.5 rounded">
                RUNNING
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 min-h-0">
            {/* Terminal */}
            <div className="flex-1 flex flex-col border-r border-border">
              <div className="px-3 py-2 border-b border-border bg-muted/20 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Terminal Output</span>
              </div>
              <div
                ref={termRef}
                className="flex-1 overflow-y-auto scrollbar-thin bg-background p-3 font-mono-code text-xs"
              >
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className={`leading-relaxed ${
                      line.startsWith("reaching") || line.startsWith("Total")
                        ? "text-terminal font-bold"
                        : line.startsWith("$")
                        ? "text-primary"
                        : line.startsWith("DAV:")
                        ? "text-muted-foreground"
                        : "text-foreground/70"
                    }`}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                {lines.length < TERMINAL_LINES.length && (
                  <span className="inline-block w-2 h-4 bg-terminal animate-glow-pulse" />
                )}
              </div>
            </div>

            {/* Plot area */}
            <div className="flex-1 flex flex-col">
              <div className="px-3 py-2 border-b border-border bg-muted/20 flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Energy / Temperature</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center grid-pattern p-6">
                <div className="w-full max-w-md space-y-4">
                  {/* Simulated mini chart bars */}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Energy Convergence (eV)</p>
                    <div className="flex items-end gap-1 h-24">
                      {[-39.48, -41.87, -41.92, -41.92, -41.92].map((val, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${((Math.abs(val) - 38) / 4) * 100}%` }}
                          transition={{ delay: i * 0.15, duration: 0.5 }}
                          className="flex-1 bg-primary/60 rounded-t-sm relative group"
                        >
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono-code text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {val.toFixed(2)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className="flex-1 text-center text-[9px] text-muted-foreground">
                          Step {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Temperature (K)</p>
                    <div className="flex items-end gap-1 h-20">
                      {[300, 305, 298, 301, 300].map((val, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${((val - 290) / 20) * 100}%` }}
                          transition={{ delay: i * 0.15 + 0.5, duration: 0.5 }}
                          className="flex-1 bg-glow-secondary/50 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RunMonitorPanel;
