export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
}

/** Placeholder team — replace with real bios/photos before launch. */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Nadeesha Gunawardena",
    role: "Founder & Product Lead",
    bio: "Born in Galle, spent a decade in travel tech before starting Visit Sri Lanka.",
  },
  {
    id: "tm-2",
    name: "Dilshan Fernando",
    role: "Head of Destinations",
    bio: "Former national park ranger with deep knowledge of Sri Lanka's wildlife circuits.",
  },
  {
    id: "tm-3",
    name: "Chathurika Silva",
    role: "Partnerships Lead",
    bio: "Works directly with hotels and guides across all nine provinces.",
  },
  {
    id: "tm-4",
    name: "Ruwan Jayasuriya",
    role: "Engineering Lead",
    bio: "Builds the platform connecting travelers to the island's experiences.",
  },
];
