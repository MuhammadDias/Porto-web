import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
// import Dither from '../components/Dither';

const Home = () => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log('Home component mounted');
    fetchSkills();
    fetchRecentProjects();

    // Subscribe to real-time changes for skills
    const skillsSubscription = supabase
      .channel('skills')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'skills',
        },
        (payload) => {
          console.log('Skills updated:', payload);
          fetchSkills();
        }
      )
      .subscribe();

    // Subscribe to real-time changes for projects
    const projectsSubscription = supabase
      .channel('projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          console.log('Projects updated:', payload);
          fetchRecentProjects();
        }
      )
      .subscribe();

    return () => {
      skillsSubscription.unsubscribe();
      projectsSubscription.unsubscribe();
    };
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await supabase.from('skills').select('*').order('order', { ascending: true }).limit(8);
      if (data && data.length > 0) {
        setSkills(data);
      } else {
        setSkills(dummySkills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills(dummySkills);
    }
  };

  const fetchRecentProjects = async () => {
    try {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(4);
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(dummyProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(dummyProjects);
    }
  };

  //   const dummySkills = [
  //     { id: 1, name: 'React', category: 'Frontend', order: 1 },
  //     { id: 2, name: 'JavaScript', category: 'Language', order: 2 },
  //     { id: 3, name: 'Tailwind CSS', category: 'Styling', order: 3 },
  //     { id: 4, name: 'Node.js', category: 'Backend', order: 4 },
  //   ];

  const dummyProjects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'A modern portfolio website built with React and Tailwind CSS',
      category: 'Web Development',
      image_url: 'https://via.placeholder.com/400x300?text=Project+1',
    },
    {
      id: 2,
      title: 'E-Commerce App',
      description: 'Full-stack e-commerce application with payment integration',
      category: 'Web Development',
      image_url: 'https://via.placeholder.com/400x300?text=Project+2',
    },
  ];

  const socialLinks = [
    { icon: <FiGithub />, href: '#', label: 'GitHub' },
    { icon: <FiLinkedin />, href: '#', label: 'LinkedIn' },
    { icon: <FiTwitter />, href: '#', label: 'Twitter' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-sm text-cyan-400 font-mono">Available for work</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              I'm Dias <span className="gradient-text">Creative Developer</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8">I create stunning digital experiences with modern technologies. Specializing in Graphic Design, motion design, UI/UX Design.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary">
                View Projects <FiArrowRight className="inline ml-2" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get In Touch
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              {/* Dither Animation Background */}
              <div className="absolute inset-0 rounded-full overflow-hidden">{/* <Dither /> */}</div>

              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 animate-float" />
              <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-cyan-400/40 to-blue-500/40" />

              {/* Floating Elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`absolute w-12 h-12 rounded-lg glass-effect flex items-center justify-center ${i === 0 ? 'top-0 left-1/4' : i === 1 ? 'bottom-8 right-4' : 'top-12 right-0'}`}
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
          <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-slate-400">Technologies I work with</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-effect rounded-xl p-6 card-hover">
              <div className="text-4xl mb-4">{skill.icon || '💻'}</div>
              <h3 className="font-semibold mb-2">{skill.name}</h3>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
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
              <h2 className="text-3xl font-bold mb-4">Recent Projects</h2>
              <p className="text-slate-400">Check out some of my latest work</p>
            </div>
            <Link to="/projects" className="btn-secondary">
              View All
            </Link>
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
              className="group relative overflow-hidden rounded-2xl glass-effect card-hover"
            >
              <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400">{project.category}</span>
                  <span className="text-xs text-slate-400">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{project.description}</p>
                <Link to={`/projects/${project.category.toLowerCase().replace(' ', '-')}`} className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-effect rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
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
                className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-xl hover:text-cyan-400 transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
