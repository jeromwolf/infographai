# 🎬 Scene Builder - Project Pivot Roadmap

## New Vision
**From**: Full automatic video generation (Low quality)
**To**: High-quality single scene animation builder

## Project Structure (After Cleanup)
```
infographai/
├── apps/
│   ├── web/              # Main application
│   │   ├── components/
│   │   │   ├── education/    # Hand-drawn animations ✅
│   │   │   ├── data-viz/     # Data visualizations ✅
│   │   │   └── scene-builder/ # NEW: Scene building UI
│   │   └── app/
│   │       ├── dashboard/
│   │       │   ├── education/  # Current demos ✅
│   │       │   ├── data-viz/   # Current demos ✅
│   │       │   └── builder/    # NEW: Scene builder interface
│   └── api/              # Backend API
│       └── src/
│           ├── routes/       # API endpoints
│           └── services/     # Core services (cleaned)
├── packages/
│   ├── asset-loader/     # Asset management ✅
│   ├── asset-manager/    # Asset library ✅
│   └── shared/          # Shared utilities ✅
├── assets/              # Visual assets
│   ├── icons/          # Icon library
│   ├── templates/      # Animation templates (simplified)
│   └── youtube-style/  # NEW: YouTube-style assets
└── archive/           # Old code (backed up)
```

## Key Features to Build
1. **Scene Description Input**
   - Text input for scene description
   - Style selector (3Blue1Brown, Fireship, etc.)
   - Duration setting (5-10 seconds)

2. **Visual Asset Library**
   - Pre-made SVG components
   - Hand-drawn style elements
   - YouTube channel inspired graphics

3. **Animation Builder**
   - Drag & drop interface
   - Timeline editor
   - Real-time preview

4. **Export Options**
   - MP4 export
   - GIF export
   - Frame-by-frame PNG

## What We Keep
✅ Authentication system
✅ Database structure
✅ Hand-drawn animation components
✅ Data visualization components
✅ Sharp + SVG rendering
✅ Canvas animation system

## What We Remove
❌ Complex scenario generation
❌ Multi-scene orchestration
❌ Unused package dependencies
❌ Failed video synthesis attempts

## Next Steps
1. Define target YouTube channels for style reference
2. Build asset library based on those styles
3. Create scene builder interface
4. Implement single-scene animation engine
5. Add export functionality

## Success Metrics
- Single scene quality: 90%+ (vs current 27%)
- Generation time: <5 seconds
- User satisfaction: Immediate visual feedback
- Flexibility: Mix and match assets easily