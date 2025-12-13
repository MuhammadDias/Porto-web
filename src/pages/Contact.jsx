import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiInstagram, FiArrowRight } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    interest: 'ui-ux-design',
  });

  const [loading, setLoading] = useState(false);

  // Initialize EmailJS - Replace with your Public Key from EmailJS dashboard
  useEffect(() => {
    emailjs.init('YGyR9zdv-DcSfXS1f'); // Replace dengan Public Key kamu dari emailjs.com
  }, []);

  const interests = [
    { id: 'ui-ux-design', label: 'UI/UX Design' },
    { id: 'web-design', label: 'Web Design' },
    { id: 'graphic-design', label: 'Graphic Design' },
    { id: 'motion-graphics', label: 'Motion Graphics' },
    { id: 'other', label: 'Other' },
  ];

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'diasizzat222@gmail.com',
      href: 'mailto:diasizzat222@gmail.com',
    },
    {
      icon: FiPhone,
      label: 'Phone',
      value: '+62 857 048 800 50',
      href: 'tel:+6285704880050',
    },
    {
      icon: FiMapPin,
      label: 'Address',
      value: 'Sekargadung, Dukun, Gresik',
      href: '#',
    },
  ];

  const socialLinks = [
    {
      icon: FiGithub,
      label: 'GitHub',
      href: 'https://github.com',
      color: 'hover:text-white',
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      color: 'hover:text-blue-400',
    },
    {
      icon: FiInstagram,
      label: 'Instagram',
      href: 'https://instagram.com',
      color: 'hover:text-pink-400',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Template parameters untuk EmailJS
      const templateParams = {
        to_email: 'diasizzat222@gmail.com', // Email tujuan
        from_name: formData.name,
        from_email: formData.email,
        interest: formData.interest,
        message: formData.message,
      };

      // Kirim email via EmailJS
      const response = await emailjs.send(
        'service_1q84p7p', // Service ID dari EmailJS
        'template_wbn7fjs', // Template ID dari EmailJS
        templateParams
      );

      if (response.status === 200) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setFormData({
          name: '',
          email: '',
          message: '',
          interest: 'ui-ux-design',
        });
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error('Failed to send message. Please try again or contact directly.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">Have a project in mind? Let's collaborate and create something amazing together.</p>
        </motion.div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-12">
            {/* Main Message */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Let's discuss on something <span className="gradient-text">cool</span> together
              </h2>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={containerVariants} className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a key={info.label} variants={itemVariants} href={info.href} className="flex items-start gap-4 group cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div
                        className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 
                                  flex items-center justify-center"
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{info.label}</p>
                      <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{info.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="pt-6 border-t border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-4">Follow me</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-lg backdrop-blur-md bg-white/10 border border-white/20
                               hover:bg-white/20 hover:border-white/30 flex items-center justify-center
                               text-slate-300 transition-all duration-300 ${social.color}`}
                      title={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div
              className="relative backdrop-blur-md bg-white/10 hover:bg-white/15 
                         border border-white/20 hover:border-white/30 rounded-3xl p-8 md:p-10
                         transition-all duration-300"
            >
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">Let's get started</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Interest Selection */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                    <label className="text-sm font-semibold text-slate-300 mb-3 block">I'm interested in...</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interests.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              interest: option.id,
                            }))
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm
                                   ${formData.interest === option.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Name Input */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 border-slate-400 pb-3 text-white 
                               placeholder-slate-400 focus:outline-none focus:border-cyan-400
                               transition-colors text-lg"
                    />
                  </motion.div>

                  {/* Email Input */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 border-slate-400 pb-3 text-white 
                               placeholder-slate-400 focus:outline-none focus:border-cyan-400
                               transition-colors text-lg"
                    />
                  </motion.div>

                  {/* Message Input */}
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                    <textarea
                      name="message"
                      placeholder="Your message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-transparent border-b-2 border-slate-400 pb-3 text-white 
                               placeholder-slate-400 focus:outline-none focus:border-cyan-400
                               transition-colors resize-none text-lg"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    ) : (
                      <>
                        Send Message
                        <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
