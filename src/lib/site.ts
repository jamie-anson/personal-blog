type SiteNavItem = {
  href: string;
  label: string;
};

export const site: {
  name: string;
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    url: string;
  };
  publisher: {
    name: string;
    url: string;
    logo: string;
  };
  sameAs: string[];
  defaultOgImage: string;
  nav: SiteNavItem[];
} = {
  name: 'Bringing Clarity',
  title: 'Bringing Clarity',
  description:
    'Essays on AI-native companies, operating systems for teams, and the structures that emerge when execution becomes abundant.',
  url: 'https://bringing-clarity.org',
  author: {
    name: 'Jamie Anson',
    url: 'https://bringing-clarity.org/'
  },
  publisher: {
    name: 'Bringing Clarity',
    url: 'https://bringing-clarity.org/',
    logo: 'https://bringing-clarity.org/favicon-v2.svg'
  },
  sameAs: [],
  defaultOgImage: 'https://bringing-clarity.org/favicon-v2.svg',
  nav: []
};
