import { CubeCoord, RotationAngle } from '../types';

export interface Face3D {
  id: string;
  cubeId: string;
  cube: CubeCoord;
  faceType: 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';
  points: string; // "x1,y1 x2,y2 x3,y3 x4,y4"
  center: { x: number; y: number };
  depth: number;
  lightFactor: number; // 0..1 for shading
  isBackface: boolean;
}

export interface ProjectedScene {
  faces: Face3D[];
  cubeCenters: { [cubeId: string]: { x: number; y: number; depth: number } };
}

// Light source vector coming from top-left-front
const LIGHT_DIR = {
  x: -0.3,
  y: 0.5,
  z: 0.8,
};
const LIGHT_LEN = Math.sqrt(LIGHT_DIR.x ** 2 + LIGHT_DIR.y ** 2 + LIGHT_DIR.z ** 2);
const LIGHT_NORM = {
  x: LIGHT_DIR.x / LIGHT_LEN,
  y: LIGHT_DIR.y / LIGHT_LEN,
  z: LIGHT_DIR.z / LIGHT_LEN,
};

/**
 * Robust 3D camera projection handling any Yaw (0..360°) and Pitch (0..90° including direct top-down)
 */
export function projectCubes3D(
  cubes: CubeCoord[],
  size: number,
  originX: number,
  originY: number,
  yawDeg: number,
  pitchDeg: number,
  explodeGap: number = 0
): ProjectedScene {
  const yaw = (yawDeg * Math.PI) / 180;
  // Constrain pitch between 0° (eye-level) and 89.9° (pure top-down)
  const pitch = (Math.max(0, Math.min(89.9, pitchDeg)) * Math.PI) / 180;

  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  // Compute bounding box to center structure
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  cubes.forEach((c) => {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
    if (c.z < minZ) minZ = c.z;
    if (c.z > maxZ) maxZ = c.z;
  });

  if (cubes.length === 0) {
    minX = maxX = minY = maxY = minZ = maxZ = 0;
  }

  const midX = (minX + maxX + 1) / 2;
  const midY = (minY + maxY + 1) / 2;
  const midZ = (minZ + maxZ + 1) / 2;

  // Vertex transformation: World -> Yaw-rotated -> Camera projection
  const transformPoint = (wx: number, wy: number, wz: number, zLayer: number) => {
    // Relative to center
    const rx = (wx - midX) * size;
    const ry = (wy - midY) * size;
    const rz = (wz - midZ) * size + (zLayer - midZ) * explodeGap;

    // Yaw rotation around Z axis
    const x1 = rx * cosY - ry * sinY;
    const y1 = rx * sinY + ry * cosY;
    const z1 = rz;

    // Pitch elevation angle (0° = side view, 90° = direct top-down looking along -Z)
    // Camera right vector = (1, 0, 0)
    // Camera up vector = (0, -sinP, cosP)
    // Camera look vector = (0, cosP, sinP) pointing to viewer
    const screenX = originX + x1;
    const screenY = originY - (-y1 * sinP + z1 * cosP);
    const depth = y1 * cosP + z1 * sinP;

    return { sx: screenX, sy: screenY, depth };
  };

  // Face definitions with local normal vectors
  const faceDefinitions: {
    type: Face3D['faceType'];
    normal: { x: number; y: number; z: number };
    getVertices: (c: CubeCoord) => { x: number; y: number; z: number }[];
  }[] = [
    {
      type: 'top',
      normal: { x: 0, y: 0, z: 1 },
      getVertices: (c) => [
        { x: c.x, y: c.y, z: c.z + 1 },
        { x: c.x + 1, y: c.y, z: c.z + 1 },
        { x: c.x + 1, y: c.y + 1, z: c.z + 1 },
        { x: c.x, y: c.y + 1, z: c.z + 1 },
      ],
    },
    {
      type: 'bottom',
      normal: { x: 0, y: 0, z: -1 },
      getVertices: (c) => [
        { x: c.x, y: c.y, z: c.z },
        { x: c.x, y: c.y + 1, z: c.z },
        { x: c.x + 1, y: c.y + 1, z: c.z },
        { x: c.x + 1, y: c.y, z: c.z },
      ],
    },
    {
      type: 'front', // +Y
      normal: { x: 0, y: 1, z: 0 },
      getVertices: (c) => [
        { x: c.x, y: c.y + 1, z: c.z },
        { x: c.x + 1, y: c.y + 1, z: c.z },
        { x: c.x + 1, y: c.y + 1, z: c.z + 1 },
        { x: c.x, y: c.y + 1, z: c.z + 1 },
      ],
    },
    {
      type: 'back', // -Y
      normal: { x: 0, y: -1, z: 0 },
      getVertices: (c) => [
        { x: c.x, y: c.y, z: c.z },
        { x: c.x, y: c.y, z: c.z + 1 },
        { x: c.x + 1, y: c.y, z: c.z + 1 },
        { x: c.x + 1, y: c.y, z: c.z },
      ],
    },
    {
      type: 'right', // +X
      normal: { x: 1, y: 0, z: 0 },
      getVertices: (c) => [
        { x: c.x + 1, y: c.y, z: c.z },
        { x: c.x + 1, y: c.y + 1, z: c.z },
        { x: c.x + 1, y: c.y + 1, z: c.z + 1 },
        { x: c.x + 1, y: c.y, z: c.z + 1 },
      ],
    },
    {
      type: 'left', // -X
      normal: { x: -1, y: 0, z: 0 },
      getVertices: (c) => [
        { x: c.x, y: c.y, z: c.z },
        { x: c.x, y: c.y, z: c.z + 1 },
        { x: c.x, y: c.y + 1, z: c.z + 1 },
        { x: c.x, y: c.y + 1, z: c.z },
      ],
    },
  ];

  const allFaces: Face3D[] = [];
  const cubeCenters: { [cubeId: string]: { x: number; y: number; depth: number } } = {};

  cubes.forEach((cube) => {
    // Project cube center
    const centerProj = transformPoint(cube.x + 0.5, cube.y + 0.5, cube.z + 0.5, cube.z);
    cubeCenters[cube.id] = { x: centerProj.sx, y: centerProj.sy, depth: centerProj.depth };

    faceDefinitions.forEach((def) => {
      // Rotate normal by yaw
      const nx1 = def.normal.x * cosY - def.normal.y * sinY;
      const ny1 = def.normal.x * sinY + def.normal.y * cosY;
      const nz1 = def.normal.z;

      // Normal dot product with camera direction (points towards viewer):
      // Camera vector = (0, cosP, sinP)
      const dotCam = ny1 * cosP + nz1 * sinP;

      // Face is visible if it points towards the camera
      const isVisible = dotCam > 0.001;

      // Lighting dot product (diffuse shading)
      const dotLight = Math.max(0, nx1 * LIGHT_NORM.x + ny1 * LIGHT_NORM.y + nz1 * LIGHT_NORM.z);
      const lightFactor = 0.55 + 0.45 * dotLight;

      const rawVertices = def.getVertices(cube);
      const projectedVertices = rawVertices.map((v) => transformPoint(v.x, v.y, v.z, cube.z));

      const points = projectedVertices.map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
      const avgX = projectedVertices.reduce((sum, p) => sum + p.sx, 0) / 4;
      const avgY = projectedVertices.reduce((sum, p) => sum + p.sy, 0) / 4;
      const avgDepth = projectedVertices.reduce((sum, p) => sum + p.depth, 0) / 4;

      allFaces.push({
        id: `${cube.id}_${def.type}`,
        cubeId: cube.id,
        cube,
        faceType: def.type,
        points,
        center: { x: avgX, y: avgY },
        depth: avgDepth,
        lightFactor,
        isBackface: !isVisible,
      });
    });
  });

  // Sort faces: smallest depth (farthest) to largest depth (nearest)
  allFaces.sort((a, b) => a.depth - b.depth);

  return { faces: allFaces, cubeCenters };
}
