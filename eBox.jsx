{
    "Box": function() {

        var boxPoints = [[0,0], [0,0], [0,0], [0,0]];

        this.setSize = function(size) {
            if (sizeIsValid(size)) {
                var originalPosition = getPosition(boxPoints);
                var tempPoints = sizeToPoints(size);
                boxPoints = movePointsCenter(tempPoints, originalPosition);
            }
        }

        this.setPosition = function(position, anchorPoint) {
            if (positionIsValid(position)) {
                var tempPoints = copyArray(boxPoints);
                boxPoints = movePointsCenter(tempPoints, cornerToCenterPosition(position, anchorPoint, tempPoints));
            }
        }

        this.setScale = function(scale, anchorPoint) {
            if (scaleIsValid(scale)) {
                var originalSize = getSize(boxPoints);
                var originalPosition = getPosition(boxPoints);
                var scaledSize = [originalSize[0] * (scale[0] / 100), originalSize[1] * (scale[1] / 100)];
                var scaledPoints = sizeToPoints(scaledSize);
                boxPoints = movePointsCenter(scaledPoints, originalPosition);
            }
        }

        this.show = function() {
            return pointsToPath(boxPoints);
        }

        function getSize(points) {
            var size = [points[1][0] - points[0][0], points[2][1] - points[1][1]];
            return size;
        }

        function getPosition(points) {
            var boxSize = getSize(points)
            return points[0] + boxSize/2;
        }

        function movePointsCenter(points, position) {
            var pointSize = getSize(points);
            var tempPoints = sizeToPoints(pointSize);

            for (var i=0; i<boxPoints.length; i++) {
                tempPoints[i] += position;
            }
            
            return tempPoints;
        }

        function cornerToCenterPosition(position, anchorPoint, points) {

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
            var pathPoints = [];
            for(i=0; i<points.length; i++) {
                pathPoints.push(fromCompToSurface(points[i]));
            }
            
            return createPath(pathPoints, [], [], true);
        }

        function copyArray(originalArray) {
            var copyArray = [];
            for (var i = 0; i < originalArray.length; i++) {
                copyArray[i] = originalArray[i].slice(0);
            }
            return copyArray;
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