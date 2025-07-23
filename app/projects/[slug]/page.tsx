    // pages/projects/[slug].tsx atau app/projects/[slug]/page.tsx
    'use client';

    import React, { useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    // import { useRouter } from 'next/router'; // untuk pages router
    import { useParams,useRouter } from 'next/navigation'; // untuk app router

    interface ProjectDetail {
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    tech: string[];
    features: string[];
    screenshots: string[];
    demoLink?: string;
    downloadLink?: string;
    githubLink?: string;
    status: 'completed' | 'in-progress' | 'planning';
    category: string;
    duration: string;
    year: string;
    challenges?: string[];
    lessons?: string[];
    }

    // Data project details - Sinkron dengan data di halaman utama
    const projectsData: Record<string, ProjectDetail> = {
    'movie-review-app': {
        slug: 'movie-review-app',
        title: 'Movie Review App',
        description: 'A React Native app that lets users search movies using OMDB API with beautiful animations.',
        longDescription: 'Aplikasi mobile yang memungkinkan pengguna untuk mencari informasi film, membaca review, dan memberikan rating. Dibangun dengan React Native untuk performa yang optimal di iOS dan Android. Mengintegrasikan OMDB API untuk data film yang lengkap dan real-time dengan sistem caching yang efisien untuk pengalaman offline yang mulus.',
        tech: ['React Native', 'OMDB API', 'Redux', 'Styled Components', 'Async Storage', 'React Navigation'],
        features: [
        'Search movies by title with auto-complete suggestions',
        'View detailed movie information including cast and crew',
        'Save favorite movies locally with persistent storage',
        'Beautiful animations and smooth transitions',
        'Dark/Light theme support with system preference detection',
        'Offline mode with cached data for previously viewed movies',
        'Share movie information to social media',
        'Rate and review movies with personal notes'
        ],
        screenshots: [
        '/screenshots/movie-app-1.jpg',
        '/screenshots/movie-app-2.jpg',
        '/screenshots/movie-app-3.jpg',
        '/screenshots/movie-app-4.jpg'
        ],
        downloadLink: '/CineVault.apk',
        githubLink: 'https://github.com/FadliN0/UAS_CineVault',
        status: 'completed',
        category: 'Mobile App',
        duration: '3 months',
        year: '2024',
        challenges: [
        'Implementing efficient API caching to reduce network calls',
        'Optimizing image loading and memory management',
        'Creating smooth animations while maintaining 60fps performance'
        ],
        lessons: [
        'Advanced React Native performance optimization techniques',
        'Efficient state management with Redux Toolkit',
        'Mobile-first design principles and user experience'
        ]
    },
    'interactive-portfolio': {
        slug: 'interactive-portfolio',
        title: 'Interactive Portfolio',
        description: 'A 3D animated portfolio built with Next.js, Three.js, and GSAP featuring immersive user experiences.',
        longDescription: 'Portfolio website yang menampilkan karya-karya saya dengan pengalaman 3D yang immersive. Menggunakan Three.js untuk rendering 3D yang optimal, GSAP untuk animasi yang smooth dan performant, serta Next.js untuk SEO dan performa loading yang excellent. Website ini menampilkan kemampuan teknis melalui implementasi langsung teknologi modern web.',
        tech: ['Next.js', 'Three.js', 'GSAP', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebGL', 'Vercel'],
        features: [
        'Interactive 3D scenes with physics-based animations',
        'Smooth scrolling animations synchronized with scroll position',
        'Fully responsive design optimized for all device sizes',
        'Dynamic lighting effects that respond to user interactions',
        'Particle systems and post-processing effects',
        'Performance optimized rendering with lazy loading',
        'SEO optimized with meta tags and structured data',
        'Progressive Web App (PWA) capabilities'
        ],
        screenshots: [
        '/screenshots/portfolio-1.jpg',
        '/screenshots/portfolio-2.jpg',
        '/screenshots/portfolio-3.jpg',
        '/screenshots/portfolio-4.jpg'
        ],
        demoLink: 'https://yourportfolio.com',
        githubLink: 'https://github.com/username/interactive-portfolio',
        status: 'completed',
        category: 'Web Application',
        duration: '2 months',
        year: '2024',
        challenges: [
        'Balancing visual impact with performance across different devices',
        'Implementing complex 3D interactions while maintaining accessibility',
        'Optimizing Three.js scenes for mobile devices with limited GPU'
        ],
        lessons: [
        'Advanced Three.js and WebGL programming techniques',
        'Performance optimization for 3D web applications',
        'Creating accessible interactive experiences'
        ]
    },
    'course-app': {
    slug: 'course-app',
    title: 'Mobile Course App with Progress Tracking',
    description: 'An interactive mobile learning app built with React Native. It features structured course modules, quizzes, and real-time user progress tracking.',
    longDescription: 'Aplikasi pembelajaran mobile yang interaktif dan user-friendly, dirancang untuk memberikan pengalaman belajar yang optimal. Fitur unggulan meliputi modul pembelajaran terstruktur, sistem quiz interaktif, dan tracking progress real-time yang memungkinkan pengguna memantau perkembangan belajar mereka. Aplikasi ini dibangun dengan teknologi React Native untuk performance optimal di platform mobile.',
    tech: ['React Native', 'Axios', 'Redux', 'REST API', 'AsyncStorage', 'React Navigation', 'Firebase'],
    features: [
        'Structured course modules with multimedia content',
        'Interactive quizzes with immediate feedback',
        'Real-time progress tracking and analytics',
        'Offline content access for downloaded materials',
        'User profile management with learning history',
        'Push notifications for course reminders',
        'Achievement system with badges and certificates',
        'Social features for learner community interaction'
    ],
    screenshots: [
        '/screenshots/course-app-1.jpg',
        '/screenshots/course-app-2.jpg',
        '/screenshots/course-app-3.jpg',
        '/screenshots/course-app-4.jpg'
    ],
    demoLink: 'https://course-app-demo.vercel.app',
    githubLink: 'https://github.com/FadliN0/UTS',
    status: 'completed',
    category: 'Mobile App',
    duration: '3 months',
    year: '2024',
    challenges: [
        'Implementing efficient offline data synchronization',
        'Creating smooth animations for mobile user experience',
        'Optimizing app performance for various device specifications'
    ],
    lessons: [
        'Advanced React Native development patterns',
        'Mobile app state management with Redux',
        'User experience design for educational applications'
    ]
    }
    };

    const ProjectDetailPage: React.FC = () => {
    const params = useParams();
        const router = useRouter();
        const slug = params.slug as string;
    
    const [selectedImage, setSelectedImage] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Loading state saat router belum ready
    if (!slug) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="text-4xl mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          ⚡
        </motion.div>
        <p className="text-white">Loading project details...</p>
      </div>
    </div>
  );
}


    const project = projectsData[slug as string];

    if (!project) {
        return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
            <motion.div
                className="text-8xl mb-8 opacity-50"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                🔍
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
            <p className="text-gray-400 mb-8">{"The project you're looking for doesn't exist."}</p>
            <div className="flex gap-4 justify-center">
                <motion.button 
                onClick={() => router.back()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                >
                Go Back
                </motion.button>
                <motion.button 
                onClick={() => router.push('/projects')}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                >
                View All Projects
                </motion.button>
            </div>
            </div>
        </div>
        );
    }

    const statusColors = {
        completed: 'bg-green-500/20 text-green-400 border-green-500/30',
        'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        planning: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    return (
        <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="relative overflow-hidden">
            {/* Background Effects */}
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

            <div className="relative z-10 px-6 py-20">
            <div className="max-w-6xl mx-auto">
                {/* Navigation */}
                <motion.div
                className="flex items-center gap-4 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                >
                <motion.button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/50"
                    whileHover={{ x: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <span>←</span>
                    <span>Back</span>
                </motion.button>
                
                <span className="text-gray-500">/</span>
                <span className="text-purple-400">{project.title}</span>
                </motion.div>

                {/* Project Header */}
                <motion.div
                className="grid md:grid-cols-2 gap-12 items-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                >
                {/* Left Column - Project Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[project.status]}`}>
                        {project.status === 'completed' && '✅ Completed'}
                        {project.status === 'in-progress' && '🚧 In Progress'}
                        {project.status === 'planning' && '📋 Planning'}
                    </span>
                    <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm border border-purple-500/50">
                        {project.category}
                    </span>
                    <span className="text-gray-400 text-sm">{project.year}</span>
                    </div>

                    <motion.h1
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent"
                    whileInView={{ scale: [0.95, 1.02, 1] }}
                    transition={{ duration: 0.5 }}
                    >
                    {project.title}
                    </motion.h1>

                    <motion.p
                    className="text-xl text-gray-300 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    >
                    {project.description}
                    </motion.p>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📅 Duration: {project.duration}</span>
                    </div>
                </div>

                {/* Right Column - Quick Actions */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {project.demoLink && (
                    <motion.a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(147, 51, 234, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-xl">🌐</span>
                        <span>Live Demo</span>
                    </motion.a>
                    )}

                    {project.downloadLink && (
                    <motion.a
                        href={project.downloadLink}
                        className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.span
                        className="text-xl"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        >
                        📥
                        </motion.span>
                        <span>Download APK</span>
                    </motion.a>
                    )}

                    {project.githubLink && (
                    <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300 border border-gray-600"
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(75, 85, 99, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-xl">🐙</span>
                        <span>View Code</span>
                    </motion.a>
                    )}
                </motion.div>
                </motion.div>
            </div>
            </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-20">
            
            {/* Screenshots Gallery */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                📸 Screenshots
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.screenshots.map((screenshot, index) => (
                    <motion.div
                    key={index}
                    className="relative aspect-video bg-gradient-to-br from-purple-800/30 to-indigo-900/30 rounded-xl overflow-hidden cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                        setSelectedImage(index);
                        setIsImageModalOpen(true);
                    }}
                    >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center">
                        <motion.div
                        className="text-6xl opacity-30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                        📱
                        </motion.div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-medium">View Image</span>
                    </div>
                    
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}/{project.screenshots.length}
                    </div>
                    </motion.div>
                ))}
                </div>
            </motion.section>

            {/* Project Description */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                📖 About This Project
                </h2>
                
                <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 rounded-2xl p-8 border border-purple-500/20">
                <p className="text-gray-300 text-lg leading-relaxed">
                    {project.longDescription}
                </p>
                </div>
            </motion.section>

            {/* Technologies */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                🛠️ Technologies Used
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.tech.map((tech, index) => (
                    <motion.div
                    key={tech}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-xl border border-purple-500/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: "rgba(147, 51, 234, 0.15)",
                        borderColor: "rgba(147, 51, 234, 0.4)"
                    }}
                    >
                    <span className="text-2xl">⚡</span>
                    <span className="font-medium text-purple-200">{tech}</span>
                    </motion.div>
                ))}
                </div>
            </motion.section>

            {/* Key Features */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                ✨ Key Features
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                {project.features.map((feature, index) => (
                    <motion.div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-gradient-to-br from-gray-900/50 to-purple-900/20 rounded-xl border border-purple-500/20"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    >
                    <motion.span 
                        className="text-2xl mt-1 flex-shrink-0"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                        🎯
                    </motion.span>
                    <div>
                        <p className="text-gray-300 leading-relaxed">{feature}</p>
                    </div>
                    </motion.div>
                ))}
                </div>
            </motion.section>

            {/* Challenges & Lessons */}
            {(project.challenges || project.lessons) && (
                <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                >
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Challenges */}
                    {project.challenges && (
                    <div>
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        🎯 Challenges Faced
                        </h3>
                        <div className="space-y-4">
                        {project.challenges.map((challenge, index) => (
                            <motion.div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/20"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                            <span className="text-xl mt-1">⚡</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{challenge}</p>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* Lessons */}
                    {project.lessons && (
                    <div>
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        💡 Lessons Learned
                        </h3>
                        <div className="space-y-4">
                        {project.lessons.map((lesson, index) => (
                            <motion.div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl border border-green-500/20"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                            <span className="text-xl mt-1">🎓</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{lesson}</p>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                    )}
                </div>
                </motion.section>
            )}

            {/* Navigation */}
            <motion.section
                className="text-center pt-12 border-t border-purple-500/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300 border border-gray-600"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(75, 85, 99, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                >
                    ← Back to Previous
                </motion.button>
                
                <motion.button
                    onClick={() => router.push('/projects')}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(147, 51, 234, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                >
                    View All Projects
                </motion.button>
                </div>
            </motion.section>
            </div>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
            {isImageModalOpen && (
            <motion.div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsImageModalOpen(false)}
            >
                <motion.div
                className="relative max-w-4xl w-full aspect-video bg-gradient-to-br from-purple-800/30 to-indigo-900/30 rounded-2xl overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                >
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                    className="text-9xl opacity-30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                    📱
                    </motion.div>
                </div>
                
                {/* Close Button */}
                <motion.button
                    onClick={() => setIsImageModalOpen(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    ✕
                </motion.button>
                
                {/* Navigation */}
                {project.screenshots.length > 1 && (
                    <>
                    <motion.button
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : project.screenshots.length - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        ←
                    </motion.button>
                    
                    <motion.button
                        onClick={() => setSelectedImage(selectedImage < project.screenshots.length - 1 ? selectedImage + 1 : 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        →
                    </motion.button>
                    </>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {project.screenshots.length}
                </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
    };

    export default ProjectDetailPage;