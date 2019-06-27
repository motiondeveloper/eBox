{
  "createBox": function(boxProps = {}, layer = thisLayer, property = thisProperty) {

    const pointOrder = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];

    const positionToCenter = (position, size, anchor) => {

      const positionCalculations = {
        'center': () => position,
        'topLeft': () => [position[0] + size[0]/2, position[1] + size[1]/2],
        'topRight': () => [position[0] -size[0]/2, position[1] + size[1]/2],
        'bottomLeft': () => [position[0] + size[0]/2, position[1] - size[1]/2],
        'bottomRight': () => [position[0] - size[0]/2, position[1] - size[1]/2],
      }

      return positionCalculations[anchor]();
    }

    const sizeToPoints = (size) => {
      return [
        [-size[0]/2, -size[1]/2],
        [size[0]/2, -size[1]/2],
        [size[0]/2, size[1]/2],
        [-size[0]/2, size[1]/2]
      ];
    }
    const movePoints = (points, oldPosition, newPosition) => {
      const positionDelta = newPosition.map((dimension, dimensionIndex) => {
        return dimension - oldPosition[dimensionIndex];
      });

      return points.map(
        (point) => {
          return point.map(
            (dimension, dimensionIndex) => {
              return dimension + positionDelta[dimensionIndex];
          });
        }
      );
    };
    
    const pointsToComp = points => points.map(point => layer.toComp(point));
    const pointsToPath = (points, isClosed) => property.createPath(points, [], [], isClosed);

    function createPointsFromBoxProps(boxProps) {
      const points = sizeToPoints(boxProps.size);
      const centeredPoints = movePoints(points, [0, 0], boxProps.centerPosition);
      const compPositionPoints = pointsToComp(centeredPoints);

      return compPositionPoints;
    }

    function scalePoints(scale = [100, 100], anchor) {

      // Remap scale to [0..1]
      const normalizedScale = scale.map(scale => scale / 100);
      
      // Get index of anchor point
      const anchorPointIndex = pointOrder.indexOf(anchor);
      const anchorPoint = this.points[anchorPointIndex];
      
      // Calculate distance from anchor point
      const pointDeltas = this.points.map(
        (point) => {
          return point.map(
            (dimension, dimensionIndex) => {
              return dimension - anchorPoint[dimensionIndex];
            }
          );
        }
      );

      // Scale the point deltas according to input scale
      const scaledPointDeltas = pointDeltas.map(
        (point) => {
          return point.map(
            (dimension, dimensionIndex) => {
              return dimension * normalizedScale[dimensionIndex];
            }
          );
        }
      );

      // Get final points by adding scaled deltas to anchor point
      this.points = this.points.map(
        (point, pointIndex) => {
          if (pointIndex !== anchorPointIndex) {
            // If not the anchor point
            // Create the point from the scaledPointDelta
            return this.points[anchorPointIndex].map(
              (pointDimension, dimensionIndex) => {
                return pointDimension + scaledPointDeltas[pointIndex][dimensionIndex];
              }
            )
          } else {
            // If the anchor point
            // Return as is
            return point;
          }
        }
      );
    }

    // Destructuring boxProps, with defaults
    const {
      size = [800, 200],
      position = [960, 540],
      anchor = 'bottomRight',
      isClosed = true,
    } = boxProps;

    const centerPosition = positionToCenter(position, size, anchor);

    this.points = createPointsFromBoxProps({size, position, anchor, isClosed, centerPosition});
    this.setScale = scalePoints;
    this.show = pointsToPath(this.points, isClosed);
  }
}