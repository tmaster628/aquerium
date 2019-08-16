/* global chrome */

import React from "react";
import {
  Stack,
  Image,
  IImageProps,
  ImageFit,
  Text,
  TextField,
  Link,
  PrimaryButton,
  ITextFieldStyleProps
} from "office-ui-fabric-react";
import { createGist, getQueryMapObj } from "../util/api";
import { login } from "../state";
import { connect } from "react-redux";
import { IState, IUserInfo } from "../state/state.types";

const imageProps: IImageProps = {
  src: "GlitterboxLogo2.png",
  imageFit: ImageFit.centerContain,
  maximizeFrame: true,
  width: 100,
  height: 100,
  onLoad: ev => console.log("image loaded", ev)
};

/**
 * @property { function } login a function that calls the login action
 */
interface ILoginProps {
  login: (user: IUserInfo) => void;
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  };
};

function LoginUIComponent(props: ILoginProps) {
  let currPAT: any = "";
  const [isValidPAT, setIsValidPAT] = React.useState(true);

  const checkPasswordValidity = async () => {
    chrome.storage.sync.get(["username", "gistID"], async result => {
      if (result.username !== "" && result.gistID !== "") {
        const user: IUserInfo = {
          token: currPAT,
          username: result.username,
          gistID: result.gistID
        };
        const responseMap = await getQueryMapObj(user); // This gets called twice if a user's pat is invalid and they try it again
        if (responseMap.queryMap === undefined) {
          setIsValidPAT(false);
        } else {
          setIsValidPAT(true);
          chrome.storage.sync.set({ token: currPAT, username: user.username, gistID: user.gistID });
          props.login(user);
        }
      } else {
        const responseGist = await createGist(currPAT);
        if (responseGist.user === undefined) {
          setIsValidPAT(false);
        } else {
          setIsValidPAT(true);
          chrome.storage.sync.set({
            token: currPAT,
            username: responseGist.user.username,
            gistID: responseGist.user.gistID
          });
          props.login(responseGist.user);
        }
      }
    });
  };

  const updateCurrPAT = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    currPAT = newValue;
  };

  const ensureEnter = async (
    event?: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!event) {
      return;
    }
    if (event.which === 13) {
      await checkPasswordValidity();
    }
  };

  const getTextFieldStyles = (props: ITextFieldStyleProps) => {
    const { required } = props;
    return {
      root: {
        width: 175,
        fontSize: 10,
        color: "#1b3e74"
      },
      fieldGroup: [
        { width: 175 },
        required && {
          borderColor: isValidPAT
            ? props.theme.semanticColors.actionLink
            : props.theme.semanticColors.errorText
        }
      ]
    };
  };

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="space-evenly"
      tokens={{ childrenGap: "5%", padding: "20 px" }}
    >
      <Image {...imageProps as any} />
      <Text
        styles={{
          root: {
            textAlign: "center",
            padding: 20,
            fontSize: 12,
            color: "#1b3e74"
          }
        }}
      >
        Welcome to Aquerium! <br />
        Keep track of desired queries at a glance and​ be notified when deadlines approach and pass.
      </Text>
      <Stack horizontal>
        <TextField
          placeholder="Enter your GitHub PAT"
          required
          styles={getTextFieldStyles}
          onChange={updateCurrPAT}
          onKeyDown={ensureEnter}
          errorMessage={isValidPAT ? "" : "InvalidPAT"}
        />
        <PrimaryButton
          text="Submit"
          allowDisabledFocus={true}
          styles={{ root: { color: "#ffffff", width: "10px" } }}
          onClick={checkPasswordValidity}
        />
      </Stack>
      <Link
        styles={{ root: { marginBottom: 5, position: "static" } }}
        href="https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line"
        target="_blank"
        style={{
          fontSize: "11px"
        }}
      >
        Don't have a Personal Access Token (PAT)? Get one here.
      </Link>
    </Stack>
  );
}

const action = {
  login
};

export const LoginUI = connect(
  mapStateToProps,
  action
)(LoginUIComponent);
