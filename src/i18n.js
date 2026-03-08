import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'porto-web-language';

const messages = {
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      projects: 'Proyek',
      contact: 'Kontak',
      dashboard: 'Dashboard',
      logout: 'Keluar',
    },
    common: {
      seeAll: 'Lihat semua',
      loading: 'Memuat...',
      loadingContent: 'Memuat konten',
      present: 'Sekarang',
      uncategorized: 'Tanpa Kategori',
      noData: 'Belum ada data.',
      copyright: 'Hak cipta dilindungi.',
      backHome: 'Kembali ke Beranda',
    },
    home: {
      availability: 'Tersedia untuk kerja freelance',
      headline: 'Saya Dias',
      role: 'Creative Developer',
      description: 'UI/UX Designer dan Frontend Developer yang fokus membangun produk digital bersih dengan visual yang kuat.',
      viewProjects: 'Lihat Proyek',
      contactMe: 'Hubungi Saya',
      coreSkills: 'Keahlian Utama',
      coreSkillsSub: 'Teknologi yang sering saya gunakan',
      recentProjects: 'Proyek Terbaru',
      recentProjectsSub: 'Karya terbaru dari portofolio',
      viewDetail: 'Lihat detail',
      ribbon: 'Desain Grafis . Desain UI/UX . Motion . Front End Developer . ',
    },
    about: {
      title: 'Tentang Saya',
      subtitle: 'Saya fokus membangun sistem desain yang praktis dan implementasi frontend yang rapi.',
      personalInfo: 'Info Pribadi',
      contact: 'Kontak',
      downloadCv: 'Unduh CV',
      skills: 'Keahlian',
      loadingSkills: 'Memuat keahlian...',
      noSkills: 'Belum ada keahlian.',
      experience: 'Pengalaman',
      loadingExp: 'Memuat pengalaman...',
      noExp: 'Belum ada pengalaman.',
      viewDetail: 'Lihat detail',
      failLoad: 'Gagal memuat data halaman tentang.',
      biodata: {
        name: 'Nama',
        birthplace: 'Tempat Lahir',
        birthdate: 'Tanggal Lahir',
        status: 'Status',
        address: 'Alamat',
      },
    },
    contact: {
      title: 'Kontak',
      subtitle: 'Ceritakan proyek atau ide kolaborasi Anda.',
      sendMessage: 'Kirim Pesan',
      interest: 'Minat',
      selectMultiple: 'Pilih satu atau lebih minat.',
      selectInterest: 'Pilih minimal satu minat.',
      otherPlaceholder: 'Jelaskan minat lainnya',
      otherRequired: 'Isi detail untuk pilihan lainnya.',
      yourName: 'Nama Anda',
      yourEmail: 'Email Anda',
      yourMessage: 'Pesan Anda',
      sending: 'Mengirim...',
      send: 'Kirim Pesan',
      success: 'Pesan berhasil dikirim',
      fail: 'Gagal mengirim pesan',
      interests: {
        uiux: 'Desain UI/UX',
        web: 'Desain Web',
        graphic: 'Desain Grafis',
        motion: 'Motion Graphics',
        other: 'Lainnya',
      },
    },
    projects: {
      selectedWork: 'Karya Pilihan',
      title: 'Portofolio',
      designing: 'Desain',
      development: 'Development',
      marketing: 'Digital Marketing',
      all: 'Semua',
      loading: 'Memuat proyek...',
      noProjects: 'Tidak ada proyek ditemukan.',
      knowMore: 'Selengkapnya',
      live: 'Live',
      code: 'Code',
      viewLiveProject: 'Lihat Proyek Live',
      viewCode: 'Lihat Kode',
    },
    projectCategory: {
      back: 'Kembali ke Proyek',
      loading: 'Memuat proyek...',
      noProjects: 'Belum ada proyek di kategori ini.',
      visit: 'Kunjungi Proyek',
      projectsCount: 'proyek',
    },
    status: {
      offlineTitle: 'Koneksi Offline',
      offlineMessage: 'Internet tidak tersedia. Coba cek koneksi lalu muat ulang halaman.',
      notFoundTitle: 'Halaman Tidak Ditemukan',
      notFoundMessage: 'Halaman yang Anda cari tidak tersedia atau sudah dipindah.',
      methodTitle: 'Metode Tidak Diizinkan',
      methodMessage: 'Permintaan tidak dapat diproses karena metode tidak diizinkan.',
      serverTitle: 'Gangguan Server',
      serverMessage: 'Sedang terjadi gangguan pada layanan. Coba beberapa saat lagi.',
      retry: 'Coba Lagi',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      contact: 'Contact',
      dashboard: 'Dashboard',
      logout: 'Logout',
    },
    common: {
      seeAll: 'See all',
      loading: 'Loading...',
      loadingContent: 'Loading content',
      present: 'Present',
      uncategorized: 'Uncategorized',
      noData: 'No data yet.',
      copyright: 'All rights reserved.',
      backHome: 'Back to Home',
    },
    home: {
      availability: 'Available for freelance work',
      headline: "I'm Dias",
      role: 'Creative Developer',
      description: 'UI/UX Designer and Frontend Developer focused on building clean digital products with strong visual direction.',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
      coreSkills: 'Core Skills',
      coreSkillsSub: 'Technologies I use regularly',
      recentProjects: 'Recent Projects',
      recentProjectsSub: 'Latest work from the portfolio',
      viewDetail: 'View detail',
      ribbon: 'Graphic Design . UI/UX Design . Motion . Front End Developer . ',
    },
    about: {
      title: 'About Me',
      subtitle: 'I focus on building practical design systems and clean frontend implementation.',
      personalInfo: 'Personal Info',
      contact: 'Contact',
      downloadCv: 'Download CV',
      skills: 'Skills',
      loadingSkills: 'Loading skills...',
      noSkills: 'No skills added yet.',
      experience: 'Experience',
      loadingExp: 'Loading experiences...',
      noExp: 'No experiences added yet.',
      viewDetail: 'View detail',
      failLoad: 'Failed to load about data',
      biodata: {
        name: 'Name',
        birthplace: 'Birthplace',
        birthdate: 'Birthdate',
        status: 'Status',
        address: 'Address',
      },
    },
    contact: {
      title: 'Contact',
      subtitle: 'Tell me about your project or collaboration idea.',
      sendMessage: 'Send Message',
      interest: 'Interest',
      selectMultiple: 'Select one or more interests.',
      selectInterest: 'Please select at least one interest.',
      otherPlaceholder: 'Describe your other interest',
      otherRequired: 'Please fill in the other interest detail.',
      yourName: 'Your name',
      yourEmail: 'Your email',
      yourMessage: 'Your message',
      sending: 'Sending...',
      send: 'Send Message',
      success: 'Message sent successfully',
      fail: 'Failed to send message',
      interests: {
        uiux: 'UI/UX Design',
        web: 'Web Design',
        graphic: 'Graphic Design',
        motion: 'Motion Graphics',
        other: 'Other',
      },
    },
    projects: {
      selectedWork: 'Selected Work',
      title: 'Portfolio',
      designing: 'Designing',
      development: 'Development',
      marketing: 'Digital Marketing',
      all: 'All',
      loading: 'Loading projects...',
      noProjects: 'No projects found.',
      knowMore: 'Know More',
      live: 'Live',
      code: 'Code',
      viewLiveProject: 'View Live Project',
      viewCode: 'View Code',
    },
    projectCategory: {
      back: 'Back to Projects',
      loading: 'Loading projects...',
      noProjects: 'No projects in this category yet.',
      visit: 'Visit Project',
      projectsCount: 'project(s)',
    },
    status: {
      offlineTitle: 'You Are Offline',
      offlineMessage: 'Internet connection is unavailable. Please check your network and try again.',
      notFoundTitle: 'Page Not Found',
      notFoundMessage: 'The page you requested is unavailable or has been moved.',
      methodTitle: 'Method Not Allowed',
      methodMessage: 'The request cannot be processed because the method is not allowed.',
      serverTitle: 'Server Trouble',
      serverMessage: 'The service is currently having trouble. Please try again shortly.',
      retry: 'Retry',
    },
  },
};

const getByPath = (obj, path) => path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('id');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'id' || stored === 'en') setLang(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, fallback = '') => getByPath(messages[lang], key) ?? fallback,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
