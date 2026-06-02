"use client";
import React, { useState, useEffect } from "react";

type Page =
  | "home"
  | "sobre"
  | "academico"
  | "profissional"
  | "projetos";

type Weather = {
  temp: number;
  wind: number;
  icon: string;
} | null;

type Repo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
};

// ─── Weather API Hook ────────────────────────────────────────────────────────
function useWeather() {
 const [weather, setWeather] = useState<{
  temp: number;
  wind: number;
  icon: string;
} | null>(null);
  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-8.1127&longitude=-34.9025&current=temperature_2m,weathercode,windspeed_10m&timezone=America%2FRecife"
    )
      .then((r) => r.json())
      .then((data) => {
        const code = data.current.weathercode;
        const icons: Record<number, string> = {
          0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
          45: "🌫️", 48: "🌫️", 51: "🌦️", 61: "🌧️",
          80: "🌦️", 95: "⛈️",
        };
        const icon = icons[code as number] ?? "🌡️";
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          wind: Math.round(data.current.windspeed_10m),
          icon,
        });
      })
      .catch(() =>
  setWeather({
    temp: 0,
    wind: 0,
    icon: "🌡️",
  })
);
  }, []);
  return weather;
}

// ─── GitHub API Hook ─────────────────────────────────────────────────────────
function useGitHub() {
const [repos, setRepos] = useState<Repo[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/users/adrielbibiano/repos?sort=updated&per_page=12", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const mapped = data.map((r: any) => ({
          name: r.name,
          description: r.description || "Sem descrição",
          language: r.language || "Other",
          stars: r.stargazers_count,
          forks: r.forks_count,
          url: r.html_url,
          updatedAt: new Date(r.updated_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
        }));
        setRepos(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { repos, loading, error };
}

// ─── Data ────────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "Java", level: 80, color: "#e76f51", icon: "☕" },
  { name: "React", level: 75, color: "#48cae4", icon: "⚛️" },
  { name: "Banco de Dados", level: 78, color: "#a8dadc", icon: "🗄️" },
  { name: "Vercel", level: 70, color: "#ffffff", icon: "▲" },
  { name: "Figma", level: 65, color: "#c77dff", icon: "🎨" },
  { name: "HTML/CSS", level: 82, color: "#f4a261", icon: "🌐" },
  { name: "Git", level: 72, color: "#e9c46a", icon: "🌿" },
  { name: "Spring Boot", level: 68, color: "#6db33f", icon: "🌱" },
];

const TECH_STACK = [
  { name: "React 18", role: "Framework UI", icon: "⚛️" },
  { name: "CSS Custom Properties", role: "Estilização / Tema", icon: "🎨" },
  { name: "Open-Meteo API", role: "Clima em tempo real (REST)", icon: "🌦️" },
  { name: "GitHub API", role: "Projetos dinâmicos", icon: "🐙" },
  { name: "CSS Animations", role: "Microinterações & Motion", icon: "✨" },
  { name: "Google Fonts (Syne + Lora)", role: "Tipografia distintiva", icon: "🔤" },
  { name: "CSS Grid & Flexbox", role: "Layout responsivo", icon: "📐" },
  { name: "React Hooks", role: "Estado & Side-effects", icon: "🪝" },
];

const ACADEMIC = [
  {
    degree: "Tecnólogo em Sistemas para Internet",
    school: "UNICAP — Universidade Católica de Pernambuco",
    period: "2025 — cursando",
    detail: "Curso focado em desenvolvimento web full-stack, banco de dados, redes e engenharia de software. Ênfase prática em tecnologias modernas do mercado.",
    icon: "🎓",
  },
  {
    degree: "Ensino Médio Completo",
    school: "Escola Estadual, Recife – PE",
    period: "Concluído",
    detail: "Base sólida em ciências exatas que direcionou o interesse pela área de tecnologia.",
    icon: "📚",
  },
];

const EXPERIENCE = [
  {
    role: "Em busca da primeira oportunidade",
    company: "Mercado de TI — Recife/PE",
    period: "2025 — presente",
    desc: "Desenvolvendo projetos práticos para construção de portfólio sólido. Foco em desenvolvimento full-stack Java + React, modelagem de banco de dados e UI/UX com Figma. Aberto a estágios e posições júnior.",
    tags: ["Java", "React", "SQL", "Figma"],
    highlight: true,
  },
  {
    role: "Desenvolvedor Freelancer",
    company: "Projetos pessoais & acadêmicos",
    period: "2024 — presente",
    desc: "Desenvolvimento de interfaces e sistemas para fins acadêmicos e pessoais. Criação de protótipos no Figma, implementação em React e deploy via Vercel.",
    tags: ["React", "Vercel", "Figma", "CSS"],
    highlight: false,
  },
];

// ─── Animated Number ─────────────────────────────────────────────────────────
function AnimatedBar({
  level,
  color,
}: {
  level: number;
  color: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(level), 300); return () => clearTimeout(t); }, [level]);
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 6, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${w}%`, background: color,
        borderRadius: 999, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: `0 0 12px ${color}88`
      }} />
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({
  active,
  setPage,
}: {
  active: Page;
  setPage: (page: Page) => void;
}) {
  const links = [
  "home",
  "sobre",
  "academico",
  "profissional",
  "projetos",
] as const;
  const labels = { home: "Home", sobre: "Sobre", academico: "Acadêmico", profissional: "Profissional", projetos: "Projetos" };
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 2rem",
      background: scrolled ? "rgba(8,8,20,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64,
    }}>
      <span onClick={() => setPage("home")} style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem",
        color: "#e9c46a", cursor: "pointer", letterSpacing: "0.05em"
      }}>
        AB<span style={{ color: "#fff", opacity: 0.4 }}>.dev</span>
      </span>

      {/* Desktop */}
      <div style={{ display: "flex", gap: "2rem" }} className="nav-desktop">
        {links.map((l) => (
          <button key={l} onClick={() => setPage(l)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Syne', sans-serif", fontSize: "0.8rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: active === l ? "#e9c46a" : "rgba(255,255,255,0.55)",
            transition: "color 0.2s",
            padding: "4px 0",
            borderBottom: active === l ? "1px solid #e9c46a" : "1px solid transparent",
          }}>{labels[l]}</button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)} style={{
        display: "none", background: "none", border: "none",
        color: "#fff", fontSize: "1.4rem", cursor: "pointer"
      }} className="nav-mobile-btn">☰</button>

      {open && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0,
          background: "rgba(8,8,20,0.98)", padding: "1rem 2rem",
          display: "flex", flexDirection: "column", gap: "1rem"
        }}>
          {links.map((l) => (
            <button key={l} onClick={() => { setPage(l); setOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 600,
              color: active === l ? "#e9c46a" : "#fff", textAlign: "left"
            }}>{labels[l]}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function Home({
  setPage,
  weather,
}: {
  setPage: (page: Page) => void;
  weather: Weather;
}) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "20%", left: "60%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(233,196,106,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(72,202,228,0.06) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {/* Weather badge */}
        {weather && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999, padding: "6px 16px", marginBottom: "2rem",
            fontFamily: "'Syne', sans-serif", fontSize: "0.75rem",
            color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em"
          }}>
            {weather.icon} Recife, PE — {weather.temp}°C · Vento {weather.wind} km/h
          </div>
        )}

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#e9c46a", marginBottom: "1.2rem", opacity: 0.8 }}>
          Disponível para oportunidades
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1,
          margin: "0 0 1.5rem",
          color: "#fff",
          letterSpacing: "-0.02em",
        }}>
          Adriel<br />
          <span style={{ color: "#e9c46a" }}>Bibiano</span>
        </h1>

        <p style={{
          fontFamily: "'Lora', serif", fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "rgba(255,255,255,0.55)", maxWidth: 540, lineHeight: 1.7,
          marginBottom: "3rem"
        }}>
          Desenvolvedor em formação · Java & React · 32 anos, Recife–PE.
          Construindo soluções com código limpo e design funcional.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => setPage("projetos")} style={{
            background: "#e9c46a", color: "#080814", border: "none",
            padding: "14px 32px", borderRadius: 4, cursor: "pointer",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 0 30px rgba(233,196,106,0.25)",
          }}
           onMouseOver={(e) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 6px 40px rgba(233,196,106,0.4)";
}}

onMouseOut={(e) => {
  e.currentTarget.style.transform = "";
  e.currentTarget.style.boxShadow = "0 0 30px rgba(233,196,106,0.25)";
}}
          >Ver Projetos</button>
          <button onClick={() => setPage("sobre")} style={{
            background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
            padding: "14px 32px", borderRadius: 4, cursor: "pointer",
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.85rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            transition: "all 0.2s",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#e9c46a"; e.currentTarget.style.color = "#e9c46a"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
          >Sobre Mim</button>
        </div>

        {/* Skills pill row */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "4rem", flexWrap: "wrap" }}>
          {SKILLS.map(s => (
            <span key={s.name} style={{
              fontFamily: "'Syne', sans-serif", fontSize: "0.72rem",
              fontWeight: 600, letterSpacing: "0.08em",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${s.color}44`,
              color: s.color, borderRadius: 4,
              padding: "5px 12px",
            }}>{s.icon} {s.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOBRE ───────────────────────────────────────────────────────────────────
function Sobre() {
  return (
    <section style={{ minHeight: "100vh", padding: "8rem 2rem 6rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel>// sobre</SectionLabel>
        <h2 style={h2Style}>Quem sou <span style={{ color: "#e9c46a" }}>eu</span></h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "5rem" }} className="grid-responsive">
          <div>
            <p style={bodyText}>
              Tenho 32 anos, sou de Recife–PE e atualmente estudo <strong style={{ color: "#e9c46a" }}>Sistemas para Internet na UNICAP</strong>. Minha entrada na tecnologia foi motivada por uma paixão genuína por resolver problemas e criar experiências digitais que fazem diferença.
            </p>
            <p style={{ ...bodyText, marginTop: "1.2rem" }}>
              Foco em desenvolvimento full-stack com <strong style={{ color: "#48cae4" }}>Java</strong> no backend e <strong style={{ color: "#48cae4" }}>React</strong> no frontend. Acredito que bom código e bom design andam juntos — por isso também trabalho com <strong style={{ color: "#c77dff" }}>Figma</strong> antes de qualquer linha de CSS.
            </p>
            <p style={{ ...bodyText, marginTop: "1.2rem" }}>
              Estou em busca da minha primeira oportunidade profissional, trazendo muita disposição para aprender, colaborar e crescer junto com uma equipe.
            </p>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>Habilidades técnicas</h3>
            {SKILLS.map(s => (
              <div key={s.name} style={{ marginBottom: "1.2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#fff" }}>{s.icon} {s.name}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", color: s.color }}>{s.level}%</span>
                </div>
                <AnimatedBar level={s.level} color={s.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack usado neste site */}
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#fff", marginBottom: "2rem" }}>
          Tecnologias usadas <span style={{ color: "#e9c46a" }}>neste site</span>
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
          {TECH_STACK.map(t => (
            <div key={t.name} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "1.2rem 1.4rem",
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(233,196,106,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{t.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", marginBottom: "0.3rem" }}>{t.name}</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ACADÊMICO ───────────────────────────────────────────────────────────────
function Academico() {
  return (
    <section style={{ minHeight: "100vh", padding: "8rem 2rem 6rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionLabel>// educação</SectionLabel>
        <h2 style={h2Style}>Experiência <span style={{ color: "#e9c46a" }}>Acadêmica</span></h2>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }} />

          {ACADEMIC.map((a, i) => (
            <div key={i} style={{ paddingLeft: "3.5rem", marginBottom: "3rem", position: "relative" }}>
              {/* dot */}
              <div style={{
                position: "absolute", left: 8, top: 8, width: 24, height: 24,
                borderRadius: "50%", background: "#e9c46a",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700,
              }}>{a.icon}</div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "1.8rem 2rem" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e9c46a", marginBottom: "0.5rem" }}>{a.period}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", margin: "0 0 0.4rem" }}>{a.degree}</h3>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.82rem", color: "#48cae4", marginBottom: "0.8rem" }}>{a.school}</div>
                <p style={{ ...bodyText, margin: 0 }}>{a.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cursos complementares */}
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", marginTop: "3rem", marginBottom: "1.5rem" }}>Aprendizado Contínuo</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {["Java Fundamentos", "Spring Boot", "React Avançado", "SQL & NoSQL", "Figma UI Design", "Git & GitHub", "Deploy com Vercel", "APIs RESTful"].map(c => (
            <div key={c} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, padding: "0.8rem 1rem",
              fontFamily: "'Syne', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)",
              display: "flex", alignItems: "center", gap: "0.5rem"
            }}>
              <span style={{ color: "#e9c46a" }}>▸</span> {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROFISSIONAL ─────────────────────────────────────────────────────────────
function Profissional() {
  return (
    <section style={{ minHeight: "100vh", padding: "8rem 2rem 6rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionLabel>// carreira</SectionLabel>
        <h2 style={h2Style}>Experiência <span style={{ color: "#e9c46a" }}>Profissional</span></h2>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }} />

          {EXPERIENCE.map((e, i) => (
            <div key={i} style={{ paddingLeft: "3.5rem", marginBottom: "3rem", position: "relative" }}>
              <div style={{
                position: "absolute", left: 8, top: 8, width: 24, height: 24,
                borderRadius: "50%",
                background: e.highlight ? "linear-gradient(135deg,#e9c46a,#f4a261)" : "rgba(255,255,255,0.1)",
                border: e.highlight ? "none" : "1px solid rgba(255,255,255,0.2)",
              }} />

              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${e.highlight ? "rgba(233,196,106,0.25)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "1.8rem 2rem",
              }}>
                {e.highlight && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    background: "rgba(233,196,106,0.1)", border: "1px solid rgba(233,196,106,0.3)",
                    borderRadius: 999, padding: "3px 12px", marginBottom: "0.8rem",
                    fontFamily: "'Syne', sans-serif", fontSize: "0.7rem",
                    color: "#e9c46a", letterSpacing: "0.1em", textTransform: "uppercase"
                  }}>✦ Disponível</div>
                )}
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e9c46a", marginBottom: "0.5rem" }}>{e.period}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", margin: "0 0 0.3rem" }}>{e.role}</h3>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.82rem", color: "#48cae4", marginBottom: "0.8rem" }}>{e.company}</div>
                <p style={{ ...bodyText, marginBottom: "1rem" }}>{e.desc}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {e.tags.map(t => (
                    <span key={t} style={{
                      fontFamily: "'Syne', sans-serif", fontSize: "0.7rem", fontWeight: 700,
                      letterSpacing: "0.08em", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)",
                      borderRadius: 4, padding: "3px 10px"
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: "linear-gradient(135deg, rgba(233,196,106,0.08), rgba(72,202,228,0.05))",
          border: "1px solid rgba(233,196,106,0.2)", borderRadius: 12,
          padding: "2.5rem", textAlign: "center", marginTop: "2rem"
        }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff", marginBottom: "0.8rem" }}>
            Vamos trabalhar juntos?
          </div>
          <p style={{ ...bodyText, marginBottom: "1.5rem" }}>
            Estou disponível para estágios, freelas e posições júnior. Baseado em Recife–PE, com disponibilidade para trabalho remoto.
          </p>
          <a href="mailto:adrielbibiano@email.com" style={{
            display: "inline-block", background: "#e9c46a", color: "#080814",
            padding: "12px 28px", borderRadius: 4, textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.82rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>✉ Entrar em Contato</a>
        </div>
      </div>
    </section>
  );
}

// ─── PROJETOS ─────────────────────────────────────────────────────────────────
function Projetos({
  repos,
  loading,
  error,
}: {
  repos: Repo[];
  loading: boolean;
  error: string | null;
}) {
  const langColors: Record<string, string> = {
  Java: "#e76f51",
  JavaScript: "#f4d03f",
  SQL: "#48cae4",
  TypeScript: "#3b82f6",
  HTML: "#f97316",
  CSS: "#a855f7",
  Python: "#facc15",
  Other: "#94a3b8",
};

  return (
    <section style={{ minHeight: "100vh", padding: "8rem 2rem 6rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel>// github · adrielbibiano</SectionLabel>
        <h2 style={h2Style}>Projetos <span style={{ color: "#e9c46a" }}>Desenvolvidos</span></h2>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
          <p style={{ ...bodyText, maxWidth: 520 }}>
            Repositórios reais puxados diretamente do meu GitHub via <span style={{ color: "#48cae4" }}>GitHub REST API</span>. Atualizados automaticamente a cada visita.
          </p>
          <a
            href="https://github.com/adrielbibiano"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6, padding: "8px 16px", textDecoration: "none",
              fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 600,
              color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#e9c46a"; e.currentTarget.style.color = "#e9c46a"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >
            🐙 Ver perfil no GitHub →
          </a>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: "1.8rem", height: 160,
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{
            background: "rgba(231,111,81,0.08)", border: "1px solid rgba(231,111,81,0.25)",
            borderRadius: 10, padding: "2rem", textAlign: "center",
            fontFamily: "'Syne', sans-serif",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>⚠️</div>
            <div style={{ color: "#e76f51", fontWeight: 700, marginBottom: "0.4rem" }}>Não foi possível carregar os repositórios</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{error}</div>
          </div>
        )}

        {/* Repos grid */}
        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {repos.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
                  padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.8rem",
                  transition: "border-color 0.2s, transform 0.2s",
                  textDecoration: "none",
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(233,196,106,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.2rem" }}>📦</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 3 }}>
                      🍴 {r.forks}
                    </span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 3 }}>
                      ⭐ {r.stars}
                    </span>
                  </div>
                </div>

                {/* Name + description */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: "0 0 0.4rem", wordBreak: "break-word" }}>
                    {r.name}
                  </h3>
                  <p style={{ fontFamily: "'Lora', serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>
                    {r.description}
                  </p>
                </div>

                {/* Bottom row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{
                    fontFamily: "'Syne', sans-serif", fontSize: "0.7rem", fontWeight: 700,
                    color: langColors[r.language] || langColors.Other,
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: langColors[r.language] || langColors.Other, display: "inline-block", flexShrink: 0 }} />
                    {r.language}
                  </span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.25)" }}>
                    {r.updatedAt}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* API badge */}
        <div style={{
          marginTop: "3rem", padding: "1rem 1.4rem", borderRadius: 8,
          background: "rgba(72,202,228,0.05)", border: "1px solid rgba(72,202,228,0.15)",
          fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap"
        }}>
          🐙 <span>
            Dados ao vivo via <strong style={{ color: "#48cae4" }}>GitHub REST API v3</strong>
            {" — "}
            <code style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>
              api.github.com/users/adrielbibiano/repos
            </code>
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      fontFamily: "'Syne', sans-serif", fontSize: "0.72rem",
      letterSpacing: "0.15em", color: "#48cae4",
      marginBottom: "1rem", opacity: 0.7
    }}>{children}</div>
  );
};
const h2Style = {
  fontFamily: "'Syne', sans-serif", fontWeight: 800,
  fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1,
  color: "#fff", margin: "0 0 2.5rem", letterSpacing: "-0.02em"
};
const bodyText = {
  fontFamily: "'Lora', serif", fontSize: "0.95rem",
  color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0
};

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "2rem", textAlign: "center",
      fontFamily: "'Syne', sans-serif", fontSize: "0.75rem",
      color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em"
    }}>
      Adriel Bibiano · Recife–PE · {new Date().getFullYear()} · Feito com React & ☕
    </footer>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const weather = useWeather();
  const { repos, loading: reposLoading, error: reposError } = useGitHub();

  const pageMap: Record<Page, React.ReactElement> = {
    home: <Home setPage={setPage} weather={weather} />,
    sobre: <Sobre />,
    academico: <Academico />,
    profissional: <Profissional />,
    projetos: <Projetos repos={repos} loading={reposLoading} error={reposError} />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080814; color: #fff; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080814; }
        ::-webkit-scrollbar-thumb { background: rgba(233,196,106,0.3); border-radius: 999px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        section { animation: fadeUp 0.5s ease both; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          .grid-responsive { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
      <Nav active={page} setPage={(p) => { setPage(p); window.scrollTo(0, 0); }} />
      <main>{pageMap[page]}</main>
      <Footer />
    </>
  );
}