import { Layer, PathProperty } from 'expression-globals-typescript';

// Creating layer and property mocks
const thisLayer = new Layer();
const thisProperty = new PathProperty([[0, 0]]);

// eBox types
type Anchor = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'center';
type Rounding = [number, number, number, number];
type Vector2D = [number, number];
type Points = Array<Vector2D>;

interface BoxProps {
  size: Vector2D;
  position: Vector2D;
  anchor: Anchor;
  isClosed: boolean;
  rounding: Rounding;
  tangentMult: number;
}

function createBox({
  size = [100, 100],
  position = [0, 0],
  rounding = [0, 0, 0, 0],
  anchor = 'center',
  isClosed = true,
  tangentMult = 0.5,
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
    return points.map((point): Vector2D => thisLayer.fromComp(point)) as Points;
  }

  function pointsToPath(points: Points, rounding: Rounding, isClosed: boolean) {
    const [pTl, pTr, pBr, pBl] = points;

    const width = pTr[0] - pTl[0];
    const height = pBl[1] - pTl[1];

    const [rTl, rTr, rBr, rBl] = rounding.map(radius => {
      const minDimension = Math.min(width, height);
      return Math.max(Math.min(minDimension / 2, radius), 0);
    });

    const cornerPoints = [
      // Top left
      thisLayer.add(pTl, [0, rTl]),
      thisLayer.add(pTl, [rTl, 0]),
      // Top right
      thisLayer.add(pTr, [-rTr, 0]),
      thisLayer.add(pTr, [0, rTr]),
      // Bottom right
      thisLayer.add(pBr, [0, -rBr]),
      thisLayer.add(pBr, [-rBr, 0]),
      // Bottom left
      thisLayer.add(pBl, [rBl, 0]),
      thisLayer.add(pBl, [0, -rBl]),
    ];

    const inTangents = [
      // Top left
      [0, 0],
      [-rTl, 0],
      // Top right
      [0, 0],
      [0, -rTr],
      // Bottom right
      [0, 0],
      [rBr, 0],
      // Bottom left
      [0, 0],
      [0, rBl],
    ].map(p => thisLayer.mul(p, tangentMult));
    const outTangents = [
      // Top left
      [0, -rTl],
      [0, 0],
      // Top right
      [rTr, 0],
      [0, 0],
      // Bottom right
      [0, rBr],
      [0, 0],
      // Bottom left
      [-rBl, 0],
      [0, 0],
    ].map(p => thisLayer.mul(p, tangentMult));

    return thisProperty.createPath(
      cornerPoints,
      inTangents,
      outTangents,
      isClosed
    );
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
    rounding,
  });

  function getBoxPath() {
    return pointsToPath(boxPoints, rounding, isClosed);
  }

  function createPointsFromBoxProps(
    boxProps: Omit<OutputBox, 'tangentMult'>
  ): Points {
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
