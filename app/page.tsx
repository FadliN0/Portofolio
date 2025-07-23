'use client';

import dynamic from 'next/dynamic';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import { useEffect } from 'react';


const Contact = dynamic(() => import('./components/Contact'), { ssr: false });
const Projects = dynamic(() => import('./components/Projects'), { ssr: false });

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#projects') {
      const el = document.getElementById('projects');
      if (el) {
        // Delay agar komponen dynamic sempat muncul
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 500); // bisa sesuaikan delay ini
      }
    }
  }, []);
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
