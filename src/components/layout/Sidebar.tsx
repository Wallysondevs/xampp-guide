import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { COURSE_MODULES, getProgress } from "@/lib/course";
import { X, ChevronRight, CheckCircle2, Circle } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompleted(getProgress());
  }, [location]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#1a1407] to-[#0f0a03] border-r border-orange-500/20 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="sticky top-0 z-10 px-5 pt-5 pb-3 bg-gradient-to-b from-[#1a1407] to-[#1a1407]/95 backdrop-blur-sm border-b border-orange-500/20">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-orange-500 border border-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-xl font-black text-white">X</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">XAMPP Guide</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Guia completo</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-orange-500/10 lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navegação */}
        <nav className="p-3 space-y-1">
          {COURSE_MODULES.map((section) => {
            const sectionDone = section.lessons.filter((l) => completed.has(l.id)).length;
            const sectionTotal = section.lessons.length;

            return (
              <div key={section.id}>
                <div className="flex items-center justify-between px-2.5 py-1.5 mb-1">
                  <h4 className="text-[10px] font-bold text-gray-400/70 uppercase tracking-[0.12em]">
                    {section.title}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-500">
                    {sectionDone}/{sectionTotal}
                  </span>
                </div>
                <ul className="space-y-0.5 list-none pl-0">
                  {section.lessons.map((item) => {
                    const isActive = location === item.path;
                    const isCompleted = completed.has(item.id);

                    return (
                      <li key={item.id}>
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "relative flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-150",
                            isActive
                              ? "bg-orange-500/20 text-orange-400 font-semibold"
                              : isCompleted
                              ? "text-orange-400/80 hover:bg-[#1a1407]/50"
                              : "text-gray-300 hover:bg-[#1a1407]/50 hover:text-white"
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-orange-500" />
                          )}
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-orange-400" strokeWidth={2.5} />
                          ) : (
                            <Circle className="w-3.5 h-3.5 shrink-0 opacity-30" />
                          )}
                          <span className="truncate">{item.title}</span>
                          {isActive && <ChevronRight className="w-3 h-3 ml-auto text-orange-400 shrink-0" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-orange-500/20 mt-4">
          <div className="text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-1">
            Versão
          </div>
          <div className="text-sm font-bold text-white">XAMPP 8.2.12</div>
          <div className="text-[11px] text-gray-500 mt-1">Apache + MariaDB + PHP + Perl</div>
        </div>
      </aside>
    </>
  );
}
