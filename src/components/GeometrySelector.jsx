export default function GeometrySelector({ selectedGeometry, onGeometryChange }) {
  const geometries = [
    { value: 'sphere', label: 'Sphere', icon: '○' },
    { value: 'cube', label: 'Cube', icon: '□' },
    { value: 'torus', label: 'Torus', icon: '◯' },
    { value: 'torusKnot', label: 'Torus Knot', icon: '∞' },
    { value: 'icosahedron', label: 'Icosahedron', icon: '⬟' },
    { value: 'cylinder', label: 'Cylinder', icon: '▭' },
    { value: 'cone', label: 'Cone', icon: '△' },
    { value: 'tetrahedron', label: 'Tetrahedron', icon: '▲' }
  ];
  
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Geometry
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {geometries.map((geo) => (
          <button
            key={geo.value}
            onClick={() => onGeometryChange(geo.value)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg
              transition-all duration-200 border min-w-0
              ${selectedGeometry === geo.value
                ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400'
                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            `}
            title={geo.label}
          >
            <span className="text-xl mb-1">{geo.icon}</span>
            <span className="text-xs truncate w-full px-1">{geo.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-3">
        <label className="flex items-center justify-between px-3 py-2 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <span className="text-sm text-gray-300">Upload Custom Model</span>
          <input 
            type="file" 
            accept=".glb,.gltf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // Handle file upload - for now just log
                console.log('Model file selected:', file.name);
              }
            }}
          />
          <span className="text-xs text-gray-500 ml-2">(.glb, .gltf)</span>
        </label>
      </div>
    </div>
  );
}