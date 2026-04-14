import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { getSavedProjects } from '../supabase/api';
import { GlowProjectCard } from '../components/GlowProjectCard';
import { useLanguage } from '../i18n';
import toast from 'react-hot-toast';
import { FiBookmark } from 'react-icons/fi';

const SavedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        const data = await getSavedProjects(user.id);
        setProjects(data);
      } catch (error) {
        toast.error('Failed to fetch saved projects');
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="animate-pulse text-slate-400">Loading saved projects...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 pb-20 pt-32 md:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white">
          <FiBookmark className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-white">Saved Projects</h1>
        <p className="mt-2 text-slate-400">Your bookmarked inspirations and favorites.</p>
      </div>

      {projects.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center p-20 text-center">
          <p className="text-slate-400">You haven't bookmarked any projects yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <GlowProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProjects;
