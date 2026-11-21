export interface CameraPose {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
}

export interface SectionWaypoint {
  id: string;
  startProgress: number; // 0.0 to 1.0
  endProgress: number;   // 0.0 to 1.0
  startPose: CameraPose;
  endPose: CameraPose;
}

export interface SareeLook {
  id: string;
  title: string;
  subtitle: string;
  craft: string;
  origin: string;
  price: number;
  image: string;
  colorHex: string;
  accentHex: string;
  palluDetail: string;
  pleatsDetail: string;
  blouseDetail: string;
  ensemble: {
    saree: { name: string; price: number };
    choli: { name: string; price: number };
    pallu: { name: string; price: number };
    jewels: { name: string; price: number };
  };
}

export interface RackItem {
  id: string;
  title: string;
  colorName: string;
  weave: string;
  price: number;
  weightGrams: number;
  zariPurity: string;
  image: string;
  tag: string;
}

export interface WeaveSwatch {
  id: string;
  name: string;
  cluster: string;
  warpWeft: string;
  goldContent: string;
  description: string;
  colorClass: string;
}

export interface TrunkItem {
  id: string;
  title: string;
  craft: string;
  price: number;
  image: string;
  colorHex: string;
  quantity: number;
}
