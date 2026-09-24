import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  IcosahedronGeometry,
  MeshBasicMaterial,
  Mesh,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
} from "three";
import {
  Github, Mail, Phone, GraduationCap, X,
  ChevronLeft, ChevronRight, Lock, Menu, ArrowUpRight, MessageCircle
} from "lucide-react";

/* ─── Asset loading ────────────────────────────────────────────────────────── */
const globModules = import.meta.glob(
  "/src/assets/projects/*/*.{png,jpg,jpeg,webp}",
  { eager: true }
);

const slugMap = {
  letschat: "lets-chat",
  ideacatalyst: "idea-catalyst",
  foodies: "foodies",
  expensify: "expensify",
  taskmate: "taskmate",
  shopease: "shopease",
};

const projectImages = {};
Object.entries(globModules).forEach(([path, mod]) => {
  const parts = path.split("/");
  const idx = parts.indexOf("projects");
  if (idx !== -1 && parts[idx + 1]) {
    const raw = parts[idx + 1];
    const slug = slugMap[raw] || raw;
    const url = typeof mod === "string" ? mod : mod?.default || mod;
    if (!projectImages[slug]) projectImages[slug] = [];
    projectImages[slug].push({ path, url });
  }
});
Object.keys(projectImages).forEach((slug) => {
  projectImages[slug].sort((a, b) =>
    a.path.localeCompare(b.path, undefined, { numeric: true })
  );
  projectImages[slug] = projectImages[slug].map((i) => i.url);
});

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    slug: "lets-chat",
    name: "Let's Chat",
    years: "Jan to Mar 2026",
    desc: "A fully functional, WhatsApp style messaging app with real time chat, communities, and voice/video call UI backed by Firebase.",
    tags: ["Flutter", "Firebase", "Realtime DB"],
    link: "https://github.com/mr-uzairnaseer/Lets-chat",
    images: projectImages["lets-chat"] || projectImages["letschat"] || [],
  },
  {
    slug: "foodies",
    name: "Foodies",
    years: "2026",
    desc: "Complete food delivery frontend including onboarding, home feed, categories, cart, checkout, and order tracking, with smooth animations throughout.",
    tags: ["Flutter", "Dart"],
    link: "https://github.com/mr-uzairnaseer/Foodies-App",
    images: projectImages["foodies"] || [],
  },
  {
    slug: "expensify",
    name: "Expensify",
    years: "2026",
    desc: "A premium, dark themed expense tracker with spending analytics, savings plans, category breakdowns, and multi account management.",
    tags: ["Flutter", "Dart", "Charts"],
    link: "https://github.com/mr-uzairnaseer/Expensify",
    images: projectImages["expensify"] || [],
  },
  {
    slug: "taskmate",
    name: "TaskMate",
    years: "2026 · Freelance",
    desc: "20+ screen Figma system for an on demand home services platform featuring booking flow, provider profiles, chat, ratings, and order management.",
    tags: ["Figma", "Design System"],
    link: null,
    images: projectImages["taskmate"] || [],
  },
  {
    slug: "shopease",
    name: "ShopEase & SellerEase",
    years: "Apr to Jun 2025",
    desc: "Dual role e-commerce app: product browsing, cart, and order management for buyers, plus a dedicated admin inventory panel for sellers.",
    tags: ["Flutter", "Firebase", "Supabase"],
    link: "https://github.com/igmoiiz/Shop-Ease-Full_Stack",
    images: projectImages["shopease"] || [],
  },
  {
    slug: "idea-catalyst",
    name: "Idea Catalyst",
    years: "Nov 2025 to Jan 2026",
    desc: "A startup idea generator with user/admin roles and analytics based outputs, deployed live as a primary portfolio demo of frontend skill.",
    tags: ["React", "JavaScript"],
    link: "https://github.com/igmoiiz/IdeaCatalyst---Backend",
    liveLink: "https://idea-catalyst.netlify.app/",
    images: projectImages["idea-catalyst"] || projectImages["ideacatalyst"] || [],
  },
  {
    slug: "oric-portal",
    name: "ORIC Database Portal",
    years: "2026 · TCCI Internship",
    confidential: true,
    desc: "Designed and developed the frontend experience for a centralized ORIC platform covering research, projects, publications, innovation, commercialization, startups, and laboratories. Built role based dashboards and authentication flows using React/Next.js while translating high fidelity Figma designs into responsive interfaces.",
    tags: ["UI/UX", "Frontend", "React", "Next.js", "Figma", "TypeScript"],
    link: null,
    images: [],
  },
  {
    slug: "tcci-live",
    name: "TCCI Live News & Streaming Platform",
    years: "2026 · TCCI Internship",
    confidential: true,
    desc: "Designed and developed frontend interfaces for a TCCI focused platform featuring news, webinars, and live streaming content. Focused on clean content discovery, responsive layouts, and consistency with the TCCI brand.",
    tags: ["UI/UX", "Frontend", "React", "Responsive Design"],
    link: null,
    images: [],
  },
  {
    slug: "tcci-lab",
    name: "TCCI Laboratory Platform",
    years: "2026 · TCCI Internship",
    confidential: true,
    desc: "Contributed to the frontend development of a platform for organizing and presenting university laboratories and their capabilities within the TCCI ecosystem. Designed UI components, translated design concepts into functional interfaces, and collaborated with another intern to maintain UI consistency across the build.",
    tags: ["UI/UX", "Figma", "React", "Frontend"],
    link: null,
    images: [],
  },
];

const SKILLS = [
  { label: "Design & Prototyping Tools", items: ["Figma", "Adobe XD", "Illustrator", "Photoshop", "Canva"] },
  { label: "UI/UX Competencies", items: ["User-Centered Design", "Design Thinking", "Wireframing", "Prototyping", "User Research", "Usability Testing", "Interaction Design", "Responsive Design"] },
  { label: "Graphic Design", items: ["Branding", "Visual Identity", "Logo & Icon Design", "Typography", "Color Theory", "Illustration"] },
  { label: "Development", items: ["HTML", "CSS", "Basic Frontend Knowledge"] },
  { label: "Additional Skills", items: ["Design Systems", "Cross-Functional Collaboration", "Storytelling", "Problem-Solving", "Analytical Thinking", "Time Management"] },
];

const TOP_NAV = [
  { id: "about",      label: "About" },
  { id: "why",        label: "Why Me" },
  { id: "craft",      label: "Craft" },
  { id: "work",       label: "Work" },
  { id: "skills",     label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact" },
];

const WHY_ITEMS = [
  {
    title: "User-Centered Approach",
    desc: "I understand the psychology behind user flows and interactions. From initial wireframes to high-fidelity prototypes in Figma, my focus is always on usability and empathy.",
  },
  {
    title: "Real World Experience",
    desc: "Through my TCCI internship, I contributed to production oriented digital platforms and worked with complex requirements, dashboards, role based interfaces, and database driven systems.",
  },
  {
    title: "Problem Solver",
    desc: "I enjoy breaking down complex requirements into clear user flows, organized information architectures, and practical interface solutions.",
  },
  {
    title: "Collaborative Mindset",
    desc: "I've worked with developers, supervisors, and other interns using collaborative workflows and Git/GitHub to refine and implement digital products.",
  },
  {
    title: "Always Learning",
    desc: "I'm continuously improving my design and development skills and enjoy working on products where I can learn, contribute, and create meaningful user experiences.",
  },
];

function getTerminalPath(name, slug) {
  if (slug) return `~/projects/${slug}`;
  return `~/projects/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

/* ─── Scroll reveal hook ────────────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Three.js hero canvas ──────────────────────────────────────────────────── */
function HeroCanvas({ reduceMotion }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const scene = new Scene();
    const camera = new PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 6;

    /* Outer wireframe icosahedron (Burnt Orange #857946) */
    const icoGeo = new IcosahedronGeometry(2.3, 1);
    const icoMat = new MeshBasicMaterial({
      color: 0xC0440A,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const ico = new Mesh(icoGeo, icoMat);
    scene.add(ico);

    /* Inner core wireframe icosahedron (Dark Brown #2C2117) */
    const innerGeo = new IcosahedronGeometry(1.3, 0);
    const innerMat = new MeshBasicMaterial({
      color: 0x2C2117,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const innerIco = new Mesh(innerGeo, innerMat);
    scene.add(innerIco);

    /* Ember particle cloud (Burnt Orange #857946) */
    const COUNT = 480;
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const ptGeo = new BufferGeometry();
    ptGeo.setAttribute("position", new BufferAttribute(pos, 3));
    const ptMat = new PointsMaterial({
      color: 0xC0440A,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    const points = new Points(ptGeo, ptMat);
    scene.add(points);

    /* Deep forest ambient particle field (Dark Brown #2C2117) */
    const pos2 = new Float32Array(280 * 3);
    for (let i = 0; i < 280; i++) {
      pos2[i * 3]     = (Math.random() - 0.5) * 16;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos2[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const ptGeo2 = new BufferGeometry();
    ptGeo2.setAttribute("position", new BufferAttribute(pos2, 3));
    const ptMat2 = new PointsMaterial({
      color: 0x2C2117,
      size: 0.022,
      transparent: true,
      opacity: 0.45,
    });
    const points2 = new Points(ptGeo2, ptMat2);
    scene.add(points2);

    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* Scroll tracking */
    let targetScroll = 0;
    let currentScroll = 0;
    const onScroll = () => {
      targetScroll = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0, raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.004;

      // Smooth scroll interpolation (lerp)
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // Shape stays visible in viewport at all times, gracefully oscillating and shifting
      const driftY = 0.8 + Math.sin(currentScroll * 0.0012) * 1.1 + Math.sin(t * 0.6) * 0.2;
      const driftX = 1.0 + Math.sin(currentScroll * 0.0008 + 0.6) * 1.6 + mx * 0.35;

      ico.position.y = driftY;
      ico.position.x = driftX;
      ico.rotation.x = t * 0.22 + my * 0.08 + currentScroll * 0.0025;
      ico.rotation.y = t * 0.35 + mx * 0.08 + currentScroll * 0.0035;
      ico.rotation.z = currentScroll * 0.0015;

      innerIco.position.y = driftY;
      innerIco.position.x = driftX;
      innerIco.rotation.x = -t * 0.32 - currentScroll * 0.002;
      innerIco.rotation.y = -t * 0.45 + currentScroll * 0.003;

      // Particles orbit and drift with the shape across sections
      points.position.x = driftX * 0.7;
      points.position.y = driftY * 0.7;
      points.rotation.y = t * 0.08 + currentScroll * 0.0018;
      points.rotation.x = t * 0.05 + currentScroll * 0.0012;

      // Ambient field counter-rotation
      points2.rotation.y = -t * 0.04 - currentScroll * 0.0008;
      points2.rotation.x = currentScroll * 0.0005;

      // Camera stays focused with subtle breath dolly
      camera.position.z = 6 + Math.sin(currentScroll * 0.0006) * 0.5;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      renderer.dispose();
      icoGeo.dispose(); icoMat.dispose();
      innerGeo.dispose(); innerMat.dispose();
      ptGeo.dispose(); ptMat.dispose();
      ptGeo2.dispose(); ptMat2.dispose();
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="ap-hero-canvas" aria-hidden="true" />;
}

/* ─── Custom cursor ─────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    document.documentElement.classList.add("has-custom-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, raf;
    let hovered = false;

    const onMove = (e) => { x = e.clientX; y = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    const bindHover = () => {
      document.querySelectorAll("a, button, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    bindHover();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      }
      if (ringRef.current) {
        const s = hovered ? 1.7 : 1;
        ringRef.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px) scale(${s})`;
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cur-dot" aria-hidden="true" />
      <div ref={ringRef} className="cur-ring" aria-hidden="true" />
    </>
  );
}

/* ─── Craft section ─────────────────────────────────────────────────────────── */
function CraftSection({ reduceMotion }) {
  // Lab 1: Magnetic Physics
  const [magCoords, setMagCoords] = useState({ dx: 0, dy: 0, active: false, clicks: 0 });
  const magBtnRef = useRef(null);

  const handleMagMove = (e) => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const btn = magBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.round((e.clientX - cx) * 0.45);
    const dy = Math.round((e.clientY - cy) * 0.45);
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
    setMagCoords((prev) => ({ ...prev, dx, dy, active: true }));
  };

  const handleMagLeave = () => {
    if (magBtnRef.current) magBtnRef.current.style.transform = "translate(0,0)";
    setMagCoords((prev) => ({ ...prev, dx: 0, dy: 0, active: false }));
  };

  // Lab 2: Live Token & Swatch Engine
  const [swatchAngle, setSwatchAngle] = useState(135);
  const [swatchHue, setSwatchHue] = useState(14); // default ember ~ #FF4A2E
  const presets = [
    { label: "Ember", hue: 14 },
    { label: "Flame", hue: 28 },
    { label: "Citrus", hue: 42 },
    { label: "Coral", hue: 350 },
  ];

  // Lab 3: 3D Matrix Card with Glare
  const [flipped, setFlipped] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef(null);

  const handleCardMove = (e) => {
    if (reduceMotion || flipped) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setCardTilt({
      x: (py - 0.5) * -18,
      y: (px - 0.5) * 22,
      glareX: Math.round(px * 100),
      glareY: Math.round(py * 100),
    });
  };
  const handleCardLeave = () => {
    setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  // Lab 4: Live Command Filter Matrix
  const [filterTag, setFilterTag] = useState("All");
  const [filterQuery, setFilterQuery] = useState("");
  const craftTags = [
    { name: "Auth Flows", cat: "Security", count: 4 },
    { name: "Dashboards", cat: "Analytics", count: 7 },
    { name: "Micro Animations", cat: "Motion", count: 12 },
    { name: "WebGL 3D", cat: "Graphics", count: 3 },
    { name: "State Stores", cat: "Architecture", count: 8 },
  ];
  const activeTags = craftTags.filter((t) => {
    const matchCat = filterTag === "All" || t.cat === filterTag;
    const matchQ = t.name.toLowerCase().includes(filterQuery.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <section id="craft" className="ap-section">
      <div className="ap-wrap">
        <div className="ap-section-head">
          <div className="ap-eyebrow">
            <span className="ap-eyebrow-num">03</span> craft
          </div>
          <h2 className="ap-h2">Interfaces I like building.</h2>
          <p className="ap-section-sub">
            Interactive micro-systems built to demonstrate state architecture, 3D transformations, physics, and token calculations.
          </p>
        </div>

        <div className="ap-craft-grid">
          {/* Lab 1: Magnetic Physics */}
          <div
            className="ap-craft-card"
            onMouseMove={handleMagMove}
            onMouseLeave={handleMagLeave}
          >
            <div className="ap-craft-header-bar">
              <span className="ap-craft-badge">Physics</span>
              <span className="ap-craft-telemetry">
                {magCoords.active
                  ? `dx: ${magCoords.dx > 0 ? "+" : ""}${magCoords.dx}px · dy: ${magCoords.dy > 0 ? "+" : ""}${magCoords.dy}px`
                  : "idle · move cursor near button"}
              </span>
            </div>
            <div className="ap-craft-stage">
              <button
                ref={magBtnRef}
                type="button"
                className="ap-mag-btn"
                onClick={() => setMagCoords((prev) => ({ ...prev, clicks: prev.clicks + 1 }))}
              >
                <span>Hover &amp; Drag Pull</span>
                <span className="ap-mag-pill-tag">
                  {magCoords.clicks > 0 ? `${magCoords.clicks} clicks` : "✦ physics"}
                </span>
              </button>
            </div>
            <div className="ap-craft-caption">
              <b>01. Magnetic Physics</b> · Cursor distance-aware velocity translation with elastic spring return.
            </div>
          </div>

          {/* Lab 2: Live Token Swatch Engine */}
          <div className="ap-craft-card">
            <div className="ap-craft-header-bar">
              <span className="ap-craft-badge">Token Engine</span>
              <span className="ap-craft-telemetry">
                HSL({swatchHue}, 100%, 59%) · {swatchAngle}°
              </span>
            </div>
            <div className="ap-craft-stage ap-craft-stage-column">
              <div
                className="ap-swatch-box"
                style={{
                  background: `hsl(${swatchHue}, 100%, 59%)`,
                  transform: `rotate(${swatchAngle * 0.15}deg)`,
                  boxShadow: `0 12px 32px hsla(${swatchHue}, 100%, 50%, 0.28)`,
                }}
              >
                <span className="ap-swatch-label">
                  Dynamic Palette HSL({swatchHue}°)
                </span>
              </div>
              <div className="ap-swatch-controls">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={swatchAngle}
                  onChange={(e) => setSwatchAngle(Number(e.target.value))}
                  className="ap-craft-slider"
                  aria-label="Adjust swatch angle"
                />
                <div className="ap-preset-pills">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className={`ap-preset-pill ${swatchHue === p.hue ? "active" : ""}`}
                      onClick={() => {
                        setSwatchHue(p.hue);
                        setSwatchAngle(p.hue * 4);
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="ap-craft-caption">
              <b>02. Dynamic Color Tokens</b> · Real time CSS variable calculation with live contrast and angle interpolation.
            </div>
          </div>

          {/* Lab 3: 3D Matrix Card */}
          <div
            className="ap-craft-card"
            ref={cardRef}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
          >
            <div className="ap-craft-header-bar">
              <span className="ap-craft-badge">3D Matrix</span>
              <span className="ap-craft-telemetry">
                {flipped ? "Code Inspector view" : `rotX: ${Math.round(cardTilt.x)}° · rotY: ${Math.round(cardTilt.y)}°`}
              </span>
            </div>
            <div className="ap-craft-stage">
              <div
                className={`ap-flip-card ${flipped ? "flipped" : ""}`}
                style={{
                  transform: flipped
                    ? "rotateY(180deg)"
                    : `perspective(600px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                }}
                onClick={() => setFlipped(!flipped)}
              >
                <div className="ap-flip-inner">
                  <div
                    className="ap-flip-front"
                    style={{
                      background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,0.09), transparent 60%), #181818`,
                    }}
                  >
                    <span className="ap-flip-title">Interactive 3D Glass Layer</span>
                    <span className="ap-flip-sub">Click to flip &amp; inspect CSS tokens</span>
                  </div>
                  <div className="ap-flip-back">
                    <code>transform: rotateX({Math.round(cardTilt.x)}deg) rotateY({Math.round(cardTilt.y)}deg);</code>
                    <span className="ap-flip-back-hint">Click to return to front</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ap-craft-caption">
              <b>03. Pure CSS 3D Matrix</b> · Specular glare reflection mapped to cursor coordinates with seamless 180° flip.
            </div>
          </div>

          {/* Lab 4: Live Command Filter Matrix */}
          <div className="ap-craft-card">
            <div className="ap-craft-header-bar">
              <span className="ap-craft-badge">State Matrix</span>
              <span className="ap-craft-telemetry">{activeTags.length} active nodes</span>
            </div>
            <div className="ap-craft-stage ap-craft-stage-column">
              <div className="ap-craft-filter-bar">
                <input
                  type="text"
                  placeholder="Filter interfaces (e.g. auth, webgl)..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="ap-craft-mini-input"
                />
                <div className="ap-filter-cat-row">
                  {["All", "Security", "Analytics", "Motion", "Graphics", "Architecture"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`ap-filter-cat-btn ${filterTag === cat ? "active" : ""}`}
                      onClick={() => setFilterTag(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ap-craft-chips-grid">
                {activeTags.length > 0 ? (
                  activeTags.map((t) => (
                    <span key={t.name} className="ap-craft-chip">
                      <span className="ap-chip-dot" />
                      {t.name}
                      <small>{t.count}</small>
                    </span>
                  ))
                ) : (
                  <span className="ap-craft-empty">No components match "{filterQuery}"</span>
                )}
              </div>
            </div>
            <div className="ap-craft-caption">
              <b>04. Reactive State Matrix</b> · Instantaneous multi predicate filtering and dynamic layout reflow.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Project card ──────────────────────────────────────────────────────────── */
function ProjectCard({ project, onOpenLightbox }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = project.images || [];

  return (
    <article className="ap-card">
      <div className="ap-shot">
        {project.confidential ? (
          <div className="ap-shot-placeholder">
            <Lock size={16} style={{ marginBottom: 8, color: "var(--gray-2)" }} />
            <span>Client work with visuals confidential</span>
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
              <span className="ap-shot-badge">{activeIdx + 1}/{images.length}</span>
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
        <div className="ap-card-meta-row">
          <span className="ap-card-path">{getTerminalPath(project.name, project.slug)}</span>
          <span className={`ap-card-badge ${project.confidential ? "is-client" : ""}`}>
            {project.confidential ? "Client Work" : "Completed"}
          </span>
        </div>
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
                View on GitHub <ArrowUpRight size={13} />
              </a>
            )}
            {project.liveLink && (
              <a className="ap-link" href={project.liveLink} target="_blank" rel="noopener noreferrer">
                Live Site <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── App ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive]       = useState("home");
  const [tilt, setTilt]           = useState({ x: 0, y: 0 });
  const [lightbox, setLightbox]   = useState(null);
  const [cName, setCName]         = useState("");
  const [cMsg, setCMsg]           = useState("");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  const heroRef      = useRef(null);
  const reduceMotion = useRef(false);
  const scrollBarRef = useRef(null);

  const handleGmail = () => {
    const sub  = encodeURIComponent("Portfolio contact");
    const body = encodeURIComponent(`Hi Uzair,\n\nName: ${cName}\n\n${cMsg}`);
    window.location.href = `mailto:mr-uzairnaseer@example.com?subject=${sub}&body=${body}`;
  };
  const handleWhatsApp = () => {
    const t = cName || cMsg ? `Hi Uzair, I'm ${cName}. ${cMsg}` : "Hi Uzair, I'd like to get in touch!";
    window.open(`https://wa.me/923116877887?text=${encodeURIComponent(t)}`, "_blank");
  };

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /* Scroll progress + nav shadow */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setScrollPct(pct);
      setNavScrolled(scrolled > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lightbox keyboard */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft" && lightbox.images.length > 1)
        setLightbox((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length }));
      if (e.key === "ArrowRight" && lightbox.images.length > 1)
        setLightbox((p) => ({ ...p, index: (p.index + 1) % p.images.length }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openLightbox = (images, index, name) => setLightbox({ images, index, name });

  /* Phone tilt */
  const handleHeroMove = useCallback((e) => {
    if (reduceMotion.current || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  }, []);
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  /* Active section */
  useEffect(() => {
    const ids = ["home", "about", "why", "craft", "work", "skills", "experience", "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* Scroll reveals — observe all .sr-group elements */
  useEffect(() => {
    const groups = document.querySelectorAll(".sr-group");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sr-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    groups.forEach((g) => obs.observe(g));
    return () => obs.disconnect();
  }, []);

  /* ── Scroll-linked section stagger grids ── */
  useEffect(() => {
    const grids = document.querySelectorAll(".sr-stagger");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll(".sr-item");
            children.forEach((el, i) => {
              setTimeout(() => el.classList.add("sr-item-in"), i * 80);
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    grids.forEach((g) => obs.observe(g));
    return () => obs.disconnect();
  }, []);

  /* ── Scroll-reveal for .sr-line elements (section heads) ── */
  useEffect(() => {
    const lines = document.querySelectorAll(".sr-line");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("sr-line-in"); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.1 }
    );
    lines.forEach((l) => obs.observe(l));
    return () => obs.disconnect();
  }, []);

  /* ─────────────────── JSX ─────────────────── */
  return (
    <div className="ap-root">
      <style>{CSS}</style>

      {/* Scroll progress bar */}
      <div
        className="ap-scroll-progress"
        style={{ width: `${scrollPct}%` }}
        aria-hidden="true"
      />

      <CustomCursor />

      {/* Global persistent 3D animated background */}
      <HeroCanvas reduceMotion={reduceMotion.current} />

      {/* NAV */}
      <header className={`ap-nav${navScrolled ? " scrolled" : ""}`}>
        <div className="ap-nav-left">
          <span className="ap-dot" />
          <span className="ap-nav-status">open to opportunities</span>
        </div>

        <nav className="ap-nav-links" aria-label="Main navigation">
          {TOP_NAV.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`ap-nav-link ${active === id ? "active" : ""}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ap-nav-right">
          <span className="ap-nav-loc">multan, pk</span>
          <button
            type="button"
            className="ap-hamburger"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="ap-mobile-menu">
            {TOP_NAV.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`ap-mobile-link ${active === id ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="ap-hero"
        ref={heroRef}
        onMouseMove={handleHeroMove}
        onMouseLeave={resetTilt}
      >
        <div className="ap-wrap ap-hero-inner">
          <div className="ap-hero-top sr-group">
            <div className="ap-eyebrow sr-child" style={{ "--i": 0 }}>
              Hi, I'm Uzair Naseer
            </div>
            <h1 className="ap-h1 sr-child" style={{ "--i": 1 }}>
              UI/UX<br />
              <span className="ap-accent">Designer</span>
            </h1>
          </div>

          <div className="ap-hero-lower sr-group">
            <div className="ap-hero-left sr-child" style={{ "--i": 2 }}>
              <p className="ap-lede">
                I design intuitive digital experiences and turn them into responsive, functional web interfaces.
              </p>
              <div className="ap-hero-tech">
                Figma · Adobe XD · Illustrator · Photoshop · Canva · HTML/CSS
              </div>
              <div className="ap-cta-row">
                <a href="#work" className="ap-btn ap-btn-primary">
                  View My Work <ArrowUpRight size={15} />
                </a>
                <a href="#contact" className="ap-btn ap-btn-ghost">Let's Connect</a>
              </div>
              <div className="ap-stat-row">
                <div><div className="ap-num">9+</div><div className="ap-label">projects delivered</div></div>
                <div><div className="ap-num">6th</div><div className="ap-label">semester, BSCS</div></div>
                <div><div className="ap-num">3.29</div><div className="ap-label">CGPA</div></div>
              </div>
            </div>

            <div className="ap-hero-right sr-child" style={{ "--i": 3 }}>
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
                    <div className="ap-bubble ap-in">Pixel perfect as always</div>
                    <div className="ap-bubble ap-out">That's the only setting I have</div>
                    <div className="ap-typing"><span /><span /><span /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="ap-marquee-wrap" aria-label="Tech stack overview">
        <div className="ap-marquee-track">
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
          <span>Figma · Adobe XD · Illustrator · Photoshop · Canva · Wireframing · Prototyping · User Research · Interaction Design · HTML/CSS</span>
          <span aria-hidden="true" style={{ margin: "0 20px" }}>·</span>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="ap-section">
        <div className="ap-wrap">
          <div className="ap-about-layout">
            <div className="ap-about-copy sr-group">
              <div className="ap-eyebrow sr-child" style={{ "--i": 0 }}>
                <span className="ap-eyebrow-num">01</span> about
              </div>
              <h2 className="ap-h2 sr-child" style={{ "--i": 1 }}>
                Grounded in code,{" "}
                <span className="ap-accent-italic">driven by design.</span>
              </h2>
              <p className="sr-child" style={{ "--i": 2 }}>
                <strong>I'm Uzair</strong>, graduated from Quaid-I-Azam University Islamabad having one year of experience as a UI/UX Designer.
              </p>
              <p className="sr-child" style={{ "--i": 3 }}>
                I specialize in Figma, Adobe XD, and Illustrator to create polished, accessible, and genuinely usable interfaces. My process revolves around User-Centered Design, rapid prototyping, and ensuring pixel-perfect visual identities.
              </p>
            </div>

            <div className="ap-edu-card sr-group">
              <span className="ap-tag-pill sr-child" style={{ "--i": 0 }}>
                <GraduationCap size={13} /> education
              </span>
              <h3 className="sr-child" style={{ "--i": 1 }}>BS Computer Science</h3>
              <div className="ap-school sr-child" style={{ "--i": 2 }}>Air University, Multan Campus</div>
              <div className="ap-edu-row sr-child" style={{ "--i": 3 }}>
                <span>Aug 2023 to Jun 2027</span><b>6th Semester</b>
              </div>
              <div className="ap-edu-row ap-edu-row-last sr-child" style={{ "--i": 4 }}>
                <span>CGPA</span><b>3.29</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="ap-section ap-why-section">
        <div className="ap-wrap">
          <div className="ap-section-head sr-group">
            <div className="ap-eyebrow sr-child" style={{ "--i": 0 }}>
              <span className="ap-eyebrow-num">02</span> why work with me
            </div>
            <h2 className="ap-h2 sr-child" style={{ "--i": 1 }}>Design that ships.</h2>
          </div>

          <div className="ap-why-list sr-stagger">
            {WHY_ITEMS.map((item, i) => (
              <div className="ap-why-item sr-item" key={item.title}>
                <div className="ap-why-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="ap-why-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFT */}
      <CraftSection reduceMotion={reduceMotion.current} active={active === "craft"} />

      {/* WORK */}
      <section id="work" className="ap-section">
        <div className="ap-wrap">
          <div className="ap-section-head sr-group">
            <div className="ap-eyebrow sr-child" style={{ "--i": 0 }}>
              <span className="ap-eyebrow-num">04</span> selected work
            </div>
            <h2 className="ap-h2 sr-child" style={{ "--i": 1 }}>Nine builds, one obsession with detail.</h2>
            <p className="ap-section-sub sr-child" style={{ "--i": 2 }}>
              Each card represents a real project or platform. Click image to expand screenshot lightbox.
            </p>
          </div>

          <div className="ap-grid sr-stagger">
            {PROJECTS.map((p) => (
              <div className="sr-item" key={p.slug}>
                <ProjectCard project={p} onOpenLightbox={openLightbox} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="ap-section">
        <div className="ap-wrap">
          <div className="ap-section-head sr-group">
            <div className="ap-eyebrow sr-child" style={{ "--i": 0 }}>
              <span className="ap-eyebrow-num">05</span> toolkit
            </div>
            <h2 className="ap-h2 sr-child" style={{ "--i": 1 }}>Expertise.</h2>
          </div>

          <div className="ap-skills-table sr-stagger">
            {SKILLS.map((s) => (
              <div className="ap-skill-row sr-item" key={s.label}>
                <div className="ap-skill-cat">{s.label}</div>
                <div className="ap-pill-row">
                  {s.items.map((it) => <span className="ap-pill" key={it}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="ap-section">
        <div className="ap-wrap">
          <div className="ap-section-head sr-group">
            <div className="ap-eyebrow sr-child" style={{ "--i": 0 }}>
              <span className="ap-eyebrow-num">06</span> experience
            </div>
            <h2 className="ap-h2 sr-child" style={{ "--i": 1 }}>Where I've worked.</h2>
          </div>

          <div className="ap-timeline sr-stagger">
            <div className="ap-tl-item sr-item">
              <div className="ap-tl-year">2026</div>
              <div className="ap-tl-body">
                <h3>UI/UX &amp; Frontend Development Intern</h3>
                <div className="ap-tl-meta">
                  <span className="ap-company">TCCI</span>
                </div>
                <ul>
                  <li>Contributed to UI/UX design and frontend development of TCCI digital platforms, including the ORIC Database Portal and TCCI Live.</li>
                  <li>Designed high fidelity interfaces, dashboards, authentication flows, and research and commercialization modules.</li>
                  <li>Translated designs into responsive web interfaces using React/Next.js.</li>
                </ul>
              </div>
            </div>

            <div className="ap-tl-item sr-item">
              <div className="ap-tl-year">2024</div>
              <div className="ap-tl-body">
                <h3>Content Writer</h3>
                <div className="ap-tl-meta">
                  <span className="ap-company">Fiesta Consultants</span>
                  <span className="ap-tl-period">Aug 2024 to Dec 2025</span>
                </div>
                <ul>
                  <li>Created original, plagiarism free content tailored to diverse client briefs.</li>
                  <li>Designed engaging presentations and visual assets using Canva.</li>
                  <li>Collaborated directly with clients to translate requirements into delivered work.</li>
                </ul>
              </div>
            </div>

            <div className="ap-tl-item sr-item">
              <div className="ap-tl-year">2024</div>
              <div className="ap-tl-body">
                <h3>C++ Intern</h3>
                <div className="ap-tl-meta">
                  <span className="ap-company">HiSkyTech</span>
                  <span className="ap-tl-period">Jul 2024 to Aug 2024</span>
                </div>
                <ul>
                  <li>Applied core C++ concepts and worked with libraries in scenario based application development.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="ap-section ap-contact-section">
        <div className="ap-wrap">
          <div className="ap-section-head sr-group">
            <div className="ap-eyebrow sr-child" style={{ "--i": 0 }}>
              <span className="ap-eyebrow-num">07</span> contact
            </div>
            <h2 className="ap-h2 sr-child" style={{ "--i": 1 }}>
              Let's build something worth opening.
            </h2>
          </div>

          <div className="ap-contact-body sr-group">
            <p className="sr-child" style={{ "--i": 2 }}>
              I'm currently looking for internship and junior developer roles in Flutter, frontend, and UI/UX. If you've got a screen that needs designing or an app that needs building, I'd love to hear from you.
            </p>

            <div className="ap-contact-links sr-child" style={{ "--i": 3 }}>
              <a href="mailto:mr-uzairnaseer@example.com" className="ap-contact-link">
                <Mail size={15} /> mr-uzairnaseer@example.com
              </a>
              <a href="tel:+923116877887" className="ap-contact-link">
                <Phone size={15} /> 0311 6877887
              </a>
              <a href="https://github.com/mr-uzairnaseer" target="_blank" rel="noopener noreferrer" className="ap-contact-link">
                <Github size={15} /> github.com/mr-uzairnaseer
              </a>
            </div>

            <div className="ap-compose-box sr-child" style={{ "--i": 4 }}>
              <div className="ap-compose-fields">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="ap-input"
                />
                <input
                  type="text"
                  placeholder="Your Message or Email"
                  value={cMsg}
                  onChange={(e) => setCMsg(e.target.value)}
                  className="ap-input"
                />
              </div>
              <div className="ap-compose-btns">
                <button type="button" onClick={handleGmail} className="ap-btn ap-btn-primary">
                  Open in Gmail <Mail size={14} />
                </button>
                <button type="button" onClick={handleWhatsApp} className="ap-btn ap-btn-ghost">
                  Message on WhatsApp <MessageCircle size={14} />
                </button>
              </div>
              <p className="ap-compose-note">Nothing is sent automatically. This opens a prefilled draft.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="ap-footer">
        <div className="ap-wrap">
          Built by Uzair Naseer · Islamabad, Pakistan · 2026
        </div>
      </footer>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="ap-lightbox-backdrop" onClick={() => setLightbox(null)}>
          <div className="ap-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ap-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="ap-lightbox-nav ap-lightbox-prev"
                onClick={() =>
                  setLightbox((p) => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length }))
                }
                aria-label="Previous"
              >
                <ChevronLeft size={26} />
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
                  setLightbox((p) => ({ ...p, index: (p.index + 1) % p.images.length }))
                }
                aria-label="Next"
              >
                <ChevronRight size={26} />
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

/* ═══════════════════════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,600;1,9..144,700;1,9..144,800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  /* ── Variables ── */
  .ap-root {
    --ink:         #FAF6EF;
    --paper:       #2C2117;
    --gray-1:      #6B5A46;
    --gray-2:      #9C8A75;
    --surface:     #F2EDE4;
    --surface-2:   #E8E0D4;
    --border:      rgba(44,33,23,0.10);
    --border-strong: rgba(44,33,23,0.20);
    --accent:      #C0440A;
    --accent-soft: rgba(192,68,10,0.12);

    background: var(--ink);
    color: var(--paper);
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    line-height: 1.65;
    min-height: 100vh;
    overflow-x: hidden;
    isolation: isolate;
    position: relative;
  }
  .ap-root * { box-sizing: border-box; }
  .ap-root a { color: inherit; text-decoration: none; }
  .ap-root ::selection { background: var(--accent); color: var(--ink); }
  .ap-root code { font-family: 'JetBrains Mono', monospace; }
  .ap-root h1, .ap-root h2, .ap-root h3 { margin: 0; }

  /* ── Custom cursor ── */
  .has-custom-cursor, .has-custom-cursor * { cursor: none !important; }
  .cur-dot {
    position: fixed; top: 0; left: 0; z-index: 9999;
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); pointer-events: none;
    will-change: transform;
  }
  .cur-ring {
    position: fixed; top: 0; left: 0; z-index: 9998;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid var(--border-strong);
    pointer-events: none; will-change: transform;
    transition: transform 0.12s ease;
  }

  /* ── Layout ── */
  .ap-wrap { max-width: 1120px; margin: 0 auto; padding: 0 32px; }
  @media (max-width: 640px) { .ap-wrap { padding: 0 20px; } }

  /* ── Scroll progress bar ── */
  .ap-scroll-progress {
    position: fixed; top: 52px; left: 0; z-index: 99;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, var(--accent), #E26627, var(--accent));
    background-size: 200% 100%;
    animation: progress-shimmer 2.5s linear infinite;
    transition: width 0.08s linear;
    pointer-events: none;
  }
  @keyframes progress-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ── Navigation ── */
  .ap-nav {
    position: fixed; top: 0; left: 0; right: 0; width: 100%; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    background: rgba(250,246,239,0.95);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
    height: 52px; gap: 16px;
    transition: box-shadow 0.3s ease;
  }
  .ap-nav.scrolled {
    box-shadow: 0 2px 24px rgba(44,33,23,0.10);
  }
  @media (max-width: 640px) { .ap-nav { padding: 0 20px; } }

  .ap-nav-left { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .ap-dot {
    display: inline-block; width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); box-shadow: 0 0 0 2.5px var(--accent-soft);
    animation: pulse 2.2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  .ap-nav-status { color: var(--gray-1); white-space: nowrap; }

  .ap-nav-links { display: flex; align-items: center; gap: 20px; }
  .ap-nav-link {
    color: var(--gray-2); font-size: 11px; letter-spacing: 0.04em;
    text-transform: uppercase; position: relative; padding: 4px 0;
    transition: color 0.2s ease;
  }
  .ap-nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    height: 1px; background: var(--accent);
    width: 0; transition: width 0.25s cubic-bezier(0.25,1,0.5,1);
  }
  .ap-nav-link:hover, .ap-nav-link.active { color: var(--paper); }
  .ap-nav-link:hover::after, .ap-nav-link.active::after { width: 100%; }

  .ap-nav-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .ap-nav-loc { color: var(--gray-2); font-size: 11px; }

  .ap-hamburger {
    display: none; background: none; border: none;
    color: var(--paper); cursor: pointer; padding: 4px;
    align-items: center; justify-content: center;
  }
  .ap-mobile-menu {
    position: absolute; top: 100%; left: 0; right: 0;
    background: #F2EDE4; border-bottom: 1px solid var(--border-strong);
    padding: 16px 32px; display: flex; flex-direction: column; gap: 12px;
    box-shadow: 0 20px 40px rgba(44,33,23,0.15); z-index: 99;
  }
  .ap-mobile-link {
    color: var(--gray-1); font-size: 13px; padding: 6px 0;
    transition: color 0.2s ease; font-family: 'JetBrains Mono', monospace;
  }
  .ap-mobile-link.active, .ap-mobile-link:hover { color: var(--accent); }

  @media (max-width: 760px) {
    .ap-nav-links { display: none; }
    .ap-hamburger { display: flex; }
    .ap-nav-loc { display: none; }
  }

  /* ── Scroll reveal system ── */
  .sr-child {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .sr-group.sr-visible .sr-child {
    opacity: 1;
    transform: translateY(0);
  }
  .sr-group.sr-visible .sr-child:nth-child(1) { transition-delay: 0s; }
  .sr-group.sr-visible .sr-child:nth-child(2) { transition-delay: 0.1s; }
  .sr-group.sr-visible .sr-child:nth-child(3) { transition-delay: 0.18s; }
  .sr-group.sr-visible .sr-child:nth-child(4) { transition-delay: 0.26s; }
  .sr-group.sr-visible .sr-child:nth-child(5) { transition-delay: 0.34s; }

  .sr-item {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .sr-item.sr-item-in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Slide-from-left / right for why & experience items */
  .sr-slide-left {
    opacity: 0; transform: translateX(-36px);
    transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .sr-slide-left.sr-item-in { opacity: 1; transform: translateX(0); }

  .sr-slide-right {
    opacity: 0; transform: translateX(36px);
    transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .sr-slide-right.sr-item-in { opacity: 1; transform: translateX(0); }

  @media (prefers-reduced-motion: reduce) {
    .sr-child, .sr-item, .sr-slide-left, .sr-slide-right {
      opacity: 1 !important; transform: none !important;
      transition: none !important;
    }
  }

  /* ── HERO ── */
  .ap-hero {
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 152px 0 80px;
    overflow: hidden;
  }
  .ap-hero-canvas {
    position: fixed; inset: 0;
    width: 100vw; height: 100vh;
    z-index: 0;
    pointer-events: none;
    opacity: 0.85;
  }
  .ap-hero-inner {
    position: relative; z-index: 1;
  }
  .ap-hero-top { margin-bottom: 24px; }

  .ap-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px; letter-spacing: 0.12em;
    color: var(--accent); text-transform: uppercase;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .ap-eyebrow::before {
    content: ''; height: 1px; background: var(--accent);
    width: 0; animation: eyebrow-line 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
  }
  @keyframes eyebrow-line { to { width: 28px; } }
  .ap-eyebrow-num { font-weight: 500; }

  .ap-h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(3rem, 6.5vw, 6.5rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--paper);
  }
  .ap-accent {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 700;
    color: var(--accent);
  }
  .ap-accent-italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 600;
    color: var(--accent);
  }

  .ap-hero-lower {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  @media (max-width: 800px) {
    .ap-hero-lower { grid-template-columns: 1fr; }
    .ap-hero-right { display: none; }
  }

  .ap-lede { font-size: 1.15rem; line-height: 1.6; color: var(--gray-1); max-width: 480px; margin-bottom: 12px; }
  .ap-hero-tech {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px; color: var(--gray-2); margin: 20px 0 36px;
    letter-spacing: 0.02em;
  }

  .ap-cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
  .ap-btn {
    padding: 12px 24px; border-radius: 100px;
    font-weight: 600; font-size: 0.88rem;
    display: inline-flex; align-items: center; gap: 8px;
    cursor: pointer; border: 1px solid transparent;
    transition: transform 0.18s cubic-bezier(0.25,1,0.5,1),
                background 0.18s ease,
                border-color 0.18s ease;
    letter-spacing: 0.01em;
  }
  .ap-btn-primary { background: var(--accent); color: var(--ink); border-color: var(--accent); }
  .ap-btn-primary:hover { transform: translateY(-2px) skewX(-2deg); background: #D65518; }
  .ap-btn-ghost { border-color: var(--border-strong); color: var(--paper); }
  .ap-btn-ghost:hover { transform: translateY(-2px) skewX(-2deg); border-color: var(--accent); background: var(--accent-soft); }

  .ap-stat-row { display: flex; gap: 36px; flex-wrap: wrap; }
  .ap-num {
    font-family: 'Fraunces', serif;
    font-size: 2rem; font-weight: 700; line-height: 1;
    color: var(--paper);
    animation: float-num 4s ease-in-out infinite;
  }
  .ap-stat-row > div:nth-child(2) .ap-num { animation-delay: 0.8s; }
  .ap-stat-row > div:nth-child(3) .ap-num { animation-delay: 1.6s; }
  @keyframes float-num {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .ap-label {
    font-size: 0.72rem; color: var(--gray-2);
    text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px;
  }

  /* ── Phone mockup ── */
  .ap-phone-stage { display: flex; justify-content: center; }
  .ap-phone {
    width: 240px; height: 490px; border-radius: 40px;
    background: var(--surface); border: 8px solid var(--paper);
    position: relative; overflow: hidden;
    box-shadow: 
      inset 0 0 0 1px rgba(255,255,255,0.1),
      0 40px 80px -20px rgba(44,33,23,0.35), 
      0 20px 40px -10px rgba(44,33,23,0.2);
    transform-style: preserve-3d; transition: transform 0.1s ease-out;
  }
  .ap-phone::before {
    content: ''; position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 96px; height: 24px; background: var(--paper);
    border-radius: 0 0 16px 16px; z-index: 5;
  }
  .ap-phone-screen {
    position: absolute; inset: 0;
    padding: 40px 14px 16px; background: var(--ink);
    display: flex; flex-direction: column; gap: 8px;
    box-shadow: inset 0 4px 12px rgba(0,0,0,0.03);
  }
  .ap-phone-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .ap-avatar { width: 26px; height: 26px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .ap-name { font-size: 11px; font-weight: 600; color: var(--paper); }
  .ap-sub { font-size: 9px; color: var(--accent); }
  .ap-bubble {
    max-width: 78%; padding: 10px 14px; border-radius: 16px;
    font-size: 11px; line-height: 1.4; opacity: 0; animation: bpop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    box-shadow: 0 4px 14px rgba(44,33,23,0.06);
  }
  .ap-in  { align-self: flex-start; background: var(--surface-2); color: var(--paper); border-bottom-left-radius: 4px; }
  .ap-out { align-self: flex-end; background: linear-gradient(135deg, var(--accent), #D65518); color: white; font-weight: 500; border-bottom-right-radius: 4px; box-shadow: 0 6px 16px rgba(192,68,10,0.25); }
  .ap-bubble:nth-of-type(1) { animation-delay: 0.5s; }
  .ap-bubble:nth-of-type(2) { animation-delay: 1.2s; }
  .ap-bubble:nth-of-type(3) { animation-delay: 1.9s; }
  .ap-bubble:nth-of-type(4) { animation-delay: 2.6s; }
  @keyframes bpop { from { opacity:0; transform:translateY(8px) scale(0.95); } to { opacity:1; transform:none; } }
  .ap-typing {
    display: flex; gap: 4px; align-self: flex-start;
    background: var(--surface-2); padding: 10px 14px; border-radius: 16px;
    border-bottom-left-radius: 4px; opacity: 0;
    box-shadow: 0 4px 14px rgba(44,33,23,0.06);
    animation: bpop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 3.2s;
  }
  .ap-typing span { width: 4px; height: 4px; border-radius: 50%; background: var(--gray-2); animation: blink 1.2s infinite; }
  .ap-typing span:nth-child(2) { animation-delay: 0.2s; }
  .ap-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,60%,100% { opacity:0.3; } 30% { opacity:1; } }

  /* ── Marquee ── */
  .ap-marquee-wrap {
    overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    padding: 11px 0;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--gray-2);
    background: rgba(250,246,239,0.75);
    backdrop-filter: blur(4px);
    position: relative; z-index: 1;
  }
  .ap-marquee-track {
    display: flex; width: max-content; white-space: nowrap;
    animation: marquee 28s linear infinite;
  }
  .ap-marquee-wrap:hover .ap-marquee-track { animation-play-state: paused; }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) {
    .ap-marquee-track { animation: none; width: 100%; white-space: normal; }
  }

  /* ── Section base ── */
  .ap-section {
    padding: 110px 0;
    position: relative;
    background: transparent;
  }
  @media (max-width: 720px) { .ap-section { padding: 72px 0; } }

  .ap-section-head { margin-bottom: 56px; }
  .ap-h2 {
    font-family: 'Fraunces', serif;
    font-size: clamp(2rem, 4.5vw, 3.8rem);
    font-weight: 700; line-height: 0.96;
    letter-spacing: -0.025em; color: var(--paper);
    margin-bottom: 12px;
  }
  .ap-section-sub { color: var(--gray-1); font-size: 0.96rem; max-width: 480px; }

  /* ── About ── */
  .ap-about-layout {
    display: grid; grid-template-columns: 1.2fr 0.8fr;
    gap: 64px; align-items: start;
  }
  @media (max-width: 780px) { .ap-about-layout { grid-template-columns: 1fr; gap: 40px; } }

  .ap-about-copy p { color: var(--gray-1); margin-bottom: 16px; font-size: 0.98rem; }
  .ap-about-copy strong { color: var(--paper); }

  .ap-edu-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 26px;
    transition: border-color 0.2s ease;
  }
  .ap-edu-card:hover { border-color: var(--border-strong); }
  .ap-tag-pill {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
    color: var(--accent); background: var(--accent-soft);
    padding: 4px 12px; border-radius: 100px; margin-bottom: 16px;
  }
  .ap-edu-card h3 {
    font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 700;
    color: var(--paper); margin-bottom: 6px;
  }
  .ap-school { color: var(--gray-1); font-size: 0.88rem; margin-bottom: 18px; }
  .ap-edu-row {
    display: flex; justify-content: space-between;
    font-size: 0.83rem; color: var(--gray-2);
    border-top: 1px solid var(--border); padding-top: 10px; margin-top: 4px;
  }
  .ap-edu-row b { color: var(--paper); }
  .ap-edu-row-last { border-top: none; padding-top: 6px; }

  /* ── Why — numbered editorial list ── */
  .ap-why-section { background: rgba(242,237,228,0.50); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
  .ap-why-list { display: flex; flex-direction: column; }
  .ap-why-item {
    display: grid; grid-template-columns: 80px 1fr;
    gap: 32px; align-items: start;
    padding: 28px 0;
    border-top: 1px solid var(--border);
    transition: border-color 0.2s ease;
  }
  .ap-why-item:hover { border-color: var(--border-strong); }
  .ap-why-item:last-child { border-bottom: 1px solid var(--border); }
  @media (max-width: 640px) {
    .ap-why-item { grid-template-columns: 1fr; gap: 10px; }
  }
  .ap-why-num {
    font-family: 'Fraunces', serif; font-size: 3.5rem; font-weight: 700;
    line-height: 1; color: var(--surface);
    letter-spacing: -0.04em;
    -webkit-text-stroke: 1.5px var(--border-strong);
    text-stroke: 1.5px var(--border-strong);
    user-select: none;
    transition: color 0.2s ease, -webkit-text-stroke-color 0.2s ease;
  }
  .ap-why-item:hover .ap-why-num {
    color: transparent;
    -webkit-text-stroke-color: var(--accent);
  }
  .ap-why-body h3 {
    font-family: 'Fraunces', serif; font-size: 1.25rem; font-weight: 700;
    color: var(--paper); margin-bottom: 8px; margin-top: 6px;
    letter-spacing: -0.02em;
  }
  .ap-why-body p { color: var(--gray-1); font-size: 0.93rem; line-height: 1.65; }

  /* ── Craft Grid & Labs ── */
  .ap-craft-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }
  @media (max-width: 768px) { .ap-craft-grid { grid-template-columns: 1fr; } }
  .ap-craft-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 24px; padding: 24px;
    display: flex; flex-direction: column; justify-content: space-between;
    min-height: 270px; position: relative; overflow: hidden;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .ap-craft-card:hover {
    border-color: rgba(192,68,10,0.35);
    box-shadow: 0 16px 36px -10px rgba(44,33,23,0.2);
  }
  .ap-craft-header-bar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .ap-craft-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--accent); background: var(--accent-soft);
    padding: 3px 9px; border-radius: 100px; font-weight: 500;
  }
  .ap-craft-telemetry {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--gray-2);
  }
  .ap-craft-stage {
    flex: 1; display: flex; align-items: center;
    justify-content: center; min-height: 130px; position: relative;
  }
  .ap-craft-stage-column {
    flex-direction: column; gap: 14px; width: 100%;
  }
  .ap-craft-caption {
    font-family: 'Inter', sans-serif; font-size: 12px;
    color: var(--gray-1); margin-top: 18px;
    border-top: 1px solid var(--border); padding-top: 12px;
    line-height: 1.5;
  }
  .ap-craft-caption b { color: var(--paper); font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 11px; }

  /* Lab 1: Magnetic */
  .ap-mag-btn {
    padding: 13px 26px; border-radius: 100px;
    background: var(--surface-2); border: 1px solid var(--accent);
    color: var(--paper); font-weight: 600; font-size: 0.88rem; cursor: pointer;
    transition: transform 0.12s ease, background 0.2s ease, box-shadow 0.2s ease;
    font-family: 'Inter', sans-serif; display: inline-flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 24px rgba(192,68,10,0.18);
  }
  .ap-mag-btn:hover { background: var(--accent-soft); box-shadow: 0 12px 30px rgba(192,68,10,0.28); }
  .ap-mag-pill-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--accent); background: rgba(192,68,10,0.18);
    padding: 2px 8px; border-radius: 100px;
  }

  /* Lab 2: Swatch & Presets */
  .ap-swatch-box {
    width: 100%; height: 60px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s ease, transform 0.15s ease;
  }
  .ap-swatch-label {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    background: rgba(250,246,239,0.88); padding: 5px 14px;
    border-radius: 100px; color: var(--paper);
    border: 1px solid var(--border-strong);
  }
  .ap-swatch-controls {
    width: 100%; display: flex; flex-direction: column; gap: 10px;
  }
  .ap-craft-slider {
    width: 100%; accent-color: var(--accent); cursor: pointer;
    height: 4px; background: var(--surface-2); border-radius: 2px;
  }
  .ap-preset-pills { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
  .ap-preset-pill {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    background: var(--surface-2); border: 1px solid var(--border);
    color: var(--gray-1); padding: 3px 10px; border-radius: 100px;
    cursor: pointer; transition: all 0.2s ease;
  }
  .ap-preset-pill:hover, .ap-preset-pill.active {
    border-color: var(--accent); color: var(--accent); background: var(--accent-soft);
  }

  /* Lab 3: 3D Matrix Flip */
  .ap-flip-card {
    width: 100%; height: 120px; perspective: 700px; cursor: pointer;
    transition: transform 0.15s ease-out;
  }
  .ap-flip-inner {
    width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ap-flip-card.flipped .ap-flip-inner { transform: rotateY(180deg); }
  .ap-flip-front, .ap-flip-back {
    position: absolute; inset: 0; backface-visibility: hidden; border-radius: 16px;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 18px; text-align: center;
    border: 1px solid var(--border-strong);
  }
  .ap-flip-front {
    color: var(--paper);
  }
  .ap-flip-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; color: var(--paper); }
  .ap-flip-sub { font-size: 11px; color: var(--gray-1); font-family: 'JetBrains Mono', monospace; }
  .ap-flip-back {
    background: var(--surface-2); border-color: var(--accent);
    color: var(--paper); transform: rotateY(180deg); gap: 6px;
  }
  .ap-flip-back code { font-size: 10.5px; color: var(--accent); }
  .ap-flip-back-hint { font-size: 10px; color: var(--gray-2); font-family: 'JetBrains Mono', monospace; }

  /* Lab 4: Filter Matrix */
  .ap-craft-filter-bar { width: 100%; display: flex; flex-direction: column; gap: 8px; }
  .ap-craft-mini-input {
    width: 100%; background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 12px; color: var(--paper);
    font-size: 11px; font-family: 'Inter', sans-serif; outline: none;
    transition: border-color 0.2s ease;
  }
  .ap-craft-mini-input:focus { border-color: var(--accent); }
  .ap-filter-cat-row { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 2px; }
  .ap-filter-cat-btn {
    background: none; border: none; font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px; color: var(--gray-2); padding: 2px 6px; border-radius: 4px;
    cursor: pointer; white-space: nowrap; transition: color 0.15s ease;
  }
  .ap-filter-cat-btn:hover, .ap-filter-cat-btn.active { color: var(--accent); font-weight: 600; }
  .ap-craft-chips-grid { display: flex; flex-wrap: wrap; gap: 6px; width: 100%; min-height: 48px; align-content: flex-start; }
  .ap-craft-chip {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    background: var(--surface-2); border: 1px solid var(--border);
    padding: 4px 8px; border-radius: 6px; color: var(--paper);
    display: inline-flex; align-items: center; gap: 6px;
  }
  .ap-chip-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
  .ap-craft-chip small { color: var(--gray-2); font-size: 9px; }
  .ap-craft-empty { font-size: 11px; color: var(--gray-2); font-style: italic; }

  /* ── Work Grid ── */
  .ap-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
  @media (max-width: 780px) {
    .ap-grid {
      grid-template-columns: 1fr;
      gap: 22px;
    }
  }

  /* ── Project card ── */
  .ap-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 24px; overflow: hidden;
    display: flex; flex-direction: column; height: 100%;
    transition: border-color 0.25s ease, transform 0.25s cubic-bezier(0.25,1,0.5,1), box-shadow 0.25s ease;
    position: relative;
  }
  .ap-card::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    box-shadow: 0 0 0 0 var(--accent);
    transition: box-shadow 0.3s ease; pointer-events: none; z-index: 1;
  }
  .ap-card:hover {
    transform: translateY(-5px);
    border-color: rgba(192,68,10,0.40);
    box-shadow: 0 20px 40px -12px rgba(44,33,23,0.22), 0 0 22px rgba(192,68,10,0.14);
  }
  .ap-shot { aspect-ratio: 16/10; width: 100%; position: relative; overflow: hidden; background: var(--surface-2); }
  .ap-shot-main { width: 100%; height: 100%; object-fit: cover; display: block; cursor: zoom-in; transition: transform 0.4s ease; }
  .ap-card:hover .ap-shot-main { transform: scale(1.03); }
  .ap-shot-badge {
    position: absolute; top: 10px; right: 10px;
    background: rgba(250,246,239,0.90); color: var(--gray-1);
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    padding: 3px 9px; border-radius: 100px; border: 1px solid var(--border);
    pointer-events: none; z-index: 3;
  }
  .ap-shot-nav {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 12px;
    background: rgba(250,246,239,0.90);
    display: flex; justify-content: center; align-items: center; z-index: 3;
  }
  .ap-shot-dots { display: flex; gap: 6px; align-items: center; }
  .ap-shot-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(44,33,23,0.25); border: none; padding: 0; cursor: pointer;
    transition: all 0.2s ease;
  }
  .ap-shot-dot:hover { background: rgba(44,33,23,0.55); }
  .ap-shot-dot.active { background: var(--accent); width: 16px; border-radius: 100px; }
  .ap-shot-thumbs { display: flex; gap: 5px; overflow-x: auto; max-width: 100%; padding: 2px 4px; scrollbar-width: none; }
  .ap-shot-thumbs::-webkit-scrollbar { display: none; }
  .ap-shot-thumb {
    width: 26px; height: 26px; border-radius: 5px; overflow: hidden;
    border: 1.5px solid transparent; padding: 0; background: none;
    cursor: pointer; flex-shrink: 0; opacity: 0.55; transition: all 0.2s ease;
  }
  .ap-shot-thumb:hover { opacity: 0.85; }
  .ap-shot-thumb.active { opacity: 1; border-color: var(--accent); }
  .ap-shot-placeholder {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; padding: 16px;
  }
  .ap-shot-placeholder span { font-size: 11px; color: var(--gray-2); line-height: 1.6; margin-top: 2px; }
  .ap-shot-placeholder code { color: var(--gray-1); font-size: 10.5px; }

  .ap-card-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .ap-card-meta-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .ap-card-path { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--gray-2); }
  .ap-card-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
    padding: 2px 8px; border-radius: 100px; font-weight: 500;
    border: 1px solid var(--border); background: transparent; color: var(--gray-1);
    white-space: nowrap;
  }
  .ap-card-badge.is-client { color: var(--accent); border-color: var(--accent-soft); }
  .ap-card-top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .ap-card-top h3 {
    font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 700;
    color: var(--paper); letter-spacing: -0.02em;
  }
  .ap-years { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--gray-2); white-space: nowrap; }
  .ap-desc { color: var(--gray-1); font-size: 0.84rem; line-height: 1.58; }
  .ap-tag-row { display: flex; flex-wrap: wrap; gap: 5px; }
  .ap-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    padding: 3px 9px; border-radius: 100px; background: var(--surface-2);
    color: var(--gray-1); border: 1px solid var(--border);
  }
  .ap-link-row { display: flex; gap: 14px; flex-wrap: wrap; margin-top: auto; padding-top: 4px; }
  .ap-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.82rem; font-weight: 600; color: var(--accent);
    transition: gap 0.2s ease;
  }
  .ap-link:hover { gap: 8px; }

  /* ── Skills ── */
  .ap-skills-table { display: flex; flex-direction: column; }
  .ap-skill-row {
    display: grid; grid-template-columns: 200px 1fr; gap: 32px;
    padding: 18px 0; border-top: 1px solid var(--border);
    align-items: start; transition: border-color 0.2s ease;
  }
  .ap-skill-row:hover { border-color: var(--border-strong); }
  .ap-skill-row:last-child { border-bottom: 1px solid var(--border); }
  @media (max-width: 680px) { .ap-skill-row { grid-template-columns: 1fr; gap: 10px; } }
  .ap-skill-cat {
    font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
    color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em;
    padding-top: 4px;
  }
  .ap-pill-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .ap-pill {
    font-size: 0.81rem; padding: 5px 12px; border-radius: 100px;
    background: var(--surface-2); border: 1px solid var(--border);
    color: var(--paper); transition: border-color 0.15s ease, background 0.15s ease;
  }
  .ap-pill:hover { border-color: var(--accent); background: var(--accent-soft); }

  /* ── Experience ── */
  .ap-timeline { display: flex; flex-direction: column; gap: 0; }
  .ap-tl-item {
    display: grid; grid-template-columns: 80px 1fr;
    gap: 40px; padding: 36px 0;
    border-top: 1px solid var(--border);
    transition: border-color 0.2s ease;
  }
  .ap-tl-item:hover { border-color: var(--border-strong); }
  .ap-tl-item:last-child { border-bottom: 1px solid var(--border); }
  @media (max-width: 640px) { .ap-tl-item { grid-template-columns: 1fr; gap: 12px; } }
  .ap-tl-year {
    font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 700;
    color: var(--gray-2); letter-spacing: -0.03em; line-height: 1;
    padding-top: 4px;
    transition: color 0.2s ease;
  }
  .ap-tl-item:hover .ap-tl-year { color: var(--accent); }
  .ap-tl-body h3 {
    font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 700;
    color: var(--paper); margin-bottom: 6px; letter-spacing: -0.02em;
  }
  .ap-tl-meta { display: flex; gap: 10px; align-items: center; margin-bottom: 14px; flex-wrap: wrap; }
  .ap-company { font-weight: 600; color: var(--accent); font-size: 0.88rem; }
  .ap-tl-period { font-size: 0.82rem; color: var(--gray-2); font-family: 'JetBrains Mono', monospace; }
  .ap-tl-body ul {
    padding-left: 16px; color: var(--gray-1); font-size: 0.91rem;
    display: flex; flex-direction: column; gap: 6px; line-height: 1.6;
  }

  /* ── Contact ── */
  .ap-contact-section { background: rgba(242,237,228,0.50); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
  .ap-contact-body { max-width: 640px; }
  .ap-contact-body > p { color: var(--gray-1); font-size: 1rem; line-height: 1.7; margin-bottom: 32px; }

  .ap-contact-links { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
  .ap-contact-link {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.95rem; font-weight: 500; color: var(--paper);
    padding: 10px 0; border-bottom: 1px solid var(--border);
    transition: color 0.2s ease, border-color 0.2s ease, gap 0.2s ease;
  }
  .ap-contact-link:hover { color: var(--accent); border-color: var(--accent); gap: 14px; }

  .ap-compose-box { display: flex; flex-direction: column; gap: 14px; }
  .ap-compose-fields { display: flex; gap: 12px; }
  @media (max-width: 540px) { .ap-compose-fields { flex-direction: column; } }
  .ap-input {
    flex: 1; background: var(--surface-2); border: 1px solid var(--border-strong);
    border-radius: 10px; padding: 12px 16px;
    color: var(--paper); font-family: 'Inter', sans-serif; font-size: 0.88rem; outline: none;
    transition: border-color 0.2s ease;
  }
  .ap-input:focus { border-color: var(--accent); }
  .ap-input::placeholder { color: var(--gray-2); }
  .ap-compose-btns { display: flex; gap: 10px; flex-wrap: wrap; }
  .ap-compose-note { font-size: 0.76rem; color: var(--gray-2); font-style: italic; margin: 0; }

  /* ── Footer ── */
  .ap-footer {
    padding: 32px 0 44px;
    text-align: center; color: var(--gray-2); font-size: 0.78rem;
    font-family: 'JetBrains Mono', monospace;
    border-top: 1px solid var(--border);
    background: rgba(242,237,228,0.55);
    backdrop-filter: blur(4px);
    position: relative;
  }

  /* ── Lightbox ── */
  .ap-lightbox-backdrop {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(28,21,14,0.90);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .ap-lightbox-content {
    position: relative; max-width: 92vw; max-height: 88vh;
    display: flex; flex-direction: column; align-items: center;
  }
  .ap-lightbox-img {
    max-width: 90vw; max-height: 80vh; object-fit: contain;
    border-radius: 10px; box-shadow: 0 24px 60px rgba(0,0,0,0.9);
    border: 1px solid var(--border-strong);
  }
  .ap-lightbox-close {
    position: fixed; top: 20px; right: 20px;
    background: var(--surface-2); border: 1px solid var(--border-strong);
    color: var(--paper); border-radius: 50%; width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s ease, transform 0.2s ease; z-index: 1001;
  }
  .ap-lightbox-close:hover { background: var(--accent); color: var(--ink); transform: scale(1.08); }
  .ap-lightbox-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: var(--surface-2); border: 1px solid var(--border-strong);
    color: var(--paper); border-radius: 50%; width: 46px; height: 46px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s ease, transform 0.2s ease; z-index: 1001;
  }
  .ap-lightbox-prev { left: -58px; }
  .ap-lightbox-next { right: -58px; }
  .ap-lightbox-nav:hover { background: var(--accent); color: var(--ink); transform: translateY(-50%) scale(1.08); }
  @media (max-width: 768px) {
    .ap-lightbox-prev { left: 8px; }
    .ap-lightbox-next { right: 8px; }
    .ap-lightbox-close { top: 12px; right: 12px; }
  }
  .ap-lightbox-caption {
    margin-top: 14px; font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px; color: var(--gray-1);
    background: var(--surface-2); padding: 4px 14px; border-radius: 100px;
    border: 1px solid var(--border);
  }
`;
