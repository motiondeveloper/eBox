[back to top ↑]: #ebox-

# eBox <!-- omit in toc -->

eBox a system for creating rectangles in After Effects with intuitive controls for changing their position, size, and scale.

It comes in the form of a JSON file that's imported into the project, and a set of expressions you apply to a path property, with the box parameters edited within the expression.

The benefit of using eBox is being able to easily create and scale boxes in expressions, while maintaining a consistent anchor point.

You can animate each of the box properties with the expression animation tool, **[`eKeys 🔑`](https://github.com/motiondeveloper/ekeys)**.

## Contents <!-- omit in toc -->

- [Example](#Example)
- [Usage](#Usage)
- [License](#License)
- [Contact](#Contact)

## Example

An example setup of an eBox setup:

```javascript
// Import eBox library
const eBox = footage("eBox.jsx").sourceData;

// Create new eBox
const myBox = eBox.createBox({
  size: [800, 200],
  position: [960, 540],
  anchor: 'center',
});

// Scale the box in from the left
myBox.setScale([scaleIn, 100], 'topLeft');

// Scale the box off from the right
myBox.setScale([scaleOut, 100], 'topRight');

// Return the box path
myBox.getPath();
```

[Back To Top ↑]

## Usage

1. **Download and import [`eBox.jsx`](https://github.com/motiondeveloper/eBox/raw/master/eBox.jsx) into your After Effects project**

    This is the JSON file that contains the necesary code to run eBox. You may not be able to drag and drop it into your project, in which case you will need to use the import dialog.

    **Note:** eBox is only compatable with After Effects versions >= 15.1.

2. **Add a refrence to the library in your expression**

    To refrence the library in an expression, you need to assign it to a variable. This is done via the line:

    ```javascript
    const eBox = footage("eBox.jsx").sourceData;
    ```
    > ⚠️ Since After Effects doesn't count footage items that are only referenced within expressions as used, it's recommended that you also place the `eBox.jsx` file in any compositions where it is referenced.
    >
    > This will ensure After Effects includes the file when collecting assets or packaging into a Motion Graphics Template.

3. **Create an eBox**

    This creates a rectangle, with a set of controls for modifying it.

    ```javascript
    const myBox = eBox.createBox({
        size: [800, 200],
        position: [960, 540],
        anchor: 'topLeft',
        isClosed: true,
    });
    ```

4. **Set the scale**

    > This step is optional, you can call `myBox.getPath()` without applying any scaling

    Scale the box, from the center or a corner:

    ```javascript
    myBox.setScale(scale, anchorPoint);
    ```

    - scale: `[0...100, 0...100]`
    - anchorPoint: ``

5. **Show the box**

    This function returns the path for the box:

    ```javascript
    eBoxName.getPath();
    ````

[Back To Top ↑]

## License

This project is licensed under the terms of the MIT license.

[Back To Top ↑]

## Contact

Bugs, issues and feature requests can be submitted by filing an [issue](https://github.com/motiondeveloper/ekeys/issues) on Github. For everything else, feel free to reach out to [@modeveloper](https://twitter.com/modeveloper) on twitter.

[Back To Top ↑]
