{
    "Box": function() {

        var boxPoints = [[0,0], [0,0], [0,0], [0,0]];

        this.setSize = function(size) {
            if (sizeIsValid(size)) {
                var originalPosition = getPosition();
                var tempPoints = sizeToPoints(size);
                boxPoints = movePointsCenter(tempPoints, originalPosition);
            }
        }

        this.setPosition = function(position, anchorPoint) {
            if (positionIsValid(position)) {
                var tempPoints = boxPoints.slice(0);
                boxPoints = movePointsCenter(tempPoints, cornerToCenterPosition(position, anchorPoint));
            }
        }

        var scaledPoints = boxPoints.slice(0);

        this.setScale = function(scale, anchorPoint) {
            if (scaleIsValid(scale)) {
                var originalPosition = centerToCornerPosition(getPosition(), anchorPoint);
                var originalSize = getSize();
                var scaledSize = originalSize * (scale / 100);
                scaledPoints = sizeToPoints(scaledSize);
                scaledPoints = movePointsCenter(scaledPoints, cornerToCenterPosition(originalPosition, anchorPoint));
            }
        }

        this.show = function() {
            return pointsToPath(boxPoints);
        }

        function getSize() {
            return [boxPoints[1][0] - boxPoints[0][0], boxPoints[2][1] - boxPoints[1][1]];
        }

        function getPosition() {
            var boxSize = getSize()
            return boxPoints[0] + boxSize/2;
        }

        function movePointsCenter(points, position) {

            var boxPosition = getPosition();
            var positionDelta = boxPosition + position;

            for (var i=0; i<boxPoints.length; i++) {
                points[i] += positionDelta;
            }
            
            return points;
        }

        function cornerToCenterPosition(position, anchorPoint) {

            var centerPosition = [];
            var boxSize = getSize();

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

        function centerToCornerPosition(center, anchorPoint) {

            var cornerPosition = [];
            var boxSize = getSize();

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
            var pathPoints = [];
            for(i=0; i<points.length; i++) {
                pathPoints.push(fromCompToSurface(points[i]));
            }
            
            return createPath(pathPoints, [], [], true);
        }

        function sizeIsValid(size) {
            return size.length === 2;
        }

        function positionIsValid(position) {
            return position.length === 2;
        }

        function scaleIsValid(scale) {
            return scale.length === 2;
        }
    }
}