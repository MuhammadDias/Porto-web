import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import Dither from '../components/Dither';

const Home = () => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  // Data dummy (Backup)
  const dummySkills = [
    { id: 1, name: 'React', category: 'Frontend', order: 1, level: 90 },
    { id: 2, name: 'JavaScript', category: 'Language', order: 2, level: 85 },
    { id: 3, name: 'Tailwind CSS', category: 'Styling', order: 3, level: 95 },
    { id: 4, name: 'Node.js', category: 'Backend', order: 4, level: 80 },
    { id: 5, name: 'Python', category: 'Language', order: 5, level: 75 },
    { id: 6, name: 'Supabase', category: 'Backend', order: 6, level: 85 },
    { id: 7, name: 'Framer Motion', category: 'Animation', order: 7, level: 70 },
    { id: 8, name: 'Git', category: 'Tools', order: 8, level: 90 },
  ];

  const dummyProjects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'A modern portfolio website built with React and Tailwind CSS',
      category: 'Web Development',
      created_at: new Date().toISOString(),
      image_url: 'https://via.placeholder.com/400x300?text=Project+1',
    },
    {
      id: 2,
      title: 'E-Commerce App',
      description: 'Full-stack e-commerce application with payment integration',
      category: 'Web Development',
      created_at: new Date().toISOString(),
      image_url: 'https://via.placeholder.com/400x300?text=Project+2',
    },
  ];

  const fetchSkills = async () => {
    try {
      const { data } = await supabase.from('skills').select('*').order('order', { ascending: true }).limit(8);
      setSkills(data && data.length > 0 ? data : dummySkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills(dummySkills);
    }
  };

  const fetchRecentProjects = async () => {
    try {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(4);
      setProjects(data && data.length > 0 ? data : dummyProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(dummyProjects);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchRecentProjects();
    const skillsSub = supabase.channel('skills').on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, fetchSkills).subscribe();
    const projectsSub = supabase.channel('projects').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchRecentProjects).subscribe();
    return () => { skillsSub.unsubscribe(); projectsSub.unsubscribe(); };
  }, []);

  const socialLinks = [
    { icon: <FiGithub />, href: '#', label: 'GitHub' },
    { icon: <FiLinkedin />, href: '#', label: 'LinkedIn' },
    { icon: <FiTwitter />, href: '#', label: 'Twitter' },
  ];

  // --- NEW iOS GLASS STYLE CLASS ---
  // Saya bikin variabel string biar gampang dipake di mana-mana dan konsisten
  // - backdrop-blur-lg: Blur lebih kuat
  // - bg-white/10: Permukaan lebih terang
  // - border-white/10: Garis tepi lebih jelas
  // - shadow-lg shadow-black/20: Bayangan lembut biar ngambang
  const iOSGlassStyle = "border border-white/10 bg-white/10 backdrop-blur-lg shadow-lg shadow-black/20";

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      
      {/* BACKGROUND DITHER */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
        <Dither
          waveColor={[0.1, 0.7, 0.8]} 
          colorNum={4}
          pixelSize={3}
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.2}
          enableMouseInteraction={true}
          mouseRadius={0.4}
        />
      </div>

      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-8 py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                <span className="text-sm text-cyan-400 font-mono">Available for work</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                I'm Dias <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Creative Developer</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8">
                I create stunning digital experiences with modern technologies. Specializing in Graphic Design, motion design, UI/UX Design.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/projects" className="btn-primary">
                  View Projects <FiArrowRight className="inline ml-2" />
                </Link>
                <Link to="/contact" className="btn-secondary border border-white/10 bg-white/10 backdrop-blur-lg shadow-lg shadow-black/20 hover:bg-white/15 
                         border border-white/20 hover:border-white/30">
                  Get In Touch
                </Link>
              </div>
            </motion.div>

            {/* Right Visual - FLOATING ICONS WITH NEW GLASS STYLE */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.2 }} 
              className="relative hidden md:block h-[400px]"
            >
               <div className="relative w-full h-full flex justify-center items-center">
                  <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse border border-white/5"></div>
                  
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 5 + i,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      // UPDATE STYLE DISINI
                      className={`absolute w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${iOSGlassStyle}
                        ${i === 0 ? 'top-10 left-10' : i === 1 ? 'bottom-20 right-10' : 'top-1/2 right-0'}
                      `}
                    >
                      {i === 0 ? '🚀' : i === 1 ? '🎨' : '💻'}
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="container mx-auto px-4 md:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Skills & Expertise</h2>
            <p className="text-slate-400">Technologies I work with</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.1 }} 
                // UPDATE STYLE DISINI (Saya tambah rounded-2xl biar lebih modern)
                className={`rounded-2xl p-6 card-hover ${iOSGlassStyle}`}
              >
                <div className="text-4xl mb-4">{skill.icon || '💻'}</div>
                <h3 className="font-semibold mb-2 text-white">{skill.name}</h3>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        <section className="container mx-auto px-4 md:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white">Recent Projects</h2>
                <p className="text-slate-400">Check out some of my latest work</p>
              </div>
              <Link to="/projects" className="btn-secondary">View All</Link>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                // UPDATE STYLE DISINI (Pakai rounded-3xl biar makin kerasa iOS-nya)
                className={`group relative overflow-hidden rounded-3xl card-hover ${iOSGlassStyle}`}
              >
                <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{project.category}</span>
                    <span className="text-xs text-slate-400">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-white">{project.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{project.description}</p>
                  <Link to={`/projects/${project.category.toLowerCase().replace(' ', '-')}`} className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">View Details →</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social Links */}
        <section className="container mx-auto px-4 md:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            // UPDATE STYLE DISINI (Pakai rounded-3xl dan blur lebih kuat lagi)
            className="rounded-3xl p-8 md:p-12 text-center border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/30"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Let's Connect</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Feel free to reach out for collaborations or just to say hello!</p>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  // UPDATE STYLE DISINI (Tombol bulat juga dipertegas bordernya)
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white hover:text-cyan-400 transition-colors border border-white/20 bg-white/10 backdrop-blur-md shadow-md hover:border-cyan-500/50"
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;