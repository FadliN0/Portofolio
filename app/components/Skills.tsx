'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconCloud } from "@/components/magicui/icon-cloud";

// Skill data dengan level proficiency dan kategori
// FRONTEND ROW (Row 1)
const skillsRow1 = [
  { name: "React Native", icon: "📱", color: "#61DAFB", category: "Framework" },
  { name: "Next.js", icon: "▲", color: "#000000", category: "Framework" },
  { name: "TypeScript", icon: "📘", color: "#3178C6", category: "Language" },
  { name: "Tailwind CSS", icon: "🎨", color: "#06B6D4", category: "Framework" },
  { name: "Three.js", icon: "🎯", color: "#000000", category: "Library" },
  { name: "JavaScript", icon: "🟨", color: "#F7DF1E", category: "Language" },
  { name: "HTML5", icon: "🌐", color: "#E34F26", category: "Language" },
  { name: "CSS3", icon: "🎨", color: "#1572B6", category: "Language" }
];

// BACKEND ROW (Row 2)  
const skillsRow2 = [
  { name: "Node.js", icon: "🟢", color: "#339933", category: "Runtime" },
  { name: "PHP", icon: "🐘", color: "#777BB4", category: "Language" },
  { name: "CodeIgniter", icon: "🔥", color: "#EF4223", category: "Framework" },
  { name: "MongoDB", icon: "🍃", color: "#47A248", category: "Database" },
  { name: "MySQL", icon: "🐬", color: "#4479A1", category: "Database" },
  { name: "RESTful API", icon: "🔌", color: "#FF6B35", category: "Architecture" }
];

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

interface SkillCardProps {
  skill: { name: string; icon: string; color: string; category: string };
  index: number;
}

const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
);

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 group relative mx-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="relative p-6 rounded-2xl bg-gradient-to-br from-black via-gray-900 to-purple-900/50 border border-purple-500/20 backdrop-blur-sm shadow-2xl overflow-hidden min-w-[200px]"
        whileHover={{ 
          boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.6)",
          borderColor: "rgba(147, 51, 234, 0.8)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-br from-purple-600/40 via-indigo-600/30 to-pink-600/40 rounded-2xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Category Badge */}
        <motion.div
          className="absolute top-2 right-2 px-2 py-1 bg-black/40 backdrop-blur text-xs text-purple-300 rounded-lg border border-purple-500/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0.7, scale: isHovered ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {skill.category}
        </motion.div>

        {/* Floating particles ketika hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: skill.color,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                  y: [0, -20, -40]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity 
                }}
              />
            ))}
          </div>
        )}

        {/* Icon Container */}
        <motion.div
          className="relative w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-xl"
          style={{ 
            boxShadow: `0 10px 30px ${skill.color}40`
          }}
          whileHover={{ 
            rotate: 360,
            boxShadow: `0 20px 40px ${skill.color}60`
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-2xl"
            animate={isHovered ? { 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 0.6 }}
          >
            {skill.icon}
          </motion.div>
          
          {/* Orbital ring */}
          <motion.div
            className="absolute inset-0 border-2 border-white/20 rounded-full"
            animate={isHovered ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Skill Name */}
        <motion.h3
          className="text-lg font-bold text-white text-center mb-2"
          whileHover={{ scale: 1.05, color: "#e2e8f0" }}
          transition={{ duration: 0.2 }}
        >
          {skill.name}
        </motion.h3>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 rounded-2xl"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

const InfiniteScrollRow: React.FC<{
  skills: typeof skillsRow1;
  direction: 'left' | 'right';
  speed?: number;
}> = ({ skills, direction, speed = 50 }) => {
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative overflow-hidden w-full">
      <motion.div
        className="flex will-change-transform"
        animate={{
          x: direction === 'left' 
            ? ['0%', '-50%']
            : ['-50%', '0%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        style={{ 
          width: '400%',
          transform: 'translateZ(0)'
        }}
      >
        {duplicatedSkills.map((skill, index) => (
          <SkillCard 
            key={`${skill.name}-${index}`} 
            skill={skill} 
            index={index}
          />
        ))}
      </motion.div>
      
      {/* Enhanced gradient masks */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};

const Skills: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Large floating orbs with improved animation */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl"
          animate={{
            x: [0, 150, 0],
            y: [0, -100, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl"
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
            scale: [1, 0.7, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/6 rounded-full blur-3xl"
          animate={{
            x: [-50, 50, -50],
            y: [-50, 50, -50],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Enhanced static particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Header Section */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center text-center md:text-left mb-20 gap-12"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Icon Cloud */}
            <motion.div 
              className="w-full md:w-[300px] h-[300px]"
              whileInView={{ scale: [0.8, 1] }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              <IconCloud images={images} />
            </motion.div>

            {/* Header Text */}
            <div className="flex flex-col items-center md:items-start">
              <motion.div
                className="inline-block text-6xl mb-6"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                🛠️
              </motion.div>

              <motion.h2
                className="text-5xl md:text-7xl font-bold leading-tight mb-6"
                whileInView={{ scale: [0.9, 1.02, 1] }}
                transition={{ duration: 0.8 }}
              >
                My{' '}
                <motion.span
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  Skills
                </motion.span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-300 leading-relaxed max-w-3xl mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                Technologies and tools I use to create{' '}
                <motion.span
                  className="text-purple-300 font-semibold"
                  whileHover={{ scale: 1.05, color: "#c084fc" }}
                >
                  exceptional
                </motion.span>{' '}
                digital experiences
              </motion.p>

              {/* Stats */}
              
            </div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="flex justify-center items-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.div 
              className="w-16 h-0.5 bg-gradient-to-r from-transparent to-purple-500"
              whileInView={{ scaleX: [0, 1] }}
              transition={{ duration: 1.5 }}
            />
            <motion.div
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="w-16 h-0.5 bg-gradient-to-l from-transparent to-purple-500"
              whileInView={{ scaleX: [0, 1] }}
              transition={{ duration: 1.5 }}
            />
          </motion.div>

          {/* Infinite Scrolling Skills Rows */}
          <div className="space-y-16">
            {/* Row 1 - Moving Left */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <InfiniteScrollRow 
                skills={skillsRow1} 
                direction="left" 
                speed={40}
              />
            </motion.div>

            {/* Row 2 - Moving Right */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <InfiniteScrollRow 
                skills={skillsRow2} 
                direction="right" 
                speed={45}
              />
            </motion.div>
          </div>

          {/* Enhanced Bottom Section */}
          <motion.div
            className="text-center mt-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-3 text-purple-300/75 text-lg bg-gradient-to-br from-black/40 via-gray-900/40 to-purple-900/20 backdrop-blur-lg px-10 py-5 rounded-full border border-purple-500/20 shadow-2xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
                borderColor: "rgba(147, 51, 234, 0.6)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.span>
              <span>Always learning and evolving</span>
              <motion.div 
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;