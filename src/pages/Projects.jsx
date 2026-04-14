import React, { useEffect, useRef, useState } from 'react';
import { FiExternalLink, FiGithub, FiInfo, FiX } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';
import { useLanguage } from '../i18n';
import DStatusLoader from '../components/DStatusLoader';
import { GlowProjectPageCard } from '../components/GlowProjectPageCard';
import ModalPortal from '../components/ModalPortal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOrigin, setModalOrigin] = useState({ x: 50, y: 8 });
  const modalContentRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        const projectData = data || [];
        setProjects(projectData);
        setFilteredProjects(projectData);
        setCategories([...new Set(projectData.map((item) => item.category).filter(Boolean))]);
      } catch (error) {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredProjects(projects);
      return;
    }
    setFilteredProjects(projects.filter((project) => project.category === category));
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) return parsed;
      } catch (error) {
        return tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
      return tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
    return [];
  };

  return (
    <div className="relative overflow-hidden pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#ff7a00]/[0.05] blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 md:px-8">
        <section className="mb-8 md:mb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-slate-400">{t('projects.selectedWork')}</p>
          <h1 className="text-3xl font-medium tracking-[0.01em] text-white md:text-5xl">{t('projects.title')}</h1>
          <div className="mt-3 h-px w-16 bg-white/55" />
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-[130px_1fr]">
          <aside className="hidden lg:block">
            <p className="mb-7 text-[10px] uppercase tracking-[0.28em] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">{t('projects.designing')}</p>
            <p className="mb-7 text-[10px] uppercase tracking-[0.28em] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">{t('projects.development')}</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">{t('projects.marketing')}</p>
          </aside>

          <div>
            {categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryFilter('all')}
                  className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${activeCategory === 'all' ? 'border-white/70 text-white' : 'border-white/20 text-slate-400 hover:border-white/45 hover:text-slate-200'}`}
                >
                  {t('projects.all')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${activeCategory === category ? 'border-white/70 text-white' : 'border-white/20 text-slate-400 hover:border-white/45 hover:text-slate-200'}`}
                  >
                    {category.replaceAll('-', ' ')}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="rounded-xl border border-white/15 bg-black/50 p-6">
                <DStatusLoader label={t('projects.loading')} />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <GlowProjectPageCard key={project.id} project={project} onSelect={handleOpenProjectDetail} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/15 bg-black/50 p-6 text-sm text-slate-400">{t('projects.noProjects')}</div>
            )}
          </div>
        </section>
      </div>

      <p className="pointer-events-none absolute bottom-[-2.5rem] left-0 text-5xl font-black uppercase tracking-tight text-white/[0.04] md:text-8xl">THE CRE8TIVE</p>

      {selectedProject && (
        <ModalPortal>
          <div className="modal-overlay project-modal-overlay fixed inset-0 z-[1000] flex items-start justify-center bg-black/80 p-3 pt-16 md:p-6 md:pt-20" onClick={() => setSelectedProject(null)}>
            <div
              className="modal-surface modal-surface-pull project-modal-surface relative w-full max-w-3xl overflow-hidden rounded-xl border border-white/20"
              style={{ '--pull-origin-x': `${modalOrigin.x}%`, '--pull-origin-y': `${modalOrigin.y}%` }}
              onClick={(event) => event.stopPropagation()}
            >
              <button onClick={() => setSelectedProject(null)} className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-slate-300 transition-colors hover:border-white/40 hover:text-white">
                <FiX className="h-4 w-4" />
              </button>
              <div ref={modalContentRef} className="max-h-[85vh] overflow-y-auto p-6 pr-5 md:p-8 md:pr-7">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                  {selectedProject.category || t('common.uncategorized')}
                </p>
                <h3 className="mb-4 text-3xl font-medium text-white">{selectedProject.title}</h3>
                <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-slate-300">{selectedProject.description}</p>

                <div className="flex flex-wrap gap-3">
                  {selectedProject.project_url && (
                    <a href={selectedProject.project_url} target="_blank" rel="noopener noreferrer" className="project-modal-link inline-flex items-center gap-2 border border-white/25 px-4 py-2 text-sm text-white transition-colors hover:border-white/60">
                      <FiExternalLink className="h-4 w-4" /> {t('projects.viewLiveProject')}
                    </a>
                  )}
                  {selectedProject.code && (
                    <a
                      href={selectedProject.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-modal-link inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-white/45 hover:text-white"
                    >
                      <FiGithub className="h-4 w-4" /> {t('projects.viewCode')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
