import { IUserInfo } from "../state.types";

/**
 * This file is responsible for the reducers that deal with the UI
 */

/**
 * We need to have a default state for when we first start the application
 * Type: IState
 */
const DEFAULT_STATE: { currUI: string } = { currUI: "Login" };

/**
 * This reducer deals with UI and storing the Token
 * @param cur_UI
 */
export const changeUI = (state: { currUI: string } = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case "LOGIN": {
      const updatedState = { ...state };
      updatedState.currUI = "Home";
      return updatedState;
    }
    case "LOGOUT": {
      const updatedState = { ...state };
      updatedState.currUI = "Login";
      return updatedState;
    }
    default:
      return state;
  }
};
