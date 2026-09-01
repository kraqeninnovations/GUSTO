"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const coverVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Three-texture noise dissolve shader
const multiDissolveFragmentShader = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform sampler2D uTexture3;
  uniform vec2 uResolution;
  uniform vec2 uImgRes1;
  uniform vec2 uImgRes2;
  uniform vec2 uImgRes3;
  uniform float uProgress; // 0.0 to 1.0 (0->0.5: T1->T2, 0.5->1.0: T2->T3)
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 imageRes) {
    float screenAspect = screenRes.x / screenRes.y;
    float imageAspect = imageRes.x / imageRes.y;
    vec2 scale = vec2(1.0);
    if (screenAspect > imageAspect) {
      scale = vec2(1.0, imageAspect / screenAspect);
    } else {
      scale = vec2(screenAspect / imageAspect, 1.0);
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv1 = getCoverUv(vUv, uResolution, uImgRes1);
    vec2 uv2 = getCoverUv(vUv, uResolution, uImgRes2);
    vec2 uv3 = getCoverUv(vUv, uResolution, uImgRes3);

    vec4 col1 = texture2D(uTexture1, uv1);
    vec4 col2 = texture2D(uTexture2, uv2);
    vec4 col3 = texture2D(uTexture3, uv3);

    // Noise calculation for dissolve edge
    vec2 centeredUv = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    centeredUv.x *= aspect;
    float dist = length(centeredUv);
    float angle = atan(centeredUv.y, centeredUv.x);
    
    float noiseVal = fbm(vUv * 6.0 + uTime * 0.1) * 0.2 + fbm(vec2(angle * 4.0, dist * 3.0)) * 0.1;
    
    vec4 finalColor;

    if (uProgress <= 0.5) {
      // Phase 1: 0.0 to 0.5 (T1 -> T2)
      float p1 = uProgress * 2.0;
      float threshold = p1 * 0.85 + 0.05;
      float mask = smoothstep(threshold - 0.12, threshold + 0.08, dist + noiseVal);
      finalColor = mix(col2, col1, mask);
      
      float edge = smoothstep(threshold - 0.06, threshold, dist + noiseVal) * 
                   smoothstep(threshold + 0.06, threshold, dist + noiseVal);
      finalColor.rgb += vec3(1.0, 0.2, 0.1) * edge * 0.5 * (1.0 - p1);
    } else {
      // Phase 2: 0.5 to 1.0 (T2 -> T3)
      float p2 = (uProgress - 0.5) * 2.0;
      float threshold = p2 * 0.85 + 0.05;
      float mask = smoothstep(threshold - 0.12, threshold + 0.08, dist + noiseVal);
      finalColor = mix(col3, col2, mask);
      
      float edge = smoothstep(threshold - 0.06, threshold, dist + noiseVal) * 
                   smoothstep(threshold + 0.06, threshold, dist + noiseVal);
      finalColor.rgb += vec3(1.0, 0.3, 0.1) * edge * 0.5 * (1.0 - p2);
    }

    gl_FragColor = finalColor;
  }
`;

interface MultiSceneProps {
  images: string[];
  progress: number;
}

const MultiScene = ({ images, progress }: MultiSceneProps) => {
  const [t1, t2, t3] = useTexture([
    images[0] || "/00.jpeg",
    images[1] || "/01.jpeg",
    images[2] || "/02.jpeg",
  ]);

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture1: { value: t1 },
      uTexture2: { value: t2 },
      uTexture3: { value: t3 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImgRes1: { value: new THREE.Vector2((t1.image as any)?.width || 1920, (t1.image as any)?.height || 1080) },
      uImgRes2: { value: new THREE.Vector2((t2.image as any)?.width || 1920, (t2.image as any)?.height || 1080) },
      uImgRes3: { value: new THREE.Vector2((t3.image as any)?.width || 1920, (t3.image as any)?.height || 1080) },
      uProgress: { value: 0.0 },
      uTime: { value: 0.0 },
    }),
    [t1, t2, t3, size]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uProgress.value = progress;
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={coverVertexShader}
        fragmentShader={multiDissolveFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export interface StoryItem {
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface ScrollDissolveRevealProps {
  sectionLabel: string;
  sectionTitle: string;
  subTitle?: string;
  stories: StoryItem[];
  className?: string;
}

export function ScrollDissolveReveal({
  sectionLabel,
  sectionTitle,
  subTitle,
  stories,
  className,
}: ScrollDissolveRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    setMounted(true);
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setCurrentProgress(Math.max(0, Math.min(1, v)));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Determine active story index based on progress
  let activeIndex = 0;
  if (currentProgress >= 2 / stories.length) {
    activeIndex = 2;
  } else if (currentProgress >= 1 / stories.length) {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }

  const activeStory = stories[activeIndex] || stories[0];
  const imageSources = stories.map((s) => s.image);

  return (
    <div
      ref={containerRef}
      id="champions"
      className={cn("relative w-full bg-black text-white", className)}
      style={{ height: `calc(${stories.length + 1} * 100vh)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background WebGL Shader Canvas with fallback image */}
        <div className="absolute inset-0 z-0">
          {/* Always render underlying fallback image in DOM */}
          <img
            src={activeStory.image || stories[0]?.image || "/00.jpeg"}
            alt="Story Background"
            className="w-full h-full object-cover absolute inset-0"
          />

          {mounted && (
            <Canvas
              gl={{ antialias: true, powerPreference: "high-performance" }}
              className="absolute inset-0 w-full h-full"
            >
              <OrthographicCamera
                makeDefault
                manual
                left={-1}
                right={1}
                top={1}
                bottom={-1}
                near={0.1}
                far={10}
                position={[0, 0, 1]}
              />
              <React.Suspense fallback={null}>
                <MultiScene images={imageSources} progress={currentProgress} />
              </React.Suspense>
            </Canvas>
          )}

          {/* Dark Overlay Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent max-lg:bg-gradient-to-t max-lg:from-black max-lg:via-black/70 max-lg:to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />
        </div>

        {/* Floating Story Content Overlay */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col justify-between py-8 sm:py-12 pointer-events-none">
          {/* Header Bar */}
          <div className="pointer-events-auto flex items-center justify-between border-b border-white/10 pb-4 max-w-7xl w-full mx-auto">
            <div>
              <span className="text-red-500 text-[10px] sm:text-xs tracking-[0.3em] font-extrabold uppercase drop-shadow-md">
                {sectionLabel}
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
                {sectionTitle}
              </h2>
            </div>
            
            {/* Story Counter Badge */}
            <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
              <span className="text-xs sm:text-sm font-black text-red-500">
                0{activeIndex + 1}
              </span>
              <span className="text-xs text-zinc-500 font-bold">/</span>
              <span className="text-xs font-bold text-zinc-400">
                0{stories.length}
              </span>
            </div>
          </div>

          {/* Active Story Details Panel */}
          <div className="pointer-events-auto w-full max-w-xl my-auto max-lg:mt-auto max-lg:mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`story-${activeIndex}`}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4 bg-zinc-950/75 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl shadow-black/80"
              >
                {/* Year Pill & Accent Line */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-600/90 text-white font-black text-xs sm:text-sm rounded-lg uppercase tracking-widest shadow-md shadow-red-600/30">
                    {activeStory.year}
                  </span>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-red-500 to-transparent rounded-full" />
                </div>

                {/* Story Title */}
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
                  {activeStory.title}
                </h3>

                {/* Story Description */}
                <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-medium drop-shadow">
                  {activeStory.description}
                </p>

                {/* Navigation Dots / Progress */}
                <div className="pt-3 flex items-center gap-2 border-t border-white/10">
                  {stories.map((s, idx) => (
                    <div
                      key={s.year + idx}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        idx === activeIndex
                          ? "w-8 bg-red-600 shadow-md shadow-red-600/50"
                          : "w-2 bg-zinc-700 opacity-60"
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Scroll Prompt */}
          <div className="pointer-events-auto flex items-center justify-between text-zinc-400 text-[10px] sm:text-xs tracking-widest font-extrabold uppercase max-w-7xl w-full mx-auto">
            <span>SCROLL TO EXPLORE STORY</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-white font-bold">{Math.round(currentProgress * 100)}% EXPLORED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollDissolveReveal;
