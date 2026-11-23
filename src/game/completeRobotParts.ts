export type Shape =
  | { kind: 'rect'; x: number; y: number; width: number; height: number; radius: number; color: string }
  | { kind: 'line'; x: number; y: number; endX: number; endY: number; weight: number; color: string }
  | { kind: 'circle'; x: number; y: number; radius: number; color: string };

const rect = (x: number, y: number, width: number, height: number, color: string, radius = 0): Shape =>
  ({ kind: 'rect', x, y, width, height, color, radius });
const line = (x: number, y: number, endX: number, endY: number, weight: number, color: string): Shape =>
  ({ kind: 'line', x, y, endX, endY, weight, color });
const circle = (x: number, y: number, radius: number, color: string): Shape =>
  ({ kind: 'circle', x, y, radius, color });

const dark = '#112938';
export const unselectedRobotColor = '#38505d';

export function getMultiplicationArtId(stageId: string, visual: string) {
  return stageId === 'corpo' && visual === 'robot' ? 'montagem' : stageId;
}

export const completeRobotLegs = [
  rect(137, 134, 16, 17, unselectedRobotColor),
  rect(167, 134, 16, 17, unselectedRobotColor),
];

export const robotPartViewBoxes: Readonly<Record<string, string>> = {
  carcaca: '120 66 80 64',
  antena: '134 26 52 42',
  montagem: '116 57 88 74',
  rodas: '113 109 94 41',
  caminho: '0 0 62 32',
  cabeca: '131 48 58 42',
  corpo: '124 88 72 51',
  bracos: '99 93 122 41',
  sensores: '140 27 40 34',
};

export function getRobotPartShapes(
  stageId: string, variant: number, color: string, bodyVariant = 0, celebrating = false,
): Shape[] {
  const bodyWidth = [44, 62, 50][stageId === 'corpo' ? variant : bodyVariant] ?? 44;
  const bodyLeft = 160 - bodyWidth / 2;

  if (stageId.startsWith('setor-')) {
    const middleY = [16, 6, 26][variant] ?? 16;
    return [
      line(7, 16, 20, middleY, 4, color),
      line(20, middleY, 42, middleY, 4, color),
      line(42, middleY, 55, 16, 4, color),
      circle(7, 16, 3, color), circle(55, 16, 3, color),
    ];
  }

  switch (stageId) {
    case 'carcaca':
      return [rect(126, 70, 68, 58, color, 2), rect(149, 94, 22, 9, dark)];
    case 'antena':
      return variant === 0
        ? [line(160, 66, 160, 36, 5, color), circle(160, 34, 4, color)]
        : [
          line(160, 66, 160, 52, 5, color),
          line(160, 54, 146, 35, 5, color), line(160, 54, 174, 35, 5, color),
          circle(146, 34, 4, color), circle(174, 34, 4, color),
        ];
    case 'montagem': {
      const width = [50, 68, 58, 76][variant] ?? 50;
      const height = [48, 40, 54, 58][variant] ?? 48;
      return [
        rect(160 - width / 2, 122 - height, width, height, color, [2, 4, 17, 12][variant] ?? 2),
        rect(149, 98 - (height - 40) / 2, 22, 9, dark),
      ];
    }
    case 'rodas': {
      const radius = [11, 15, 13][variant] ?? 11;
      return [136, 184].flatMap((x) => [
        circle(x, 131, radius, '#081c26'),
        circle(x, 131, radius - 3, color),
        circle(x, 131, variant === 2 ? 6 : 3, dark),
        ...(variant === 2 ? [circle(x, 131, 2, '#d3e0e2')] : []),
      ]);
    }
    case 'cabeca':
      return [
        rect(135, 52, 50, 34, color, [1, 17, 7][variant] ?? 1),
        rect(145, 65, 8, 7, dark), rect(167, 65, 8, 7, dark),
      ];
    case 'corpo':
      return [
        rect(bodyLeft, 91, bodyWidth, 45, color, variant === 2 ? 13 : 2),
        rect(149, 106, 22, 13, dark), rect(156, 109, 8, 7, '#f4c955'),
      ];
    case 'bracos': {
      const offset = variant ? 22 : 16;
      const weight = variant ? 8 : 12;
      const endY = celebrating ? 72 : 126;
      return [
        line(bodyLeft, 102, bodyLeft - offset, endY, weight, color),
        line(320 - bodyLeft, 102, 320 - bodyLeft + offset, endY, weight, color),
      ];
    }
    case 'sensores':
      return variant === 0
        ? [line(160, 57, 160, 38, 4, color), circle(160, 36, 4, color)]
        : [
          line(160, 53, 148, 36, 4, color), line(160, 53, 172, 36, 4, color),
          circle(148, 35, 4, color), circle(172, 35, 4, color),
        ];
    default:
      return [];
  }
}
