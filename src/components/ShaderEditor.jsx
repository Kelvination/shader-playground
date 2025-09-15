import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';

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

  // Configure Monaco theme before mount
  const handleEditorBeforeMount = (monaco) => {
    monaco.editor.defineTheme('shader-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#111827',
      }
    });
  };

  // Configure Monaco theme on mount
  const handleEditorMount = (editor, monaco) => {
    monaco.editor.setTheme('shader-dark');
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
        <Editor
          key={activeTab}
          language="glsl"
          value={activeTab === 'vertex' ? vertexShader : fragmentShader}
          onChange={activeTab === 'vertex' ? onVertexChange : onFragmentChange}
          options={editorOptions}
          beforeMount={handleEditorBeforeMount}
          onMount={handleEditorMount}
          theme="shader-dark"
          loading={
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
}