import { completeRobotLegs, getMultiplicationArtId, getRobotPartShapes, robotPartViewBoxes, unselectedRobotColor } from './completeRobotParts';
import type { MultiplicationStage } from '../content/challenges';

function RobotShapes({ shapes }: { shapes: ReturnType<typeof getRobotPartShapes> }) {
  return shapes.map((shape, index) => {
    switch (shape.kind) {
      case 'rect':
        return <rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.radius} fill={shape.color} />;
      case 'line':
        return <line key={index} x1={shape.x} y1={shape.y} x2={shape.endX} y2={shape.endY} strokeWidth={shape.weight} stroke={shape.color} />;
      case 'circle':
        return <circle key={index} cx={shape.x} cy={shape.y} r={shape.radius} fill={shape.color} />;
    }
  });
}

export function RobotPartThumbnail({ stageId, variant, color, bodyVariant }: {
  stageId: string;
  variant: number;
  color?: string;
  bodyVariant: number;
}) {
  return <svg className="robot-part-thumbnail" viewBox={robotPartViewBoxes[stageId] ?? robotPartViewBoxes.caminho} aria-hidden="true" focusable="false">
    <RobotShapes shapes={getRobotPartShapes(stageId, variant, color ?? unselectedRobotColor, bodyVariant)} />
  </svg>;
}

export function RobotAssemblyArt({ stages, selections, completed, completeRobot, thumbnail = false }: {
  stages: readonly MultiplicationStage[];
  selections: Readonly<Record<string, string>>;
  completed: boolean;
  completeRobot: boolean;
  thumbnail?: boolean;
}) {
  const bodyStage = stages.find(({ id }) => id === 'corpo');
  const bodyVariant = Math.max(0, bodyStage?.options.findIndex(({ id }) => id === selections.corpo) ?? 0);

  return <svg className="complete-robot-static-art" viewBox={thumbnail ? "106 57 108 93" : "0 0 320 190"} aria-hidden="true" focusable="false">
    {!thumbnail && <rect x="17" y="153.5" width="286" height="25" fill={completed ? '#285b58' : '#203c49'} stroke="#6d8790" strokeWidth="2" />}
    {completeRobot && <RobotShapes shapes={completeRobotLegs} />}
    {(completeRobot ? ['bracos', 'corpo', 'sensores', 'cabeca'] : stages.map(({ id }) => id)).map((stageId) => {
      const stage = stages.find(({ id }) => id === stageId);
      const index = stage?.options.findIndex(({ id }) => id === selections[stageId]) ?? -1;
      const option = stage?.options[index];
      if (!completeRobot && index < 0 && stageId !== stages[0]?.id) return null;
      return <RobotShapes key={stageId} shapes={getRobotPartShapes(
        getMultiplicationArtId(stageId, completeRobot ? 'complete-robot' : 'robot'), Math.max(0, index), option?.color ?? unselectedRobotColor, bodyVariant, completed,
      )} />;
    })}
  </svg>;
}
