# Aimah Bilal — Portfolio

A React + Vite portfolio site with an interactive, mesh-gradient theme,
a cursor-reactive hero, and project cards ready for real screenshots.

## 1. Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 2. Add your project screenshots

1. Put your image files in `src/assets/projects/`. Match these names
   (or use your own — just keep track of them):

   ```
   src/assets/projects/lets-chat.png
   src/assets/projects/foodies.png
   src/assets/projects/expensify.png
   src/assets/projects/taskmate.png
   src/assets/projects/shopease.png
   src/assets/projects/idea-catalyst.png
   ```

2. Open `src/App.jsx`. Near the top, uncomment the import lines:

   ```jsx
   import letsChatImg  from "./assets/projects/lets-chat.png";
   import foodiesImg   from "./assets/projects/foodies.png";
   import expensifyImg from "./assets/projects/expensify.png";
   import taskMateImg  from "./assets/projects/taskmate.png";
   import shopEaseImg  from "./assets/projects/shopease.png";
   import ideaCatalystImg from "./assets/projects/idea-catalyst.png";
   ```

3. In the `PROJECTS` array (just below the imports), change each
   project's `image: null` to the matching imported variable, e.g.:

   ```jsx
   {
     name: "Let's Chat",
     ...
     image: letsChatImg,   // was: image: null
   },
   ```

4. Save — Vite hot-reloads automatically and your screenshot appears
   inside that project's card.

Any image works (PNG, JPG, WEBP). For crisp results, aim for a 16:11
aspect ratio or close to it (the card crops to fit either way).

## 3. Customize content

Everything text-based — project descriptions, skills, experience,
contact links — lives in plain arrays/JSX near the top of `src/App.jsx`.
No design tokens are hidden elsewhere; colors and fonts are all in the
`CSS` template string at the bottom of the same file.

## 4. Build for deployment

```bash
npm run build
```

This outputs a static `dist/` folder you can deploy to Vercel, Netlify,
GitHub Pages, or any static host.

## 5. Design notes

- **Theme**: dark "live wallpaper" base with a slow-drifting mesh
  gradient (coral / indigo / lime), a cursor spotlight, and a
  hero phone mockup that tilts toward your mouse.
- **Navigation**: the fixed bottom pill bar is styled like a mobile
  app's tab bar — a deliberate nod to being a Flutter/mobile developer.
- Respects `prefers-reduced-motion` and disables mouse-tracking effects
  on touch devices automatically.
