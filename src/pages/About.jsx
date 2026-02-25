import React, { useEffect, useState } from 'react';
import { FiDownload, FiMail, FiX } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';
import { useLanguage } from '../i18n';
import DStatusLoader from '../components/DStatusLoader';

const biodata = {
  name: 'Muhammad Dias Al Izzat',
  birthplace: 'Gresik',
  birthdate: '27 August 2005',
  status: 'Student',
  address: 'Sekargadung, Dukun, Gresik',
};

export default function About() {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: expData, error: expError }, { data: skillData, error: skillError }] = await Promise.all([
          supabase.from('experiences').select('*').order('start_date', { ascending: false }),
          supabase.from('skills').select('*').order('order', { ascending: true }),
        ]);

        if (expError) throw expError;
        if (skillError) throw skillError;

        setExperiences(expData || []);
        setSkills(skillData || []);
      } catch (error) {
        toast.error(t('about.failLoad'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  return (
    <div className="pb-12 pt-8 md:pb-14 md:pt-12">
      <div className="container mx-auto space-y-10 px-4 md:space-y-12 md:px-8">
        <section className="surface interactive-card p-6 md:p-8">
          <h1 className="mb-2 text-3xl font-semibold text-white md:text-4xl">{t('about.title')}</h1>
          <p className="max-w-2xl text-slate-300">{t('about.subtitle')}</p>
        </section>

        <section className="surface p-5 md:p-6">
          <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-start">
            <div className="mx-auto w-full max-w-[280px] overflow-hidden border-2 border-white/40">
              <img src="/Dayess_1.png" alt="Muhammad Dias Al Izzat" className="h-72 w-full object-cover" />
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">{t('about.personalInfo')}</h2>
              <div className="space-y-3">
                {Object.entries(biodata).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-slate-800 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t(`about.biodata.${key}`)}</p>
                    <p className="text-sm text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="mailto:diasizzat222@gmail.com" className="btn-primary">
                  <FiMail className="h-4 w-4" /> {t('about.contact')}
                </a>
                <a href="/CV DPR Fest.jpg" download="CV_Muhammad_Dias.jpg" className="btn-outline">
                  <FiDownload className="h-4 w-4" /> {t('about.downloadCv')}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">{t('about.skills')}</h2>
          {loading ? (
            <div className="surface p-6">
              <DStatusLoader label={t('about.loadingSkills')} />
            </div>
          ) : skills.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((skill) => (
                <div key={skill.id} className="surface interactive-card p-5">
                  <p className="mb-1 text-sm text-slate-400">{skill.category || 'General'}</p>
                  <h3 className="mb-3 font-medium text-white">{skill.name}</h3>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-white" style={{ width: `${skill.level || 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="surface p-6 text-sm text-slate-400">{t('about.noSkills')}</div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">{t('about.experience')}</h2>
          {loading ? (
            <div className="surface p-6">
              <DStatusLoader label={t('about.loadingExp')} />
            </div>
          ) : experiences.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {experiences.map((exp) => (
                <article key={exp.id} className="surface interactive-card p-5">
                  <p className="mb-1 text-xs text-white">
                    {new Date(exp.start_date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'short' })}
                    {exp.end_date ? ` - ${new Date(exp.end_date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'short' })}` : ` - ${t('common.present')}`}
                  </p>
                  <h3 className="text-lg font-medium text-white">{exp.title}</h3>
                  <p className="mb-3 text-sm text-slate-300">{exp.company}</p>
                  <p className="mb-4 line-clamp-3 text-sm text-slate-400">{exp.description}</p>
                  <button onClick={() => setSelectedExperience(exp)} className="interactive-link text-sm text-white">
                    {t('about.viewDetail')}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface p-6 text-sm text-slate-400">{t('about.noExp')}</div>
          )}
        </section>
      </div>

      {selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedExperience(null)}>
          <div className="surface relative w-full max-w-2xl p-6" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setSelectedExperience(null)} className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
              <FiX className="h-5 w-5" />
            </button>
            <h3 className="mb-1 text-2xl font-semibold text-white">{selectedExperience.title}</h3>
            <p className="mb-4 text-white">{selectedExperience.company}</p>
            <p className="text-slate-300">{selectedExperience.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
