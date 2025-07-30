"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false); // Changed from isLoaded to isInView
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [nameAnimationComplete, setNameAnimationComplete] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);

  // Ref untuk section About
  const aboutRef = useRef<HTMLElement>(null);

  const fullText = "I'm a passionate fullstack developer specializing in web and mobile development. I craft end-to-end digital solutions that seamlessly blend powerful backend functionality with stunning user interfaces, creating comprehensive experiences that captivate users across all platforms.";

  // Define particle type and state with proper TypeScript typing
  type Particle = {
    left: number;
    top: number;
    delay: number;
  };

  const [particlesData, setParticlesData] = useState<Particle[]>([]);

  // Intersection Observer untuk mendeteksi kapan section About terlihat
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Disconnect observer setelah animasi dimulai untuk mencegah trigger berulang
          observer.disconnect();
        }
      },
      {
        threshold: 0.3, // Trigger ketika 30% dari section terlihat
        rootMargin: '0px 0px -100px 0px' // Offset untuk trigger lebih awal
      }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Generate particles only on client side (tidak bergantung pada scroll)
    const particles = Array.from({ length: 4 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticlesData(particles);
    setParticlesReady(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Name animation trigger - hanya jalan ketika isInView true
  useEffect(() => {
    if (!isInView) return;
    
    const timer = setTimeout(() => {
      setNameAnimationComplete(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isInView]);

  // Typing animation effect - hanya jalan ketika isInView true
  useEffect(() => {
    if (!isInView) return;
    
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, 500); // Start typing after name animation

    return () => clearTimeout(timer);
  }, [isInView]);

  useEffect(() => {
    if (!isTyping || !isInView) return;

    if (textIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + fullText[textIndex]);
        setTextIndex(prev => prev + 1);
      }, 15);

      return () => clearTimeout(timer);
    }
  }, [textIndex, isTyping, fullText, isInView]);

  const renderAnimatedText = () => {
    const parts = [
      { text: "I'm a passionate ", color: "text-gray-300" },
      { text: "fullstack developer", color: "text-purple-400 font-semibold" },
      { text: " specializing in ", color: "text-gray-300" },
      { text: "web and mobile development", color: "text-pink-400 font-semibold" },
      { text: ". I craft ", color: "text-gray-300" },
      { text: "end-to-end digital solutions", color: "text-blue-400 font-semibold" },
      { text: " that seamlessly blend powerful ", color: "text-gray-300" },
      { text: "backend functionality", color: "text-green-400 font-semibold" },
      { text: " with stunning ", color: "text-gray-300" },
      { text: "user interfaces", color: "text-cyan-400 font-semibold" },
      { text: ", creating comprehensive experiences that captivate users across all platforms.", color: "text-gray-300" }
    ];

    let currentIndex = 0;
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const partLength = part.text.length;
      const visibleLength = Math.max(0, Math.min(partLength, displayText.length - currentIndex));
      
      if (visibleLength > 0) {
        result.push(
          <span key={i} className={part.color}>
            {part.text.substring(0, visibleLength)}
          </span>
        );
      }
      
      currentIndex += partLength;
      if (currentIndex > displayText.length) break;
    }

    return result;
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0px); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 0.4; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #ffffffff, #ec4899, #60a5fa, #8b5cf6);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
        }
      `}</style>
      
      <section ref={aboutRef} id="about" className="relative min-h-screen py-20 overflow-hidden">
        {/* Subtle background - matching Hero style */}
        <div className="absolute inset-0">
          {/* Reduced opacity background elements */}
          <div
            className={`absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transition-all duration-1000 ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{ 
              transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px) scale(${isInView ? 1 : 0.5})`,
              transition: 'transform 0.1s ease-out, opacity 1s ease, scale 1s ease'
            }}
          />
          <div
            className={`absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl transition-all duration-1000 delay-300 ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{ 
              transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px) scale(${isInView ? 1 : 0.5})`,
              transition: 'transform 0.1s ease-out, opacity 1s ease, scale 1s ease'
            }}
          />
          <div
            className={`absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-xl transition-all duration-1000 delay-500 ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{ 
              transform: `translate(-50%, -50%) translate(${mousePosition.x}px, ${mousePosition.y}px) scale(${isInView ? 1 : 0.5})`,
              transition: 'transform 0.1s ease-out, opacity 1s ease, scale 1s ease'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className={`transform transition-all duration-1000 delay-300 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            {/* Header */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              {/* FOTO PROFIL */}
              <div className="flex flex-col items-center justify-center text-center">
                {/* Photo container with subtle effects */}
                <div className={`relative group transition-all duration-1000 delay-500 ${
                  isInView ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8'
                }`}>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full opacity-50 blur-lg group-hover:opacity-70 transition duration-1000"></div>
                  <div className="relative w-64 h-80 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
                    <Image
                      src="/foto.png"
                      alt="Fadli Nofrizal"
                      fill
                      className="rounded-full object-cover object-top scale-100 "
                    />
                    {/* Subtle rotating border effect */}
                    <div 
                      className="absolute inset-0 rounded-full border border-transparent bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        animation: 'spin 12s linear infinite'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Name with refined animations */}
                <div className="relative mt-8 mb-6">
                  <h3 
                    className={`floating-sparkles relative z-10 text-3xl md:text-5xl font-bold tracking-wider transform transition-all duration-1000 ${nameAnimationComplete ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.3)) drop-shadow(0 0 20px rgba(236,72,153,0.2))'
                    }}
                  >
                    <span className="gradient-text">Fadli Nofrizal</span>
                  </h3>
                  
                  {/* Fixed floating particles - only render after client-side hydration */}
                  {particlesReady && (
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 delay-500 ${nameAnimationComplete ? 'opacity-100' : 'opacity-0'}`}>
                      {particlesData.map((particle, index) => (
                        <div
                          key={index}
                          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400/40 to-blue-400/40 rounded-full"
                          style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animation: `floatUp 4s infinite ${particle.delay}s ease-in-out`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtitle with Hero-style design */}
                <div className={`text-center transform transition-all duration-1000 delay-1000 ${nameAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 shadow-lg">
                    <span className="text-purple-400 font-medium text-lg">✨ Fullstack Developer</span>
                  </div>
                  
                  <div className="flex justify-center mt-4 space-x-3">
                    {[
                      { name: 'React', color: 'bg-white/5 border-blue-400/30 text-blue-400' },
                      { name: 'Next.js', color: 'bg-white/5 border-gray-400/30 text-gray-300' },
                      { name: 'Node.js', color: 'bg-white/5 border-green-400/30 text-green-400' },
                      { name: 'React Native', color: 'bg-white/5 border-cyan-400/30 text-cyan-400' }
                    ].map((tech, index) => (
                      <span
                        key={tech.name}
                        className={`flex items-center justify-center px-4 py-2 text-sm ${tech.color} text-center backdrop-blur-lg rounded-full border font-medium transition-all duration-500 hover:scale-110 hover:bg-white/10`}
                        style={{
                          minWidth: '80px', // untuk jaga agar badge tidak terlalu kecil
                          transitionDelay: `${1200 + index * 150}ms`,
                          transform: nameAnimationComplete ? 'scale(1)' : 'scale(0.8)',
                          opacity: nameAnimationComplete ? 1 : 0
                        }}
                      >
                        {tech.name}
                      </span>

                    ))}
                  </div>
                </div>
              </div>

              {/* TEXT SECTION */}
              <div>
                <div className={`relative mb-8 transition-all duration-1000 delay-700 ${
                  isInView ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}>
                  <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent relative">
                    👋 About Me
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400/60 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  </h2>
                </div>
                
                <div className={`text-lg md:text-xl leading-relaxed min-h-[180px] relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg transition-all duration-1000 delay-900 ${
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <div className="relative z-10">
                    {renderAnimatedText()}
                    {isTyping && textIndex < fullText.length && (
                      <span className="inline-block w-0.5 h-6 bg-gradient-to-t from-purple-400 to-blue-400 ml-1 animate-pulse"></span>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className={`flex flex-wrap gap-3 transition-all duration-700 delay-2000 ${textIndex >= fullText.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {[
                      { word: 'Creative', color: 'bg-white/5 border-purple-400/30 text-purple-400', icon: '🎨' },
                      { word: 'Versatile', color: 'bg-white/5 border-green-400/30 text-green-400', icon: '⚡' },
                      { word: 'Detail-oriented', color: 'bg-white/5 border-pink-400/30 text-pink-400', icon: '🔍' },
                      { word: 'Cross-platform', color: 'bg-white/5 border-cyan-400/30 text-cyan-400', icon: '🌐' },
                      { word: 'Problem-solver', color: 'bg-white/5 border-blue-400/30 text-blue-400', icon: '🧩' }
                    ].map(({ word, color, icon }, index) => (
                      <span 
                        key={word}
                        className={`group px-4 py-2 ${color} backdrop-blur-lg rounded-full text-sm font-medium border transition-all duration-500 hover:scale-105 hover:bg-white/10 cursor-default`}
                        style={{ 
                          transitionDelay: `${2200 + index * 200}ms`,
                          transform: textIndex >= fullText.length ? 'scale(1)' : 'scale(0.8)',
                          opacity: textIndex >= fullText.length ? 1 : 0
                        }}
                      >
                        <span className="mr-2 group-hover:animate-bounce">{icon}</span>
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Button - Hero style */}
            <div className="text-center mt-12">
              <div className={`relative inline-block group transition-all duration-700 delay-3000 ${textIndex >= fullText.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-full opacity-50 blur group-hover:opacity-70 transition duration-1000"></div>
                <button className="relative z-10 px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-2xl shadow-purple-500/20 hover:scale-110 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 border border-white/10 backdrop-blur-sm group">
                  <span className="flex items-center gap-3">
                    <span>{"Let's Create Something Amazing"}</span>
                    <span className="text-xl group-hover:animate-bounce">🚀</span>
                  </span>
                </button>

                {/* Refined orbiting elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute inset-0"
                    style={{ animation: 'spin 10s linear infinite' }}
                  >
                    <div className="absolute -top-3 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transform -translate-x-1/2 opacity-60" />
                  </div>
                  <div 
                    className="absolute inset-0"
                    style={{ animation: 'spin 8s linear infinite reverse' }}
                  >
                    <div className="absolute top-1/2 -right-3 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transform -translate-y-1/2 opacity-60" />
                  </div>
                  <div 
                    className="absolute inset-0"
                    style={{ animation: 'spin 12s linear infinite' }}
                  >
                    <div className="absolute -bottom-3 left-1/4 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced floating code elements with fullstack context */}
          <div className={`absolute top-16 right-8 opacity-20 font-mono text-sm text-purple-400 bg-white/5 backdrop-blur-lg rounded-lg px-3 py-2 border border-white/10 transition-all duration-1000 delay-1500 ${
            isInView ? 'opacity-20 translate-y-0 animate-bounce' : 'opacity-0 translate-y-4'
          }`}
               style={{ animationDuration: '3s' }}>
            {'app.listen(3000)'}
          </div>
          <div className={`absolute bottom-16 left-8 opacity-20 font-mono text-sm text-blue-400 bg-white/5 backdrop-blur-lg rounded-lg px-3 py-2 border border-white/10 transition-all duration-1000 delay-1800 ${
            isInView ? 'opacity-20 translate-y-0 animate-bounce' : 'opacity-0 translate-y-4'
          }`}
               style={{ animationDuration: '4s', animationDelay: '1s' }}>
            {'const API = await fetch()'}
          </div>
          <div className={`absolute top-1/3 left-16 opacity-15 font-mono text-xs text-pink-400 bg-white/5 backdrop-blur-sm rounded px-2 py-1 border border-white/10 transition-all duration-1000 delay-1200 ${
            isInView ? 'opacity-15 translate-y-0 animate-bounce' : 'opacity-0 translate-y-4'
          }`}
               style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
            {'<Component />'}
          </div>
          <div className={`absolute top-1/4 right-20 opacity-15 font-mono text-xs text-green-400 bg-white/5 backdrop-blur-sm rounded px-2 py-1 border border-white/10 transition-all duration-1000 delay-2100 ${
            isInView ? 'opacity-15 translate-y-0 animate-bounce' : 'opacity-0 translate-y-4'
          }`}
               style={{ animationDuration: '6s', animationDelay: '2s' }}>
            {'MongoDB.connect()'}
          </div>
        </div>
      </section>
    </>
  );
}