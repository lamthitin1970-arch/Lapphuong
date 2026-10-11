import { CubeCoord, LevelData } from '../types';

// Helper to quickly define cubes from column heights on a 2D grid
function generateFromHeightMatrix(matrix: number[][]): CubeCoord[] {
  const cubes: CubeCoord[] = [];
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      const height = matrix[x][y];
      for (let z = 0; z < height; z++) {
        cubes.push({
          x,
          y,
          z,
          id: `c_${x}_${y}_${z}`,
        });
      }
    }
  }
  return cubes;
}

// Generate options (correct answer + 3 plausible distractors)
function makeOptions(answer: number): number[] {
  const dist = new Set<number>();
  dist.add(answer);
  // Typical mistakes Grade 2 kids make: forgetting hidden cubes, counting only visible faces, +-1, +-2
  const plausible = [answer - 1, answer + 1, answer - 2, answer + 2, answer - 3, answer + 3];
  for (const p of plausible) {
    if (p > 0 && !dist.has(p)) {
      dist.add(p);
      if (dist.size === 4) break;
    }
  }
  return Array.from(dist).sort(() => Math.random() - 0.5);
}

export const LEVELS: LevelData[] = [
  // ================= CẤP ĐỘ 1: KHỞI ĐỘNG (DỄ: 1 - 6 KHỐI) =================
  {
    id: 1,
    title: 'Hàng Ngang Thẳng Tắp',
    category: 'Làm quen 1 tầng',
    difficulty: 'de',
    difficultyLabel: 'Mức 1: Khởi động',
    gridSize: { rows: 3, cols: 3, maxZ: 1 },
    cubes: generateFromHeightMatrix([
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]),
    answer: 3,
    options: [2, 3, 4, 5],
    explanation: {
      layers: [{ layerNum: 1, count: 3, name: 'Tầng 1 (Đáy)' }],
      hiddenCount: 0,
      visibleCount: 3,
      tip: 'Chỉ có 1 tầng nằm ngang, bé đếm lần lượt từ trái sang phải: 1, 2, 3 khối!',
    },
  },
  {
    id: 2,
    title: 'Góc Chữ L Nhỏ Xinh',
    category: 'Làm quen 1 tầng',
    difficulty: 'de',
    difficultyLabel: 'Mức 1: Khởi động',
    gridSize: { rows: 3, cols: 3, maxZ: 1 },
    cubes: generateFromHeightMatrix([
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ]),
    answer: 4,
    options: [3, 4, 5, 6],
    explanation: {
      layers: [{ layerNum: 1, count: 4, name: 'Tầng 1 (Đáy)' }],
      hiddenCount: 0,
      visibleCount: 4,
      tip: 'Hình chữ L chỉ có 1 tầng. Cạnh đứng có 3 khối, cạnh ngang thêm 1 khối nữa là 4 khối.',
    },
  },
  {
    id: 3,
    title: 'Bậc Thang 2 Bậc',
    category: 'Xếp tầng cơ bản',
    difficulty: 'de',
    difficultyLabel: 'Mức 1: Khởi động',
    gridSize: { rows: 2, cols: 2, maxZ: 2 },
    cubes: generateFromHeightMatrix([
      [2, 0],
      [1, 0],
    ]),
    answer: 3,
    options: [2, 3, 4, 5],
    explanation: {
      layers: [
        { layerNum: 1, count: 2, name: 'Tầng 1 (Đáy)' },
        { layerNum: 2, count: 1, name: 'Tầng 2 (Bậc cao)' },
      ],
      hiddenCount: 0,
      visibleCount: 3,
      tip: 'Cột thứ nhất cao 2 khối, cột thứ hai cao 1 khối. Ta có 2 + 1 = 3 khối lập phương.',
    },
  },
  {
    id: 4,
    title: 'Khối Vuông 2x2 Bằng Phẳng',
    category: 'Làm quen 1 tầng',
    difficulty: 'de',
    difficultyLabel: 'Mức 1: Khởi động',
    gridSize: { rows: 2, cols: 2, maxZ: 1 },
    cubes: generateFromHeightMatrix([
      [1, 1],
      [1, 1],
    ]),
    answer: 4,
    options: [3, 4, 5, 6],
    explanation: {
      layers: [{ layerNum: 1, count: 4, name: 'Tầng 1 (Đáy)' }],
      hiddenCount: 0,
      visibleCount: 4,
      tip: 'Mặt bằng có 2 hàng, mỗi hàng có 2 khối. Tổng cộng: 2 + 2 = 4 khối lập phương.',
    },
  },
  {
    id: 5,
    title: 'Chữ T Nằm Ngang',
    category: 'Làm quen 1 tầng',
    difficulty: 'de',
    difficultyLabel: 'Mức 1: Khởi động',
    gridSize: { rows: 3, cols: 3, maxZ: 1 },
    cubes: generateFromHeightMatrix([
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]),
    answer: 4,
    options: [3, 4, 5, 6],
    explanation: {
      layers: [{ layerNum: 1, count: 4, name: 'Tầng 1 (Đáy)' }],
      hiddenCount: 0,
      visibleCount: 4,
      tip: 'Thanh ngang có 3 khối, thanh dọc thêm 1 khối ở trên. 3 + 1 = 4 khối.',
    },
  },
  {
    id: 6,
    title: 'Cột Tháp 3 Tầng',
    category: 'Xếp tầng cơ bản',
    difficulty: 'de',
    difficultyLabel: 'Mức 1: Khởi động',
    gridSize: { rows: 3, cols: 3, maxZ: 3 },
    cubes: generateFromHeightMatrix([
      [0, 0, 0],
      [0, 3, 0],
      [0, 0, 0],
    ]),
    answer: 3,
    options: [2, 3, 4, 5],
    explanation: {
      layers: [
        { layerNum: 1, count: 1, name: 'Tầng 1 (Đáy)' },
        { layerNum: 2, count: 1, name: 'Tầng 2 (Giữa)' },
        { layerNum: 3, count: 1, name: 'Tầng 3 (Đỉnh)' },
      ],
      hiddenCount: 0,
      visibleCount: 3,
      tip: 'Ba khối xếp chồng lên nhau thành một cột cao: Tầng 1, Tầng 2, Tầng 3 = 3 khối.',
    },
  },

  // ================= CẤP ĐỘ 2: TRUNG BÌNH (CÓ KHỐI ẨN / ĐA TẦNG: 6 - 12 KHỐI) =================
  {
    id: 7,
    title: 'Bậc Thang 3 Bậc Đơn',
    category: 'Xếp bậc thang',
    difficulty: 'trung_binh',
    difficultyLabel: 'Mức 2: Khối tầng & Bậc',
    gridSize: { rows: 3, cols: 1, maxZ: 3 },
    cubes: generateFromHeightMatrix([
      [3],
      [2],
      [1],
    ]),
    answer: 6,
    options: [5, 6, 7, 8],
    explanation: {
      layers: [
        { layerNum: 1, count: 3, name: 'Tầng 1 (Đáy)' },
        { layerNum: 2, count: 2, name: 'Tầng 2 (Giữa)' },
        { layerNum: 3, count: 1, name: 'Tầng 3 (Cao nhất)' },
      ],
      hiddenCount: 0,
      visibleCount: 6,
      tip: 'Đếm theo cột: 3 + 2 + 1 = 6 khối. Hoặc đếm theo tầng: Tầng 1 (3 khối) + Tầng 2 (2 khối) + Tầng 3 (1 khối) = 6 khối!',
    },
  },
  {
    id: 8,
    title: 'Khối Lập Phương Lớn 2x2x2',
    category: 'Khối hộp chữ nhật & lập phương',
    difficulty: 'trung_binh',
    difficultyLabel: 'Mức 2: Khối ẩn ở dưới',
    gridSize: { rows: 2, cols: 2, maxZ: 2 },
    cubes: generateFromHeightMatrix([
      [2, 2],
      [2, 2],
    ]),
    answer: 8,
    options: [6, 7, 8, 9],
    explanation: {
      layers: [
        { layerNum: 1, count: 4, name: 'Tầng 1 (Đáy)' },
        { layerNum: 2, count: 4, name: 'Tầng 2 (Trên cùng)' },
      ],
      hiddenCount: 1,
      visibleCount: 7,
      tip: 'Bé chú ý! Tầng dưới có 4 khối và tầng trên có 4 khối. Khối ở góc trong cùng phía dưới bị che khuất! Tổng = 4 + 4 = 8 khối.',
    },
  },
  {
    id: 9,
    title: 'Tháp Tam Giác 3 Tầng (Hình Mẫu 1)',
    category: 'Hình tháp kim tự tháp',
    difficulty: 'trung_binh',
    difficultyLabel: 'Mức 2: Khối ẩn bên trong',
    referenceImageMatch: 'ly-thuyet-khoi-hop-chu-nhat-khoi-lap-phuong-13.png',
    gridSize: { rows: 3, cols: 3, maxZ: 3 },
    // Pyramid from image 1:
    // Top (layer 3): 1 cube at center (0,0)
    // Layer 2: 3 cubes (supporting top: 1 behind + 2 visible)
    // Layer 1: 6 cubes (triangle base 1+2+3 = 6 cubes)
    cubes: [
      // Layer 0 (Đáy - 6 cubes in triangular pyramid base)
      { x: 0, y: 0, z: 0, id: 'c_0_0_0' },
      { x: 1, y: 0, z: 0, id: 'c_1_0_0' },
      { x: 0, y: 1, z: 0, id: 'c_0_1_0' },
      { x: 2, y: 0, z: 0, id: 'c_2_0_0' },
      { x: 1, y: 1, z: 0, id: 'c_1_1_0' },
      { x: 0, y: 2, z: 0, id: 'c_0_2_0' },
      // Layer 1 (Giữa - 3 cubes sitting on base)
      { x: 0, y: 0, z: 1, id: 'c_0_0_1' },
      { x: 1, y: 0, z: 1, id: 'c_1_0_1' },
      { x: 0, y: 1, z: 1, id: 'c_0_1_1' },
      // Layer 2 (Đỉnh - 1 cube on top)
      { x: 0, y: 0, z: 2, id: 'c_0_0_2' },
    ],
    answer: 10,
    options: [6, 8, 9, 10],
    explanation: {
      layers: [
        { layerNum: 1, count: 6, name: 'Tầng 1 (Đáy hình tam giác)' },
        { layerNum: 2, count: 3, name: 'Tầng 2 (Gồm 1 khối đỡ phía sau và 2 khối phía trước)' },
        { layerNum: 3, count: 1, name: 'Tầng 3 (Khối trên đỉnh)' },
      ],
      hiddenCount: 3,
      visibleCount: 7,
      tip: 'Bí quyết bóc tầng: Tầng 3 có 1 khối, Tầng 2 có 3 khối, Tầng 1 có 6 khối. Cộng lại: 1 + 3 + 6 = 10 khối!',
    },
  },
  {
    id: 10,
    title: 'Ghế Sofa Mini',
    category: 'Mô hình đời sống',
    difficulty: 'trung_binh',
    difficultyLabel: 'Mức 2: Đếm theo tầng',
    gridSize: { rows: 2, cols: 3, maxZ: 2 },
    cubes: generateFromHeightMatrix([
      [2, 2, 2],
      [1, 1, 1],
    ]),
    answer: 9,
    options: [7, 8, 9, 10],
    explanation: {
      layers: [
        { layerNum: 1, count: 6, name: 'Tầng 1 (Đệm và chân ghế)' },
        { layerNum: 2, count: 3, name: 'Tầng 2 (Lưng tựa ghế)' },
      ],
      hiddenCount: 0,
      visibleCount: 9,
      tip: 'Đếm theo 2 phần: Lưng ghế có 3 cột cao 2 (3 x 2 = 6 khối), đệm ghế phía trước có 3 khối cao 1. 6 + 3 = 9 khối.',
    },
  },
  {
    id: 11,
    title: 'Cổng Chào Vững Chãi',
    category: 'Cổng vòm',
    difficulty: 'trung_binh',
    difficultyLabel: 'Mức 2: Khối cầu nối',
    gridSize: { rows: 1, cols: 3, maxZ: 3 },
    cubes: [
      { x: 0, y: 0, z: 0, id: 'c_0_0_0' },
      { x: 0, y: 0, z: 1, id: 'c_0_0_1' },
      { x: 0, y: 0, z: 2, id: 'c_0_0_2' },
      { x: 0, y: 1, z: 2, id: 'c_0_1_2' }, // Cầu nối trên đỉnh
      { x: 0, y: 2, z: 2, id: 'c_0_2_2' },
      { x: 0, y: 2, z: 1, id: 'c_0_2_1' },
      { x: 0, y: 2, z: 0, id: 'c_0_2_0' },
    ],
    answer: 7,
    options: [5, 6, 7, 8],
    explanation: {
      layers: [
        { layerNum: 1, count: 2, name: 'Tầng 1 (Chân hai cột)' },
        { layerNum: 2, count: 2, name: 'Tầng 2 (Thân hai cột)' },
        { layerNum: 3, count: 3, name: 'Tầng 3 (Mái cổng nối liền)' },
      ],
      hiddenCount: 0,
      visibleCount: 7,
      tip: 'Hai cột đứng: mỗi cột 3 khối (3 + 3 = 6). Thêm 1 khối vắt ngang trên đỉnh là 7 khối!',
    },
  },
  {
    id: 12,
    title: 'Khối Hộp Khuyết Một Góc',
    category: 'Toán tư duy lớp 2',
    difficulty: 'trung_binh',
    difficultyLabel: 'Mức 2: Trừ phần khuyết',
    gridSize: { rows: 2, cols: 2, maxZ: 2 },
    cubes: [
      { x: 0, y: 0, z: 0, id: 'c_0_0_0' },
      { x: 1, y: 0, z: 0, id: 'c_1_0_0' },
      { x: 0, y: 1, z: 0, id: 'c_0_1_0' },
      { x: 1, y: 1, z: 0, id: 'c_1_1_0' },
      { x: 0, y: 0, z: 1, id: 'c_0_0_1' },
      { x: 1, y: 0, z: 1, id: 'c_1_0_1' },
      { x: 0, y: 1, z: 1, id: 'c_0_1_1' },
      // (1, 1, 1) bị khuyết
    ],
    answer: 7,
    options: [6, 7, 8, 9],
    explanation: {
      layers: [
        { layerNum: 1, count: 4, name: 'Tầng 1 (Đủ 4 khối ở đáy)' },
        { layerNum: 2, count: 3, name: 'Tầng 2 (Có 3 khối, khuyết 1 góc)' },
      ],
      hiddenCount: 1,
      visibleCount: 6,
      tip: 'Mẹo thông minh: Khối lập phương 2x2x2 đầy đủ là 8 khối. Bị khuyết mất 1 khối ở tầng trên nên còn: 8 - 1 = 7 khối!',
    },
  },

  // ================= CẤP ĐỘ 3: THỬ THÁCH (KHỐI ĐA TẦNG, HÌNH CHỮ U, 12 - 24 KHỐI) =================
  {
    id: 13,
    title: 'Hình Chữ U Đối Xứng (Hình Mẫu 2)',
    category: 'Bài toán trong SGK',
    difficulty: 'thu_thach',
    difficultyLabel: 'Mức 3: Thử thách SGK',
    referenceImageMatch: 'images.png',
    gridSize: { rows: 2, cols: 5, maxZ: 2 },
    // Image 2 has:
    // Left side: 2x2 base, height 2 (8 cubes)
    // Middle trench: 2x1 base, height 1 (2 cubes)
    // Right side: 2x2 base, height 2 (8 cubes)
    cubes: generateFromHeightMatrix([
      [2, 2, 1, 2, 2],
      [2, 2, 1, 2, 2],
    ]),
    answer: 18,
    options: [14, 16, 18, 20],
    explanation: {
      layers: [
        { layerNum: 1, count: 10, name: 'Tầng 1 (Đáy gồm 2 hàng x 5 cột = 10 khối)' },
        { layerNum: 2, count: 8, name: 'Tầng 2 (4 khối bên trái + 4 khối bên phải = 8 khối)' },
      ],
      hiddenCount: 4,
      visibleCount: 14,
      tip: 'Cách 1 đếm theo tầng: Tầng 1 (đáy) có 10 khối. Tầng 2 có 4 + 4 = 8 khối. Tổng: 10 + 8 = 18 khối. Cách 2: Trái (8) + Giữa (2) + Phải (8) = 18 khối!',
    },
  },
  {
    id: 14,
    title: 'Ma Trận Xuyên Thấu X-Ray (Hình Mẫu 3)',
    category: 'Độ cao cột đa dạng',
    difficulty: 'thu_thach',
    difficultyLabel: 'Mức 3: Xuyên thấu X-Ray',
    referenceImageMatch: 'laphuong1-1531818980276966034424.jpg',
    gridSize: { rows: 3, cols: 3, maxZ: 3 },
    // Model closely resembling image 3 with varied column heights
    cubes: generateFromHeightMatrix([
      [3, 3, 0],
      [2, 2, 3],
      [1, 1, 1],
    ]),
    answer: 16,
    options: [13, 14, 15, 16],
    explanation: {
      layers: [
        { layerNum: 1, count: 8, name: 'Tầng 1 (Có 8 khối ở đáy)' },
        { layerNum: 2, count: 5, name: 'Tầng 2 (Có 5 khối ở tầng 2)' },
        { layerNum: 3, count: 3, name: 'Tầng 3 (3 khối trên đỉnh)' },
      ],
      hiddenCount: 3,
      visibleCount: 13,
      tip: 'Bật chế độ nhìn X-Ray hoặc Bóc tách tầng để thấy các khối đỡ bên dưới. Tầng 1 (8) + Tầng 2 (5) + Tầng 3 (3) = 16 khối!',
    },
  },
  {
    id: 15,
    title: 'Lâu Đài Hai Tháp Canh',
    category: 'Mô hình kiến trúc',
    difficulty: 'thu_thach',
    difficultyLabel: 'Mức 3: Đếm cột & tường',
    gridSize: { rows: 3, cols: 3, maxZ: 3 },
    cubes: generateFromHeightMatrix([
      [3, 1, 3],
      [1, 1, 1],
      [1, 1, 1],
    ]),
    answer: 13,
    options: [11, 12, 13, 14],
    explanation: {
      layers: [
        { layerNum: 1, count: 9, name: 'Tầng 1 (Đầy đủ mặt sàn 3x3 = 9 khối)' },
        { layerNum: 2, count: 2, name: 'Tầng 2 (Hai tháp canh = 2 khối)' },
        { layerNum: 3, count: 2, name: 'Tầng 3 (Đỉnh hai tháp = 2 khối)' },
      ],
      hiddenCount: 1,
      visibleCount: 12,
      tip: 'Sàn dưới cùng là hình vuông 3x3 có 9 khối. Hai tháp canh ở hai góc cao thêm 2 tầng (2 x 2 = 4 khối). Tổng: 9 + 4 = 13 khối.',
    },
  },
  {
    id: 16,
    title: 'Bậc Thang Đôi Lớn',
    category: 'Xếp tầng mở rộng',
    difficulty: 'thu_thach',
    difficultyLabel: 'Mức 3: Siêu nhí tính nhanh',
    gridSize: { rows: 2, cols: 3, maxZ: 3 },
    cubes: generateFromHeightMatrix([
      [3, 2, 1],
      [3, 2, 1],
    ]),
    answer: 12,
    options: [10, 11, 12, 14],
    explanation: {
      layers: [
        { layerNum: 1, count: 6, name: 'Tầng 1 (6 khối ở đáy)' },
        { layerNum: 2, count: 4, name: 'Tầng 2 (4 khối)' },
        { layerNum: 3, count: 2, name: 'Tầng 3 (2 khối)' },
      ],
      hiddenCount: 2,
      visibleCount: 10,
      tip: 'Có 2 làn cầu thang song song. Mỗi làn có 3 + 2 + 1 = 6 khối. Cả hai làn có: 6 + 6 = 12 khối lập phương!',
    },
  },
  {
    id: 17,
    title: 'Tòa Nhà 3 Tầng Giếng Trời',
    category: 'Mô hình giếng trời',
    difficulty: 'thu_thach',
    difficultyLabel: 'Mức 3: Rỗng ở giữa',
    gridSize: { rows: 3, cols: 3, maxZ: 2 },
    cubes: generateFromHeightMatrix([
      [2, 2, 2],
      [2, 0, 2],
      [2, 2, 2],
    ]),
    answer: 16,
    options: [14, 15, 16, 18],
    explanation: {
      layers: [
        { layerNum: 1, count: 8, name: 'Tầng 1 (8 khối bao quanh, ô giữa trống)' },
        { layerNum: 2, count: 8, name: 'Tầng 2 (8 khối bao quanh)' },
      ],
      hiddenCount: 2,
      visibleCount: 14,
      tip: 'Khung vuông 3x3 nhưng rỗng ô ở chính giữa. Mỗi tầng có 8 khối. 2 tầng có: 8 + 8 = 16 khối.',
    },
  },
  {
    id: 18,
    title: 'Tháp Chóp 4 Tầng Bậc Thang',
    category: 'Kim tự tháp lớn',
    difficulty: 'thu_thach',
    difficultyLabel: 'Mức 3: Thử thách đỉnh cao',
    gridSize: { rows: 4, cols: 1, maxZ: 4 },
    cubes: generateFromHeightMatrix([
      [4],
      [3],
      [2],
      [1],
    ]),
    answer: 10,
    options: [9, 10, 11, 12],
    explanation: {
      layers: [
        { layerNum: 1, count: 4, name: 'Tầng 1 (4 khối)' },
        { layerNum: 2, count: 3, name: 'Tầng 2 (3 khối)' },
        { layerNum: 3, count: 2, name: 'Tầng 3 (2 khối)' },
        { layerNum: 4, count: 1, name: 'Tầng 4 (1 khối)' },
      ],
      hiddenCount: 0,
      visibleCount: 10,
      tip: 'Cộng theo dãy số bậc thang: 4 + 3 + 2 + 1 = 10 khối lập phương!',
    },
  },
];
