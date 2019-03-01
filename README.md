# eBox

eBox a system for creating rectangles in After Effects with intuitive controls for changing their position, size, and scale. It comes in the form of a JSON file that's imported into the project, and a set of expressions to be applied to the path property of a shape layer, with all of the box parameters edited within the expression.

Its purpose is to speed up the creation of After Effects templates and other automated work.

**Please note eBox is not currently working!**

## Usage

1. **Download and import [`eBox.jsx`](https://github.com/motiondeveloper/eBox/raw/master/eBox.jsx) into your After Effects project**

   This is the JSON file that contains the necesary code to run eBox. You may not be able to drag and drop it into your project, in which case you will need to use the import dialog.

   **Note:** eBox is only compatable with After Effects versions >= 15.1.

2. **Add a refrence to the library in your expression**

   To refrence the library in an expression, you need to assign it to a variable. This is done via the line:

   ```javascript
   var eBox = footage("Box.jsx").sourceData;
   ```

3. **Create an eBox**

   This creates a rectangle, with a set of controls for modifying it.

   ```javascript
   var myBox = new eBox.Box();
   ```

   You can create as many of these boxes as you like, with properties for each box. This comes in handy when you need to toggle between different boxes, while still having the ability to have them within the same expression.

4. **Modify the size, position and scale**

   Each of the standard transform properties can be modified by providing it's value, as well as an anchor point.

   Change the width and height of the box, pinned from the center or a corner:

   ```javascript
   eBoxName.setSize(size, anchorPoint);
   ```

    - size: `[width, height]`
    - anchorPoint: The desired location to scale from. Either `'center'`, `'topLeft'`, `'topRight'`, `'bottomLeft'` or `'bottomRight'`.

    Move the box to a new position:

   ```javascript
   eBoxName.setPosition(position, anchorPoint);
   ```

   - position: `[x, y]`

   Scale the box, from the center or a corner:

   ```javascript
   eBoxName.setScale(scale, anchorPoint);
   ```

   - scale: `[0...100, 0...100]`

5. **Show the box**

    This returns the path for the box:

    ```javascript
    eBoxName.show();
    ````

The main advantage is that each of the transform properties can be changed, while maintaining a particular anchor point. This means they can be animated on and off, or scale to fit content easily.

Each of the properties can easily be animated with the expression animation tool, **[`eKeys`](https://github.com/motiondeveloper/ekeys)**.

## Example

An example setup of an eBox setup:

```javascript
// Import eBox library
var eBox = footage("Box.jsx").sourceData;

// Create new eBox
var myBox = new eBox.Box();

// Set the size and position
myBox.setPosition([thisComp.width/2, thisComp.height/2], center);
myBox.setSize([600, 200], center);

// Animate the box scaling on from the left
var scaleIn = ease(time, 0, 2, 0, 100);
myBox.setScale([scaleIn,100], topLeft);

// Return the box path
myBox.show()
```

## To Do

- [x] Actually try the code in After Effects
- [x] Write setScale function
- [ ] Fix setScale anchor points
- [ ] Add edge center anchor points (e.g. topCenter, leftCenter)

## License

This project is licensed under the terms of the MIT license.

## Contact

If you have any questions, feedback or anything else feel free to contact me at:

`tim@haywood.org`