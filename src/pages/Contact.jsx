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
    interest: 'ui-ux-design',
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await emailjs.send('service_1q84p7p', 'template_wbn7fjs', {
        to_email: 'diasizzat222@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        interest: formData.interest,
        message: formData.message,
      });

      if (response.status === 200) {
        toast.success(t('contact.success'));
        setFormData({
          name: '',
          email: '',
          message: '',
          interest: 'ui-ux-design',
        });
      }
    } catch (error) {
      toast.error(t('contact.fail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 pt-8 md:pb-14 md:pt-12">
      <div className="container mx-auto grid gap-4 px-4 md:gap-6 md:grid-cols-2 md:px-8">
        <section className="surface interactive-card p-5 md:p-8">
          <h1 className="mb-3 text-3xl font-semibold text-white md:text-4xl">{t('contact.title')}</h1>
          <p className="mb-5 text-sm text-slate-300 md:mb-6 md:text-base">{t('contact.subtitle')}</p>

          <div className="space-y-3">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} className="flex items-start gap-3 rounded-none border border-slate-800 p-3 transition-colors hover:bg-slate-900">
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
                  className="flex h-9 w-9 items-center justify-center rounded-none border border-slate-700 text-slate-300 transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:translate-x-0.5 hover:border-slate-500 hover:text-white"
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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {interests.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, interest: option.id }))}
                    className={`rounded-none border px-3 py-2 text-xs transition-colors ${formData.interest === option.id ? 'border-white bg-white text-slate-950' : 'border-slate-700 text-slate-300 hover:bg-slate-900'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

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
