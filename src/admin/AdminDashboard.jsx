import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/client';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiUpload,
  FiLogOut,
  FiSave,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'web-design',
    description: '',
    image_url: '',
    project_url: '',
    tags: '',
  });

  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    start_date: '',
    end_date: '',
    description: '',
    current: false,
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 80,
    category: 'frontend',
    icon: '💻',
    order: 0,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        setProjects(data || []);
      } else if (activeTab === 'experiences') {
        const { data } = await supabase.from('experiences').select('*').order('start_date', { ascending: false });
        setExperiences(data || []);
      } else if (activeTab === 'skills') {
        const { data } = await supabase.from('skills').select('*').order('order', { ascending: true });
        setSkills(data || []);
      }
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...projectForm,
        tags: JSON.stringify(projectForm.tags.split(',').map(tag => tag.trim())),
        created_at: new Date().toISOString(),
      };

      if (editingItem) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingItem);
        
        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase.from('projects').insert([projectData]);
        if (error) throw error;
        toast.success('Project added successfully');
      }

      setProjectForm({
        title: '',
        category: 'web-design',
        description: '',
        image_url: '',
        project_url: '',
        tags: '',
      });
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('experiences')
          .update(experienceForm)
          .eq('id', editingItem);
        
        if (error) throw error;
        toast.success('Experience updated successfully');
      } else {
        const { error } = await supabase.from('experiences').insert([experienceForm]);
        if (error) throw error;
        toast.success('Experience added successfully');
      }

      setExperienceForm({
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: '',
        current: false,
      });
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('skills')
          .update(skillForm)
          .eq('id', editingItem);
        
        if (error) throw error;
        toast.success('Skill updated successfully');
      } else {
        const { error } = await supabase.from('skills').insert([skillForm]);
        if (error) throw error;
        toast.success('Skill added successfully');
      }

      setSkillForm({
        name: '',
        level: 80,
        category: 'frontend',
        icon: '💻',
        order: 0,
      });
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Item deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const renderTable = () => {
    if (activeTab === 'projects') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">{project.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400">
                      {project.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setProjectForm({
                            ...project,
                            tags: JSON.parse(project.tags || '[]').join(', ')
                          });
                          setEditingItem(project.id);
                        }}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete('projects', project.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'experiences') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Company</th>
                <th className="py-3 px-4 text-left">Period</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">{exp.title}</td>
                  <td className="py-3 px-4">{exp.company}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setExperienceForm(exp);
                          setEditingItem(exp.id);
                        }}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete('experiences', exp.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'skills') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left">Skill</th>
                <th className="py-3 px-4 text-left">Level</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">{skill.icon}</span>
                      {skill.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/5">
                      {skill.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSkillForm(skill);
                          setEditingItem(skill.id);
                        }}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete('skills', skill.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const renderForm = () => {
    if (activeTab === 'projects') {
      return (
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={projectForm.category}
                onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              >
                <option value="web-design">Web Design</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="motion-graphic">Motion Graphic</option>
                <option value="videography">Videography</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              value={projectForm.description}
              onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
              rows="3"
              className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={projectForm.image_url}
                onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Project URL</label>
              <input
                type="url"
                value={projectForm.project_url}
                onChange={(e) => setProjectForm({...projectForm, project_url: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={projectForm.tags}
              onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
              className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              placeholder="React, Design, Animation"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setProjectForm({
                    title: '',
                    category: 'web-design',
                    description: '',
                    image_url: '',
                    project_url: '',
                    tags: '',
                  });
                }}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                <FiX className="inline mr-2" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2"
            >
              <FiSave className="inline mr-2" />
              {editingItem ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      );
    }

    if (activeTab === 'experiences') {
      return (
        <form onSubmit={handleExperienceSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                value={experienceForm.title}
                onChange={(e) => setExperienceForm({...experienceForm, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                required
                value={experienceForm.company}
                onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                required
                value={experienceForm.start_date}
                onChange={(e) => setExperienceForm({...experienceForm, start_date: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={experienceForm.end_date}
                onChange={(e) => setExperienceForm({...experienceForm, end_date: e.target.value})}
                disabled={experienceForm.current}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={experienceForm.current}
                  onChange={(e) => setExperienceForm({...experienceForm, current: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="current" className="text-sm">I currently work here</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              value={experienceForm.description}
              onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
              rows="3"
              className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setExperienceForm({
                    title: '',
                    company: '',
                    start_date: '',
                    end_date: '',
                    description: '',
                    current: false,
                  });
                }}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                <FiX className="inline mr-2" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2"
            >
              <FiSave className="inline mr-2" />
              {editingItem ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </form>
      );
    }

    if (activeTab === 'skills') {
      return (
        <form onSubmit={handleSkillSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Skill Name</label>
              <input
                type="text"
                required
                value={skillForm.name}
                onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Level (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skillForm.level}
                onChange={(e) => setSkillForm({...skillForm, level: e.target.value})}
                className="w-full"
              />
              <div className="text-center text-sm text-slate-400">{skillForm.level}%</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="design">Design</option>
                <option value="tools">Tools</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
              <input
                type="text"
                value={skillForm.icon}
                onChange={(e) => setSkillForm({...skillForm, icon: e.target.value})}
                className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
                maxLength="2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <input
              type="number"
              value={skillForm.order}
              onChange={(e) => setSkillForm({...skillForm, order: e.target.value})}
              className="w-full px-4 py-2 rounded-lg glass-effect border border-white/10 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setSkillForm({
                    name: '',
                    level: 80,
                    category: 'frontend',
                    icon: '💻',
                    order: 0,
                  });
                }}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                <FiX className="inline mr-2" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2"
            >
              <FiSave className="inline mr-2" />
              {editingItem ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage your portfolio content</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          {['projects', 'experiences', 'skills'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'glass-effect text-slate-300 hover:text-cyan-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-effect rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">
                {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
              </h2>
              {renderForm()}
            </div>
          </motion.div>

          {/* Table Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <span className="text-slate-400">
                  {loading ? 'Loading...' : `${activeTab === 'projects' ? projects.length : activeTab === 'experiences' ? experiences.length : skills.length} items`}
                </span>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-700/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                renderTable()
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;