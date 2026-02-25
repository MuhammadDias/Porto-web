import React, { useEffect, useState } from 'react';
import { FiEdit, FiLogOut, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';

const defaultProjectForm = {
  title: '',
  category: 'web-design',
  description: '',
  image_url: '',
  project_url: '',
  code: '',
  tags: '',
};

const defaultExperienceForm = {
  title: '',
  company: '',
  start_date: '',
  end_date: '',
  description: '',
  current: false,
};

const defaultSkillForm = {
  name: '',
  level: 80,
  category: 'frontend',
  icon: '*',
  order: 0,
};

const parseTagsToText = (tags) => {
  if (!tags) return '';
  if (Array.isArray(tags)) return tags.join(', ');
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.join(', ');
      return tags;
    } catch (error) {
      return tags;
    }
  }
  return '';
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [experienceForm, setExperienceForm] = useState(defaultExperienceForm);
  const [skillForm, setSkillForm] = useState(defaultSkillForm);

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
      } else {
        const { data } = await supabase.from('skills').select('*').order('order', { ascending: true });
        setSkills(data || []);
      }
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const projectData = {
        ...projectForm,
        image_url: projectForm.image_url || null,
        project_url: projectForm.project_url || null,
        code: projectForm.code || null,
        tags: JSON.stringify(projectForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean)),
        created_at: editingItem ? undefined : new Date().toISOString(),
      };

      if (editingItem) {
        const { error } = await supabase.from('projects').update(projectData).eq('id', editingItem);
        if (error) throw error;
        toast.success('Project updated');
      } else {
        const { error } = await supabase.from('projects').insert([projectData]);
        if (error) throw error;
        toast.success('Project added');
      }

      setProjectForm(defaultProjectForm);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...experienceForm,
        end_date: experienceForm.current ? null : experienceForm.end_date || null,
      };

      if (editingItem) {
        const { error } = await supabase.from('experiences').update(payload).eq('id', editingItem);
        if (error) throw error;
        toast.success('Experience updated');
      } else {
        const { error } = await supabase.from('experiences').insert([payload]);
        if (error) throw error;
        toast.success('Experience added');
      }

      setExperienceForm(defaultExperienceForm);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        const { error } = await supabase.from('skills').update(skillForm).eq('id', editingItem);
        if (error) throw error;
        toast.success('Skill updated');
      } else {
        const { error } = await supabase.from('skills').insert([skillForm]);
        if (error) throw error;
        toast.success('Skill added');
      }

      setSkillForm(defaultSkillForm);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Item deleted');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const resetCurrentForm = () => {
    setEditingItem(null);
    if (activeTab === 'projects') setProjectForm(defaultProjectForm);
    if (activeTab === 'experiences') setExperienceForm(defaultExperienceForm);
    if (activeTab === 'skills') setSkillForm(defaultSkillForm);
  };

  const count = activeTab === 'projects' ? projects.length : activeTab === 'experiences' ? experiences.length : skills.length;

  return (
    <div className="pb-10 pt-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage portfolio content</p>
          </div>
          <button onClick={handleLogout} className="btn-outline text-red-400 hover:border-red-400 hover:text-red-300">
            <FiLogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['projects', 'experiences', 'skills'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setEditingItem(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === tab ? 'bg-white text-slate-950' : 'border border-slate-700 text-slate-300 hover:bg-slate-900'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="surface p-6 lg:col-span-1">
            <h2 className="mb-4 text-lg font-semibold text-white">{editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}</h2>

            {activeTab === 'projects' && (
              <form onSubmit={handleProjectSubmit} className="space-y-3">
                <input type="text" required value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} placeholder="Title" className="input-base" />
                <select value={projectForm.category} onChange={(event) => setProjectForm({ ...projectForm, category: event.target.value })} className="input-base">
                  <option value="web-design">Web Design</option>
                  <option value="graphic-design">Graphic Design</option>
                  <option value="motion-graphic">Motion Graphic</option>
                  <option value="videography">Videography</option>
                </select>
                <textarea required rows="3" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} placeholder="Description" className="input-base resize-none" />
                <input type="url" value={projectForm.image_url || ''} onChange={(event) => setProjectForm({ ...projectForm, image_url: event.target.value })} placeholder="Image URL" className="input-base" />
                <input type="url" value={projectForm.project_url || ''} onChange={(event) => setProjectForm({ ...projectForm, project_url: event.target.value })} placeholder="Project URL" className="input-base" />
                <input type="url" value={projectForm.code || ''} onChange={(event) => setProjectForm({ ...projectForm, code: event.target.value })} placeholder="Repository URL" className="input-base" />
                <input type="text" value={projectForm.tags} onChange={(event) => setProjectForm({ ...projectForm, tags: event.target.value })} placeholder="Tags (comma separated)" className="input-base" />
                <div className="flex gap-2 pt-2">
                  {editingItem && (
                    <button type="button" onClick={resetCurrentForm} className="btn-outline flex-1">
                      <FiX className="h-4 w-4" /> Cancel
                    </button>
                  )}
                  <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                    <FiSave className="h-4 w-4" /> {editingItem ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'experiences' && (
              <form onSubmit={handleExperienceSubmit} className="space-y-3">
                <input type="text" required value={experienceForm.title} onChange={(event) => setExperienceForm({ ...experienceForm, title: event.target.value })} placeholder="Title" className="input-base" />
                <input type="text" required value={experienceForm.company} onChange={(event) => setExperienceForm({ ...experienceForm, company: event.target.value })} placeholder="Company" className="input-base" />
                <input type="date" required value={experienceForm.start_date} onChange={(event) => setExperienceForm({ ...experienceForm, start_date: event.target.value })} className="input-base" />
                <input type="date" value={experienceForm.end_date} onChange={(event) => setExperienceForm({ ...experienceForm, end_date: event.target.value })} disabled={experienceForm.current} className="input-base disabled:opacity-60" />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={experienceForm.current}
                    onChange={(event) => setExperienceForm({ ...experienceForm, current: event.target.checked, end_date: event.target.checked ? '' : experienceForm.end_date })}
                  />
                  I currently work here
                </label>
                <textarea required rows="3" value={experienceForm.description} onChange={(event) => setExperienceForm({ ...experienceForm, description: event.target.value })} placeholder="Description" className="input-base resize-none" />
                <div className="flex gap-2 pt-2">
                  {editingItem && (
                    <button type="button" onClick={resetCurrentForm} className="btn-outline flex-1">
                      <FiX className="h-4 w-4" /> Cancel
                    </button>
                  )}
                  <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                    <FiSave className="h-4 w-4" /> {editingItem ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'skills' && (
              <form onSubmit={handleSkillSubmit} className="space-y-3">
                <input type="text" required value={skillForm.name} onChange={(event) => setSkillForm({ ...skillForm, name: event.target.value })} placeholder="Skill name" className="input-base" />
                <div>
                  <input type="range" min="0" max="100" value={skillForm.level} onChange={(event) => setSkillForm({ ...skillForm, level: Number(event.target.value) })} className="w-full" />
                  <p className="text-xs text-slate-400">{skillForm.level}%</p>
                </div>
                <select value={skillForm.category} onChange={(event) => setSkillForm({ ...skillForm, category: event.target.value })} className="input-base">
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="design">Design</option>
                  <option value="tools">Tools</option>
                </select>
                <input type="text" value={skillForm.icon} onChange={(event) => setSkillForm({ ...skillForm, icon: event.target.value })} placeholder="Icon" className="input-base" maxLength="2" />
                <input type="number" value={skillForm.order} onChange={(event) => setSkillForm({ ...skillForm, order: Number(event.target.value) })} placeholder="Display order" className="input-base" />
                <div className="flex gap-2 pt-2">
                  {editingItem && (
                    <button type="button" onClick={resetCurrentForm} className="btn-outline flex-1">
                      <FiX className="h-4 w-4" /> Cancel
                    </button>
                  )}
                  <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                    <FiSave className="h-4 w-4" /> {editingItem ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </section>

          <section className="surface p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">All {activeTab}</h2>
              <p className="text-sm text-slate-400">{loading ? 'Loading...' : `${count} items`}</p>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-10 animate-pulse rounded-lg bg-slate-800" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      {activeTab === 'projects' && (
                        <>
                          <th className="px-2 py-3">Title</th>
                          <th className="px-2 py-3">Category</th>
                          <th className="px-2 py-3">Date</th>
                        </>
                      )}
                      {activeTab === 'experiences' && (
                        <>
                          <th className="px-2 py-3">Title</th>
                          <th className="px-2 py-3">Company</th>
                          <th className="px-2 py-3">Period</th>
                        </>
                      )}
                      {activeTab === 'skills' && (
                        <>
                          <th className="px-2 py-3">Skill</th>
                          <th className="px-2 py-3">Level</th>
                          <th className="px-2 py-3">Category</th>
                        </>
                      )}
                      <th className="px-2 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === 'projects' &&
                      projects.map((project) => (
                        <tr key={project.id} className="border-b border-slate-800/70">
                          <td className="px-2 py-3 text-white">{project.title}</td>
                          <td className="px-2 py-3 text-slate-300">{project.category}</td>
                          <td className="px-2 py-3 text-slate-400">{new Date(project.created_at).toLocaleDateString()}</td>
                          <td className="px-2 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setProjectForm({
                                    ...project,
                                    tags: parseTagsToText(project.tags),
                                  });
                                  setEditingItem(project.id);
                                }}
                                className="rounded-md border border-slate-700 p-2 text-slate-300 hover:bg-slate-800"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete('projects', project.id)} className="rounded-md border border-red-900/60 p-2 text-red-400 hover:bg-red-950/40">
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {activeTab === 'experiences' &&
                      experiences.map((exp) => (
                        <tr key={exp.id} className="border-b border-slate-800/70">
                          <td className="px-2 py-3 text-white">{exp.title}</td>
                          <td className="px-2 py-3 text-slate-300">{exp.company}</td>
                          <td className="px-2 py-3 text-slate-400">
                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date || '-'}
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setExperienceForm({
                                    ...defaultExperienceForm,
                                    ...exp,
                                    end_date: exp.end_date || '',
                                  });
                                  setEditingItem(exp.id);
                                }}
                                className="rounded-md border border-slate-700 p-2 text-slate-300 hover:bg-slate-800"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete('experiences', exp.id)} className="rounded-md border border-red-900/60 p-2 text-red-400 hover:bg-red-950/40">
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {activeTab === 'skills' &&
                      skills.map((skill) => (
                        <tr key={skill.id} className="border-b border-slate-800/70">
                          <td className="px-2 py-3 text-white">
                            <span className="mr-2">{skill.icon}</span>
                            {skill.name}
                          </td>
                          <td className="px-2 py-3 text-slate-300">{skill.level}%</td>
                          <td className="px-2 py-3 text-slate-400">{skill.category}</td>
                          <td className="px-2 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSkillForm(skill);
                                  setEditingItem(skill.id);
                                }}
                                className="rounded-md border border-slate-700 p-2 text-slate-300 hover:bg-slate-800"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete('skills', skill.id)} className="rounded-md border border-red-900/60 p-2 text-red-400 hover:bg-red-950/40">
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

