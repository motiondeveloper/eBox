{
  "createBox": function(boxProps = {}, layer = thisLayer) {

    const pointOrder = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];

    const positionToCenter = (position, size, anchor) => {
      return {
        'center': position,
        'topLeft': position + [size[0]/2, size[1]/2],
        'topRight': position + [-size[0]/2, size[1]/2],
        'bottomLeft': position + [size[0]/2, -size[1]/2],
        'bottomRight': position + [-size[0]/2, -size[1]/2],
      }[anchor];        
    }

    const sizeToPoints = (size) => {
      return [
        [-size[0]/2, -size[1]/2],
        [size[0]/2, -size[1]/2],
        [size[0]/2, size[1]/2],
        [-size[0]/2, size[1]/2]
      ];
    }
    const movePoints = (points, position) => points.map(point => point + position);
    const pointsToComp = points => points.map(point => layer.toComp(point));
    const pointsToPath = (points, isClosed) => layer.createPath(points, 0, 0, isClosed);

    function createPointsFromBoxProps(boxProps) {
      const points = sizeToPoints(boxProps.size);
      const centeredPoints = movePoints(points, boxProps.centerPosition);
      const compPositionPoints = pointsToComp(centeredPoints);

      return compPositionPoints;
    }

    function scalePoints(scale = [100, 100], anchor) {

      // Remap scale to [0..1]
      const normalizedScale = scale.map(scale => scale / 100);
      // Set which point won't be scaled
      const staticPointNum = pointOrder.indexOf[anchor];
      // Calculate distance from anchor point
      const pointDeltas;

      const pointScales = [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
      ];

      // Scale the point deltas according to input scale
      const scaledPointDeltas;

      // Get final points by adding scaled deltas to anchor point

      // Return points multiplied by relevant pointScale
      this.points = this.points.map(
        (point, pointIndex) => {
          return point.map(
            (pointDimension, pointDimensionIndex) => {
              return pointDimension * pointScales[pointIndex][pointDimensionIndex];
            }
          )
        }
      );
    }

    // Destructuring boxProps, with defaults
    const {
      size = [800, 200],
      position = [960, 540],
      anchor = 'center',
      isClosed = true,
    } = boxProps;

    const centerPosition = positionToCenter(box.position, box.size, box.anchor);

    this.points = createPointsFromBoxProps({size, position, anchor, isClosed, centerPosition});
    this.setScale = scalePoints();
    this.show = pointsToPath(this.points, isClosed);
  }
}