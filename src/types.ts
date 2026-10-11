export interface CubeCoord {
  x: number; // Row index (0..N)
  y: number; // Col index (0..N)
  z: number; // Height layer (0 is base layer, 1 is layer 2, etc.)
  id: string;
  color?: string;
}

export interface LayerExplanation {
  layerNum: number;
  name: string;
  count: number;
  cubes: CubeCoord[];
  note: string;
}

export interface ColumnExplanation {
  x: number;
  y: number;
  height: number;
}

export interface LevelExplanation {
  layerMethod: {
    layers: LayerExplanation[];
    total: number;
    formula: string;
  };
  columnMethod: {
    columns: ColumnExplanation[];
    total: number;
    formula: string;
  };
  hiddenCubesCount: number;
  tip: string;
}

export type DifficultyLevel = 'de' | 'trung_binh' | 'thu_thach';

export interface LevelData {
  id: number;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  cubes: CubeCoord[];
  options: number[];
  answer: number;
  gridSize: { rows: number; cols: number; maxZ: number };
  explanation: LevelDataExplanation;
  referenceImageMatch?: string; // note which image inspired this
}

export interface LevelDataExplanation {
  layers: { layerNum: number; count: number; name: string }[];
  hiddenCount: number;
  visibleCount: number;
  tip: string;
}

export type RotationAngle = 0 | 90 | 180 | 270;
export type ViewProjection = 'iso' | 'top' | 'front' | 'side';
export type ColorTheme = 'classic' | 'sky_blue' | 'pastel' | 'by_layer';
