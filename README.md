# Shader Playground

A real-time GLSL shader editor for creative experimentation. Write fragment shaders and see the results instantly, with live reload as you type.

![Shader Playground](https://img.shields.io/badge/WebGL-Powered-red) ![Three.js](https://img.shields.io/badge/Three.js-Rendering-black) ![GLSL](https://img.shields.io/badge/GLSL-Shaders-blue)

## 🎨 Features

- **Live Editing** - See your shader changes instantly as you type
- **Multiple Geometries** - Test shaders on different 3D shapes (sphere, cube, torus, etc.)
- **Starter Examples** - Collection of basic shaders to learn from and modify
- **Parameter Controls** - Adjustable sliders for experimenting with uniform values
- **Syntax Highlighting** - Monaco editor with GLSL syntax support
- **Error Feedback** - Clear error messages when shaders fail to compile
- **Fullscreen Preview** - Toggle between split view and fullscreen rendering

## 🚀 Live Demo

Try it out at: [https://kelvinnewton.com/projects/shader-playground/](https://kelvinnewton.com/projects/shader-playground/)

## 💻 Local Development

### Prerequisites
- Node.js 20+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kelvination/shader-playground.git
cd shader-playground

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the project
pnpm build

# Preview production build
pnpm preview
```

## 🛠️ Tech Stack

- **React** - UI framework
- **Three.js** - 3D rendering
- **Monaco Editor** - Code editing with syntax highlighting
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling

## 📝 Writing Shaders

The playground uses standard GLSL fragment shaders. Here's a basic template:

```glsl
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    vec2 st = vUv;
    
    // Your shader code here
    vec3 color = vec3(st.x, st.y, abs(sin(time)));
    
    gl_FragColor = vec4(color, 1.0);
}
```

### Available Uniforms

- `time` - Elapsed time in seconds
- `resolution` - Canvas resolution in pixels
- `mouse` - Mouse position (normalized 0-1)

### Tips for Getting Started

1. Start with one of the example shaders
2. Make small changes and see how they affect the output
3. Use the parameter sliders to experiment with values
4. Try different geometries to see how your shader maps to 3D surfaces
5. Check the console for detailed error messages if compilation fails

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new example shaders
- Improve the editor experience
- Add new geometries or features
- Fix bugs or improve performance

## 📄 License

MIT License - feel free to use this for learning, experimenting, or building your own shader tools!

## 🙏 Acknowledgments

- Inspired by [Shadertoy](https://www.shadertoy.com/) and [The Book of Shaders](https://thebookofshaders.com/)
- Built with [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

Made with ❤️ for the creative coding community