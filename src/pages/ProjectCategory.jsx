import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiFolder } from 'react-icons/fi';
import { supabase } from '../supabase/client';

const ProjectCategory = () => {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [category]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  const categoryInfo = {
    'graphic-design': {
      title: 'Graphic Design',
      description: 'Visual communication through typography, photography, and illustration.',
      icon: '🎨',
      color: 'from-purple-500 to-pink-500'
    },
    'motion-graphic': {
      title: 'Motion Graphic',
      description: 'Animation and digital footage to create illusion of motion.',
      icon: '🎬',
      color: 'from-cyan-500 to-blue-500'
    },
    'web-design': {
      title: 'Web Design',
      description: 'Creating engaging and responsive websites with modern technologies.',
      icon: '💻',
      color: 'from-green-500 to-emerald-500'
    },
    'videography': {
      title: 'Videography',
      description: 'Professional video production and editing services.',
      icon: '🎥',
      color: 'from-orange-500 to-red-500'
    },
  };

  const currentCategory = categoryInfo[category] || categoryInfo['graphic-design'];

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <FiArrowLeft className="mr-2" />
          Back to Projects
        </Link>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-12 p-8 rounded-2xl bg-gradient-to-br ${currentCategory.color} relative overflow-hidden`}
        >
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">{currentCategory.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold">{currentCategory.title}</h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              {currentCategory.description}
            </p>
            <div className="mt-4 flex items-center text-white/80">
              <FiFolder className="mr-2" />
              <span>{projects.length} projects in this category</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-l from-white to-transparent" />
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl glass-effect p-6 animate-pulse">
                <div className="aspect-video bg-slate-700 rounded-xl mb-4" />
                <div className="h-4 bg-slate-700 rounded mb-2" />
                <div className="h-4 bg-slate-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group rounded-2xl glass-effect overflow-hidden card-hover border border-white/5"
              >
                {/* Project Image */}
                <div className="aspect-video relative overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${currentCategory.color} opacity-30`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm">
                      {project.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                        aria-label="View project"
                      >
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {JSON.parse(project.tags).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded bg-white/5 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Details Link */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm text-slate-400">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      to="#"
                      className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      View Case Study →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-slate-400">Projects in this category will appear here soon.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default ProjectCategory;