export interface UIComponentItem {
  slug: string;
  name: string;
  category: "heroes" | "navigation" | "bento_grids" | "cards" | "modals" | "forms" | "animations" | "tables";
  description: string;
  author: string;
  registryUrl: string;
  tags: string[];
  dependencies: string[];
  codeSnippet: string;
  demoSnippet: string;
}

export const COMPONENTS_CATALOG: Record<string, UIComponentItem> = {
  "glowing-card": {
    slug: "glowing-card",
    name: "Glowing Radial Gradient Card",
    category: "cards",
    description: "Modern SaaS card with mouse-tracking radial gradient border glow and glassmorphism backdrop.",
    author: "21st-community",
    registryUrl: "https://21st.dev/r/community/glowing-card",
    tags: ["card", "glassmorphism", "gradient", "hover", "framer-motion"],
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    codeSnippet: `'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function GlowingCard({ title, description, icon: Icon, children }: any) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-2xl overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: \`radial-gradient(600px circle at \${mousePos.x}px \${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 40%)\`
        }}
      />
      {Icon && <Icon className="w-8 h-8 text-primary mb-4" />}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children}
    </div>
  );
}`,
    demoSnippet: `import { GlowingCard } from './code';
import { Zap } from 'lucide-react';

export default function Demo() {
  return (
    <GlowingCard title="Instant Analytics" description="Real-time event processing for modern SaaS tools." icon={Zap}>
      <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium">Explore Features</button>
    </GlowingCard>
  );
}`
  },

  "floating-dock": {
    slug: "floating-dock",
    name: "Apple Dock Magnetic Navigation",
    category: "navigation",
    description: "Floating navigation dock with spring-loaded mouse proximity magnification inspired by macOS.",
    author: "magic-ui",
    registryUrl: "https://21st.dev/r/magicui/floating-dock",
    tags: ["dock", "navigation", "apple-hig", "magnetic", "framer-motion"],
    dependencies: ["framer-motion", "lucide-react"],
    codeSnippet: `'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export function FloatingDock({ items }: { items: { title: string; icon: any; href: string }[] }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-16 items-end gap-4 rounded-2xl bg-card/80 px-4 pb-3 backdrop-blur-md border border-border shadow-xl"
    >
      {items.map((item, idx) => (
        <DockIcon key={idx} mouseX={mouseX} icon={item.icon} title={item.title} />
      ))}
    </motion.div>
  );
}

function DockIcon({ mouseX, icon: Icon, title }: any) {
  const distance = useTransform(mouseX, (val: number) => val - 100);
  const width = useSpring(useTransform(distance, [-150, 0, 150], [40, 64, 40]), { stiffness: 300, damping: 25 });

  return (
    <motion.div style={{ width, height: width }} className="flex items-center justify-center rounded-full bg-muted/80 hover:bg-accent cursor-pointer">
      <Icon className="w-1/2 h-1/2 text-foreground" />
    </motion.div>
  );
}`,
    demoSnippet: `import { FloatingDock } from './code';
import { Home, Layers, Settings, User } from 'lucide-react';

export default function Demo() {
  const links = [
    { title: "Home", icon: Home, href: "#" },
    { title: "Projects", icon: Layers, href: "#" },
    { title: "Profile", icon: User, href: "#" },
    { title: "Settings", icon: Settings, href: "#" }
  ];
  return <FloatingDock items={links} />;
}`
  },

  "bento-grid-3x3": {
    slug: "bento-grid-3x3",
    name: "Interactive SaaS Bento Grid",
    category: "bento_grids",
    description: "Responsive 3x3 bento grid layout with subtle hover elevation and dark mode HSL styling.",
    author: "shadcn",
    registryUrl: "https://21st.dev/r/shadcn/bento-grid",
    tags: ["bento", "grid", "dashboard", "layout", "responsive"],
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    codeSnippet: `import React from 'react';
import { cn } from '@/lib/utils';

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto p-4", className)}>
      {children}
    </div>
  );
}

export function BentoCard({ title, description, header, icon: Icon, className }: any) {
  return (
    <div className={cn("row-span-1 rounded-2xl group/bento hover:shadow-xl transition duration-200 p-6 bg-card border border-border flex flex-col justify-between space-y-4", className)}>
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {Icon && <Icon className="w-6 h-6 text-primary mb-2" />}
        <div className="font-bold text-foreground mb-1">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}`,
    demoSnippet: `import { BentoGrid, BentoCard } from './code';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export default function Demo() {
  return (
    <BentoGrid>
      <BentoCard title="AI Copilot" description="Context aware auto-completion" icon={Sparkles} className="md:col-span-2" />
      <BentoCard title="Enterprise Shield" description="SOC2 Type II Compliant" icon={Shield} />
    </BentoGrid>
  );
}`
  }
};
