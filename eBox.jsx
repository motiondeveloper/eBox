{
  "createBox": function(boxProps = {}, layer = thisLayer) {

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
      
      // Set anchor corner as [0, 0] for easy scaling
      const pointsToCorner = (anchor) => {
        // Get a center position that would zero out the corner
        const centeredPosition = positionToCenter([0,0], this.size, anchor);
        // Return points at that position
        return movePoints(this.points, centeredPosition);
      }

      // Points moved to [0, 0]
      const anchoredPoints = pointsToCorner(anchor);

      // Points scaled 
      const scaledPoints = [
          [anchoredPoints[0][0] * p1XScale, anchoredPoints[0][1] * point1YScale],
          [anchoredPoints[1][0] * p2XScale, anchoredPoints[1][1] * point2YScale],
          [anchoredPoints[2][0] * p3XScale, anchoredPoints[2][1] * point3YScale],
          [anchoredPoints[3][0] * p4XScale, anchoredPoints[4][1] * point4YScale]
        ];
      

      }
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