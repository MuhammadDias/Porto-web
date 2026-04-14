import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useLanguage } from '../i18n';
import ModalPortal from '../components/ModalPortal';

const dummySkills = [
  { id: 1, name: 'React', level: 90 },
  { id: 2, name: 'JavaScript', level: 85 },
  { id: 3, name: 'Tailwind CSS', level: 95 },
  { id: 4, name: 'Node.js', level: 80 },
];

const dummyProjects = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A clean portfolio website built with React and Tailwind CSS.',
    category: 'Web Development',
    created_at: new Date().toISOString(),
    image_url: '',
  },
  {
    id: 2,
    title: 'E-Commerce App',
    description: 'Full-stack e-commerce application with payment integration.',
    category: 'Web Development',
    created_at: new Date().toISOString(),
    image_url: '',
  },
];

import { GlowProjectCard } from '../components/GlowProjectCard';
import { GlowSkillCard } from '../components/GlowSkillCard';
import { getProfile } from '../supabase/api';

export default function Home() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOrigin, setModalOrigin] = useState({ x: 50, y: 8 });
  const modalContentRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await supabase.from('skills').select('*').order('order', { ascending: true });
        setSkills(data && data.length > 0 ? data : dummySkills);
      } catch (error) {
        setSkills(dummySkills);
      }
    };

    const fetchProjects = async () => {
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(4);
        setProjects(data && data.length > 0 ? data : dummyProjects);
      } catch (error) {
        setProjects(dummyProjects);
      }
    };

    const fetchProfileData = async () => {
      try {
        // For a portfolio, we usually fetch the first profile found or a specific admin ID
        // Here we just fetch the first one to make it dynamic for the owner
        const { data } = await supabase.from('profiles').select('*').limit(1).single();
        if (data) setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchSkills();
    fetchProjects();
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (!selectedProject) return undefined;

    const originalStyles = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
    };

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyles.bodyOverflow;
      document.documentElement.style.overflow = originalStyles.htmlOverflow;
    };
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [selectedProject]);

  const handleOpenProjectDetail = (project, event) => {
    if (event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      setModalOrigin({
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
      });
    }
    setSelectedProject(project);
    // Track view
    import('../supabase/api').then(api => api.incrementViews(project.id));
  };

  const ribbonText = t('home.ribbon');
  const ribbonItems = `${ribbonText}${ribbonText}${ribbonText}${ribbonText}`;

  return (
    <div className="home-page pb-12 pt-8 md:pb-14 md:pt-12">
      <section className="relative overflow-hidden bg-black pb-24 pt-8 md:pb-32 md:pt-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-8 top-24 text-[120px] font-semibold leading-none text-white/[0.05] md:text-[300px]">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover opacity-20 grayscale" />
            ) : 'd'}
          </div>
          <p className="absolute bottom-0 left-0 text-3xl font-semibold uppercase tracking-tight text-white/[0.05] md:text-7xl">THE CRE8TIVE</p>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <aside className="hidden lg:block">
              <p className="mb-7 text-[10px] uppercase tracking-[0.28em] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">Digital Marketing</p>
              <p className="mb-7 text-[10px] uppercase tracking-[0.28em] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">Designing</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">Development</p>
            </aside>

            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-300">{t('home.availability')}</p>
              <h1 className="mb-4 max-w-4xl text-4xl font-medium leading-tight text-white sm:text-5xl md:text-7xl">
                {profile?.name || t('home.headline')}
                <br />
                {profile?.bio?.split('\n')[0] || t('home.role')}
              </h1>
              <p className="mb-7 max-w-2xl text-sm text-slate-300 md:text-base">
                {profile?.bio || t('home.description')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/projects" className="inline-flex items-center gap-2 border border-white/35 px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-white transition-colors hover:border-white/60">
                  {t('home.viewProjects')} <FiArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center border border-white/15 px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-slate-300 transition-colors hover:border-white/40 hover:text-white">
                  {t('home.contactMe')}
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="pointer-events-none absolute left-3/4 top-[12%] z-20 w-[220vw] overflow-hidden border border-black/20 bg-[#ececec] py-4 text-black md:top-[6%] md:py-5" style={{ transform: 'translateX(-50%) rotate(44.71deg)' }}>
            <div className="home-marquee-reverse">
              <p className="pr-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] md:text-2xl">{ribbonItems}</p>
              <p className="pr-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] md:text-2xl">{ribbonItems}</p>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-[100px] left-1/2 z-30 w-[220vw] overflow-hidden border border-white/10 bg-zinc-700/95 py-4 md:py-5" style={{ transform: 'translateX(-50%) rotate(-12.95deg)' }}>
            <div className="home-marquee">
              <p className="pr-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-zinc-100 md:text-2xl">{ribbonItems}</p>
              <p className="pr-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-zinc-100 md:text-2xl">{ribbonItems}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-16 space-y-12 px-4 md:mt-24 md:space-y-16 md:px-8">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">{t('home.coreSkills')}</h2>
              <p className="text-sm text-slate-400">{t('home.coreSkillsSub')}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <GlowSkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">{t('home.recentProjects')}</h2>
              <p className="text-sm text-slate-400">{t('home.recentProjectsSub')}</p>
            </div>
            <Link to="/projects" className="btn-outline text-sm">
              {t('common.seeAll')}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {projects.map((project) => (
              <GlowProjectCard key={project.id} project={project} onSelect={handleOpenProjectDetail} />
            ))}
          </div>
        </section>
      </div>

      {selectedProject && (
        <ModalPortal>
          <div className="modal-overlay fixed inset-0 z-[1000] flex items-start justify-center bg-black/70 p-4 pt-16 md:pt-20" onClick={() => setSelectedProject(null)}>
            <div
              className="modal-surface modal-surface-pull surface relative w-full max-w-2xl overflow-hidden rounded-xl"
              style={{ '--pull-origin-x': `${modalOrigin.x}%`, '--pull-origin-y': `${modalOrigin.y}%` }}
              onClick={(event) => event.stopPropagation()}
            >
              <button onClick={() => setSelectedProject(null)} className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <FiX className="h-5 w-5" />
              </button>
              <div ref={modalContentRef} className="max-h-[80vh] overflow-y-auto p-6 pr-5">
                <p className="mb-2 text-sm text-white">{selectedProject.category}</p>
                <h3 className="mb-3 text-2xl font-semibold text-white">{selectedProject.title}</h3>
                <p className="whitespace-pre-line text-slate-300">{selectedProject.description}</p>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
