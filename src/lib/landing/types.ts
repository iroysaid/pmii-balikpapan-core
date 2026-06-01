export type NavLink = {
  name: string;
  href: string;
};

export type CtaLink = {
  label: string;
  href: string;
};

export type FloatingImage = {
  image: string;
  alt: string;
  title: string;
  description: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
  caption?: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  primaryCta: CtaLink;
  studyCta: CtaLink;
  backgroundImage?: ImageAsset;
  mainImage?: ImageAsset;
  floatingImages: FloatingImage[];
};

export type VisionMissionContent = {
  eyebrow: string;
  title: string;
  visionTitle: string;
  vision: string;
  missionTitle: string;
  missions: string[];
};

export type NdpItem = {
  title: string;
  desc: string;
};

export type NdpContent = {
  title: string;
  description: string;
  items: NdpItem[];
};

export type TeamMember = {
  image: string;
  name: string;
  role: string;
  showOnHomepage?: boolean;
  showOnProfile?: boolean;
  sortOrder?: number;
};

export type TeamContent = {
  eyebrow: string;
  title: string;
  description: string;
  members: TeamMember[];
};

export type DocumentationContent = {
  eyebrow: string;
  title: string;
  description?: string;
  photos: ImageAsset[];
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  emptyText: string;
};

export type MovementCard = {
  title: string;
  text: string;
  image: string;
  alt?: string;
  icon: "graduation" | "handshake" | "users";
  overlay?: "blue" | "green" | "dark";
};

export type MovementContent = {
  cards: MovementCard[];
};

export type NewsContent = {
  eyebrow: string;
  title: string;
  cta: CtaLink;
  emptyText: string;
  headlineLabel: string;
  popularLabel: string;
  description?: string;
  displayCount: number;
  selectedSlugs: string[];
};

export type AgendaContent = {
  eyebrow: string;
  title: string;
  cta: CtaLink;
  learningTitle: string;
  learningDescription: string;
  learningCta: CtaLink;
  description?: string;
  displayCount: number;
  selectedSlugs: string[];
  learningImage?: ImageAsset;
};

export type FinalCtaContent = {
  title: string;
  description: string;
  cta: CtaLink;
  backgroundImage?: ImageAsset;
};

export type NavbarContent = {
  brandTop: string;
  brandBottom: string;
  logos: { src: string; alt: string }[];
  links: NavLink[];
  loginLink: CtaLink;
};

export type FooterContent = {
  brand: string;
  tagline: string;
  socials: { label: string; href: string }[];
  quickLinks: NavLink[];
  secretariatTitle: string;
  addressLabel: string;
  address: string;
  mapsCta: CtaLink;
  email: string;
  copyright: string;
};

export type LandingContent = {
  navbar: NavbarContent;
  footer: FooterContent;
  hero: HeroContent;
  visionMission: VisionMissionContent;
  ndp: NdpContent;
  team: TeamContent;
  documentation: DocumentationContent;
  movement: MovementContent;
  news: NewsContent;
  agenda: AgendaContent;
  finalCta: FinalCtaContent;
};

export type LandingGalleryActivity = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  photos: { id: string; url: string }[];
};

export type LandingPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: Date;
};

export type LandingActivity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  organizer: string | null;
  image: string | null;
};
