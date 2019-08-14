import { IUserInfo } from "../state.types";
import update from "immutability-helper";
import { changeUILoginAction } from "../actions/changeUI";

const DEFAULT_STATE: IUserInfo = { token : "", username : "", gistID : ""};

/**
 * This reducer deals with receiving the login action. Once received, the user info is stored in the state
 */
export const changeUI = (state: IUserInfo = DEFAULT_STATE, action: changeUILoginAction) => {
    switch (action.type) {
      case "LOGIN": {
          const { user } = action as changeUILoginAction;
        return update(state, {
          $set: {
            
        });
      }
      default:
        return state;
    }
  };