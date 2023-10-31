import Directions from "./directionTypes/Directions.js";

let lastAssignedId = 0;
export const generateId = () => (++lastAssignedId).toString();

export const assignSource = (source, callback) => {
    if (typeof callback === 'function') {
        return () => callback(source);
    }
    return undefined;
}

export const getOppositeDirection = (direction) => {
    return direction === Directions.input ? Directions.output : Directions.input;
}
