/**
 * Creates a new box-shaped object. If height is omitted, a cube is created.
 * @param {number} xPos X position on screen (anchored to top-left corner)
 * @param {number} yPos Y position on screen (anchored to top-left corner)
 * @param {number} width Width of element
 * @param {number} height Height of element
 */
function objectBoxCreator(xPos, yPos, width, height = width) {
  const thisBox = {
    xPos, yPos, width, height,
  };
  return {
    ...thisBox,
    boxBoundsCheck: (childObject) => {
      if (childObject.xPos < thisBox.xPos) { return false; }
      if (childObject.yPos < thisBox.yPos) { return false; }
      if (childObject.xPos + childObject.width > thisBox.xPos + thisBox.width) { return false; }
      if (childObject.yPos + childObject.height > thisBox.yPos + thisBox.height) { return false; }
      return true;
    },
    getRadius: () => thisBox.width / 2,
  };
}

/**
 * Creates a new box-shaped object. If height is omitted, a cube is created.
 * @param {number} xPos - X position on screen (anchored to top-left corner)
 * @param {number} yPos - Y position on screen (anchored to top-left corner)
 * @param {number} width - Width of element
 * @param {number} height - Height of element. Create a cube by omitting this.
 */
function RectObject(xPos, yPos, width, height = width) {
  const thisRect = {
    xPos, yPos, width, height,
  };
  return {
    ...thisRect,
    /**
     * This function checks if the given coordinates are valid for a child
     *  rectangle inside this one. Returns boolean.
     */
    boundsCheck: (childObject) => {
      if (childObject.xPos < thisRect.xPos) { return false; }
      if (childObject.yPos < thisRect.yPos) { return false; }
      if (childObject.xPos + childObject.width > thisRect.xPos + thisRect.width) { return false; }
      if (childObject.yPos + childObject.height > thisRect.yPos + thisRect.height) { return false; }
      return true;
    },
  };
}

/**
 * Creates a new circle-shaped object.
 * @param {number} xPos - X position on screen (anchored to center)
 * @param {number} yPos - Y position on screen (anchored to center)
 * @param {number} radius - Radius of element
 */
function CircleObject(xPos, yPos, radius) {
  const thisCircle = {
    xPos, yPos, radius,
  };
  return {
    ...thisCircle,
    /**
     * Checks if the coordinates given for another circle will result
     * in a collision with this one. Returns boolean.
     */
    collisionCheck: (otherCircle) => {
      // TODO implement this
      return false;
    },
  };
}
