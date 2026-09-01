"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Shuffle from "./Shuffle";

export interface ChampionItem {
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface RippleDisplacementSliderProps {
  sectionLabel: string;
  sectionTitle: string;
  subTitle?: string;
  items: ChampionItem[];
  autoPlayInterval?: number;
  className?: string;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const rippleFragmentShader = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uProgress;
  uniform float uRippleIntensity;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uImgRes1;
  uniform vec2 uImgRes2;
  varying vec2 vUv;

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

    float wave = sin(vUv.y * 18.0 + uTime * 4.0) * cos(vUv.x * 18.0 + uTime * 4.0);
    float dist = length(vUv - vec2(0.5));
    float rippleOffset = sin(dist * 28.0 - uTime * 6.0) * uRippleIntensity * sin(uProgress * 3.14159);
    
    vec2 displacedUv1 = uv1 + vec2(wave + rippleOffset, wave - rippleOffset) * uRippleIntensity * (1.0 - uProgress);
    vec2 displacedUv2 = uv2 + vec2(wave - rippleOffset, wave + rippleOffset) * uRippleIntensity * uProgress;

    vec4 col1 = texture2D(uTexture1, displacedUv1);
    vec4 col2 = texture2D(uTexture2, displacedUv2);

    float mixProgress = smoothstep(0.0, 1.0, uProgress + wave * 0.08 * sin(uProgress * 3.14159));
    vec4 finalColor = mix(col1, col2, clamp(mixProgress, 0.0, 1.0));

    // Subtle crimson liquid shimmer effect during peak ripple
    float shimmer = sin(uProgress * 3.14159) * uRippleIntensity * 0.2;
    finalColor.rgb += vec3(0.95, 0.15, 0.1) * shimmer * (col1.r + col2.r);

    gl_FragColor = finalColor;
  }
`;

export function RippleDisplacementSlider({
  sectionLabel,
  sectionTitle,
  subTitle,
  items,
  autoPlayInterval = 5000,
  className,
}: RippleDisplacementSliderProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);

  // References for WebGL Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);

  const imageSources = useMemo(
    () => items.map((item) => item.image || "/00.jpeg"),
    [items]
  );

  // Load Three.js Textures
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const loadedTextures: THREE.Texture[] = [];

    imageSources.forEach((src: string) => {
      const tex = textureLoader.load(src, () => {
        renderer.render(scene, camera);
      });
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      loadedTextures.push(tex);
    });

    texturesRef.current = loadedTextures;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: rippleFragmentShader,
      uniforms: {
        uTexture1: { value: loadedTextures[0] },
        uTexture2: { value: loadedTextures[1] || loadedTextures[0] },
        uProgress: { value: 0 },
        uRippleIntensity: { value: 0 },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uImgRes1: { value: new THREE.Vector2(1920, 1080) },
        uImgRes2: { value: new THREE.Vector2(1920, 1080) },
      },
    });
    materialRef.current = material;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(plane);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !materialRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      rendererRef.current.setSize(newW, newH);
      materialRef.current.uniforms.uResolution.value.set(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        mountRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [imageSources]);

  // Transition to specific slide
  const goToSlide = useCallback(
    (nextIdx: number) => {
      if (isAnimatingRef.current || !materialRef.current || texturesRef.current.length === 0) return;

      const total = items.length;
      const targetIndex = (nextIdx + total) % total;
      if (targetIndex === currentIndex) return;

      isAnimatingRef.current = true;
      setIsAnimating(true);

      const currentTex = texturesRef.current[currentIndex] || texturesRef.current[0];
      const nextTex = texturesRef.current[targetIndex] || texturesRef.current[0];

      materialRef.current.uniforms.uTexture1.value = currentTex;
      materialRef.current.uniforms.uTexture2.value = nextTex;
      materialRef.current.uniforms.uProgress.value = 0;
      materialRef.current.uniforms.uRippleIntensity.value = 0;

      // GSAP Ripple Animation
      gsap.to(materialRef.current.uniforms.uProgress, {
        value: 1,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (rendererRef.current && sceneRef.current) {
            const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
            cam.position.z = 1;
            rendererRef.current.render(sceneRef.current, cam);
          }
        },
        onComplete: () => {
          if (materialRef.current) {
            materialRef.current.uniforms.uTexture1.value = nextTex;
            materialRef.current.uniforms.uProgress.value = 0;
            materialRef.current.uniforms.uRippleIntensity.value = 0;
          }
          setCurrentIndex(targetIndex);
          isAnimatingRef.current = false;
          setIsAnimating(false);
        },
      });

      // Ripple Distortion Peak
      gsap.to(materialRef.current.uniforms.uRippleIntensity, {
        value: 0.65,
        duration: 0.6,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    },
    [currentIndex, items.length]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, nextSlide]);

  // Touch Swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const activeItem = items[currentIndex] || items[0];

  return (
    <section
      id="champions"
      className={cn(
        "relative w-full h-[580px] sm:h-[680px] lg:h-[760px] bg-black text-white overflow-hidden select-none border-t border-zinc-900",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => nextSlide()}
    >
      {/* WebGL Canvas Background */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer z-0" />

      {/* Fallback Image */}
      <img
        src={activeItem.image}
        alt={activeItem.title}
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Dark Overlay for typography legibility (50-60%) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 max-lg:bg-gradient-to-t max-lg:from-black/90 max-lg:via-black/70 max-lg:to-black/40 pointer-events-none z-10" />

      {/* Floating Motorsport Content Layout */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col justify-between py-8 sm:py-12 pointer-events-none">
        
        {/* Section Header */}
        <div className="pointer-events-auto flex items-center justify-between border-b border-white/10 pb-4 max-w-7xl w-full mx-auto">
          <div>
            <span className="text-red-500 text-[10px] sm:text-xs tracking-[0.3em] font-extrabold uppercase drop-shadow">
              {sectionLabel}
            </span>
            <Shuffle
              text={sectionTitle}
              tag="h2"
              className="text-xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight"
              duration={0.4}
            />
          </div>

          {/* Slide Indicator Badge */}
          <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-2xl">
            <span className="text-xs sm:text-sm font-black text-red-500">
              0{currentIndex + 1}
            </span>
            <span className="text-xs text-zinc-500 font-bold">/</span>
            <span className="text-xs font-bold text-zinc-400">
              0{items.length}
            </span>
          </div>
        </div>

        {/* Dynamic Story Details Panel */}
        <div className="pointer-events-auto w-full max-w-xl my-auto max-lg:mt-auto max-lg:mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`ripple-story-${currentIndex}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-3 sm:space-y-4 bg-zinc-950/75 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl shadow-black/80"
            >
              {/* Year Badge */}
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 bg-red-600/90 text-white font-black text-xs sm:text-sm rounded-lg uppercase tracking-widest shadow-md shadow-red-600/30">
                  {activeItem.year}
                </span>
                <div className="h-0.5 w-12 bg-gradient-to-r from-red-500 to-transparent rounded-full" />
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-lg">
                {activeItem.title}
              </h3>

              {/* Description */}
              {activeItem.description && (
                <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-medium drop-shadow">
                  {activeItem.description}
                </p>
              )}

              {/* Action Hint */}
              <div className="pt-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-red-500">
                <span>Click image or swipe to switch slide</span>
                <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls & Pagination Footer */}
        <div className="pointer-events-auto flex items-center justify-between max-w-7xl w-full mx-auto">
          {/* Slide Dots */}
          <div className="flex items-center gap-2">
            {items.map((item, idx) => (
              <button
                key={item.year + idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-500 cursor-pointer",
                  idx === currentIndex
                    ? "w-8 bg-red-600 shadow-md shadow-red-600/50"
                    : "w-2 bg-zinc-700 hover:bg-zinc-500 opacity-60"
                )}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous Slide"
              disabled={isAnimating}
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next Slide"
              disabled={isAnimating}
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-40"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RippleDisplacementSlider;
