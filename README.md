# 🎬 SceneCraft

> High-quality educational animation builder inspired by YouTube's best educational channels

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- npm v10+
- PostgreSQL 15+
- FFmpeg (for video export)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/scenecraft.git
cd scenecraft

# 2. Install dependencies
npm install

# 3. Start Docker containers (PostgreSQL)
docker compose up -d

# 4. Run development server
npm run dev

# 5. Open in browser
http://localhost:3906
```

## 🎯 What is SceneCraft?

SceneCraft is a tool for creating professional educational animations, one scene at a time. Instead of generating entire videos automatically, we focus on crafting perfect individual scenes.

### Key Features
- 📝 **Scene-by-Scene Creation**: Focus on quality over quantity
- 🎨 **YouTube-Style Graphics**: Hand-drawn animations like 3Blue1Brown, Fireship
- ⚡ **Real-time Preview**: See your animations as you build them
- 🎯 **Educational Focus**: Optimized for teaching technical concepts

## 📁 Project Structure

```
scenecraft/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express.js backend
├── components/
│   ├── education/        # Educational animation components
│   ├── data-viz/         # Data visualization components
│   └── scene-builder/    # Scene building UI (NEW)
├── assets/
│   ├── icons/           # Icon library
│   ├── templates/       # Animation templates
│   └── youtube-style/   # YouTube-inspired graphics
└── packages/
    ├── asset-loader/    # Asset management
    └── shared/          # Common utilities
```

## ✨ Features

### Current Components
- **Network Graph**: Palantir-style relationship visualization
- **Geo Map**: Interactive geographical data display
- **Radial Network**: Beautiful radial connection diagrams
- **Hand-Drawn Animations**: YouTube education channel style
- **SQL Visualizer**: Database concept animations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Prisma, PostgreSQL
- **Animation**: Canvas API, SVG, D3.js
- **Graphics**: Sharp for image processing
- **Video Export**: FFmpeg
- **Styling**: Hand-drawn fonts (Kalam), YouTube-inspired themes

## 🚀 Roadmap

### Phase 1: Foundation (Current)
- ✅ Hand-drawn animation components
- ✅ Data visualization tools
- ✅ YouTube-style graphics
- 🔄 Scene builder interface

### Phase 2: Asset Library
- [ ] Pre-made icons and shapes
- [ ] Animation presets
- [ ] Template library
- [ ] Custom fonts and styles

### Phase 3: Export & Share
- [ ] MP4 video export
- [ ] GIF generation
- [ ] YouTube optimization
- [ ] Social media formats

## 📚 Available Pages

- `/dashboard/education` - Hand-drawn educational animations
- `/dashboard/data-viz` - Advanced data visualizations
- `/dashboard/builder` - Scene builder interface (coming soon)

## 🎨 Inspiration

- **3Blue1Brown**: Mathematical animations
- **Fireship**: Tech explanations with style
- **Kurzgesagt**: Beautiful educational graphics
- **The Coding Train**: Hand-drawn programming tutorials

## 🤝 Contributing

We're building the best tool for educational content creators. Join us!

## 📝 License

MIT License

## 📞 Contact

Questions? Ideas? Let's build amazing educational content together!

---

**SceneCraft**: Where education meets beautiful animation 🎨