/**
 * Creates a new box-shaped object. If height is omitted, a cube is created.
 * @param {number} xPos X position on screen (anchored to top-left corner)
 * @param {number} yPos Y position on screen (anchored to top-left corner)
 * @param {number} width Width of element
 * @param {number} height Height of element
 */

// TODO switch to centre-based positioning
function objectBoxCreator(xPos, yPos, width, height = width) {
  const thisBox = {
    xPos, yPos, width, height,
  };
  return {
    ...thisBox,
    boundsCheck: (childObject) => {
      if (childObject.xPos < thisBox.xPos) { return false; }
      if (childObject.yPos < thisBox.yPos) { return false; }
      if (childObject.xPos + childObject.width > thisBox.xPos + thisBox.width) { return false; }
      if (childObject.yPos + childObject.height > thisBox.yPos + thisBox.height) { return false; }
      return true;
    },
    getRadius: () => thisBox.width / 2,
  };
}

export default objectBoxCreator;
