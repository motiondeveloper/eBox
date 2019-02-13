// @ts-check
{
    "Box": function() {

        var boxPoints = [[0,0], [100,0], [50,100], [50,0]];

        this.setSize = function(size, anchorPoint) {
            if (sizeIsValid(size)) {
                var originalPosition = getPosition();
                boxPoints = setSizeFromCenter(size);
                boxPoints = movePointsCenter(cornerToCenterPosition(originalPosition, anchorPoint));
            } else {
                throw new Error('Invalid box size');
            }
        }

        this.setPosition = function(position, anchorPoint) {
            if (positionIsValid(position)) {
                boxPoints = movePointsCenter(cornerToCenterPosition(position, anchorPoint));
            } else {
                throw new Error('Invalid box position')
            }
        }

        this.showBox = function() {
            return pointsToPath(boxPoints)
        }

        function getSize() {
            return [boxPoints[1][0] - boxPoints[0][0], boxPoints[1][1] - boxPoints[0][1]];
        }

        function getPosition() {
            return boxPoints[0] + getSize()/2;
        }

        function setSizeFromCenter(size) {
            
            var points = sizeToPoints(size);

            for(i=0; i<points.length; i++) {
                points[i] += boxPosition;
            }

            return points;
        }

        function movePointsCenter(position) {

            var boxPosition = getPosition();
            var points = boxPoints;
            var positionDelta = boxPosition - position;

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

        function sizeToPoints(size) {
            var points = [
                [-size[0]/2, size[1]/2],
                [size[0]/2, size[1]/2],
                [size[0]/2, -size[1]/2],
                [-size[0]/2, -size[1]/2]
            ];
            return points;
        }

        function pointsToPath(points) {
            var pathPoints = [];
            for(i=0; i<points.length; i++) {
                pathPoints.push(fromCompToSurface(points[i]));
            }
            
            return createPath(pathPoints, [], [], closed);
        }

        function sizeIsValid(size) {
            if(size.length === 2) {
                return true;
            } else {
                return false;
            }
        }

        function positionIsValid(position) {
            return sizeIsValid(position);
        }
    }
}