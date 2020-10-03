/**
 * Creates a new box-shaped object. If height is omitted, a square is created.
 * @param {number} xPos - X position on screen (anchored to top-left corner)
 * @param {number} yPos - Y position on screen (anchored to top-left corner)
 * @param {number} width - Width of element
 * @param {number} height - Height of element. Create a square by omitting this.
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
    childRectBoundsCheck: (childObject) => {
      if (childObject.xPos < thisRect.xPos) { return false; }
      if (childObject.yPos < thisRect.yPos) { return false; }
      if (childObject.xPos + childObject.width > thisRect.xPos + thisRect.width) { return false; }
      if (childObject.yPos + childObject.height > thisRect.yPos + thisRect.height) { return false; }
      return true;
    },
    /**
    * This function checks if the given coordinates are valid for a child
    *  circle inside this rectangle. Returns boolean.
    */
    childCircleBoundsCheck: (childObject) => {
      if (childObject.xPos - childObject.radius < thisRect.xPos) {
        return false;
      }
      if (childObject.yPos - childObject.radius < thisRect.yPos) {
        return false;
      }
      if (childObject.xPos + childObject.radius > thisRect.xPos + thisRect.width) {
        return false;
      }
      if (childObject.yPos + childObject.radius > thisRect.yPos + thisRect.height) {
        return false;
      }
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
export function CircleObject(xPos, yPos, radius) {
  const thisCircle = {
    xPos, yPos, radius,
  };
  return {
    ...thisCircle,
  };
}

/**
 * Checks if the coordinates given for another circle will result
 * in a collision with this one. Returns boolean.
 * @param {*} circle1 The first CircleObject
 * @param {*} circle2 The second CircleObject
 * @returns {boolean} True if a collision has occurred, false if not.
 */
export function collisionCheck(circle1, circle2) {
  const xDelta = Math.abs(circle1.xPos - circle2.xPos);
  const yDelta = Math.abs(circle1.yPos - circle2.yPos);
  const centerDistance = Math.sqrt((xDelta ** 2) + (yDelta ** 2));
  if (centerDistance <= circle1.radius + circle2.radius) {
    return true;
  }
  return false;
}

/**
 * An invisible ring that returns random points around its curcumference
 * for sprites to spawn along.
 * @param {*} xPos - X position on screen (anchored to center)
 * @param {*} yPos - Y position on screen (anchored to center)
 * @param {*} radius - Radius of ring
 */
export function SpawnRing(xPos, yPos, radius) {
  const circle = CircleObject(xPos, yPos, radius);

  return {
    ...circle,
    /**
     * Returns a random coordinate along the circle's circumference
     */
    getRandomSpawnLocation: () => {
      const randomSeed = Math.random() * 2 * Math.PI;
      const xSpawn = xPos + radius * Math.cos(randomSeed);
      const ySpawn = yPos + radius * Math.sin(randomSeed);
      return { xSpawn, ySpawn };
    },
  };
}

export default RectObject;
