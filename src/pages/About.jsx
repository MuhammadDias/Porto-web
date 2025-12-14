import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiDownload } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';
import ProfileCard from '../components/ProfileCard';

export default function About() {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const biodata = {
    nama: 'Muhammad Dias Al Izzat',
    tempat_lahir: 'Gresik',
    tanggal_lahir: '27 Agustus 2005',
    agama: 'Islam',
    status: 'Mahasiswa',
    alamat: 'Sekargadung, Dukun, Gresik',
  };

  useEffect(() => {
    fetchExperiences();
    fetchSkills();

    // Subscribe to real-time changes
    const expSubscription = supabase
      .channel('experiences')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'experiences',
        },
        (payload) => {
          console.log('Experiences updated:', payload);
          fetchExperiences();
        }
      )
      .subscribe();

    const skillSubscription = supabase
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

    return () => {
      expSubscription.unsubscribe();
      skillSubscription.unsubscribe();
    };
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from('skills').select('*').order('order', { ascending: true });

      if (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      } else {
        setSkills(data || []);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load skills');
      setSkills([]);
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase.from('experiences').select('*').order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching experiences:', error);
        setExperiences([]);
      } else {
        setExperiences(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load experiences');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">Creative designer & developer passionate about creating meaningful digital experiences</p>
        </motion.div>

        {/* Biodata & Photo Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Biodata */}
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="glass-effect rounded-2xl p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded" />
                  Personal Info
                </h2>

                <div className="space-y-6">
                  {Object.entries(biodata).map(([key, value], index) => (
                    <motion.div key={key} variants={itemVariants} className="border-b border-white/5 pb-4">
                      <span className="text-slate-500 text-sm uppercase tracking-wider mb-2 block">{key.replace('_', ' ')}</span>
                      <span className="text-white text-lg font-semibold">{value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="mt-8 flex gap-4 flex-col sm:flex-row">
                  <a href="mailto:contact@example.com" className="btn-primary flex items-center justify-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Contact Me
                  </a>
                  <a
                    href="/CV DPR Fest.jpg" 
                    download="CV_Muhammad_Dias.jpg"
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download CV
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="-mt-8">
              <ProfileCard
                name="M. Dias Al Izzat"
                title="UI/UX Designer & Frontend Developer"
                handle="userswallow_"
                status="Online"
                contactText="Contact Me"
                avatarUrl="/Dayess_1.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={() => console.log('Contact clicked')}
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded" />
            My Skills
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : skills.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative backdrop-blur-md bg-white/10 hover:bg-white/20 
                           border border-white/20 hover:border-white/30 rounded-2xl p-5 
                           transition-all duration-300 hover:shadow-xl 
                           hover:shadow-cyan-500/20"
                >
                  {/* Decorative gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 
                              group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl 
                              transition-all duration-300"
                  />

                  <div className="relative z-10">
                    <div className="text-4xl mb-3">{skill.icon || '💻'}</div>
                    <h3 className="text-base font-bold mb-1 text-white">{skill.name}</h3>
                    <p className="text-xs text-slate-300 mb-3 capitalize">{skill.category}</p>

                    {skill.level && (
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-slate-400">No skills added yet</p>
            </motion.div>
          )}
        </motion.section>

        {/* Experience Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded" />
            Experience
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : experiences.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative backdrop-blur-md bg-white/10 hover:bg-white/20 
                           border border-white/20 hover:border-white/30 rounded-2xl p-6 
                           transition-all duration-300 hover:shadow-xl 
                           hover:shadow-cyan-500/20 hover:scale-105 flex flex-col"
                >
                  {/* Decorative gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 
                              group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl 
                              transition-all duration-300"
                  />

                  {/* Left border accent */}
                  <div
                    className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-blue-500 
                              rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Date */}
                    <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
                      {new Date(exp.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                      {exp.end_date && exp.end_date !== exp.start_date
                        ? ` - ${new Date(exp.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })}`
                        : ' - Now'}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-1 text-white line-clamp-2">{exp.title}</h3>

                    {/* Company */}
                    <p className="text-sm text-cyan-300 font-semibold mb-3">{exp.company}</p>

                    {/* Description */}
                    <p className="text-xs text-slate-300 flex-1 line-clamp-3 leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-slate-400">No experiences added yet</p>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
