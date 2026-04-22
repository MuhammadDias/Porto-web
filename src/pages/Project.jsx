import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import { useLanguage } from '../i18n';
import DStatusLoader from '../components/DStatusLoader';

// Dynamic categories generated in component

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      const projectData = data || [];
      setProjects(projectData);
      
      const allCatStrs = projectData.flatMap((item) => (item.category ? item.category.split(',').map(c => c.trim()).filter(Boolean) : []));
      const uniqueCats = [...new Set(allCatStrs)];
      const dynamicCats = [
        { id: 'all', name: 'All' },
        ...uniqueCats.map(c => ({ id: c, name: c.replace(/-/g, ' ').toUpperCase() }))
      ];
      setCategories(dynamicCats);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const title = (project.title || '').toLowerCase();
      const description = (project.description || '').toLowerCase();
      const keyword = searchTerm.toLowerCase();
      const matchCategory = activeCategory === 'all' || (project.category && project.category.split(',').map(c => c.trim()).includes(activeCategory));
      const matchKeyword = title.includes(keyword) || description.includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [projects, activeCategory, searchTerm]);

  return (
    <div className="pb-12 pt-8 md:pb-14 md:pt-12">
      <section className="container mx-auto px-4 md:px-8">
        <div className="surface interactive-card mb-6 p-6 md:mb-8 md:p-8">
          <h1 className="mb-2 text-3xl md:text-4xl">{t('projects.title')}</h1>
          <p className="text-sm text-slate-300">{t('projects.selectedWork')}</p>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search project..." className="input-base pl-10" />
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)} className={activeCategory === category.id ? 'btn-primary text-xs' : 'btn-outline text-xs'}>
                {category.id === 'all' ? t('projects.all') : category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="surface p-6">
            <DStatusLoader label={t('projects.loading')} />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <article key={project.id} className="surface interactive-card overflow-hidden">
                <div className="h-36 border-b-2 border-white/40 bg-black/30">{project.image_url ? <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" /> : null}</div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {project.category ? project.category.split(',').map(c => c.trim()).map(c => (
                      <span key={c} className="text-[10px] uppercase tracking-wide text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">{c.replace('-', ' ')}</span>
                    )) : <span className="text-[10px] uppercase tracking-wide text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">GENERAL</span>}
                  </div>
                  <h2 className="mb-2 text-lg">{project.title}</h2>
                  <p className="mb-4 line-clamp-2 text-sm text-slate-300">{project.description}</p>
                  <Link to={`/projects/${project.category ? project.category.split(',')[0].trim() : 'all'}`} className="interactive-link inline-flex items-center gap-2 text-sm text-white">
                    View Category <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface p-6 text-sm text-slate-300">{t('projects.noProjects')}</div>
        )}
      </section>
    </div>
  );
};

export default Project;
