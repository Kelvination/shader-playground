export default function ShaderPresets({ presets, selectedPreset, onPresetChange }) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Shader Presets
      </h3>
      <div className="space-y-1">
        {Object.entries(presets).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => onPresetChange(key)}
            className={`
              w-full text-left px-3 py-2 rounded-lg transition-all duration-200
              ${selectedPreset === key 
                ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-transparent'
              }
            `}
          >
            <span className="text-sm font-medium">{preset.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <button
          onClick={() => onPresetChange('custom')}
          className={`
            w-full text-left px-3 py-2 rounded-lg transition-all duration-200
            ${selectedPreset === 'custom' 
              ? 'bg-purple-900/50 text-purple-400 border border-purple-500' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-transparent'
            }
          `}
        >
          <span className="text-sm font-medium">Custom Shader</span>
        </button>
      </div>
    </div>
  );
}