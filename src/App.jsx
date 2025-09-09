import { useState, useCallback, useMemo } from 'react';
import SceneViewer from './components/SceneViewer';
import ShaderEditor from './components/ShaderEditor';
import GeometrySelector from './components/GeometrySelector';
import ShaderPresets from './components/ShaderPresets';
import ParameterControls from './components/ParameterControls';
import { 
  shaderExamples, 
  defaultVertexShader, 
  defaultFragmentShader, 
  defaultUniforms 
} from './shaders/shaderExamples';

function App() {
  const [selectedGeometry, setSelectedGeometry] = useState('sphere');
  const [selectedPreset, setSelectedPreset] = useState('toon');
  const [vertexShader, setVertexShader] = useState(shaderExamples.toon.vertexShader);
  const [fragmentShader, setFragmentShader] = useState(shaderExamples.toon.fragmentShader);
  const [uniforms, setUniforms] = useState(shaderExamples.toon.uniforms);
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [shaderError, setShaderError] = useState(null);
  const [customModel, setCustomModel] = useState(null);
  
  const handlePresetChange = useCallback((presetKey) => {
    setSelectedPreset(presetKey);
    
    if (presetKey === 'custom') {
      setVertexShader(defaultVertexShader);
      setFragmentShader(defaultFragmentShader);
      setUniforms(defaultUniforms);
    } else if (shaderExamples[presetKey]) {
      const preset = shaderExamples[presetKey];
      setVertexShader(preset.vertexShader);
      setFragmentShader(preset.fragmentShader);
      setUniforms(preset.uniforms);
    }
    setShaderError(null);
  }, []);
  
  const handleVertexChange = useCallback((value) => {
    setVertexShader(value || '');
    setShaderError(null);
    setSelectedPreset('custom');
  }, []);
  
  const handleFragmentChange = useCallback((value) => {
    setFragmentShader(value || '');
    setShaderError(null);
    setSelectedPreset('custom');
  }, []);
  
  const handleUniformChange = useCallback((key, value) => {
    setUniforms(prev => ({
      ...prev,
      [key]: { value }
    }));
  }, []);
  
  const exportShader = useCallback(() => {
    const shaderData = {
      vertexShader,
      fragmentShader,
      uniforms,
      geometry: selectedGeometry
    };
    
    const blob = new Blob([JSON.stringify(shaderData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shader-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [vertexShader, fragmentShader, uniforms, selectedGeometry]);
  
  const importShader = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.vertexShader) setVertexShader(data.vertexShader);
        if (data.fragmentShader) setFragmentShader(data.fragmentShader);
        if (data.uniforms) setUniforms(data.uniforms);
        if (data.geometry) setSelectedGeometry(data.geometry);
        setSelectedPreset('custom');
      } catch (error) {
        setShaderError('Failed to import shader: Invalid file format');
      }
    };
    reader.readAsText(file);
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Shader Playground
          </h1>
          <span className="text-xs text-gray-500">Three.js GLSL Editor</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
              className="rounded"
            />
            <span>Wireframe</span>
          </label>
          
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded"
            />
            <span>Grid</span>
          </label>
          
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              className="rounded"
            />
            <span>Auto Rotate</span>
          </label>
          
          <div className="border-l border-gray-700 pl-3 flex space-x-2">
            <button
              onClick={exportShader}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
            >
              Export
            </button>
            <label className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm cursor-pointer transition-colors">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importShader}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <ShaderPresets
            presets={shaderExamples}
            selectedPreset={selectedPreset}
            onPresetChange={handlePresetChange}
          />
          <GeometrySelector
            selectedGeometry={selectedGeometry}
            onGeometryChange={setSelectedGeometry}
          />
          <ParameterControls
            uniforms={uniforms}
            onUniformChange={handleUniformChange}
          />
        </div>
        
        {/* Center - 3D View */}
        <div className="flex-1 relative">
          <SceneViewer
            geometry={selectedGeometry}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            wireframe={wireframe}
            showGrid={showGrid}
            autoRotate={autoRotate}
            customModel={customModel}
          />
        </div>
        
        {/* Right - Code Editor */}
        <div className="w-1/3 min-w-[400px] border-l border-gray-700">
          <ShaderEditor
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            onVertexChange={handleVertexChange}
            onFragmentChange={handleFragmentChange}
            error={shaderError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;