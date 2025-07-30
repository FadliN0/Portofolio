'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

interface ContactMethod {
  id: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  gradient: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

// Konfigurasi EmailJS - GANTI DENGAN DATA ANDA
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_tomkk68',      // Ganti dengan Service ID Anda
  TEMPLATE_ID: 'template_zd2aam3',    // Ganti dengan Template ID Anda
  PUBLIC_KEY: 'TTwmI-L9bG6ec1CP4',      // Ganti dengan Public Key Anda
};

const ContactCard: React.FC<{ method: ContactMethod; index: number }> = ({ method, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

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

  const handleClick = () => {
    if (method.id === 'email') {
      window.location.href = `mailto:${method.value}`;
    } else if (method.id === 'phone') {
    window.open(`https://wa.me/${method.value.replace(/\D/g, '')}`, '_blank');
    } else if (method.id === 'location') {
    const encodedLocation = encodeURIComponent(method.value);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  }
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative cursor-pointer w-full max-w-md"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={handleClick}
    >
      <motion.div
        className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-br from-black via-gray-900 to-purple-900/50 border border-purple-500/20 backdrop-blur-sm shadow-lg "
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 40px -12px rgba(147, 51, 234, 0.3)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-pink-600/20 rounded-xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon Container with 3D effect */}
        <motion.div
          className={`relative w-14 h-14 rounded-full flex items-center justify-center ${method.gradient} shadow-lg`}
          style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
          whileHover={{ 
            scale: 1.1,
            rotate: 360,
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={isHovered ? { rotate: 360 } : {}}
            transition={{ duration: 0.8 }}
          >
            {method.icon}
          </motion.div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{ scale: isHovered ? [1, 1.5, 1] : 1, opacity: isHovered ? [0.3, 0, 0.3] : 0 }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex-1"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}
        >
          <motion.p
            className="font-semibold text-purple-300 text-lg"
            whileHover={{ scale: 1.05 }}
          >
            {method.title}
          </motion.p>
          <motion.p
            className="text-gray-300"
            whileHover={{ color: "#e2e8f0" }}
          >
            {method.value}
          </motion.p>
        </motion.div>

        {/* Hover arrow */}
        <motion.div
          className="opacity-0 group-hover:opacity-100 text-purple-400"
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: "preserve-3d", transform: "translateZ(15px)" }}
        >
          →
        </motion.div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 rounded-xl"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

const FormField: React.FC<{
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}> = ({ label, type, placeholder, value, onChange, rows, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <label className="block text-sm font-medium text-purple-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <motion.div className="relative">
        {type === 'textarea' ? (
          <motion.textarea
            rows={rows}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-white resize-none backdrop-blur-sm"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            whileFocus={{ scale: 1.02 }}
          />
        ) : (
          <motion.input
            type={type}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-white backdrop-blur-sm"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            whileFocus={{ scale: 1.02 }}
          />
        )}
        
        {/* Animated border effect */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-purple-500/50 pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </motion.div>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      icon: (
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
        </svg>
      ),
      title: 'Email',
      value: 'fadlioppo460@gmail.com',
      gradient: 'bg-gradient-to-r from-purple-500 to-indigo-500'
    },
    {
      id: 'phone',
      icon: (
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V4z" clipRule="evenodd"></path>
        </svg>
      ),
      title: 'Phone',
      value: '+62 858 3012 5460',
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    },
    {
      id: 'location',
      icon: (
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </svg>
      ),
      title: 'Location',
      value: 'Semper Barat, Jakarta Utara',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Template parameters yang akan dikirim ke EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'fadlioppo460@gmail.com', // Email tujuan
        reply_to: formData.email,
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset status setelah 5 detik
      setTimeout(() => setSubmitStatus('idle'), 5000);
      
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      
      // Reset status setelah 5 detik
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
    
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <motion.div
          className="absolute top-10 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -60, -20],
              opacity: [0.2, 1, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-7xl mx-auto">
          
          {/* Left Side - Header & Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-6">
              <motion.div
                className="inline-block text-6xl mb-4"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💫
              </motion.div>
              
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                whileInView={{ scale: [0.9, 1.02, 1] }}
                transition={{ duration: 0.5 }}
              >
                {"Let's"}{' '}
                <motion.span
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Connect
                </motion.span>
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Ready to bring your ideas to life? {"Let's"} create something{' '}
                <motion.span
                  className="text-purple-300 font-semibold"
                  whileHover={{ scale: 1.05, color: "#c084fc" }}
                >
                  extraordinary
                </motion.span>{' '}
                together.
              </motion.p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <ContactCard key={method.id} method={method} index={index} />
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              className="flex space-x-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                <motion.button
                  key={social}
                  className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 hover:text-white backdrop-blur-sm"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "rgba(147, 51, 234, 0.3)",
                    rotate: 360
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {social[0]}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              className="bg-gradient-to-br from-black/40 via-gray-900/40 to-purple-900/20 backdrop-blur-lg px-4 sm:px-6 py-8 rounded-3xl border border-purple-500/20 shadow-2xl"
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.4)"
              }}
            >
              {/* Form floating elements */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400/40 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0.2, 0.8, 0.2],
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

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <motion.h3
                  className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Send Me a Message
                </motion.h3>

                <FormField
                  label="Name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  required
                />

                <FormField
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  required
                />

                <FormField
                  label="Message"
                  type="textarea"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                  rows={5}
                  required
                />

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-sm sm:text-base font-semibold rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden transition-all duration-300 ${
                    submitStatus === 'success' 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                      : submitStatus === 'error'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  }`}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: submitStatus === 'success' 
                      ? "0 20px 40px -12px rgba(34, 197, 94, 0.6)"
                      : submitStatus === 'error'
                      ? "0 20px 40px -12px rgba(239, 68, 68, 0.6)"
                      : "0 20px 40px -12px rgba(147, 51, 234, 0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className={`absolute inset-0 ${
                      submitStatus === 'success' 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
                        : submitStatus === 'error'
                        ? 'bg-gradient-to-r from-rose-600 to-red-600'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                    }`}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          ⚡
                        </motion.span>
                        Sending...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <span>✅</span>
                        Message Sent!
                      </>
                    ) : submitStatus === 'error' ? (
                      <>
                        <span>❌</span>
                        Failed to Send
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </span>
                </motion.button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-green-900/30 border border-green-500/30 rounded-lg"
                  >
                    <p className="text-green-300">
                      🎉 Pesan berhasil dikirim! Saya akan membalas dalam 24 jam.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-red-900/30 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-300">
                      😔 Gagal mengirim pesan. Silakan coba lagi atau hubungi langsung ke email saya.
                    </p>
                  </motion.div>
                )}
              </form>

              {/* Hint */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                viewport={{ once: true }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-purple-300/75 flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💡
                  </motion.span>
                  I typically respond within 24 hours!
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;