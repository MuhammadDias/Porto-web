import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import { useLanguage } from '../i18n';
import DStatusLoader from '../components/DStatusLoader';

const categoryLabels = {
  'graphic-design': 'Graphic Design',
  'motion-graphic': 'Motion Graphic',
  'web-design': 'Web Design',
  videography: 'Videography',
};

const safeTags = (tags) => {
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

const ProjectCategory = () => {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data } = await supabase.from('projects').select('*').eq('category', category).order('created_at', { ascending: false });
      setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, [category]);

  return (
    <div className="pb-14 pt-12">
      <div className="container mx-auto px-4 md:px-8">
        <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <FiArrowLeft className="h-4 w-4" />
          {t('projectCategory.back')}
        </Link>

        <section className="mb-6 surface p-6">
          <h1 className="mb-2 text-3xl font-semibold text-white">{categoryLabels[category] || category}</h1>
          <p className="text-slate-300">
            {projects.length} {t('projectCategory.projectsCount')}
          </p>
        </section>

        {loading ? (
          <div className="surface p-6">
            <DStatusLoader label={t('projectCategory.loading')} />
          </div>
        ) : projects.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="surface overflow-hidden">
                <div className="h-40 bg-slate-800">{project.image_url ? <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" /> : null}</div>
                <div className="p-4">
                  <h2 className="mb-2 text-lg font-medium text-white">{project.title}</h2>
                  <p className="mb-4 line-clamp-2 text-sm text-slate-300">{project.description}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {safeTags(project.tags)
                      .slice(0, 3)
                      .map((tag, index) => (
                        <span key={`${tag}-${index}`} className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300">
                          {tag}
                        </span>
                      ))}
                  </div>

                  {project.project_url && (
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white hover:text-slate-200">
                      <FiExternalLink className="h-4 w-4" />
                      {t('projectCategory.visit')}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="surface p-6 text-sm text-slate-400">{t('projectCategory.noProjects')}</div>
        )}
      </div>
    </div>
  );
};

export default ProjectCategory;
