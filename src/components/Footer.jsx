import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/MuhammadDias', label: 'GitHub' },
    { icon: FiLinkedin, href: 'https://www.linkedin.com/in/m-dias-9a3364278?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiMail, href: 'diasizzat222@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gradient-to-b from-dark-900 to-black border-t border-white/10">
      <div className="container mx-auto px-4 md:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-bold mb-4 gradient-text">Portfolio</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Creative designer & developer crafting beautiful digital experiences</p>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400 text-sm">Graphic Design</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm">Web Design</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm">Motion Graphics</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm">Videography</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm">Frontend</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:diasizzat222@gmail.com" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  diasizzat222@gmail.com
                </a>
              </li>
              <li>
                <span className="text-slate-400 text-sm">Gresik, Indonesia</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center gap-6 mb-12 py-8 border-y border-white/10">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20
                         hover:bg-cyan-500/20 hover:border-cyan-500/50 flex items-center justify-center
                         transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-slate-300 hover:text-cyan-400 transition-colors" />
              </a>
            );
          })}
        </motion.div>

        {/* Bottom Footer */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center space-y-3 text-sm text-slate-400">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <p>© {currentYear} Muhammad Dias Al Izzat. All rights reserved.</p>
            <span className="hidden md:inline">•</span>
            <p>
              Developed by <span className="text-cyan-400 font-semibold">Muhammad Dias Al Izzat</span>
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </a>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Terms of Service
            </a>
            <span className="hidden md:inline">•</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              License
            </a>
          </div>
          <p className="text-xs text-slate-500 pt-4">Built with React, Tailwind CSS</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
