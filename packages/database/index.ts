import { getUserByEmail, getUserById, createUser } from "./src/userService";

export {
    getUserByEmail,
    getUserById,
    createUser
};

import { createRoom, getRoomByName } from "./src/roomService";

export {
    createRoom,
    getRoomByName
}


import {
  createCanvas,
  deleteUserCanvasInRoom,
  getRoomCanvas,
  getCanvasShape,
  deleteCanvasShape,
  updateCanvasShape,
} from "./src/canvasService";

export {
  deleteUserCanvasInRoom,
  getRoomCanvas,
  createCanvas,
  getCanvasShape,
  deleteCanvasShape,
  updateCanvasShape,
};
