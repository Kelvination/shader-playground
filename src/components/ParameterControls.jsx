import { useState, useEffect } from 'react';

export default function ParameterControls({ uniforms, onUniformChange }) {
  const [localUniforms, setLocalUniforms] = useState({});
  
  useEffect(() => {
    const uniformsObj = {};
    Object.entries(uniforms).forEach(([key, uniform]) => {
      uniformsObj[key] = uniform.value;
    });
    setLocalUniforms(uniformsObj);
  }, [uniforms]);
  
  const handleChange = (key, value, index = null) => {
    const newValue = index !== null 
      ? localUniforms[key].map((v, i) => i === index ? parseFloat(value) : v)
      : parseFloat(value);
    
    setLocalUniforms(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    onUniformChange(key, newValue);
  };
  
  const renderControl = (key, value) => {
    if (key === 'uTime') return null; // Skip time uniform
    
    if (Array.isArray(value)) {
      // Vector uniform (color or position)
      const isColor = key.toLowerCase().includes('color');
      
      if (isColor && value.length === 3) {
        // Convert to hex for color input
        const toHex = (val) => {
          const r = Math.round(val[0] * 255);
          const g = Math.round(val[1] * 255);
          const b = Math.round(val[2] * 255);
          return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
        };
        
        const fromHex = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
          ] : [1, 1, 1];
        };
        
        return (
          <div key={key} className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              {key.replace(/^u/, '')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={toHex(value)}
                onChange={(e) => {
                  const rgb = fromHex(e.target.value);
                  setLocalUniforms(prev => ({
                    ...prev,
                    [key]: rgb
                  }));
                  onUniformChange(key, rgb);
                }}
                className="h-8 w-16 rounded cursor-pointer"
              />
              <span className="text-xs text-gray-500">
                RGB: {value.map(v => v.toFixed(2)).join(', ')}
              </span>
            </div>
          </div>
        );
      } else {
        // Vector components
        return (
          <div key={key} className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              {key.replace(/^u/, '')}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {value.map((val, i) => (
                <input
                  key={i}
                  type="number"
                  value={val}
                  onChange={(e) => handleChange(key, e.target.value, i)}
                  step="0.1"
                  className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
                  placeholder={['X', 'Y', 'Z'][i]}
                />
              ))}
            </div>
          </div>
        );
      }
    } else {
      // Scalar uniform
      const min = key.includes('Steps') ? 1 : 0;
      const max = key.includes('Steps') ? 10 : 
                 key.includes('Power') ? 10 : 
                 key.includes('Intensity') ? 5 : 
                 key.includes('Scale') ? 10 : 
                 key.includes('Speed') ? 3 : 
                 key.includes('Width') ? 0.5 : 2;
      const step = key.includes('Steps') ? 1 : 0.01;
      
      return (
        <div key={key} className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1">
            {key.replace(/^u/, '')}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="flex-1"
            />
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-16 bg-gray-700 text-white text-xs px-2 py-1 rounded"
            />
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Shader Parameters
      </h3>
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(localUniforms).map(([key, value]) => 
          renderControl(key, value)
        )}
      </div>
    </div>
  );
}