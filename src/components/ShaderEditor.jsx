import Editor from '@monaco-editor/react';
import { useState } from 'react';

export default function ShaderEditor({ 
  vertexShader, 
  fragmentShader, 
  onVertexChange, 
  onFragmentChange,
  error 
}) {
  const [activeTab, setActiveTab] = useState('fragment');
  
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    lineNumbers: 'on',
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    fontLigatures: true,
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace"
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'vertex' 
              ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('vertex')}
        >
          Vertex Shader
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'fragment' 
              ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('fragment')}
        >
          Fragment Shader
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 text-xs font-mono">
          {error}
        </div>
      )}
      
      <div className="flex-1 relative">
        <div className={`absolute inset-0 ${activeTab === 'vertex' ? 'block' : 'hidden'}`}>
          <Editor
            language="glsl"
            value={vertexShader}
            onChange={onVertexChange}
            options={editorOptions}
          />
        </div>
        <div className={`absolute inset-0 ${activeTab === 'fragment' ? 'block' : 'hidden'}`}>
          <Editor
            language="glsl"
            value={fragmentShader}
            onChange={onFragmentChange}
            options={editorOptions}
          />
        </div>
      </div>
    </div>
  );
}