import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SharedClock } from './SharedClock';

interface Stage3DProps {
  scrollProgress: number;
  activeColorHex?: string;
}

export const Stage3D: React.FC<Stage3DProps> = ({
  activeColorHex = '#8B1E1E',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const keyLightRef = useRef<THREE.SpotLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Update key light color when accent changes
  useEffect(() => {
    if (keyLightRef.current && activeColorHex) {
      keyLightRef.current.color.setStyle(activeColorHex);
    }
  }, [activeColorHex]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.0);
    cameraRef.current = camera;

    // 3. Renderer with high performance
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Theatrical Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffbf0, 1.2);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xffe29a, 3.8, 25, Math.PI / 4, 0.45, 1.2);
    keySpot.position.set(3, 4, 4);
    scene.add(keySpot);
    keyLightRef.current = keySpot;

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.2);
    rimLight.position.set(-3.5, 2, -1.5);
    scene.add(rimLight);

    // 5. Floating Gold Dust Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdfca76,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. Subscribe to Shared Clock
    const clock = SharedClock.getInstance();
    const unsubscribe = clock.subscribe((_time, deltaTime) => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y += deltaTime * 0.035;
        particlesRef.current.rotation.x += deltaTime * 0.015;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    });

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
};
