import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Github, Mail, Phone, Home, LayoutGrid, Sparkles, ArrowUpRight,
  MessageCircle, GraduationCap, X, ChevronLeft, ChevronRight, Lock
} from "lucide-react";

/**
 * Dynamic loading of screenshot assets per project folder
 */
const globModules = import.meta.glob('/src/assets/projects/*/*.{png,jpg,jpeg,webp}', { eager: true });

const slugMap = {
  "letschat": "lets-chat",
  "ideacatalyst": "idea-catalyst",
  "foodies": "foodies",
  "expensify": "expensify",
  "taskmate": "taskmate",
  "shopease": "shopease"
};

const projectImages = {};

Object.entries(globModules).forEach(([path, mod]) => {
  const parts = path.split('/');
  const projectsIdx = parts.indexOf('projects');
  if (projectsIdx !== -1 && parts[projectsIdx + 1]) {
    const rawFolder = parts[projectsIdx + 1];
    const slug = slugMap[rawFolder] || rawFolder;
    const url = typeof mod === 'string' ? mod : (mod?.default || mod);
    
    if (!projectImages[slug]) {
      projectImages[slug] = [];
    }
    projectImages[slug].push({ path, url });
  }
});

Object.keys(projectImages).forEach((slug) => {
  projectImages[slug].sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));
  projectImages[slug] = projectImages[slug].map((item) => item.url);
});

const PROJECTS = [
  {
    slug: "lets-chat",
    name: "Let's Chat",
    years: "Jan – Mar 2026",
    desc: "A fully functional, WhatsApp-style messaging app with real-time chat, communities, and voice/video call UI — backed by Firebase.",
    tags: ["Flutter", "Firebase", "Realtime DB"],
    link: "https://github.com/aimahbilal1/Lets-chat",
    hue: "coral",
    images: projectImages["lets-chat"] || projectImages["letschat"] || [],
  },
  {
    slug: "foodies",
    name: "Foodies",
    years: "2026",
    desc: "Complete food delivery frontend — onboarding, home feed, categories, cart, checkout, and order tracking, with smooth animations throughout.",
    tags: ["Flutter", "Dart"],
    link: "https://github.com/aimahbilal1/Foodies-App",
    hue: "lime",
    images: projectImages["foodies"] || [],
  },
  {
    slug: "expensify",
    name: "Expensify",
    years: "2026",
    desc: "A premium, dark-themed expense tracker with spending analytics, savings plans, category breakdowns, and multi-account management.",
    tags: ["Flutter", "Dart", "Charts"],
    link: "https://github.com/aimahbilal1/Expensify",
    hue: "indigo",
    images: projectImages["expensify"] || [],
  },
  {
    slug: "taskmate",
    name: "TaskMate",
    years: "2026 · Freelance",
    desc: "20+ screen Figma system for an on-demand home services platform — booking flow, provider profiles, chat, ratings, and order management.",
    tags: ["Figma", "Design System"],
    link: null,
    hue: "coral",
    images: projectImages["taskmate"] || [],
  },
  {
    slug: "shopease",
    name: "ShopEase & SellerEase",
    years: "Apr – Jun 2025",
    desc: "Dual-role e-commerce app: product browsing, cart, and order management for buyers, plus a dedicated admin inventory panel for sellers.",
    tags: ["Flutter", "Firebase", "Supabase"],
    link: "https://github.com/igmoiiz/Shop-Ease-Full_Stack",
    hue: "lime",
    images: projectImages["shopease"] || [],
  },
  {
    slug: "idea-catalyst",
    name: "Idea Catalyst",
    years: "Nov 2025 – Jan 2026",
    desc: "A startup idea generator with user/admin roles and analytics-based outputs, deployed live as a primary portfolio demo of frontend skill.",
    tags: ["React", "JavaScript"],
    link: "https://github.com/igmoiiz/IdeaCatalyst---Backend",
    liveLink: "https://idea-catalyst.netlify.app/",
    hue: "indigo",
    images: projectImages["idea-catalyst"] || projectImages["ideacatalyst"] || [],
  },
  {
    slug: "oric-portal",
    name: "ORIC Database Portal",
    years: "2026 · TCCI Internship",
    confidential: true,
    desc: "Designed and developed the frontend experience for a centralized ORIC platform covering research, projects, publications, innovation, commercialization, startups, and laboratories. Built role-based dashboards and authentication flows using React/Next.js while translating high-fidelity Figma designs into responsive interfaces.",
    tags: ["UI/UX", "Frontend", "React", "Next.js", "Figma", "TypeScript"],
    link: null,
    hue: "indigo",
    images: [],
  },
  {
    slug: "tcci-live",
    name: "TCCI Live — News & Streaming Platform",
    years: "2026 · TCCI Internship",
    confidential: true,
    desc: "Designed and developed frontend interfaces for a TCCI-focused platform featuring news, webinars, and live-streaming content. Focused on clean content discovery, responsive layouts, and consistency with the TCCI brand.",
    tags: ["UI/UX", "Frontend", "React", "Responsive Design"],
    link: null,
    hue: "coral",
    images: [],
  },
  {
    slug: "tcci-lab",
    name: "TCCI Laboratory Platform",
    years: "2026 · TCCI Internship",
    confidential: true,
    desc: "Contributed to the frontend development of a platform for organizing and presenting university laboratories — their capabilities and activities within the TCCI ecosystem. Designed UI components, translated design concepts into functional interfaces, and collaborated with another intern to maintain UI consistency across the build.",
    tags: ["UI/UX", "Figma", "React", "Frontend"],
    link: null,
    hue: "lime",
    images: [],
  },
];

const SKILLS = [
  { label: "Languages", items: ["Dart", "JavaScript", "C#", "SQL"] },
  { label: "Frameworks & Tools", items: ["Flutter", "React", "Next.js", "TypeScript", "Firebase", "Supabase", ".NET"] },
  { label: "UI/UX & Design", items: ["Figma", "Canva", "Interface Design", "Responsive Layouts"] },
  { label: "Web Development", items: ["HTML", "CSS", "Tailwind CSS", "React", "JavaScript"] },
  { label: "Backend & Database", items: ["Node.js", "Express", "Firebase Realtime DB", "MySQL", "SQL Server"] },
  { label: "Tools & Platforms", items: ["Git", "GitHub"] },
  { label: "Core Concepts", items: ["OOP", "Data Structures", "API Integration", "REST APIs"] },
];

const NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: LayoutGrid },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "contact", label: "Contact", icon: MessageCircle },
];

function ProjectCard({ project, onOpenLightbox }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = project.images || [];

  return (
    <article className={`ap-card hue-${project.hue}`}>
      <div className="ap-shot">
        {project.confidential ? (
          <div className="ap-shot-placeholder">
            <Lock size={18} style={{ marginBottom: 6, color: "var(--muted)" }} />
            <span>Client work — visuals confidential</span>
          </div>
        ) : images.length > 0 ? (
          <>
            <img
              src={images[activeIdx]}
              alt={`${project.name} screenshot ${activeIdx + 1}`}
              className="ap-shot-main"
              onClick={() => onOpenLightbox(images, activeIdx, project.name)}
            />
            {images.length > 1 && (
              <span className="ap-shot-badge">
                {activeIdx + 1} / {images.length}
              </span>
            )}
            {images.length > 1 && (
              <div className="ap-shot-nav" onClick={(e) => e.stopPropagation()}>
                {images.length <= 4 ? (
                  <div className="ap-shot-dots">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`ap-shot-dot ${i === activeIdx ? "active" : ""}`}
                        onClick={() => setActiveIdx(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="ap-shot-thumbs">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`ap-shot-thumb ${i === activeIdx ? "active" : ""}`}
                        onClick={() => setActiveIdx(i)}
                        aria-label={`View screenshot ${i + 1}`}
                      >
                        <img src={img} alt={`Thumb ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="ap-shot-placeholder">
            <span>Drop screenshot in<br /><code>src/assets/projects/</code></span>
          </div>
        )}
      </div>
      <div className="ap-card-body">
        <div className="ap-card-top">
          <h3>{project.name}</h3>
          <span className="ap-years">{project.years}</span>
        </div>
        <p className="ap-desc">{project.desc}</p>
        <div className="ap-tag-row">
          {project.tags.map((t) => <span className="ap-tag" key={t}>{t}</span>)}
        </div>
        {(project.link || project.liveLink) && (
          <div className="ap-link-row">
            {project.link && (
              <a className="ap-link" href={project.link} target="_blank" rel="noopener noreferrer">
                View on GitHub <ArrowUpRight size={14} />
              </a>
            )}
            {project.liveLink && (
              <a className="ap-link" href={project.liveLink} target="_blank" rel="noopener noreferrer">
                Live Site <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightbox, setLightbox] = useState(null); // { images, index, name }
  const heroRef = useRef(null);
  const spotRef = useRef(null);
  const meshRef = useRef(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // keyboard handler for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft" && lightbox.images.length > 1) {
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index - 1 + prev.images.length) % prev.images.length,
        }));
      }
      if (e.key === "ArrowRight" && lightbox.images.length > 1) {
        setLightbox((prev) => ({
          ...prev,
          index: (prev.index + 1) % prev.images.length,
        }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const openLightbox = (images, index, name) => {
    setLightbox({ images, index, name });
  };

  // cursor spotlight, desktop only, respects reduced motion
  useEffect(() => {
    if (reduceMotion.current) return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    const onMove = (e) => {
      if (spotRef.current) {
        spotRef.current.style.setProperty("--mx", `${e.clientX}px`);
        spotRef.current.style.setProperty("--my", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // soft parallax on mesh blobs on scroll, respecting reduced motion
  useEffect(() => {
    if (reduceMotion.current) return;
    const onScroll = () => {
      if (meshRef.current) {
        meshRef.current.style.transform = `translateY(${window.scrollY * 0.12}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // phone tilt on hero mousemove
  const handleHeroMove = useCallback((e) => {
    if (reduceMotion.current || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  }, []);
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // active section tracking for bottom tab bar
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="ap-root">
      <style>{CSS}</style>

      <div ref={spotRef} className="ap-spotlight" aria-hidden="true" />
      <div ref={meshRef} className="ap-mesh" aria-hidden="true">
        <span className="blob blob-coral" />
        <span className="blob blob-indigo" />
        <span className="blob blob-lime" />
      </div>

      <div className="ap-status">
        <span><span className="ap-dot" />open to opportunities</span>
        <span className="ap-brand">AIMAH BILAL</span>
        <span className="ap-status-loc">multan, pk</span>
      </div>

      <div className="ap-wrap">
        {/* HERO */}
        <section
          id="home"
          className="ap-hero"
          ref={heroRef}
          onMouseMove={handleHeroMove}
          onMouseLeave={resetTilt}
        >
          <div>
            <div className="ap-eyebrow">Hi, I'm Aimah Bilal</div>
            <h1 className="ap-h1">
              UI/UX Designer &<br />
              <span className="ap-accent">Frontend Developer</span>
            </h1>
            <p className="ap-lede">
              I design intuitive digital experiences and turn them into responsive, functional web interfaces.
            </p>
            <div className="ap-hero-tech">
              Figma · React · Next.js · TypeScript · JavaScript · Tailwind CSS
            </div>
            <div className="ap-cta-row">
              <a href="#work" className="ap-btn ap-btn-primary">
                View My Work <ArrowUpRight size={16} />
              </a>
              <a href="#contact" className="ap-btn ap-btn-ghost">Let's Connect</a>
            </div>
            <div className="ap-stat-row">
              <div className="ap-stat"><div className="ap-num">9+</div><div className="ap-label">projects delivered</div></div>
              <div className="ap-stat"><div className="ap-num">6th</div><div className="ap-label">semester, BSCS</div></div>
              <div className="ap-stat"><div className="ap-num">3.29</div><div className="ap-label">CGPA</div></div>
            </div>
          </div>

          <div className="ap-phone-stage">
            <div
              className="ap-phone"
              style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            >
              <div className="ap-phone-screen">
                <div className="ap-phone-header">
                  <div className="ap-avatar" />
                  <div>
                    <div className="ap-name">Design Review</div>
                    <div className="ap-sub">● online</div>
                  </div>
                </div>
                <div className="ap-bubble ap-in">Can you ship the new theme by Friday?</div>
                <div className="ap-bubble ap-out">Already building it ✦</div>
                <div className="ap-bubble ap-in">Pixel-perfect as always</div>
                <div className="ap-bubble ap-out">That's the only setting I have</div>
                <div className="ap-typing"><span /><span /><span /></div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="ap-section">
          <div className="ap-section-head">
            <div className="ap-eyebrow">about</div>
            <h2 className="ap-h2">Grounded in code, driven by design.</h2>
          </div>
          <div className="ap-about-grid">
            <div>
              <p><strong>I'm Aimah</strong> — a Computer Science student and UI/UX Designer & Frontend Developer who designs interfaces and then builds them. During my internship at TCCI, I worked on real digital platforms — an ORIC Database Portal, a news and live-streaming site, and a lab platform — across both design and frontend.</p>
              <p>I work with Figma, React, Next.js, TypeScript, and Tailwind CSS, with backend experience in Node.js, Express, MongoDB, Firebase, and Supabase. I care about interfaces that are polished, accessible, and genuinely usable.</p>
            </div>
            <div className="ap-edu-card">
              <span className="ap-tag-pill"><GraduationCap size={13} /> education</span>
              <h3>BS Computer Science</h3>
              <div className="ap-school">Air University, Multan Campus</div>
              <div className="ap-edu-row"><span>Aug 2023 – Jun 2027</span><b>6th Semester</b></div>
              <div className="ap-edu-row ap-edu-row-last"><span>CGPA</span><b>3.29</b></div>
            </div>
          </div>
        </section>

        {/* WHY WORK WITH ME */}
        <section id="why" className="ap-section">
          <div className="ap-section-head">
            <div className="ap-eyebrow">why work with me</div>
            <h2 className="ap-h2">Design that ships.</h2>
          </div>
          <div className="ap-why-grid">
            <div className="ap-why-card">
              <h3>Design + Development</h3>
              <p>I understand both sides of the product — from user flows and high-fidelity UI designs in Figma to implementing responsive interfaces with modern frontend technologies.</p>
            </div>
            <div className="ap-why-card">
              <h3>Real-World Experience</h3>
              <p>Through my TCCI internship, I contributed to production-oriented digital platforms and worked with complex requirements, dashboards, role-based interfaces, and database-driven systems.</p>
            </div>
            <div className="ap-why-card">
              <h3>Problem Solver</h3>
              <p>I enjoy breaking down complex requirements into clear user flows, organized information architectures, and practical interface solutions.</p>
            </div>
            <div className="ap-why-card">
              <h3>Collaborative Mindset</h3>
              <p>I've worked with developers, supervisors, and other interns using collaborative workflows and Git/GitHub to refine and implement digital products.</p>
            </div>
            <div className="ap-why-card">
              <h3>Always Learning</h3>
              <p>I'm continuously improving my design and development skills and enjoy working on products where I can learn, contribute, and create meaningful user experiences.</p>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="ap-section">
          <div className="ap-section-head">
            <div className="ap-eyebrow">selected work</div>
            <h2 className="ap-h2">Nine builds, one obsession with detail.</h2>
            <p className="ap-section-sub">Each card represents a real project or platform — click image to expand screenshot lightbox.</p>
          </div>

          <div className="ap-grid">
            {PROJECTS.map((p) => (
              <ProjectCard project={p} key={p.name} onOpenLightbox={openLightbox} />
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="ap-section">
          <div className="ap-section-head">
            <div className="ap-eyebrow">toolkit</div>
            <h2 className="ap-h2">What I build with.</h2>
          </div>
          <div className="ap-skill-groups">
            {SKILLS.map((s) => (
              <div className="ap-skill-card" key={s.label}>
                <div className="ap-skill-label">{s.label}</div>
                <div className="ap-pill-row">
                  {s.items.map((it) => <span className="ap-pill" key={it}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="ap-section">
          <div className="ap-section-head">
            <div className="ap-eyebrow">experience</div>
            <h2 className="ap-h2">Where I've worked.</h2>
          </div>
          <div className="ap-timeline">
            <div className="ap-tl-item">
              <h3>UI/UX & Frontend Development Intern</h3>
              <div className="ap-role-meta"><span className="ap-company">TCCI</span><span>·</span><span>2026</span></div>
              <ul>
                <li>Contributed to UI/UX design and frontend development of TCCI digital platforms, including the ORIC Database Portal and TCCI Live.</li>
                <li>Designed high-fidelity interfaces, dashboards, authentication flows, and research and commercialization modules.</li>
                <li>Translated designs into responsive web interfaces using React/Next.js.</li>
              </ul>
            </div>
            <div className="ap-tl-item">
              <h3>Content Writer</h3>
              <div className="ap-role-meta"><span className="ap-company">Fiesta Consultants</span><span>·</span><span>Aug 2024 – Dec 2025</span></div>
              <ul>
                <li>Created original, plagiarism-free content tailored to diverse client briefs.</li>
                <li>Designed engaging presentations and visual assets using Canva.</li>
                <li>Collaborated directly with clients to translate requirements into delivered work.</li>
              </ul>
            </div>
            <div className="ap-tl-item">
              <h3>C++ Intern</h3>
              <div className="ap-role-meta"><span className="ap-company">HiSkyTech</span><span>·</span><span>Jul 2024 – Aug 2024</span></div>
              <ul>
                <li>Applied core C++ concepts and worked with libraries in scenario-based application development.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="ap-section">
          <div className="ap-contact-panel">
            <h2>Let's build something worth opening.</h2>
            <p>I'm currently looking for internship and junior developer roles in Flutter, frontend, and UI/UX. If you've got a screen that needs designing or an app that needs building, I'd love to hear from you.</p>
            <div className="ap-contact-links">
              <a href="mailto:aimahbilal1@gmail.com"><Mail size={16} /> aimahbilal1@gmail.com</a>
              <a href="tel:+923127108644"><Phone size={16} /> 0312-7108644</a>
              <a href="https://github.com/aimahbilal1" target="_blank" rel="noopener noreferrer"><Github size={16} /> github.com/aimahbilal1</a>
            </div>
          </div>
        </section>

        <footer className="ap-footer">Built by Aimah Bilal · Multan, Pakistan · 2026</footer>
      </div>

      {/* signature bottom tab bar */}
      <nav className="ap-tabbar" aria-label="Section navigation">
        {NAV.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`ap-tab ${active === id ? "ap-tab-active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      {/* Full-size screenshot lightbox */}
      {lightbox && (
        <div
          className="ap-lightbox-backdrop"
          onClick={() => setLightbox(null)}
        >
          <div className="ap-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ap-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close image lightbox"
            >
              <X size={22} />
            </button>

            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="ap-lightbox-nav ap-lightbox-prev"
                onClick={() =>
                  setLightbox((prev) => ({
                    ...prev,
                    index: (prev.index - 1 + prev.images.length) % prev.images.length,
                  }))
                }
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <img
              src={lightbox.images[lightbox.index]}
              alt={`${lightbox.name} screenshot ${lightbox.index + 1}`}
              className="ap-lightbox-img"
            />

            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="ap-lightbox-nav ap-lightbox-next"
                onClick={() =>
                  setLightbox((prev) => ({
                    ...prev,
                    index: (prev.index + 1) % prev.images.length,
                  }))
                }
                aria-label="Next screenshot"
              >
                <ChevronRight size={28} />
              </button>
            )}

            <div className="ap-lightbox-caption">
              {lightbox.name} ({lightbox.index + 1} / {lightbox.images.length})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
  .ap-root{
    --ink:#0D0B14;
    --surface:#141021;
    --surface-2:#221B36;
    --coral:#FF6B57;
    --coral-soft:rgba(255,107,87,0.16);
    --indigo:#7C6FFF;
    --indigo-soft:rgba(124,111,255,0.16);
    --lime:#2FE6C7;
    --lime-soft:rgba(47,230,199,0.16);
    --text:#F5F2FC;
    --muted:#A79FC4;
    --muted-dim:#6B6486;
    --border:rgba(245,242,252,0.08);
    --border-strong:rgba(245,242,252,0.18);

    position:relative;
    background:var(--ink);
    color:var(--text);
    font-family:'Inter',sans-serif;
    line-height:1.6;
    min-height:100vh;
    overflow-x:hidden;
    isolation:isolate;
  }
  .ap-root *{box-sizing:border-box;}
  .ap-root h1,.ap-root h2,.ap-root h3{font-family:'Outfit',sans-serif; letter-spacing:-0.02em; margin:0;}
  .ap-root a{color:inherit; text-decoration:none;}
  .ap-root code{font-family:'JetBrains Mono',monospace;}
  .ap-root ::selection{background:var(--lime); color:#0D0B14;}

  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  /* mesh background */
  .ap-mesh{position:fixed; inset:0; z-index:0; overflow:hidden; pointer-events:none; will-change:transform;}
  .blob{position:absolute; border-radius:50%; filter:blur(90px); opacity:0.35; mix-blend-mode:screen;}
  .blob-coral{width:520px; height:520px; background:var(--coral); top:-140px; left:-120px; animation:drift1 22s ease-in-out infinite;}
  .blob-indigo{width:560px; height:560px; background:var(--indigo); bottom:-200px; right:-160px; animation:drift2 26s ease-in-out infinite;}
  .blob-lime{width:380px; height:380px; background:var(--lime); top:40%; left:60%; opacity:0.18; animation:drift3 30s ease-in-out infinite;}
  @keyframes drift1{ 0%,100%{transform:translate(0,0);} 50%{transform:translate(60px,80px);} }
  @keyframes drift2{ 0%,100%{transform:translate(0,0);} 50%{transform:translate(-70px,-50px);} }
  @keyframes drift3{ 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-40px,40px) scale(1.15);} }
  @media (prefers-reduced-motion: reduce){ .blob{animation:none;} }

  /* cursor spotlight */
  .ap-spotlight{
    position:fixed; inset:0; z-index:1; pointer-events:none;
    background:radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(212,255,63,0.06), transparent 70%);
  }

  .ap-wrap{position:relative; z-index:2; max-width:1120px; margin:0 auto; padding:0 28px;}
  .ap-section{padding:110px 0;}
  @media (max-width:720px){ .ap-section{padding:76px 0;} }

  .ap-status{
    position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between;
    padding:14px 28px; background:rgba(13,11,20,0.75); backdrop-filter:blur(14px);
    border-bottom:1px solid var(--border); font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted);
  }
  .ap-dot{display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--lime); margin-right:8px; box-shadow:0 0 0 3px var(--lime-soft); animation:pulse 2.4s ease-in-out infinite;}
  @keyframes pulse{ 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  .ap-brand{color:var(--text); font-weight:600; letter-spacing:0.02em;}

  .ap-hero{padding:92px 0 50px; display:grid; grid-template-columns:1.1fr 0.9fr; gap:56px; align-items:center; perspective:1000px;}
  @media (max-width:860px){ .ap-hero{grid-template-columns:1fr; padding-top:52px;} }

  .ap-eyebrow{font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.14em; color:var(--lime); text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:10px;}
  .ap-eyebrow::before{content:''; width:24px; height:1px; background:var(--lime);}

  .ap-h1{font-size:clamp(2.3rem,5vw,3.5rem); font-weight:600; line-height:1.08; margin-bottom:22px;}
  .ap-accent{background:linear-gradient(100deg,var(--coral),var(--indigo)); -webkit-background-clip:text; background-clip:text; color:transparent; font-weight:700;}

  .ap-lede{font-size:1.08rem; color:var(--muted); max-width:480px; margin-bottom:20px;}
  .ap-hero-tech{font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted-dim); margin-bottom:32px; letter-spacing:0.02em;}

  .ap-cta-row{display:flex; gap:14px; flex-wrap:wrap;}
  .ap-btn{padding:14px 26px; border-radius:100px; font-weight:600; font-size:0.94rem; display:inline-flex; align-items:center; gap:8px; cursor:pointer; border:1px solid transparent; transition:transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;}
  .ap-btn-primary{background:var(--lime); color:#0D0B14;}
  .ap-btn-primary:hover{transform:translateY(-2px); background:#e2ff6e;}
  .ap-btn-ghost{border-color:var(--border-strong); color:var(--text);}
  .ap-btn-ghost:hover{transform:translateY(-2px); border-color:var(--coral); background:var(--coral-soft);}

  .ap-stat-row{display:flex; gap:32px; margin-top:44px; flex-wrap:wrap;}
  .ap-num{font-family:'Outfit',sans-serif; font-size:1.7rem; font-weight:600;}
  .ap-label{font-size:0.78rem; color:var(--muted-dim); text-transform:uppercase; letter-spacing:0.08em; margin-top:2px;}

  .ap-phone-stage{display:flex; justify-content:center;}
  .ap-phone{
    width:248px; height:504px; border-radius:38px; background:var(--surface);
    border:8px solid #241D36; position:relative; overflow:hidden;
    box-shadow:0 30px 80px -20px rgba(124,111,255,0.35), 0 0 0 1px rgba(255,255,255,0.03);
    transition:transform 0.15s ease-out; transform-style:preserve-3d;
  }
  .ap-phone::before{content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:88px; height:20px; background:#241D36; border-radius:0 0 14px 14px; z-index:5;}
  .ap-phone-screen{position:absolute; inset:0; padding:34px 14px 16px; background:linear-gradient(165deg,#1D1830,#120F1E); display:flex; flex-direction:column; gap:8px;}
  .ap-phone-header{display:flex; align-items:center; gap:8px; margin-bottom:6px;}
  .ap-avatar{width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,var(--coral),var(--indigo));}
  .ap-name{font-size:11px; font-weight:600;}
  .ap-sub{font-size:9px; color:var(--lime);}
  .ap-bubble{max-width:74%; padding:9px 13px; border-radius:14px; font-size:11px; opacity:0; animation:pop 0.5s ease forwards;}
  .ap-in{align-self:flex-start; background:var(--surface-2); color:var(--muted); border-bottom-left-radius:4px;}
  .ap-out{align-self:flex-end; background:var(--indigo); color:#F5F2FC; border-bottom-right-radius:4px;}
  .ap-bubble:nth-of-type(1){animation-delay:0.4s;} .ap-bubble:nth-of-type(2){animation-delay:1.1s;}
  .ap-bubble:nth-of-type(3){animation-delay:1.8s;} .ap-bubble:nth-of-type(4){animation-delay:2.5s;}
  @keyframes pop{ from{opacity:0; transform:translateY(8px) scale(0.96);} to{opacity:1; transform:translateY(0) scale(1);} }
  .ap-typing{display:flex; gap:3px; align-self:flex-start; background:var(--surface-2); padding:9px 12px; border-radius:14px; border-bottom-left-radius:4px; opacity:0; animation:pop 0.5s ease forwards; animation-delay:3.1s;}
  .ap-typing span{width:4px; height:4px; border-radius:50%; background:var(--muted-dim); animation:blink 1.2s infinite;}
  .ap-typing span:nth-child(2){animation-delay:0.2s;} .ap-typing span:nth-child(3){animation-delay:0.4s;}
  @keyframes blink{ 0%,60%,100%{opacity:0.3;} 30%{opacity:1;} }

  .ap-section-head{margin-bottom:52px;}
  .ap-h2{font-size:clamp(1.8rem,3.4vw,2.4rem); font-weight:600;}
  .ap-section-sub{color:var(--muted); max-width:520px; margin-top:12px; font-size:0.98rem;}

  .ap-about-grid{display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:start;}
  @media (max-width:780px){ .ap-about-grid{grid-template-columns:1fr;} }
  .ap-about-grid p{color:var(--muted); margin-bottom:16px;}
  .ap-about-grid strong{color:var(--text);}
  .ap-edu-card{background:var(--surface); border:1px solid var(--border); border-radius:24px; padding:22px;}
  .ap-tag-pill{display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--lime); background:var(--lime-soft); padding:5px 12px; border-radius:100px; margin-bottom:10px;}
  .ap-edu-card h3{font-size:1.1rem; margin-bottom:6px;}
  .ap-school{color:var(--muted); font-size:0.9rem; margin-bottom:14px;}
  .ap-edu-row{display:flex; justify-content:space-between; font-size:0.85rem; color:var(--muted-dim); border-top:1px solid var(--border); padding-top:10px;}
  .ap-edu-row b{color:var(--text);}
  .ap-edu-row-last{border-top:none; padding-top:6px;}

  /* why work with me grid */
  .ap-why-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:20px;}
  @media (max-width:960px){ .ap-why-grid{grid-template-columns:repeat(2,1fr);} }
  @media (max-width:560px){ .ap-why-grid{grid-template-columns:1fr;} }
  .ap-why-card{background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:24px; display:flex; flex-direction:column; gap:10px; transition:border-color 0.2s ease, transform 0.2s ease;}
  .ap-why-card:hover{border-color:var(--border-strong); transform:translateY(-3px);}
  .ap-why-card h3{font-size:1.05rem; font-family:'Outfit',sans-serif; color:var(--text); margin:0;}
  .ap-why-card p{font-size:0.86rem; color:var(--muted); line-height:1.55; margin:0;}

  .ap-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:22px;}
  @media (max-width:900px){ .ap-grid{grid-template-columns:1fr 1fr;} }
  @media (max-width:600px){ .ap-grid{grid-template-columns:1fr;} }

  .ap-card{background:var(--surface); border:1px solid var(--border); border-radius:28px; overflow:hidden; transition:transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; display:flex; flex-direction:column;}
  .ap-card:hover{transform:translateY(-6px);}
  .hue-coral:hover{border-color:rgba(255,107,87,0.45); box-shadow:0 0 25px rgba(255,107,87,0.22), 0 15px 35px -10px rgba(0,0,0,0.5);}
  .hue-indigo:hover{border-color:rgba(124,111,255,0.45); box-shadow:0 0 25px rgba(124,111,255,0.22), 0 15px 35px -10px rgba(0,0,0,0.5);}
  .hue-lime:hover{border-color:rgba(212,255,63,0.45); box-shadow:0 0 25px rgba(212,255,63,0.18), 0 15px 35px -10px rgba(0,0,0,0.5);}

  .ap-shot{aspect-ratio:16/11; width:100%; position:relative; overflow:hidden;}
  .ap-shot-main{width:100%; height:100%; object-fit:cover; display:block; cursor:pointer; transition:opacity 0.2s ease;}
  .ap-shot-badge{position:absolute; top:10px; right:10px; background:rgba(13,11,20,0.75); backdrop-filter:blur(8px); color:var(--muted); font-family:'JetBrains Mono',monospace; font-size:10px; padding:3px 8px; border-radius:100px; border:1px solid var(--border); pointer-events:none; z-index:3;}
  .ap-shot-nav{position:absolute; bottom:0; left:0; right:0; padding:10px 12px; background:linear-gradient(to top, rgba(13,11,20,0.85) 0%, rgba(13,11,20,0) 100%); display:flex; justify-content:center; align-items:center; z-index:3;}
  .ap-shot-dots{display:flex; gap:6px; align-items:center;}
  .ap-shot-dot{width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,0.35); border:none; padding:0; cursor:pointer; transition:all 0.2s ease;}
  .ap-shot-dot:hover{background:rgba(255,255,255,0.7);}
  .ap-shot-dot.active{background:var(--lime); width:18px; border-radius:100px;}
  .ap-shot-thumbs{display:flex; gap:6px; overflow-x:auto; max-width:100%; padding:2px 4px; scrollbar-width:none;}
  .ap-shot-thumbs::-webkit-scrollbar{display:none;}
  .ap-shot-thumb{width:28px; height:28px; border-radius:6px; overflow:hidden; border:1.5px solid transparent; padding:0; background:none; cursor:pointer; flex-shrink:0; opacity:0.6; transition:all 0.2s ease;}
  .ap-shot-thumb:hover{opacity:0.9;}
  .ap-shot-thumb.active{opacity:1; border-color:var(--lime); transform:scale(1.05);}
  .hue-coral .ap-shot{background:linear-gradient(140deg,var(--coral-soft),var(--surface-2));}
  .hue-indigo .ap-shot{background:linear-gradient(140deg,var(--indigo-soft),var(--surface-2));}
  .hue-lime .ap-shot{background:linear-gradient(140deg,var(--lime-soft),var(--surface-2));}
  .ap-shot-placeholder{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:16px;}
  .ap-shot-placeholder span{font-size:11px; color:var(--muted-dim); line-height:1.6;}
  .ap-shot-placeholder code{color:var(--muted); font-size:10.5px;}

  .ap-card-body{padding:22px; display:flex; flex-direction:column; gap:12px; flex:1;}
  .ap-card-top{display:flex; justify-content:space-between; align-items:baseline; gap:8px;}
  .ap-card-top h3{font-size:1.08rem;}
  .ap-years{font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--muted-dim); white-space:nowrap;}
  .ap-desc{color:var(--muted); font-size:0.86rem; line-height:1.55;}
  .ap-tag-row{display:flex; flex-wrap:wrap; gap:6px;}
  .ap-tag{font-family:'JetBrains Mono',monospace; font-size:10.5px; padding:4px 9px; border-radius:100px; background:var(--surface-2); color:var(--muted);}
  .ap-link-row{display:flex; gap:14px; flex-wrap:wrap; margin-top:auto;}
  .ap-link{display:inline-flex; align-items:center; gap:6px; font-size:0.84rem; font-weight:600; color:var(--lime);}

  .ap-skill-groups{display:grid; grid-template-columns:repeat(3,1fr); gap:20px;}
  @media (max-width:820px){ .ap-skill-groups{grid-template-columns:1fr 1fr;} }
  @media (max-width:560px){ .ap-skill-groups{grid-template-columns:1fr;} }
  .ap-skill-card{background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:22px;}
  .ap-skill-label{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--coral); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:14px;}
  .ap-pill-row{display:flex; flex-wrap:wrap; gap:8px;}
  .ap-pill{font-size:0.82rem; padding:6px 12px; border-radius:100px; background:var(--surface-2); border:1px solid var(--border);}

  .ap-timeline{position:relative; padding-left:28px; border-left:1px solid var(--border);}
  @media (max-width:520px){ .ap-timeline{padding-left:24px; margin-left:6px;} }
  .ap-tl-item{position:relative; padding-bottom:40px;}
  .ap-tl-item:last-child{padding-bottom:0;}
  .ap-tl-item::before{content:''; position:absolute; left:-33px; top:4px; width:9px; height:9px; border-radius:50%; background:var(--ink); border:2px solid var(--lime);}
  .ap-tl-item h3{font-size:1.05rem; margin-bottom:2px;}
  .ap-role-meta{display:flex; gap:10px; align-items:center; font-size:0.82rem; color:var(--muted-dim); margin-bottom:10px; flex-wrap:wrap;}
  .ap-company{color:var(--coral); font-weight:600;}
  .ap-tl-item ul{padding-left:18px; color:var(--muted); font-size:0.92rem; display:flex; flex-direction:column; gap:6px;}

  .ap-contact-panel{background:linear-gradient(150deg,var(--surface),var(--surface-2)); border:1px solid var(--border-strong); border-radius:32px; padding:56px; text-align:center; position:relative; overflow:hidden;}
  @media (max-width:600px){ .ap-contact-panel{padding:36px 20px;} }
  .ap-contact-panel h2{font-size:clamp(1.7rem,4vw,2.5rem); margin-bottom:14px; font-family:'Outfit',sans-serif;}
  .ap-contact-panel p{color:var(--muted); max-width:460px; margin:0 auto 30px;}
  .ap-contact-links{display:flex; justify-content:center; gap:14px; flex-wrap:wrap;}
  .ap-contact-links a{display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:100px; border:1px solid var(--border-strong); font-size:0.9rem; font-weight:600; transition:border-color 0.2s ease, background 0.2s ease;}
  .ap-contact-links a:hover{border-color:var(--lime); background:var(--lime-soft);}

  .ap-footer{padding:36px 0 130px; text-align:center; color:var(--muted-dim); font-size:0.8rem; font-family:'JetBrains Mono',monospace;}

  .ap-tabbar{position:fixed; bottom:18px; left:50%; transform:translateX(-50%); z-index:100; display:flex; gap:4px; padding:8px; border-radius:100px; background:rgba(23,19,37,0.85); backdrop-filter:blur(16px); border:1px solid var(--border-strong); box-shadow:0 12px 34px -12px rgba(0,0,0,0.6); max-width:calc(100vw - 24px);}
  .ap-tab{display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 16px; border-radius:100px; color:var(--muted-dim); cursor:pointer; font-size:10px; font-family:'JetBrains Mono',monospace; transition:color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); background:transparent;}
  .ap-tab-active{color:#0D0B14; background:var(--lime); transform:scale(1.04);}
  .ap-tab:not(.ap-tab-active):hover{color:var(--text); background:var(--surface-2);}
  @media (max-width:520px){ .ap-tab span{display:none;} .ap-tab{padding:10px;} }

  /* Lightbox */
  .ap-lightbox-backdrop{
    position:fixed; inset:0; z-index:1000; background:rgba(10,8,16,0.92); backdrop-filter:blur(10px);
    display:flex; align-items:center; justify-content:center; padding:20px;
  }
  .ap-lightbox-content{
    position:relative; max-width:92vw; max-height:88vh; display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  .ap-lightbox-img{
    max-width:90vw; max-height:80vh; object-fit:contain; border-radius:12px;
    box-shadow:0 20px 50px rgba(0,0,0,0.8); border:1px solid var(--border-strong);
  }
  .ap-lightbox-close{
    position:fixed; top:24px; right:24px; background:rgba(23,19,37,0.8); border:1px solid var(--border-strong);
    color:var(--text); border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.2s ease; z-index:1001;
  }
  .ap-lightbox-close:hover{background:var(--coral); color:#0D0B14; transform:scale(1.05);}
  .ap-lightbox-nav{
    position:absolute; top:50%; transform:translateY(-50%); background:rgba(23,19,37,0.8); border:1px solid var(--border-strong);
    color:var(--text); border-radius:50%; width:48px; height:48px; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.2s ease; z-index:1001;
  }
  .ap-lightbox-prev{left:-60px;}
  .ap-lightbox-next{right:-60px;}
  @media (max-width:768px){
    .ap-lightbox-close{top:16px; right:16px;}
    .ap-lightbox-prev{left:10px;}
    .ap-lightbox-next{right:10px;}
  }
  .ap-lightbox-nav:hover{background:var(--lime); color:#0D0B14; transform:translateY(-50%) scale(1.05);}
  .ap-lightbox-caption{
    margin-top:14px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted);
    background:rgba(23,19,37,0.7); padding:4px 14px; border-radius:100px; border:1px solid var(--border);
  }
`;
