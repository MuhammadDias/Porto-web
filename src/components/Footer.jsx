import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import { useLanguage } from '../i18n';

const socials = [
  { icon: FiGithub, href: 'https://github.com/MuhammadDias', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/m-dias-9a3364278?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://www.instagram.com/userswallow_/', label: 'Instagram' },
  { icon: FiMail, href: 'mailto:diasizzat222@gmail.com', label: 'Email' },
];

const Footer = () => {
  const { t } = useLanguage();
  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <footer className="border-t border-white/20 bg-black shadow-[0_0_20px_rgba(255,255,255,0.06)]">
      <div className="container mx-auto px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-zinc-400">Muhammad Dias Al Izzat</p>
          <div className="flex flex-wrap items-center gap-4">
            {links.map((item) => (
              <Link key={item.name} to={item.path} className="text-sm text-zinc-400 transition-colors hover:text-white">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          {socials.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 text-zinc-300 shadow-[0_0_8px_rgba(255,255,255,0.08)] transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:translate-x-0.5 hover:border-white/50 hover:text-white hover:shadow-[0_0_16px_rgba(255,255,255,0.2)]"
                aria-label={item.label}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        <p className="text-xs text-zinc-500">Copyright {new Date().getFullYear()} {t('common.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
