type SiteNavItem = {
  href: string;
  label: string;
};

export const site: {
  name: string;
  title: string;
  description: string;
  url: string;
  nav: SiteNavItem[];
} = {
  name: 'Bringing Clarity',
  title: 'Bringing Clarity',
  description:
    'Essays on AI-native companies, operating systems for teams, and the structures that emerge when execution becomes abundant.',
  url: 'https://bringing-clarity.org',
  nav: []
};
