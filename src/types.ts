export type Domain = 'body' | 'philosophy' | 'movement' | 'science' | 'cognition' | 'hybrid';

export type World = 'atlas' | 'field' | 'me';

export type NodeStatus = 'seed' | 'sprout' | 'alive' | 'rooted' | 'atlas';

export interface Story {
  id: string;
  author: string;
  textRu: string;
  textEn: string;
  rating: number;
}

export interface SomaticNode {
  id: string;
  nameRu: string;
  nameEn: string;
  domain: Domain;
  world: World;
  status: NodeStatus;
  resonances: number;
  descriptionRu: string;
  descriptionEn: string;
  authorRu?: string;
  authorEn?: string;
  epochRu?: string; // e.g., "1960s", "Antiquity"
  epochEn?: string;
  stories: Story[];
  addedBy?: string;
  isPrivate?: boolean;
  
  // Physics parameters (assigned dynamically if needed)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  targetX?: number; // target coordinates during animations / transitions
  targetY?: number;
  currentRadius?: number;
  baseRadius?: number;
  breathPhase?: number;
  breathSpeed?: number;
}

export interface SomaticLink {
  id: string;
  source: string; // source node id
  target: string; // target node id
  resonanceWeight: number; // strength of link
  activity: number;        // activity score (influences particles)
}

export interface PulseParticle {
  progress: number;
  speed: number;
  opacity: number;
  color: string;
}

export interface AudioItem {
  id: string;
  titleRu: string;
  titleEn: string;
  authorRu: string;
  authorEn: string;
  sourceRu: string;
  sourceEn: string;
  year: number;
  duration: number; // in seconds
  audioUrl?: string; // placeholder or sample
  domain: Domain;
  timelineNodes: {
    timeMs: number;
    nodeId: string;
    captionRu: string;
    captionEn: string;
  }[];
}

export interface AgendaQuestion {
  id: string;
  questionRu: string;
  questionEn: string;
  domains: Domain[];
  contributorsCount: number;
  contributors: { name: string; avatar: string }[];
  answers: {
    id: string;
    author: string;
    textRu: string;
    textEn: string;
    linkedNodeId?: string;
    linkedNodeNameRu?: string;
    linkedNodeNameEn?: string;
  }[];
}

export interface ActivityNotification {
  id: string;
  timestamp: string;
  textRu: string;
  textEn: string;
}

export interface UserProfile {
  name: string;
  domains: Domain[];
  sensesAdded: number;
  storiesWritten: number;
  nodesMovedToAtlas: number;
  archetypes: {
    connector: boolean;   // many connections created
    storyteller: boolean; // many stories added
    resonator: boolean;   // lots of resonances
    pioneer: boolean;     // has nodes ascended to Atlas
    bridge: boolean;      // links multiple domains
  };
  privacySettings: {
    myGraph: 'public' | 'overlayOnly' | 'private';
    myResonances: 'visible' | 'hidden';
  };
}
