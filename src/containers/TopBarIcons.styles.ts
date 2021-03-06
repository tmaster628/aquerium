import { mergeStyleSets } from "@uifabric/styling";
import { IImageProps, ImageFit } from "office-ui-fabric-react";

export const imageProps: IImageProps = {
  src: "logo.png",
  imageFit: ImageFit.centerContain,
  maximizeFrame: true,
  width: 40,
  height: 40
};

export const getMenuIconProps = {
  iconName: "More",
  ariaLabel: "More"
};

export const menuIconSize = {
  menuIcon: {
    fontSize: 25
  }
};

export const refreshIcon = {
  iconName: "Refresh",
  ariaLabel: "Refresh"
};

export const refreshIconStyles = {
  icon: { fontSize: 22 },
  root: { width: "40px", height: "40px", background: "transparent" }
};

export const topBarItemGap = { childrenGap: 20 };

export const TopBarIconsUIClassNames = mergeStyleSets({
  topBar: { height: "50px" },
  logo: {
    transform: "translateX(60%)",
    padding: 5
  },
  aquerium: {
    transform: "translateX(-62%)",
    fontSize: 20,
    color: "#1b3e74"
  },
  menu: {
    backgroundColor: "rgba(240, 240, 240, 0.7)",
    width: 40,
    height: 40
  }
});
