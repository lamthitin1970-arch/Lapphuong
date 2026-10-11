import { CubeCoord, LevelData } from '../types';

/**
 * Builds physical cubes list from a 3x3 matrix of column heights (0..3)
 */
export function matrixToCubes(matrix: number[][]): CubeCoord[] {
  const cubes: CubeCoord[] = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const height = Math.min(3, Math.max(0, matrix[x]?.[y] || 0));
      for (let z = 0; z < height; z++) {
        cubes.push({
          x,
          y,
          z,
          id: `rubik_${x}_${y}_${z}`,
        });
      }
    }
  }
  return cubes;
}

/**
 * Generates 4 plausible multiple choice options including the correct answer
 */
function generateOptions(answer: number): number[] {
  const set = new Set<number>();
  set.add(answer);

  // Typical Grade 2 mistakes: off by 1, off by 2, or forgetting hidden cubes
  const candidates = [
    answer - 1,
    answer + 1,
    answer - 2,
    answer + 2,
    answer - 3,
    answer + 3,
    answer - 4,
    answer + 4,
  ];

  for (const c of candidates) {
    if (c > 0 && c <= 27 && !set.has(c)) {
      set.add(c);
      if (set.size === 4) break;
    }
  }

  // Fallbacks if set is not 4
  let fallback = 1;
  while (set.size < 4 && fallback <= 27) {
    if (fallback !== answer) set.add(fallback);
    fallback++;
  }

  return Array.from(set).sort(() => Math.random() - 0.5);
}

/**
 * Creates full LevelData for a 3x3x3 Rubik question
 */
export function createRubikQuestion(
  id: number,
  title: string,
  category: string,
  difficultyLabel: string,
  matrix: number[][]
): LevelData {
  const cubes = matrixToCubes(matrix);
  const total = cubes.length;

  const countL1 = cubes.filter((c) => c.z === 0).length;
  const countL2 = cubes.filter((c) => c.z === 1).length;
  const countL3 = cubes.filter((c) => c.z === 2).length;

  const layers = [];
  if (countL1 > 0) layers.push({ layerNum: 1, count: countL1, name: 'Tầng 1 (Đáy)' });
  if (countL2 > 0) layers.push({ layerNum: 2, count: countL2, name: 'Tầng 2 (Giữa)' });
  if (countL3 > 0) layers.push({ layerNum: 3, count: countL3, name: 'Tầng 3 (Trên cùng)' });

  // Calculate hidden cubes in 3x3x3
  const cubeSet = new Set(cubes.map((c) => `${c.x},${c.y},${c.z}`));
  let hiddenCount = 0;
  for (const c of cubes) {
    const hasAbove = cubeSet.has(`${c.x},${c.y},${c.z + 1}`);
    const hasFrontX = cubeSet.has(`${c.x + 1},${c.y},${c.z}`);
    const hasFrontY = cubeSet.has(`${c.x},${c.y + 1},${c.z}`);
    if (hasAbove && (hasFrontX || hasFrontY)) {
      hiddenCount++;
    }
  }

  return {
    id,
    title,
    category,
    difficulty: total <= 8 ? 'de' : total <= 16 ? 'trung_binh' : 'thu_thach',
    difficultyLabel,
    gridSize: { rows: 3, cols: 3, maxZ: 3 },
    cubes,
    answer: total,
    options: generateOptions(total),
    explanation: {
      layers,
      hiddenCount,
      visibleCount: total - hiddenCount,
      tip: `Đếm bóc tách theo 3 tầng Rubik: Tầng 1 (${countL1}) + Tầng 2 (${countL2}) + Tầng 3 (${countL3}) = ${total} khối!`,
    },
  };
}

/**
 * Generator Archetype Functions: all strictly bounded within 3x3x3 Rubik
 */

// Archetype 1: Bậc thang 3 bậc (Staircases)
function genStairs(): { title: string; category: string; matrix: number[][] } {
  const styles = [
    {
      title: 'Cầu Thang 3 Bậc Đơn',
      matrix: [
        [3, 2, 1],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
    {
      title: 'Bậc Thang Đôi 3x2',
      matrix: [
        [3, 2, 1],
        [3, 2, 1],
        [0, 0, 0],
      ],
    },
    {
      title: 'Bậc Thang Toàn Khung 3x3',
      matrix: [
        [3, 2, 1],
        [3, 2, 1],
        [3, 2, 1],
      ],
    },
    {
      title: 'Cầu Thang Chéo Góc',
      matrix: [
        [3, 2, 1],
        [2, 1, 0],
        [1, 0, 0],
      ],
    },
  ];
  const choice = styles[Math.floor(Math.random() * styles.length)];
  return { ...choice, category: 'Bậc thang 3 tầng' };
}

// Archetype 2: Kim tự tháp / Tháp chóp (Stepped Pyramids)
function genPyramid(): { title: string; category: string; matrix: number[][] } {
  const styles = [
    {
      title: 'Tháp Chóp 3 Tầng Rubik',
      matrix: [
        [1, 2, 1],
        [2, 3, 2],
        [1, 2, 1],
      ],
    },
    {
      title: 'Tháp Đỉnh Cao Giữa Sàn',
      matrix: [
        [1, 1, 1],
        [1, 3, 1],
        [1, 1, 1],
      ],
    },
    {
      title: 'Tháp Chóp Góc 3 Tầng',
      matrix: [
        [3, 2, 1],
        [2, 2, 1],
        [1, 1, 1],
      ],
    },
  ];
  const choice = styles[Math.floor(Math.random() * styles.length)];
  return { ...choice, category: 'Tháp chóp 3 tầng' };
}

// Archetype 3: Khối chữ U / Cầu Vòm (U-Shapes / Bridges)
function genUShape(): { title: string; category: string; matrix: number[][] } {
  const styles = [
    {
      title: 'Khối Chữ U Hai Tháp',
      matrix: [
        [3, 1, 3],
        [3, 1, 3],
        [0, 0, 0],
      ],
    },
    {
      title: 'Cầu Vòm 3 Tầng',
      matrix: [
        [3, 0, 3],
        [3, 1, 3],
        [3, 0, 3],
      ],
    },
    {
      title: 'Khối Chữ U 3x3 Trũng Giữa',
      matrix: [
        [2, 2, 2],
        [2, 1, 2],
        [2, 2, 2],
      ],
    },
    {
      title: 'Thung Lũng Hai Bờ Cao',
      matrix: [
        [3, 1, 3],
        [3, 1, 3],
        [3, 1, 3],
      ],
    },
  ];
  const choice = styles[Math.floor(Math.random() * styles.length)];
  return { ...choice, category: 'Khối chữ U & Cầu' };
}

// Archetype 4: Lâu đài 4 tháp góc (Castle with corner pillars)
function genCastle(): { title: string; category: string; matrix: number[][] } {
  const styles = [
    {
      title: 'Lâu Đài 4 Tháp Góc Cao',
      matrix: [
        [3, 1, 3],
        [1, 0, 1],
        [3, 1, 3],
      ],
    },
    {
      title: 'Pháo Đài 3 Tầng Vững Chắc',
      matrix: [
        [3, 2, 3],
        [2, 1, 2],
        [3, 2, 3],
      ],
    },
    {
      title: 'Thành Trì Có Giếng Trời',
      matrix: [
        [2, 2, 2],
        [2, 0, 2],
        [2, 2, 2],
      ],
    },
  ];
  const choice = styles[Math.floor(Math.random() * styles.length)];
  return { ...choice, category: 'Kiến trúc thành quách' };
}

// Archetype 5: Khối Rubik khuyết góc / khuyết mặt (Hollowed Rubik Cube)
function genHollowedRubik(): { title: string; category: string; matrix: number[][] } {
  // Start with full 3x3x3 (all 3s) and remove 1 to 6 cubes from top
  const matrix = [
    [3, 3, 3],
    [3, 3, 3],
    [3, 3, 3],
  ];

  const cuts = Math.floor(Math.random() * 4) + 1; // 1 to 4 cuts
  const spots = [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
    [1, 1],
  ];
  const shuffledSpots = [...spots].sort(() => Math.random() - 0.5);

  for (let i = 0; i < cuts; i++) {
    const [r, c] = shuffledSpots[i];
    matrix[r][c] = Math.max(0, matrix[r][c] - (Math.floor(Math.random() * 2) + 1));
  }

  return {
    title: `Khối Rubik 3x3x3 Khuyết Góc`,
    category: 'Khối Rubik tư duy',
    matrix,
  };
}

// Archetype 6: Khối chữ L hoặc T 3D
function genLOrTShape(): { title: string; category: string; matrix: number[][] } {
  const styles = [
    {
      title: 'Khối Chữ L 3 Tầng',
      matrix: [
        [3, 0, 0],
        [3, 0, 0],
        [3, 2, 1],
      ],
    },
    {
      title: 'Khối Chữ T Dựng Đứng',
      matrix: [
        [3, 3, 3],
        [0, 2, 0],
        [0, 1, 0],
      ],
    },
    {
      title: 'Khối Zíc Zắc 3D',
      matrix: [
        [3, 3, 0],
        [0, 2, 2],
        [0, 0, 1],
      ],
    },
  ];
  const choice = styles[Math.floor(Math.random() * styles.length)];
  return { ...choice, category: 'Khối L & T 3D' };
}

// Archetype 7: Ma trận cột ngẫu nhiên có độ cao cân đối
function genRandomBalancedMatrix(levelTier: 'easy' | 'medium' | 'hard'): {
  title: string;
  category: string;
  matrix: number[][];
} {
  const matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  if (levelTier === 'easy') {
    // 4 to 8 cubes
    const cellsToFill = Math.floor(Math.random() * 3) + 3; // 3 to 5 cells
    let filled = 0;
    while (filled < cellsToFill) {
      const rx = Math.floor(Math.random() * 3);
      const ry = Math.floor(Math.random() * 3);
      if (matrix[rx][ry] === 0) {
        matrix[rx][ry] = Math.floor(Math.random() * 2) + 1; // 1 or 2
        filled++;
      }
    }
    return {
      title: 'Tổ Hợp Cột Khởi Động',
      category: 'Ma trận Rubik ngẫu nhiên',
      matrix,
    };
  }

  if (levelTier === 'medium') {
    // 9 to 15 cubes
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        matrix[x][y] = Math.floor(Math.random() * 3); // 0, 1, or 2
      }
    }
    // Boost at least 1 or 2 cells to 3
    matrix[0][0] = Math.max(matrix[0][0], 2);
    matrix[1][1] = 3;
    return {
      title: 'Tổ Hợp Cột Đa Tầng',
      category: 'Ma trận Rubik ngẫu nhiên',
      matrix,
    };
  }

  // Hard: 16 to 24 cubes
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      matrix[x][y] = Math.floor(Math.random() * 2) + 2; // 2 or 3
    }
  }
  // Cut 1-2 cells
  matrix[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 3)] = 1;

  return {
    title: 'Thử Thách Khối Ẩn Rubik',
    category: 'Ma trận Rubik ngẫu nhiên',
    matrix,
  };
}

/**
 * Generates an exciting, varied 5-question challenge session strictly inside a 3x3x3 Rubik box
 */
export function generate5QuestionRubikChallenge(): LevelData[] {
  // We want a clear progression for the 5 questions:
  // Q1: Easy (4 - 8 cubes)
  // Q2: Moderate (8 - 13 cubes)
  // Q3: Medium-Hard (12 - 17 cubes)
  // Q4: High spatial thinking / Hidden cubes (15 - 20 cubes)
  // Q5: Ultimate Rubik Challenge (18 - 25 cubes)

  const q1Data = Math.random() > 0.5 ? genStairs() : genRandomBalancedMatrix('easy');
  const q2Data = Math.random() > 0.5 ? genUShape() : genLOrTShape();
  const q3Data = Math.random() > 0.5 ? genPyramid() : genRandomBalancedMatrix('medium');
  const q4Data = Math.random() > 0.5 ? genCastle() : genRandomBalancedMatrix('hard');
  const q5Data = Math.random() > 0.5 ? genHollowedRubik() : genCastle();

  const rawList = [
    { data: q1Data, label: 'Câu 1 / 5: Khởi động' },
    { data: q2Data, label: 'Câu 2 / 5: Tăng tốc' },
    { data: q3Data, label: 'Câu 3 / 5: Vượt chướng ngại vật' },
    { data: q4Data, label: 'Câu 4 / 5: Khám phá khối ẩn' },
    { data: q5Data, label: 'Câu 5 / 5: Thử thách đỉnh cao Rubik' },
  ];

  return rawList.map((item, idx) => {
    return createRubikQuestion(
      idx + 1,
      item.data.title,
      item.data.category,
      item.label,
      item.data.matrix
    );
  });
}
