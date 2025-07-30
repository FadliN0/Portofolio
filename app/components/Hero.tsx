// app/components/Hero.tsx
'use client'
import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import FuzzyText from './FuzzyText';

// Dynamic import Lanyard untuk avoid SSR issues
const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-gray-100/10 to-gray-200/10 animate-pulse rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
        <div className="text-gray-400 text-sm">Loading 3D Lanyard...</div>
      </div>
    </div>
  )
})

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [animateElements, setAnimateElements] = useState({
    title: false,
    subtitle: false,
    description: false,
    stats: false,
    buttons: false,
    badge: false,
    decorations: false
  })

  useEffect(() => {
    // Trigger loading state
    setIsLoaded(true)

    // Sequential animations with delays
    const animationSequence = [
      { key: 'title', delay: 300 },
      { key: 'subtitle', delay: 600 },
      { key: 'description', delay: 900 },
      { key: 'stats', delay: 1200 },
      { key: 'buttons', delay: 1500 },
      { key: 'badge', delay: 800 },
      { key: 'decorations', delay: 1800 }
    ]

    animationSequence.forEach(({ key, delay }) => {
      setTimeout(() => {
        setAnimateElements(prev => ({ ...prev, [key]: true }))
      }, delay)
    })
  }, [])

  return (
    <section className="relative px-4 sm:px-6 md:px-8 py-16 min-h-screen min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        
        {/* Left Content - order-2 on mobile (akan tampil di bawah), order-1 on lg+ (kiri) */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            {/* Title with slide-in animation */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight text-left -ml-14 lg:-ml-16 transition-all duration-1000 ${
              animateElements.title 
                ? 'opacity-100 translate-x-0 translate-y-0' 
                : 'opacity-0 -translate-x-20 translate-y-10'
            }`}>
              <FuzzyText baseIntensity={0.2} gradientColors={['#a855f7', '#fff4f9ff']}>
                Creative
              </FuzzyText>
              
              {/* Subtitle with separate animation */}
              <span className={`block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${
                animateElements.subtitle 
                  ? 'opacity-100 translate-x-0 translate-y-0' 
                  : 'opacity-0 translate-x-20 translate-y-10'
              }`}>
                <FuzzyText baseIntensity={0.2} gradientColors={['#f8f5faff', '#ec4899']}>
                  Developer
                </FuzzyText>
              </span>
            </h1>
            
            {/* Description with fade-in */}
            <p className={`text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed text-left transition-all duration-1000 ${
              animateElements.description 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              {"Hi, I'm Fadli 👋"}<br/>
              {"I transform ideas into reality through comprehensive mobile and web development — handling everything from intuitive frontend designs to reliable backend systems."}
            </p>
          </div>
          
          {/* CTA Buttons with slide-up animation */}
          <div
            className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-start transition-all duration-1000 ${
              animateElements.buttons
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
          >
            <button
              className={`w-full sm:w-auto px-8 py-3 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 ${
                animateElements.buttons ? 'animate-bounce-once' : ''
              }`}
            >
              View My Work
            </button>

            <button
              className={`w-full sm:w-auto px-8 py-3 text-center border-2 border-purple-400 text-purple-400 rounded-lg font-semibold hover:bg-purple-400 hover:text-white transition-all transform duration-700 delay-200 ${
                animateElements.buttons ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - LANYARD CONTAINER - order-1 on mobile (akan tampil di atas), order-2 on lg+ (kanan) */}
        <div className={`relative order-1 lg:order-2 transition-all duration-1000 ${
          animateElements.badge 
            ? 'opacity-100 translate-x-0 rotate-0' 
            : 'opacity-0 translate-x-20 rotate-12'
        }`}>
          {/* Container dengan ukuran yang lebih besar dan padding yang cukup */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[750px] overflow-visible">
            <div className="absolute inset-0 translate-y-[-20px]">
              <Suspense fallback={
                <div className="w-full h-full bg-gradient-to-br from-gray-100/10 to-gray-200/10 animate-pulse rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                    <div className="text-gray-400 text-sm">Loading 3D Lanyard...</div>
                  </div>
                </div>
              }>
                <Lanyard 
                  position={[0, 0, 30]} 
                  gravity={[0, -40, 0]} 
                  transparent={true}
                  fov={20}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations with breathing animation */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-2000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transition-all duration-2000 ${
          animateElements.decorations ? 'animate-pulse scale-100' : 'scale-50'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl transition-all duration-2000 delay-500 ${
          animateElements.decorations ? 'animate-pulse scale-100' : 'scale-50'
        }`}></div>
        
        {/* Additional animated particles */}
        <div className={`absolute top-1/2 left-1/3 w-2 h-2 bg-white/20 rounded-full transition-all duration-1000 delay-1200 ${
          animateElements.decorations ? 'animate-ping opacity-20' : 'opacity-0'
        }`}></div>
        <div className={`absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/30 rounded-full transition-all duration-1000 delay-1500 ${
          animateElements.decorations ? 'animate-ping opacity-30' : 'opacity-0'
        }`}></div>
      </div>

      {/* Initial loading overlay */}
      <div className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 z-50 flex items-center justify-center transition-all duration-1000 ${
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-400/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Loading Experience</h2>
            <p className="text-gray-400">Preparing something amazing...</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
      `}</style>
    </section>
  )
}