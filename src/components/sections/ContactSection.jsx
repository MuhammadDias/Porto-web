import React, { useState, useEffect, useMemo } from 'react';
import { COLORS } from '../shared/SpotifyConstants';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiInstagram, FiArrowRight } from 'react-icons/fi';

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

const presetInterests = [
  { id: 'ui-ux-design', label: 'UI/UX Design' },
  { id: 'web-design', label: 'Web Design' },
  { id: 'graphic-design', label: 'Graphic Design' },
  { id: 'motion-graphics', label: 'Motion Graphics' },
  { id: 'other', label: 'Other' },
];

export default function ContactSection({ mobileView }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    interests: ['ui-ux-design'],
    otherInterest: '',
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    emailjs.init('YGyR9zdv-DcSfXS1f');
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleInterest = (interestId) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interestId);
      const nextInterests = exists ? prev.interests.filter(id => id !== interestId) : [...prev.interests, interestId];
      const clearOtherText = exists && interestId === 'other';
      return {
        ...prev,
        interests: nextInterests,
        otherInterest: clearOtherText ? '' : prev.otherInterest,
      };
    });
  };

  const selectedInterestsText = () => {
    const labels = presetInterests.filter(item => formData.interests.includes(item.id)).map(item => item.label);
    if (formData.interests.includes('other') && formData.otherInterest.trim()) {
      return [...labels.filter(label => label !== 'Other'), `Other: ${formData.otherInterest.trim()}`].join(', ');
    }
    return labels.join(', ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.interests.length === 0) {
      toast.error('Please select at least one area of interest');
      return;
    }

    if (formData.interests.includes('other') && !formData.otherInterest.trim()) {
      toast.error('Please specify your other interest');
      return;
    }

    setStatus('loading');
    try {
      const response = await emailjs.send('service_1q84p7p', 'template_wbn7fjs', {
        to_email: 'diasizzat222@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        interest: selectedInterestsText(),
        message: formData.message,
      });

      if (response.status === 200) {
        setStatus('success');
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '', interests: ['ui-ux-design'], otherInterest: '' });
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Failed to send message.');
    } finally {
      if(status === 'loading') {
          // just to clear loading if success hasn't overridden
          setStatus('idle');
      }
    }
  };

  return (
    <div style={{ marginBottom: "80px", paddingTop: "64px" }} id="contact">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
          gap: "12px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "22px",
            color: COLORS.white,
            letterSpacing: "-0.02em",
          }}
        >
          Let's Connect
        </h2>
      </div>

      <div
        style={{
          background: COLORS.bgCard,
          borderRadius: "16px",
          padding: mobileView ? "24px" : "40px",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: mobileView ? "1fr" : "1fr 1fr", gap: "32px", alignItems: "start" }}>

          {/* Contact Details Side */}
          <div>
            <p style={{ fontSize: "14px", color: COLORS.muted, marginBottom: "24px", lineHeight: "1.6" }}>
              I'm always open to discussing product design work or partnership opportunities. Let's make something amazing together!
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} style={{
                    display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)",
                    padding: "16px", borderRadius: "12px", textDecoration: "none", border: `1px solid rgba(255,255,255,0.05)`,
                    transition: "transform 0.2s, background 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ background: COLORS.bgCard, padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon style={{ color: COLORS.white, width: "16px", height: "16px" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "11px", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{item.label}</p>
                      <p style={{ fontSize: "14px", color: COLORS.white, fontWeight: 500 }}>{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <p style={{ fontSize: "12px", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Follow Me</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                    width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "50%", background: COLORS.bgSecondary, color: COLORS.muted, border: `1px solid ${COLORS.border}`,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = COLORS.white; e.currentTarget.style.borderColor = COLORS.white; e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = COLORS.muted; e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <Icon style={{ width: "18px", height: "18px" }} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Form Side */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", color: COLORS.muted, fontWeight: 600 }}>I'm interested in...</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {presetInterests.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleInterest(option.id)}
                    style={{
                      background: formData.interests.includes(option.id) ? COLORS.accent : COLORS.bgSecondary,
                      color: formData.interests.includes(option.id) ? COLORS.bg : COLORS.muted,
                      border: `1px solid ${formData.interests.includes(option.id) ? COLORS.accent : COLORS.border}`,
                      padding: "8px 16px", borderRadius: "16px", fontSize: "12px", fontFamily: "'Sora', sans-serif",
                      fontWeight: formData.interests.includes(option.id) ? 700 : 500, cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.interests.includes('other') && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input
                  type="text" name="otherInterest" value={formData.otherInterest} onChange={handleChange} required
                  style={{
                    background: COLORS.bgSecondary, border: `1px solid ${COLORS.border}`, padding: "12px 16px", borderRadius: "8px", 
                    color: COLORS.white, fontFamily: "'Sora', sans-serif", fontSize: "14px", outline: "none"
                  }} placeholder="Please specify your interest"
                />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", color: COLORS.muted, fontWeight: 600 }}>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                style={{
                  background: COLORS.bgSecondary, border: `1px solid ${COLORS.border}`, padding: "12px 16px", borderRadius: "8px", 
                  color: COLORS.white, fontFamily: "'Sora', sans-serif", fontSize: "14px", outline: "none"
                }} placeholder="John Doe"
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", color: COLORS.muted, fontWeight: 600 }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                style={{
                  background: COLORS.bgSecondary, border: `1px solid ${COLORS.border}`, padding: "12px 16px", borderRadius: "8px", 
                  color: COLORS.white, fontFamily: "'Sora', sans-serif", fontSize: "14px", outline: "none"
                }} placeholder="john@example.com"
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", color: COLORS.muted, fontWeight: 600 }}>Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                style={{
                  background: COLORS.bgSecondary, border: `1px solid ${COLORS.border}`, padding: "12px 16px", borderRadius: "8px", 
                  color: COLORS.white, fontFamily: "'Sora', sans-serif", fontSize: "14px", outline: "none", resize: "vertical"
                }} placeholder="Hi there..."
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="submit" disabled={status === 'loading'}
                style={{
                  background: COLORS.accent, color: COLORS.bg, border: "none", padding: "12px 32px",
                  borderRadius: "24px", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "14px",
                  cursor: status === 'loading' ? 'wait' : 'pointer', transition: "background 0.2s",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  opacity: status === 'loading' ? 0.7 : 1, width: mobileView ? "100%" : "auto", justifyContent: "center"
                }}
                onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.background = COLORS.accentHover; }}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.accent}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
                {!status && <FiArrowRight />}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
