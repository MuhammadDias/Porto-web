import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();

    // Subscribe to real-time changes
    const subscription = supabase
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
          fetchProjects(); // Re-fetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } else if (data && data.length > 0) {
        setProjects(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((p) => p.category))];
        setCategories(uniqueCategories);
        setFilteredProjects(data);
      } else {
        setProjects([]);
        setFilteredProjects([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === category));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-slate-400">Explore my latest work and projects</p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex flex-wrap gap-3">
            <button onClick={() => handleCategoryFilter('all')} className={`px-4 py-2 rounded-full font-medium transition-all ${activeCategory === 'all' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
              All Projects
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${activeCategory === category ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="group glass-effect rounded-2xl overflow-hidden card-hover">
                {/* Image */}
                <div className="relative aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-500/20 overflow-hidden">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400">{project.category}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Tags */}
                  {project.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(typeof project.tags === 'string' ? project.tags.split(',') : Array.isArray(project.tags) ? project.tags : []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400">
                          {typeof tag === 'string' ? tag.trim() : tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 flex-1 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 
                                 text-cyan-400 rounded-lg transition-colors text-sm"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        Live
                      </a>
                    )}
                    <a
                      href="#"
                      className="flex items-center gap-2 flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 
                               text-slate-300 rounded-lg transition-colors text-sm"
                    >
                      <FiGithub className="w-4 h-4" />
                      Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
            <p className="text-slate-400">Check back soon for new projects!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
