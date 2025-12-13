import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './Dither.css';

const waveVertexShader = `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waveFragmentShader = `
  precision highp float;
  uniform float time;
  uniform vec2 mouse;
  uniform float mouseIntensity;
  varying vec2 vUv;
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, mouse);
    float mouseEffect = exp(-dist * dist * mouseIntensity) * 0.5;
    
    float n = noise(uv * 5.0 + time * 0.5);
    float wave = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time);
    
    float pattern = n * 0.5 + wave * 0.5 + mouseEffect;
    
    vec3 color = vec3(0.0549, 0.6471, 0.9255);
    vec3 finalColor = color * pattern;
    
    gl_FragColor = vec4(finalColor, pattern * 0.8);
  }
`;

function DitherWaves({ mouseIntensity = 5.0 }) {
  const mesh = useRef(null);
  const uniforms = useRef({
    time: new THREE.Uniform(0),
    mouse: new THREE.Uniform(new THREE.Vector2(0.5, 0.5)),
    mouseIntensity: new THREE.Uniform(mouseIntensity),
  });

  const { viewport, size, gl } = useThree();

  useFrame(({ clock }) => {
    if (mesh.current) {
      uniforms.current.time.value = clock.getElapsedTime();
    }
  });

  const handleMouseMove = (event) => {
    const x = event.clientX / window.innerWidth;
    const y = 1 - event.clientY / window.innerHeight;
    uniforms.current.mouse.value.set(x, y);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial vertexShader={waveVertexShader} fragmentShader={waveFragmentShader} uniforms={uniforms.current} transparent />
      </mesh>
      {/* Temporarily disable EffectComposer to fix the undefined children error */}
      {/* <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
      </EffectComposer> */}
    </>
  );
}

export default function Dither() {
  return (
    <Canvas
      className="dither-canvas"
      camera={{ position: [0, 0, 5] }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <color attach="background" args={['#0f172a']} />
      <DitherWaves mouseIntensity={5.0} />
    </Canvas>
  );
}
