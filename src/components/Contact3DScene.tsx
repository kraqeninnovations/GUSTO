"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Center, Environment } from "@react-three/drei";
import * as THREE from "three";

function CustomModel() {
  const { scene } = useGLTF("/Hitem3d-1785317218370.glb");
  const modelRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Scale model so it occupies 75-80% of the 3D canvas on all screens
  const responsiveScale = Math.min(Math.max(viewport.width * 0.48, 1.6), 2.4);

  // Remove any ground/floor/plane/pedestal/background mesh underneath the logo
  useEffect(() => {
    if (!scene) return;

    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh);
      }
    });

    if (meshes.length > 1) {
      // Find bounding boxes for each mesh
      const boxes = meshes.map((m) => {
        m.geometry.computeBoundingBox();
        const box = new THREE.Box3();
        if (m.geometry.boundingBox) {
          box.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);
        } else {
          box.setFromObject(m);
        }
        return { mesh: m, box };
      });

      let minY = Infinity;
      let maxY = -Infinity;
      boxes.forEach(({ box }) => {
        if (box.min.y < minY) minY = box.min.y;
        if (box.max.y > maxY) maxY = box.max.y;
      });

      const totalHeight = maxY - minY;

      boxes.forEach(({ mesh, box }) => {
        const name = (mesh.name || "").toLowerCase();
        const height = box.max.y - box.min.y;
        const width = box.max.x - box.min.x;
        const depth = box.max.z - box.min.z;
        const centerY = (box.min.y + box.max.y) / 2;

        const isGroundByName =
          name.includes("floor") ||
          name.includes("ground") ||
          name.includes("plane") ||
          name.includes("base") ||
          name.includes("shadow") ||
          name.includes("stage") ||
          name.includes("bg") ||
          name.includes("background") ||
          name.includes("podium") ||
          name.includes("bottom") ||
          name.includes("pedestal") ||
          name.includes("platform");

        const isFlatFloor =
          height < totalHeight * 0.3 &&
          centerY < minY + totalHeight * 0.4 &&
          (width > height * 1.8 || depth > height * 1.8);

        const isBottomMesh =
          centerY < minY + totalHeight * 0.35 && height < totalHeight * 0.4;

        if (isGroundByName || isFlatFloor || isBottomMesh) {
          mesh.visible = false;
        }
      });
    }
  }, [scene]);

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
        <hemisphereLight intensity={1.2} color="#ffffff" groundColor="#ffffff" />
        <directionalLight position={[10, 15, 10]} intensity={2.5} color="#ffffff" castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[0, -10, 10]} intensity={0.8} color="#ffffff" />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <CustomModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
