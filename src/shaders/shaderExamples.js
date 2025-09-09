export const shaderExamples = {
  toon: {
    name: "Toon Shader",
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -modelViewPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uLightPosition;
      uniform float uSteps;
      
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(uLightPosition);
        
        float NdotL = dot(normal, lightDirection);
        float lightIntensity = smoothstep(0.0, 0.01, NdotL);
        float steps = uSteps;
        float level = floor(NdotL * steps);
        lightIntensity = level / steps;
        
        vec3 color = uColor * (lightIntensity * 0.7 + 0.3);
        
        // Rim lighting
        vec3 viewDirection = normalize(vViewPosition);
        float rimDot = 1.0 - dot(viewDirection, normal);
        float rimIntensity = smoothstep(0.6, 1.0, rimDot);
        
        color += vec3(0.2) * rimIntensity;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uColor: { value: [0.5, 0.7, 1.0] },
      uLightPosition: { value: [5.0, 5.0, 5.0] },
      uSteps: { value: 4.0 }
    }
  },
  
  tron: {
    name: "Tron Shader",
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uGlowColor;
      uniform float uGlowIntensity;
      uniform float uTime;
      uniform float uLineWidth;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
        
        // Grid pattern
        float grid = 0.0;
        float lineWidth = uLineWidth;
        vec2 coord = vUv * 10.0;
        
        if (mod(coord.x, 1.0) < lineWidth || mod(coord.y, 1.0) < lineWidth) {
          grid = 1.0;
        }
        
        // Animated pulse
        float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
        
        vec3 color = mix(vec3(0.0, 0.05, 0.1), uGlowColor, grid);
        color += uGlowColor * fresnel * uGlowIntensity * (0.5 + pulse * 0.5);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uGlowColor: { value: [0.0, 1.0, 1.0] },
      uGlowIntensity: { value: 2.0 },
      uTime: { value: 0.0 },
      uLineWidth: { value: 0.05 }
    }
  },
  
  holographic: {
    name: "Holographic",
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -modelViewPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uFresnelPower;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewPosition);
        
        float fresnel = pow(1.0 - dot(viewDirection, normal), uFresnelPower);
        
        // Animated rainbow effect
        float rainbow = sin(vPosition.y * 10.0 + uTime * 2.0) * 0.5 + 0.5;
        vec3 color = mix(uColor1, uColor2, rainbow);
        
        // Holographic interference pattern
        float interference = sin(vPosition.x * 20.0 + uTime) * 
                           sin(vPosition.y * 20.0 - uTime) * 
                           sin(vPosition.z * 20.0 + uTime * 0.5);
        
        color += vec3(interference * 0.2);
        color *= fresnel;
        
        // Add transparency effect
        float alpha = fresnel * 0.9 + 0.1;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      uTime: { value: 0.0 },
      uColor1: { value: [1.0, 0.0, 0.5] },
      uColor2: { value: [0.0, 0.5, 1.0] },
      uFresnelPower: { value: 2.0 }
    }
  },
  
  plasma: {
    name: "Plasma",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uScale;
      uniform float uSpeed;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        float time = uTime * uSpeed;
        vec2 p = vUv * uScale;
        
        float noise1 = sin(p.x * 10.0 + time) * cos(p.y * 10.0 + time);
        float noise2 = sin(p.x * 5.0 - time * 0.5) * cos(p.y * 7.0 + time * 0.7);
        float noise3 = sin(distance(p, vec2(0.5)) * 20.0 - time * 2.0);
        
        float totalNoise = (noise1 + noise2 + noise3) / 3.0;
        totalNoise = totalNoise * 0.5 + 0.5; // Normalize to 0-1
        
        vec3 color = mix(uColorA, uColorB, totalNoise);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uTime: { value: 0.0 },
      uColorA: { value: [1.0, 0.2, 0.0] },
      uColorB: { value: [0.0, 0.2, 1.0] },
      uScale: { value: 3.0 },
      uSpeed: { value: 1.0 }
    }
  },
  
  fresnel: {
    name: "Fresnel Glow",
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -modelViewPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uCoreColor;
      uniform vec3 uGlowColor;
      uniform float uPower;
      uniform float uIntensity;
      
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewPosition);
        
        float fresnel = pow(1.0 - dot(viewDirection, normal), uPower);
        
        vec3 color = mix(uCoreColor, uGlowColor, fresnel);
        color *= uIntensity;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uCoreColor: { value: [0.1, 0.1, 0.1] },
      uGlowColor: { value: [0.4, 0.8, 1.0] },
      uPower: { value: 3.0 },
      uIntensity: { value: 1.5 }
    }
  },
  
  matrix: {
    name: "Matrix Rain",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uSpeed;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        float time = uTime * uSpeed;
        
        // Create vertical strips
        float strips = 20.0;
        float stripIndex = floor(uv.x * strips);
        
        // Random speed for each strip
        float speed = random(vec2(stripIndex, 0.0)) * 0.5 + 0.5;
        
        // Falling effect
        float y = fract(uv.y - time * speed);
        
        // Character-like pattern
        float pattern = step(0.98, random(vec2(stripIndex, floor(y * 30.0))));
        
        // Fade effect
        float fade = 1.0 - y;
        
        vec3 color = uColor * pattern * fade;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uTime: { value: 0.0 },
      uColor: { value: [0.0, 1.0, 0.0] },
      uSpeed: { value: 0.5 }
    }
  }
};

export const defaultVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const defaultFragmentShader = `
uniform vec3 uColor;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  // Basic lighting
  vec3 light = normalize(vec3(0.5, 1.0, 0.3));
  float brightness = dot(vNormal, light) * 0.5 + 0.5;
  
  vec3 color = uColor * brightness;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

export const defaultUniforms = {
  uColor: { value: [0.5, 0.7, 1.0] },
  uTime: { value: 0.0 }
};