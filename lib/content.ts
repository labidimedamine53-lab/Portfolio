export type Locale = "en" | "it";

const projectImages = {
  mtk: "/projects/mtk.png",
  nike: "/projects/nike.png",
  prediction: "/projects/prediction.png",
  tecnocoperture: "/projects/tecnocoperture.png",
} as const;

const certificationFiles = {
  aws: {
    href: "/certifications/aws.pdf",
    filename: "aws-certificate.pdf",
    preview: "/certifications/aws.jpg",
  },
  google: {
    href: "/certifications/google.pdf",
    filename: "google-certificate.pdf",
    preview: "/certifications/google.jpg",
  },
  ielts: {
    href: "/certifications/ielts.pdf",
    filename: "ielts-certificate.pdf",
    preview: "/certifications/ielts.png",
  },
  laurea: {
    href: "/certifications/laurea-triannale.pdf",
    filename: "laurea-triannale.pdf",
    preview: "/certifications/laurea-triannale.jpg",
  },
  tcf: {
    href: "/certifications/tcf.pdf",
    filename: "tcf-certificate.pdf",
    preview: "/certifications/tcf.png",
  },
} as const;

type NavLink = {
  label: string;
  href: string;
};

type AboutHighlight = {
  title: string;
  body: string;
};

type Project = {
  title: string;
  description: string;
  tech: string[];
  accent: string;
  image: string;
  imageAlt: string;
  liveUrl?: string;
};

type Certification = {
  title: string;
  issuer: string;
  description: string;
  href?: string;
  filename?: string;
  preview?: string;
  imageAlt?: string;
};

type TimelineItem = {
  period: string;
  title: string;
  body: string;
};

type Social = {
  label: string;
  href: string;
};

type SiteContent = {
  navLinks: NavLink[];
  language: {
    ariaLabel: string;
    english: string;
    italian: string;
  };
  navbar: {
    cv: string;
    contact: string;
    downloadCv: string;
  };
  hero: {
    eyebrow: string;
    headingIntro: string;
    headingRoles: string[];
    headingArticles: string[];
    subtitle: string;
    viewProjects: string;
    downloadCv: string;
    contactMe: string;
    explore: string;
    portraitAlt: string;
    stats: Array<[string, string]>;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    role: string;
    profileText: string;
    tags: string[];
    highlights: AboutHighlight[];
  };
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    projectLabel: string;
    preview: string;
    details: string;
    items: Project[];
  };
  certifications: {
    eyebrow: string;
    title: string;
    description: string;
    download: string;
    pending: string;
    pdf: string;
    items: Certification[];
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    timeline: TimelineItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    cardTitle: string;
    cardBody: string;
    downloadCv: string;
    pdf: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    send: string;
    status: string;
  };
  footer: {
    builtWith: string;
  };
};

export const cvDownload = {
  href: "/cv/Mohamed-Amine-Abidi-CV.pdf",
  filename: "Mohamed-Amine-Abidi-CV.pdf",
};

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/labidimedamine53-lab" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohamed-amine-abidi-0a981b258",
  },
  { label: "Email", href: "mailto:labidimedamine53@gmail.com" },
];

export const translations: Record<Locale, SiteContent> = {
  en: {
    navLinks: [
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Certifications", href: "#certifications" },
      { label: "Contact", href: "#contact" },
    ],
    language: {
      ariaLabel: "Switch language",
      english: "English",
      italian: "Italiano",
    },
    navbar: {
      cv: "CV",
      contact: "Contact",
      downloadCv: "Download CV",
    },
    hero: {
      eyebrow: "Building clean digital systems",
      headingIntro: "Hi, I'm Amine,",
      headingRoles: [
        "Full-Stack Developer",
        "AI Enthusiast",
        "Electronic Engineering Student",
      ],
      headingArticles: ["a", "an", "an"],
      subtitle:
        "I build modern web apps, AI projects, and digital experiences with a focus on performance, strong interfaces, and useful technology.",
      viewProjects: "View Projects",
      downloadCv: "Download CV",
      contactMe: "Contact Me",
      explore: "Explore",
      portraitAlt: "Portrait of Amine",
      stats: [
        ["Web", "React, Next.js, PHP"],
        ["AI", "ML tools and automation"],
        ["IoT", "Connected system thinking"],
      ],
    },
    about: {
      eyebrow: "About",
      title: "Developer mindset with engineering depth.",
      description:
        "I enjoy turning complex ideas into interfaces that feel fast, clear, and useful.",
      role: "Full-Stack Developer",
      profileText:
        "I work across web development, AI, IoT, and machine learning, combining practical frontend craft with backend foundations in PHP, MySQL, and Python.",
      tags: ["React", "Next.js", "AI", "IoT", "PHP", "MySQL"],
      highlights: [
        {
          title: "Modern web apps",
          body: "Responsive interfaces built with React, Next.js, Tailwind CSS, PHP, and MySQL.",
        },
        {
          title: "AI and ML projects",
          body: "Applied experiments around estimation tools, machine learning workflows, and intelligent products.",
        },
        {
          title: "Connected systems",
          body: "Electronic engineering studies focused on AI, IoT systems, embedded thinking, and data-driven automation.",
        },
      ],
    },
    skills: {
      eyebrow: "Skills",
      title: "A compact stack for building from idea to interface.",
      description:
        "Frontend tools, backend fundamentals, AI experiments, and connected-system thinking in one workflow.",
      items: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "PHP",
        "MySQL",
        "Python",
        "AI",
        "Machine Learning",
        "IoT",
        "Git",
        "GitHub",
      ],
    },
    projects: {
      eyebrow: "Projects",
      title: "Selected builds with practical product thinking.",
      description:
        "A mix of business websites, frontend UI practice, database-backed PHP work, and AI-powered estimation.",
      projectLabel: "Project",
      preview: "Preview",
      details: "Details",
      items: [
        {
          title: "Tecnocoperture",
          description:
            "Company website for roofing, renovation, asbestos removal, and energy-efficiency services with a clean service-first structure.",
          tech: ["Web Design", "Frontend", "Responsive UI"],
          accent: "from-cyan-400 via-blue-500 to-violet-500",
          image: projectImages.tecnocoperture,
          imageAlt: "Tecnocoperture website project screenshot",
          liveUrl: "https://tecnocoperture.netlify.app/",
        },
        {
          title: "MTK Website",
          description:
            "Showcase website built with vanilla PHP, MySQL, and phpMyAdmin for dynamic content and database-backed pages.",
          tech: ["PHP", "MySQL", "phpMyAdmin"],
          accent: "from-fuchsia-400 via-violet-500 to-cyan-400",
          image: projectImages.mtk,
          imageAlt: "MTK website project screenshot",
          liveUrl: "http://mtk.tn/",
        },
        {
          title: "Nike Clone",
          description:
            "Frontend e-commerce clone focused on premium layout, product presentation, responsive grids, and polished UI details.",
          tech: ["HTML", "CSS", "JavaScript"],
          accent: "from-sky-400 via-cyan-300 to-emerald-300",
          image: projectImages.nike,
          imageAlt: "Nike clone frontend project screenshot",
          liveUrl: "https://nike-clone-chi-five.vercel.app/",
        },
        {
          title: "Project Duration Estimator",
          description:
            "AI-based tool concept for estimating project timelines from scope, complexity, team capacity, and historical patterns.",
          tech: ["AI", "Machine Learning", "Python"],
          accent: "from-violet-400 via-blue-400 to-cyan-300",
          image: projectImages.prediction,
          imageAlt: "Project duration estimator app screenshot",
        },
      ],
    },
    certifications: {
      eyebrow: "Certifications",
      title: "Certifications in one place.",
      description:
        "A compact set of academic and technical credentials, with available certificates offered as direct PDF downloads.",
      download: "Download Certificate",
      pending: "Available Soon",
      pdf: "PDF",
      items: [
        {
          title: "Bachelor Degree Certificate",
          issuer: "University credential",
          description:
            "Academic certification connected to my computer technologies and information systems development foundation.",
          href: certificationFiles.laurea.href,
          filename: certificationFiles.laurea.filename,
          preview: certificationFiles.laurea.preview,
          imageAlt: "Bachelor degree certificate preview",
        },
        {
          title: "AWS Certificate",
          issuer: "Amazon Web Services",
          description:
            "Cloud-focused certification connected to infrastructure, scalable systems, and modern development workflows.",
          href: certificationFiles.aws.href,
          filename: certificationFiles.aws.filename,
          preview: certificationFiles.aws.preview,
          imageAlt: "AWS certificate preview",
        },
        {
          title: "Google Certificate",
          issuer: "Google",
          description:
            "Google training certification connected to digital tools, technical foundations, and applied technology skills.",
          href: certificationFiles.google.href,
          filename: certificationFiles.google.filename,
          preview: certificationFiles.google.preview,
          imageAlt: "Google certificate preview",
        },
        {
          title: "IELTS Certificate",
          issuer: "IELTS",
          description:
            "English language certification for academic and professional communication.",
          href: certificationFiles.ielts.href,
          filename: certificationFiles.ielts.filename,
          preview: certificationFiles.ielts.preview,
          imageAlt: "IELTS certificate preview",
        },
        {
          title: "TCF Certificate",
          issuer: "France Education International",
          description:
            "French language certification validating communication skills for study, work, and international mobility.",
          href: certificationFiles.tcf.href,
          filename: certificationFiles.tcf.filename,
          preview: certificationFiles.tcf.preview,
          imageAlt: "TCF certificate preview",
        },
      ],
    },
    experience: {
      eyebrow: "Experience / Education",
      title: "A path through software, systems, and intelligent hardware.",
      description:
        "The portfolio combines practical web delivery with a growing engineering focus on AI and connected systems.",
      timeline: [
        {
          period: "Foundation",
          title: "Computer Technologies / Information Systems Development",
          body: "Built a practical base in software development, databases, web systems, and structured problem solving.",
        },
        {
          period: "Current",
          title: "Electronic Engineering",
          body: "Studying electronic engineering with a focus on AI, IoT systems, machine learning, and intelligent connected products.",
        },
        {
          period: "Practice",
          title: "Developer Projects",
          body: "Creating modern websites, frontend clones, PHP/MySQL platforms, and AI-oriented tools that turn ideas into usable interfaces.",
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something that feels sharp and useful.",
      description:
        "Send a message for websites, AI ideas, product interfaces, or collaboration.",
      cardTitle: "Available for meaningful projects.",
      cardBody:
        "I am interested in modern web apps, AI-assisted tools, data-backed products, and IoT systems that need a polished interface.",
      downloadCv: "Download CV",
      pdf: "PDF",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "Tell me about your idea",
      send: "Send Message",
      status: "Message prepared. Connect your preferred email or API endpoint to send it.",
    },
    footer: {
      builtWith: "Built with Next.js, Tailwind CSS, and Framer Motion.",
    },
  },
  it: {
    navLinks: [
      { label: "Chi sono", href: "#about" },
      { label: "Competenze", href: "#skills" },
      { label: "Progetti", href: "#projects" },
      { label: "Certificazioni", href: "#certifications" },
      { label: "Contatti", href: "#contact" },
    ],
    language: {
      ariaLabel: "Cambia lingua",
      english: "English",
      italian: "Italiano",
    },
    navbar: {
      cv: "CV",
      contact: "Contatti",
      downloadCv: "Scarica CV",
    },
    hero: {
      eyebrow: "Creo sistemi digitali puliti",
      headingIntro: "Ciao, sono Amine,",
      headingRoles: [
        "Full-Stack Developer",
        "Appassionato di AI",
        "Studente di Ingegneria Elettronica",
      ],
      headingArticles: ["", "", ""],
      subtitle:
        "Creo web app moderne, progetti AI ed esperienze digitali con attenzione a performance, interfacce solide e tecnologia utile.",
      viewProjects: "Vedi Progetti",
      downloadCv: "Scarica CV",
      contactMe: "Contattami",
      explore: "Esplora",
      portraitAlt: "Ritratto di Amine",
      stats: [
        ["Web", "React, Next.js, PHP"],
        ["AI", "Strumenti ML e automazione"],
        ["IoT", "Sistemi connessi intelligenti"],
      ],
    },
    about: {
      eyebrow: "Chi sono",
      title: "Mentalità da developer con profondità ingegneristica.",
      description:
        "Mi piace trasformare idee complesse in interfacce veloci, chiare e davvero utili.",
      role: "Full-Stack Developer",
      profileText:
        "Lavoro tra sviluppo web, AI, IoT e machine learning, unendo frontend moderno e basi backend con PHP, MySQL e Python.",
      tags: ["React", "Next.js", "AI", "IoT", "PHP", "MySQL"],
      highlights: [
        {
          title: "Web app moderne",
          body: "Interfacce responsive costruite con React, Next.js, Tailwind CSS, PHP e MySQL.",
        },
        {
          title: "Progetti AI e ML",
          body: "Esperimenti applicati su strumenti di stima, workflow di machine learning e prodotti intelligenti.",
        },
        {
          title: "Sistemi connessi",
          body: "Percorso in ingegneria elettronica con focus su AI, sistemi IoT, logica embedded e automazione basata sui dati.",
        },
      ],
    },
    skills: {
      eyebrow: "Competenze",
      title: "Uno stack compatto per passare dall'idea all'interfaccia.",
      description:
        "Frontend moderno, basi backend, progetti AI e visione sui sistemi connessi in un unico workflow.",
      items: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "PHP",
        "MySQL",
        "Python",
        "AI",
        "Machine Learning",
        "IoT",
        "Git",
        "GitHub",
      ],
    },
    projects: {
      eyebrow: "Progetti",
      title: "Lavori selezionati con attenzione al prodotto.",
      description:
        "Un mix di siti aziendali, interfacce frontend, lavoro PHP con database e strumenti basati su AI.",
      projectLabel: "Progetto",
      preview: "Anteprima",
      details: "Dettagli",
      items: [
        {
          title: "Tecnocoperture",
          description:
            "Sito aziendale per coperture, ristrutturazioni, rimozione amianto e servizi di efficienza energetica.",
          tech: ["Web Design", "Frontend", "UI Responsive"],
          accent: "from-cyan-400 via-blue-500 to-violet-500",
          image: projectImages.tecnocoperture,
          imageAlt: "Screenshot del progetto Tecnocoperture",
          liveUrl: "https://tecnocoperture.netlify.app/",
        },
        {
          title: "MTK Website",
          description:
            "Sito vetrina sviluppato con PHP vanilla, MySQL e phpMyAdmin per contenuti dinamici e pagine collegate al database.",
          tech: ["PHP", "MySQL", "phpMyAdmin"],
          accent: "from-fuchsia-400 via-violet-500 to-cyan-400",
          image: projectImages.mtk,
          imageAlt: "Screenshot del progetto MTK Website",
          liveUrl: "http://mtk.tn/",
        },
        {
          title: "Nike Clone",
          description:
            "Clone frontend e-commerce focalizzato su layout premium, presentazione prodotto, griglie responsive e dettagli UI curati.",
          tech: ["HTML", "CSS", "JavaScript"],
          accent: "from-sky-400 via-cyan-300 to-emerald-300",
          image: projectImages.nike,
          imageAlt: "Screenshot del progetto Nike Clone",
          liveUrl: "https://nike-clone-chi-five.vercel.app/",
        },
        {
          title: "Project Duration Estimator",
          description:
            "Concept di strumento AI per stimare le tempistiche di progetto da scope, complessità, capacità del team e pattern storici.",
          tech: ["AI", "Machine Learning", "Python"],
          accent: "from-violet-400 via-blue-400 to-cyan-300",
          image: projectImages.prediction,
          imageAlt: "Screenshot dell'app Project Duration Estimator",
        },
      ],
    },
    certifications: {
      eyebrow: "Certificazioni",
      title: "Certificazioni in un unico spazio.",
      description:
        "Una selezione compatta di credenziali accademiche e tecniche, con certificati disponibili come PDF diretti.",
      download: "Scarica Certificato",
      pending: "Disponibile Presto",
      pdf: "PDF",
      items: [
        {
          title: "Certificato Laurea Triennale",
          issuer: "Credenziale universitaria",
          description:
            "Certificazione accademica collegata alla mia base in tecnologie informatiche e sviluppo sistemi informativi.",
          href: certificationFiles.laurea.href,
          filename: certificationFiles.laurea.filename,
          preview: certificationFiles.laurea.preview,
          imageAlt: "Anteprima del certificato di laurea triennale",
        },
        {
          title: "Certificato AWS",
          issuer: "Amazon Web Services",
          description:
            "Certificazione orientata al cloud, collegata a infrastrutture, sistemi scalabili e workflow di sviluppo moderni.",
          href: certificationFiles.aws.href,
          filename: certificationFiles.aws.filename,
          preview: certificationFiles.aws.preview,
          imageAlt: "Anteprima del certificato AWS",
        },
        {
          title: "Certificato Google",
          issuer: "Google",
          description:
            "Certificazione Google collegata a strumenti digitali, basi tecniche e competenze tecnologiche applicate.",
          href: certificationFiles.google.href,
          filename: certificationFiles.google.filename,
          preview: certificationFiles.google.preview,
          imageAlt: "Anteprima del certificato Google",
        },
        {
          title: "Certificato IELTS",
          issuer: "IELTS",
          description:
            "Certificazione linguistica di inglese per comunicazione accademica e professionale.",
          href: certificationFiles.ielts.href,
          filename: certificationFiles.ielts.filename,
          preview: certificationFiles.ielts.preview,
          imageAlt: "Anteprima del certificato IELTS",
        },
        {
          title: "Certificato TCF",
          issuer: "France Education International",
          description:
            "Certificazione linguistica di francese per studio, lavoro e mobilita internazionale.",
          href: certificationFiles.tcf.href,
          filename: certificationFiles.tcf.filename,
          preview: certificationFiles.tcf.preview,
          imageAlt: "Anteprima del certificato TCF",
        },
      ],
    },
    experience: {
      eyebrow: "Esperienza / Formazione",
      title: "Un percorso tra software, sistemi e hardware intelligente.",
      description:
        "Il portfolio unisce sviluppo web pratico e una crescita ingegneristica su AI e sistemi connessi.",
      timeline: [
        {
          period: "Base",
          title: "Tecnologie Informatiche / Sviluppo Sistemi Informativi",
          body: "Ho costruito una base pratica in sviluppo software, database, sistemi web e problem solving strutturato.",
        },
        {
          period: "Attuale",
          title: "Ingegneria Elettronica",
          body: "Studio ingegneria elettronica con focus su AI, sistemi IoT, machine learning e prodotti intelligenti connessi.",
        },
        {
          period: "Pratica",
          title: "Progetti da Developer",
          body: "Creo siti moderni, cloni frontend, piattaforme PHP/MySQL e strumenti orientati all'AI che trasformano idee in interfacce usabili.",
        },
      ],
    },
    contact: {
      eyebrow: "Contatti",
      title: "Costruiamo qualcosa di preciso e utile.",
      description:
        "Scrivimi per siti web, idee AI, interfacce di prodotto o collaborazioni.",
      cardTitle: "Disponibile per progetti interessanti.",
      cardBody:
        "Mi interessano web app moderne, strumenti assistiti da AI, prodotti basati sui dati e sistemi IoT che richiedono un'interfaccia curata.",
      downloadCv: "Scarica CV",
      pdf: "PDF",
      nameLabel: "Nome",
      namePlaceholder: "Il tuo nome",
      emailLabel: "Email",
      emailPlaceholder: "tuo@email.com",
      messageLabel: "Messaggio",
      messagePlaceholder: "Raccontami la tua idea",
      send: "Invia Messaggio",
      status: "Messaggio preparato. Collega la tua email o un endpoint API per inviarlo.",
    },
    footer: {
      builtWith: "Creato con Next.js, Tailwind CSS e Framer Motion.",
    },
  },
};
