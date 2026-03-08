import React, { useEffect, useState } from 'react';
import { FiCalendar, FiDownload, FiMail, FiMapPin, FiUser, FiX } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';
import { useLanguage } from '../i18n';
import DStatusLoader from '../components/DStatusLoader';
import ModalPortal from '../components/ModalPortal';

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
  const [modalOrigin, setModalOrigin] = useState({ x: 50, y: 8 });
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

  useEffect(() => {
    if (!selectedExperience) return undefined;

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
  }, [selectedExperience]);

  const handleOpenExperienceDetail = (experience, event) => {
    if (event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      setModalOrigin({
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
      });
    }
    setSelectedExperience(experience);
  };

  return (
    <div className="relative overflow-hidden pb-12 pt-8 md:pb-14 md:pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-7rem] h-80 w-80 rounded-full bg-[#ff7a00]/[0.05] blur-3xl" />
      </div>

      <div className="container relative mx-auto space-y-10 px-4 md:space-y-12 md:px-8">
        <section className="surface interactive-card overflow-hidden p-6 md:p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-slate-400">Creative Profile</p>
          <h1 className="mb-2 text-3xl font-semibold text-white md:text-4xl">{t('about.title')}</h1>
          <p className="max-w-2xl text-slate-300">{t('about.subtitle')}</p>
        </section>

        <section className="surface overflow-hidden p-0">
          <div className="grid md:grid-cols-[320px_1fr]">
            <div className="relative border-b border-white/10 md:border-b-0 md:border-r">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/70" />
              <img src="/Dayess_1.png" alt="Muhammad Dias Al Izzat" className="h-80 w-full object-cover md:h-full" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="about-hero-identity text-xs font-semibold uppercase tracking-[0.2em]">Muhammad Dias Al Izzat</p>
                <p className="about-hero-identity text-sm">{biodata.status}</p>
              </div>
            </div>

            <div className="p-5 md:p-7">
              <h2 className="mb-5 text-xl font-semibold text-white">{t('about.personalInfo')}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(biodata).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-white/15 bg-black/30 p-3">
                    <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">{t(`about.biodata.${key}`)}</p>
                    <p className="text-sm text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-slate-300 sm:grid-cols-3">
                <p className="inline-flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-white" /> Frontend
                </p>
                <p className="inline-flex items-center gap-2">
                  <FiMapPin className="h-4 w-4 text-white" /> Gresik
                </p>
                <p className="inline-flex items-center gap-2">
                  <FiCalendar className="h-4 w-4 text-white" /> Since 2021
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
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
                  
                  <h3 className="mb-3 font-medium text-white">{skill.name}</h3>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-slate-600" style={{ width: `${skill.level || 0}%` }} />
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
                  <button onClick={(event) => handleOpenExperienceDetail(exp, event)} className="interactive-link text-sm text-white">
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
        <ModalPortal>
          <div className="modal-overlay fixed inset-0 z-[1000] flex items-start justify-center bg-black/70 p-4 pt-16 md:pt-20" onClick={() => setSelectedExperience(null)}>
            <div
              className="modal-surface modal-surface-pull surface relative w-full max-w-2xl overflow-hidden"
              style={{ '--pull-origin-x': `${modalOrigin.x}%`, '--pull-origin-y': `${modalOrigin.y}%` }}
              onClick={(event) => event.stopPropagation()}
            >
              <button onClick={() => setSelectedExperience(null)} className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <FiX className="h-5 w-5" />
              </button>
              <div className="max-h-[80vh] overflow-y-auto p-6 pr-5">
                <h3 className="mb-1 text-2xl font-semibold text-white">{selectedExperience.title}</h3>
                <p className="mb-4 text-white">{selectedExperience.company}</p>
                <p className="whitespace-pre-line text-slate-300">{selectedExperience.description}</p>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
