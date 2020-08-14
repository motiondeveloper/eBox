import { thisLayer, thisProperty } from "./expression-globals";

type Point = [number, number];
type Points = [Point, Point, Point, Point];
type Anchor = "topLeft" | "topRight" | "bottomRight" | "bottomLeft" | "center";
interface BoxProps {
  size: Point;
  position: Point;
  anchor: Anchor;
  isClosed: boolean;
}

function createBox(
  {
    size = [100, 100],
    position = [0, 0],
    anchor = "center",
    isClosed = true,
  }: BoxProps,
  layer: Layer = thisLayer,
  property: Property = thisProperty
) {
  const pointOrder: Anchor[] = [
    "topLeft",
    "topRight",
    "bottomRight",
    "bottomLeft",
  ];

  function positionToCenter(
    position: Point,
    size: Point,
    anchor: Anchor
  ): Point {
    const positionCalculations = {
      center: (): Point => position,
      topLeft: (): Point => [
        position[0] + size[0] / 2,
        position[1] + size[1] / 2,
      ],
      topRight: (): Point => [
        position[0] - size[0] / 2,
        position[1] + size[1] / 2,
      ],
      bottomLeft: (): Point => [
        position[0] + size[0] / 2,
        position[1] - size[1] / 2,
      ],
      bottomRight: (): Point => [
        position[0] - size[0] / 2,
        position[1] - size[1] / 2,
      ],
    };

    return positionCalculations[anchor]();
  }

  function sizeToPoints(size: Point): Points {
    return [
      [-size[0] / 2, -size[1] / 2],
      [size[0] / 2, -size[1] / 2],
      [size[0] / 2, size[1] / 2],
      [-size[0] / 2, size[1] / 2],
    ];
  }
  function movePoints(
    points: Points,
    oldPosition: Point,
    newPosition: Point
  ): Points {
    const positionDelta: Point = newPosition.map(
      (dimension, dimensionIndex): number => {
        return dimension - oldPosition[dimensionIndex];
      }
    ) as Point;

    return points.map(
      (point: Point): Point => {
        return point.map((dimension, dimensionIndex) => {
          return dimension + positionDelta[dimensionIndex];
        }) as Point;
      }
    ) as Points;
  }

  function pointsToComp(points: Points): Points {
    return points.map(
      (point): Point => layer.fromCompToSurface(point)
    ) as Points;
  }
  function pointsToPath(points: Points, isClosed: boolean) {
    property.createPath(points, [], [], isClosed);
  }

  const centerPosition = positionToCenter(position, size, anchor);
  interface OutputBox extends BoxProps {
    centerPosition: Point;
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

  function scalePoints(scale: Point = [100, 100], anchor: Anchor): void {
    // Remap scale to [0..1]
    const normalizedScale: Point = scale.map((scale) => scale / 100) as Point;

    // Get index of anchor point
    const anchorPointIndex: number = pointOrder.indexOf(anchor);
    const anchorPoint: Point = boxPoints[anchorPointIndex];

    // Calculate distance from anchor point
    const pointDeltas: Points = boxPoints.map((point) => {
      return point.map((dimension, dimensionIndex): number => {
        return dimension - anchorPoint[dimensionIndex];
      }) as Point;
    }) as Points;

    // Scale the point deltas according to input scale
    const scaledPointDeltas: Points = pointDeltas.map(
      (point): Point => {
        return point.map((dimension, dimensionIndex): number => {
          return dimension * normalizedScale[dimensionIndex];
        }) as Point;
      }
    ) as Points;

    const scaledPoints: Points = boxPoints.map(
      (point, pointIndex): Point => {
        if (pointIndex !== anchorPointIndex) {
          // If not the anchor point
          // Create the point from the scaledPointDelta
          return point.map((pointDimension, dimensionIndex): number => {
            return (
              anchorPoint[dimensionIndex] +
              scaledPointDeltas[pointIndex][dimensionIndex]
            );
          }) as Point;
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

export { createBox };
