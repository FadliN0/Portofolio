'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
// import { useRouter } from 'next/router'; // untuk pages router
import { useRouter } from 'next/navigation'; // untuk app router

interface Project {
  slug: string; // Tambahkan slug untuk routing
  title: string;
  description: string;
  tech: string[];
  image?: string;
  downloadLink?: string;
  hasDownload?: boolean;
  category: string;
  year: string;
}

const projects: Project[] = [
  {
    slug: 'interactive-portfolio',
    title: 'Interactive Portfolio',
    description: 'A 3D animated portfolio built with Next.js, Three.js, and GSAP featuring immersive user experiences.',
    tech: ['Next.js', 'Three.js', 'GSAP', 'TypeScript'],
    image: '/api/placeholder/400/250',
    category: 'Web Application',
    year: '2024'
  },
  {
    slug: 'movie-review-app',
    title: 'Movie Review App',
    description: 'A React Native app that lets users search movies using OMDB API with beautiful animations.',
    tech: ['React Native', 'OMDB API', 'Styled Components'],
    image: '/api/placeholder/400/250',
    hasDownload: true,
    downloadLink: '/CineVault.apk',
    category: 'Mobile App',
    year: '2024'
  },
  {
    slug: 'course-app',
    title: 'Course App with Progress Tracking',
    description: 'An interactive mobile learning app built with React Native. It features structured course modules, quizzes, and real-time user progress tracking.',
    tech: ['React Native', 'Axios', 'Redux', 'REST API'],
    image: '/api/placeholder/400/250',
    category: 'Mobile App',
    year: '2024'
  }
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Fungsi untuk navigasi ke detail project
  const handleViewProject = () => {
    router.push(`/projects/${project.slug}`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-[480px]" // Fixed height untuk semua card
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
    >
      <motion.div
        className="relative h-full bg-gradient-to-br from-black via-gray-900 to-purple-900 rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl flex flex-col" // Tambah flex flex-col
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.4)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-pink-600/30"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Download Badge */}
        {project.hasDownload && (
          <motion.div
            className="absolute top-4 right-4 z-20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
              whileHover={{ scale: 1.1 }}
              animate={{
                boxShadow: [
                  "0 4px 15px -3px rgba(34, 197, 94, 0.4)",
                  "0 4px 25px -3px rgba(34, 197, 94, 0.6)",
                  "0 4px 15px -3px rgba(34, 197, 94, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📱 Available
            </motion.div>
          </motion.div>
        )}

        {/* Category Badge */}
        <motion.div
          className="absolute top-4 left-4 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full text-xs border border-purple-500/50">
            {project.category}
          </div>
        </motion.div>

        {/* Project Image - Fixed height */}
        <div className="relative h-48 overflow-hidden flex-shrink-0"> {/* flex-shrink-0 untuk mencegah shrinking */}
          <motion.div
            className="w-full h-full bg-gradient-to-br from-purple-800/50 to-indigo-900/50 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onClick={handleViewProject}
          >
            <motion.div
              className="text-6xl opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {project.hasDownload ? '📱' : project.category === 'Web Application' ? '🌐' : '🚀'}
            </motion.div>
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Content - Flexible area */}
        <div className="relative flex-1 flex flex-col p-6"> {/* flex-1 untuk mengambil sisa space, flex flex-col untuk layout vertikal */}
          {/* Content yang flexible */}
          <div className="flex-1 space-y-4"> {/* flex-1 untuk mengambil space yang tersedia */}
            <motion.h3
              className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent cursor-pointer"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
              whileHover={{ scale: 1.05 }}
              onClick={handleViewProject}
            >
              {project.title}
            </motion.h3>
            
            <motion.p
              className="text-gray-300 text-sm leading-relaxed line-clamp-3" // Batasi deskripsi maksimal 3 baris
              style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}
            >
              {project.description}
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-2"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(15px)" }}
            >
              {project.tech.slice(0, 3).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  className="px-2 py-1 text-xs bg-purple-600/30 text-purple-200 rounded-full border border-purple-500/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * techIndex, duration: 0.3 }}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(147, 51, 234, 0.5)",
                    borderColor: "rgba(147, 51, 234, 0.8)"
                  }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.tech.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-600/30 text-gray-300 rounded-full">
                  +{project.tech.length - 3} more
                </span>
              )}
            </motion.div>
          </div>
          
          {/* Action Buttons - Fixed position di bottom */}
          <motion.div
            style={{ transformStyle: "preserve-3d", transform: "translateZ(25px)" }}
            className="pt-4 relative z-20 flex-shrink-0" // flex-shrink-0 untuk mencegah shrinking
          >
            <div className="flex gap-3 relative z-30">
              {/* View Project Button */}
              <motion.button
                onClick={handleViewProject}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer relative z-30"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -3px rgba(147, 51, 234, 0.5)",
                  background: "linear-gradient(to right, #7c3aed, #4f46e5)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View Details</span>
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  👀
                </motion.span>
              </motion.button>

              {/* Download Button */}
              {project.hasDownload && (
                <motion.a
                  href={project.downloadLink}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer relative z-30"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -3px rgba(34, 197, 94, 0.5)",
                    background: "linear-gradient(to right, #059669, #10b981)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.span
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    📥
                  </motion.span>
                  <span>Download</span>
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const router = useRouter();

  return (
    <section id="projects" className="py-20 px-6 bg-black min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block text-6xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚀
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-4"
            whileInView={{ scale: [0.9, 1.02, 1] }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>
          
          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explore my latest work where creativity meets functionality
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-2xl transition-all duration-300 border border-purple-500/30"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -12px rgba(147, 51, 234, 0.6)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/projects')}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;