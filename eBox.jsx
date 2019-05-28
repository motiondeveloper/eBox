{
    "createBox": function(layer, initialPoints = [[0,0], [0,0], [0,0], [0,0]]) {

        let boxPoints = initialPoints;

        const setSize = (size) => {
            const originalPosition = getPosition(boxPoints);
            const tempPoints = sizeToPoints(size);
            boxPoints = movePointsCenter(tempPoints, originalPosition);
        }

        const setPosition = (position, anchorPoint) => {
            const tempPoints = [...boxPoints];
            boxPoints = movePointsCenter(tempPoints, cornerToCenterPosition(position, anchorPoint, tempPoints));
        }

        const setScale = (scale, anchorPoint) => {
            const originalSize = getSize(boxPoints);
            const originalPosition = getPosition(boxPoints);
            const scaledSize = [originalSize[0] * (scale[0] / 100), originalSize[1] * (scale[1] / 100)];
            const scaledPoints = sizeToPoints(scaledSize);
            boxPoints = movePointsCenter(scaledPoints, originalPosition);
        }

        const getSize = (points) => {
            return [points[1][0] - points[0][0], points[2][1] - points[1][1]];
        }

        const getPosition = (points) => {
            const boxSize = getSize(points);
            return points[0] + boxSize/2;
        }

        const movePointsCenter = (points, position) => {
            return sizeToPoints(getSize(points)).map(point => point += position);
        }

        const cornerToCenterPosition = (position, anchorPoint, points) => {

            var centerPosition = [];
            var boxSize = getSize(points);

            switch (anchorPoint) {
                case 'center':
                    centerPosition = position;
                    break;
                case 'topLeft':
                    centerPosition = position + [boxSize[0]/2, boxSize[1]/2];
                    break;
                case 'topRight':
                    centerPosition = position + [-boxSize[0]/2, boxSize[1]/2];
                    break;
                case 'bottomLeft':
                    centerPosition = position + [boxSize[0]/2, -boxSize[1]/2];
                    break;
                case 'bottomRight':
                    centerPosition = position + [-boxSize[0]/2, -boxSize[1]/2];
                    break;
                default:
                    break;
            }

            return centerPosition;
            
        }

        function centerToCornerPosition(center, anchorPoint, points) {

            var cornerPosition = [];
            var boxSize = getSize(points);

            switch (anchorPoint) {
                case 'center':
                    cornerPosition = center;
                    break;
                case 'topLeft':
                    cornerPosition = center + [-boxSize[0]/2, -boxSize[1]/2];
                    break;
                case 'topRight':
                    cornerPosition = center + [boxSize[0]/2, -boxSize[1]/2];
                    break;
                case 'bottomLeft':
                    cornerPosition = center + [-boxSize[0]/2, boxSize[1]/2];
                    break;
                case 'bottomRight':
                    cornerPosition = center + [boxSize[0]/2, boxSize[1]/2];
                    break;
                default:
                    break;
            }

            return cornerPosition;
            
        }

        function sizeToPoints(size) {
            var points = [
                [-size[0]/2, -size[1]/2],
                [size[0]/2, -size[1]/2],
                [size[0]/2, size[1]/2],
                [-size[0]/2, size[1]/2]
            ];
            return points;
        }

        function pointsToPath(points) {
            const pathPoints = points.map(point => layer.fromCompToSurface(point));
            return pathPoints
;
        }

        const interface = {
            setSize,
            setPosition,
            setScale,
            getSize,
            show: pointsToPath(boxPoints),
        }

        return interface;
    }
}