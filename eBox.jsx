{
  "createBox": function(layer, boxProps = {}) {
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

    function createPathFromBoxProps(boxProps) {
      const points = sizeToPoints(boxProps.size);
      const centeredPoints = movePoints(points, boxProps.centerPosition);
      const compPositionPoints = pointsToComp(centeredPoints);
      const boxPath = pointsToPath(compPositionPoints, box.isClosed);

      return boxPath;
    }

    function scaleBox(boxProps, scale = [100, 100], anchor) {
      const scaledSize = [boxProps.size[0] * scale[0], boxProps.scale * scale[1]];
      return {
        ...boxProps,
        size: scaledSize,
      }
    }

    const box = {
      size: [500, 500],
      position: [960, 540],
      anchor: 'bottomLeft',
      isClosed: true,
    }

    box.centerPosition = positionToCenter(box.position, box.size, box.anchor);
    box.path = createPathFromBoxProps(box);
  }
}