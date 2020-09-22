import {
  Layer,
  PathProperty,
  Vector2D,
  Points,
  PathValue,
} from 'expression-globals-typescript';

// Creating layer and property mocks
const thisLayer = new Layer();
const thisProperty = new PathProperty<PathValue>([[0, 0]]);

// eBox types
type Anchor = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'center';
interface BoxProps {
  size: Vector2D;
  position: Vector2D;
  anchor: Anchor;
  isClosed: boolean;
}

function createBox({
  size = [100, 100],
  position = [0, 0],
  anchor = 'center',
  isClosed = true,
}: BoxProps) {
  const pointOrder: Anchor[] = [
    'topLeft',
    'topRight',
    'bottomRight',
    'bottomLeft',
  ];

  function positionToCenter(
    position: Vector2D,
    size: Vector2D,
    anchor: Anchor
  ): Vector2D {
    const positionCalculations = {
      center: (): Vector2D => position,
      topLeft: (): Vector2D => [
        position[0] + size[0] / 2,
        position[1] + size[1] / 2,
      ],
      topRight: (): Vector2D => [
        position[0] - size[0] / 2,
        position[1] + size[1] / 2,
      ],
      bottomLeft: (): Vector2D => [
        position[0] + size[0] / 2,
        position[1] - size[1] / 2,
      ],
      bottomRight: (): Vector2D => [
        position[0] - size[0] / 2,
        position[1] - size[1] / 2,
      ],
    };

    return positionCalculations[anchor]();
  }

  function sizeToPoints(size: Vector2D): Points {
    return [
      [-size[0] / 2, -size[1] / 2],
      [size[0] / 2, -size[1] / 2],
      [size[0] / 2, size[1] / 2],
      [-size[0] / 2, size[1] / 2],
    ];
  }
  function movePoints(
    points: Points,
    oldPosition: Vector2D,
    newPosition: Vector2D
  ): Points {
    const positionDelta: Vector2D = newPosition.map(
      (dimension, dimensionIndex): number => {
        return dimension - oldPosition[dimensionIndex];
      }
    ) as Vector2D;

    return points.map(
      (point: Vector2D): Vector2D => {
        return point.map((dimension, dimensionIndex) => {
          return dimension + positionDelta[dimensionIndex];
        }) as Vector2D;
      }
    ) as Points;
  }

  function pointsToComp(points: Points): Points {
    return points.map(
      (point): Vector2D => thisLayer.fromCompToSurface(point) as Vector2D
    ) as Points;
  }
  function pointsToPath(points: Points, isClosed: boolean) {
    return thisProperty.createPath(points, [], [], isClosed);
  }

  const centerPosition = positionToCenter(position, size, anchor);
  interface OutputBox extends BoxProps {
    centerPosition: Vector2D;
  }
  let boxPoints: Points = createPointsFromBoxProps({
    size,
    position,
    anchor,
    isClosed,
    centerPosition,
  });

  function getBoxPath() {
    return pointsToPath(boxPoints, isClosed);
  }
  function createPointsFromBoxProps(boxProps: OutputBox): Points {
    const points = sizeToPoints(boxProps.size);
    const centeredPoints = movePoints(points, [0, 0], boxProps.centerPosition);
    const compPositionPoints = pointsToComp(centeredPoints);

    return compPositionPoints;
  }

  function scalePoints(scale: Vector2D = [100, 100], anchor: Anchor): void {
    // Remap scale to [0..1]
    const normalizedScale: Vector2D = scale.map(
      scale => scale / 100
    ) as Vector2D;

    // Get index of anchor point
    const anchorPointIndex: number = pointOrder.indexOf(anchor);
    const anchorPoint: Vector2D = boxPoints[anchorPointIndex];

    // Calculate distance from anchor point
    const pointDeltas: Points = boxPoints.map(point => {
      return point.map((dimension, dimensionIndex): number => {
        return dimension - anchorPoint[dimensionIndex];
      }) as Vector2D;
    }) as Points;

    // Scale the point deltas according to input scale
    const scaledPointDeltas: Points = pointDeltas.map(
      (point): Vector2D => {
        return point.map((dimension, dimensionIndex): number => {
          return dimension * normalizedScale[dimensionIndex];
        }) as Vector2D;
      }
    ) as Points;

    const scaledPoints: Points = boxPoints.map(
      (point, pointIndex): Vector2D => {
        if (pointIndex !== anchorPointIndex) {
          // If not the anchor point
          // Create the point from the scaledPointDelta
          return point.map((pointDimension, dimensionIndex): number => {
            return (
              anchorPoint[dimensionIndex] +
              scaledPointDeltas[pointIndex][dimensionIndex]
            );
          }) as Vector2D;
        } else {
          // If the anchor point
          // Return as is
          return point;
        }
      }
    ) as Points;

    boxPoints = scaledPoints;
  }

  return {
    setScale: scalePoints,
    getPath: getBoxPath,
  };
}

const version: string = '_npmVersion';

export { createBox, version };
