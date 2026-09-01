"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Center, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function CustomModel() {
  const { scene } = useGLTF("/Hitem3d-1785317218370.glb");
  const modelRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Scale model so it occupies 75-80% of the 3D canvas on all screens
  const responsiveScale = Math.min(Math.max(viewport.width * 0.48, 1.6), 2.4);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Center>
        <primitive
          ref={modelRef}
          object={scene}
          scale={responsiveScale}
        />
      </Center>
    </Float>
  );
}

// Preload the GLB asset
useGLTF.preload("/Hitem3d-1785317218370.glb");

export default function Contact3DScene() {
  return (
    <div className="w-full h-full min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] relative pointer-events-none select-none rounded-3xl overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
      >
        {/* Soft Studio Canvas Background */}
        <color attach="background" args={["#FAFAFA"]} />

        {/* Studio Lighting Setup */}
        <ambientLight intensity={1.8} color="#ffffff" />
        <hemisphereLight intensity={1.2} color="#ffffff" groundColor="#e2e8f0" />
        <directionalLight position={[10, 15, 10]} intensity={2.5} color="#ffffff" castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[0, -10, 10]} intensity={0.8} color="#ffffff" />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <CustomModel />
          <ContactShadows position={[0, -1.25, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#000000" />
        </Suspense>
      </Canvas>
    </div>
  );
}
