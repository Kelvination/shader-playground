import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

function ShaderMesh({ geometry, vertexShader, fragmentShader, uniforms, wireframe }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniforms,
      side: THREE.DoubleSide,
      wireframe: wireframe,
      transparent: true
    });
  }, [vertexShader, fragmentShader, uniforms, wireframe]);
  
  useFrame((state) => {
    if (materialRef.current && materialRef.current.uniforms.uTime) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [vertexShader, fragmentShader]);
  
  const geometryComponent = useMemo(() => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[1.5, 32, 32]} />;
      case 'cube':
        return <boxGeometry args={[2, 2, 2]} />;
      case 'torus':
        return <torusGeometry args={[1.2, 0.5, 16, 32]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[1, 0.3, 128, 16]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1.5, 0]} />;
      case 'cylinder':
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      case 'cone':
        return <coneGeometry args={[1.5, 2, 32]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1.5, 0]} />;
      default:
        return <sphereGeometry args={[1.5, 32, 32]} />;
    }
  }, [geometry]);
  
  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      {geometryComponent}
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

function CustomModel({ modelUrl, vertexShader, fragmentShader, uniforms, wireframe }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniforms,
      side: THREE.DoubleSide,
      wireframe: wireframe,
      transparent: true
    });
  }, [vertexShader, fragmentShader, uniforms, wireframe]);
  
  useFrame((state) => {
    if (materialRef.current && materialRef.current.uniforms.uTime) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [vertexShader, fragmentShader]);
  
  // For now, we'll use a placeholder geometry since model loading requires more setup
  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

export default function SceneViewer({ 
  geometry, 
  vertexShader, 
  fragmentShader, 
  uniforms, 
  wireframe,
  showGrid,
  autoRotate,
  customModel 
}) {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {customModel ? (
          <CustomModel 
            modelUrl={customModel}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            wireframe={wireframe}
          />
        ) : (
          <ShaderMesh 
            geometry={geometry}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            wireframe={wireframe}
          />
        )}
        
        {showGrid && (
          <Grid 
            args={[10, 10]} 
            cellSize={1} 
            cellThickness={0.5} 
            cellColor="#333333" 
            sectionSize={5} 
            sectionThickness={1} 
            sectionColor="#666666" 
            fadeDistance={30} 
            fadeStrength={1} 
            followCamera={false} 
          />
        )}
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}