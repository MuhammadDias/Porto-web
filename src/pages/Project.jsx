import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiFolder, 
  FiFilm, 
  FiCode, 
  FiVideo,
  FiGrid,
  FiSearch
} from 'react-icons/fi';
import { supabase } from '../supabase/client';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    setProjects(data || []);
  };

  const categories = [
    { 
      id: 'graphic-design', 
      name: 'Graphic Design', 
      icon: <FiGrid />, 
      color: 'from-purple-500 to-pink-500',
      count: projects.filter(p => p.category === 'graphic-design').length
    },
    { 
      id: 'motion-graphic', 
      name: 'Motion Graphic', 
      icon: <FiFilm />, 
      color: 'from-cyan-500 to-blue-500',
      count: projects.filter(p => p.category === 'motion-graphic').length
    },
    { 
      id: 'web-design', 
      name: 'Web Design', 
      icon: <FiCode />, 
      color: 'from-green-500 to-emerald-500',
      count: projects.filter(p => p.category === 'web-design').length
    },
    { 
      id: 'videography', 
      name: 'Videography', 
      icon: <FiVideo />, 
      color: 'from-orange-500 to-red-500',
      count: projects.filter(p => p.category === 'videography').length
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explore my creative work across different disciplines. Each project represents
            a unique challenge and solution.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass-effect border border-white/10 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Category Folders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Link
                to={`/projects/${category.id}`}
                className={`block p-6 rounded-2xl glass-effect card-hover border-2 border-transparent hover:border-white/10 group`}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl text-white mb-4 mx-auto`}>
                  {category.icon}
                </div>
                <h3 className="text-center font-semibold mb-2">{category.name}</h3>
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/5">
                    <FiFolder className="mr-2" />
                    {category.count} projects
                  </span>
                </div>
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-cyan-400">Click to explore →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'glass-effect text-slate-300 hover:text-cyan-400'
              }`}
            >
              All Projects
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'glass-effect text-slate-300 hover:text-cyan-400'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group rounded-2xl glass-effect overflow-hidden card-hover"
              >
                <div className="aspect-video relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    categories.find(c => c.id === project.category)?.color || 'from-cyan-500 to-blue-500'
                  } opacity-20`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-50">
                      {categories.find(c => c.id === project.category)?.icon}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${
                      categories.find(c => c.id === project.category)?.color || 'from-cyan-500 to-blue-500'
                    } text-white`}>
                      {project.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-slate-400">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <Link
                    to={`/projects/${project.category}`}
                    className="inline-flex items-center text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Projects;