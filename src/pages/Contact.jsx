import React, { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiGithub, FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { useLanguage } from '../i18n';

const contactInfo = [
  { icon: FiMail, label: 'Email', value: 'diasizzat222@gmail.com', href: 'mailto:diasizzat222@gmail.com' },
  { icon: FiPhone, label: 'Phone', value: '+62 857 048 800 50', href: 'tel:+6285704880050' },
  { icon: FiMapPin, label: 'Address', value: 'Sekargadung, Dukun, Gresik', href: '#' },
];

const socialLinks = [
  { icon: FiGithub, href: 'https://github.com/MuhammadDias', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/m-dias-9a3364278?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://www.instagram.com/userswallow_/', label: 'Instagram' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    interests: ['ui-ux-design'],
    otherInterest: '',
  });
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const interests = useMemo(
    () => [
      { id: 'ui-ux-design', label: t('contact.interests.uiux') },
      { id: 'web-design', label: t('contact.interests.web') },
      { id: 'graphic-design', label: t('contact.interests.graphic') },
      { id: 'motion-graphics', label: t('contact.interests.motion') },
      { id: 'other', label: t('contact.interests.other') },
    ],
    [t],
  );

  useEffect(() => {
    emailjs.init('YGyR9zdv-DcSfXS1f');
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interestId) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interestId);
      const nextInterests = exists ? prev.interests.filter((id) => id !== interestId) : [...prev.interests, interestId];
      const clearOtherText = exists && interestId === 'other';
      return {
        ...prev,
        interests: nextInterests,
        otherInterest: clearOtherText ? '' : prev.otherInterest,
      };
    });
  };

  const selectedInterestsText = () => {
    const labels = interests.filter((item) => formData.interests.includes(item.id)).map((item) => item.label);
    if (formData.interests.includes('other') && formData.otherInterest.trim()) {
      return [...labels.filter((label) => label !== t('contact.interests.other')), `${t('contact.interests.other')}: ${formData.otherInterest.trim()}`].join(', ');
    }
    return labels.join(', ');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.interests.length === 0) {
      toast.error(t('contact.selectInterest'));
      return;
    }

    if (formData.interests.includes('other') && !formData.otherInterest.trim()) {
      toast.error(t('contact.otherRequired'));
      return;
    }

    setLoading(true);

    try {
      const response = await emailjs.send('service_1q84p7p', 'template_wbn7fjs', {
        to_email: 'diasizzat222@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        interest: selectedInterestsText(),
        message: formData.message,
      });

      if (response.status === 200) {
        toast.success(t('contact.success'));
        setFormData({
          name: '',
          email: '',
          message: '',
          interests: ['ui-ux-design'],
          otherInterest: '',
        });
      }
    } catch (error) {
      toast.error(t('contact.fail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden pb-12 pt-8 md:pb-14 md:pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-4rem] h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-8rem] h-80 w-80 rounded-full bg-[#ff7a00]/[0.05] blur-3xl" />
      </div>

      <div className="container relative mx-auto grid gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-8">
        <section className="surface interactive-card p-5 md:p-8">
          <h1 className="mb-3 text-3xl font-semibold text-white md:text-4xl">{t('contact.title')}</h1>
          <p className="mb-5 text-sm text-slate-300 md:mb-6 md:text-base">{t('contact.subtitle')}</p>

          <div className="space-y-3">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-black/30 p-3 transition-colors hover:bg-slate-900">
                  <Icon className="mt-0.5 h-4 w-4 text-white" />
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm text-white">{item.value}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-black/30 text-slate-300 transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:translate-x-0.5 hover:border-slate-500 hover:text-white"
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </section>

        <section className="surface p-5 md:p-8">
          <h2 className="mb-4 text-xl font-semibold text-white">{t('contact.sendMessage')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">{t('contact.interest')}</label>
              <p className="mb-3 text-xs text-slate-400">{t('contact.selectMultiple')}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {interests.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleInterest(option.id)}
                    className={`contact-interest-chip rounded-xl border px-3 py-2 text-xs transition-colors ${formData.interests.includes(option.id) ? 'contact-interest-chip-active border-white bg-white text-slate-950' : 'border-slate-700 bg-black/30 text-slate-300 hover:bg-slate-900'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.interests.includes('other') && (
              <input
                type="text"
                name="otherInterest"
                placeholder={t('contact.otherPlaceholder')}
                value={formData.otherInterest}
                onChange={handleChange}
                required
                className="input-base"
              />
            )}

            <input type="text" name="name" placeholder={t('contact.yourName')} value={formData.name} onChange={handleChange} required className="input-base" />
            <input type="email" name="email" placeholder={t('contact.yourEmail')} value={formData.email} onChange={handleChange} required className="input-base" />
            <textarea name="message" placeholder={t('contact.yourMessage')} value={formData.message} onChange={handleChange} rows={6} required className="input-base resize-none" />

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? t('contact.sending') : t('contact.send')}
              {!loading && <FiArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
