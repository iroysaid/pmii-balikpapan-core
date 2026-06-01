export type ProfileCardContent = {
  title: string;
  description: string;
};

export type ProfileContent = {
  hero: {
    title: string;
    description: string;
    image?: string;
  };
  history: ProfileCardContent;
  visionMission: {
    title: string;
    items: string[];
  };
  values: ProfileCardContent;
  structure: {
    title: string;
    description: string;
  };
  secretariat: {
    eyebrow: string;
    title: string;
    addressTitle: string;
    address: string;
    mapsUrl: string;
    embedUrl: string;
  };
};
