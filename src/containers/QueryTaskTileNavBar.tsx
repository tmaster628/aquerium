import { getId } from "@uifabric/utilities";
import React from "react";
import { Stack, TooltipHost, Link, CommandBarButton, Image } from "office-ui-fabric-react";
import { QueryTaskClassNames } from "../components/QueryTaskList.styles";
import { IQuery, toEditQuery, toHome } from "../state";
import { connect } from "react-redux";
import { normalizedURL } from "../util";

interface IQueryTaskListNavBarProps {
  /** A single IQuery to be rendered. */
  query: IQuery;
  /** A function that calls the action to go to the Edit Query UI. */
  toEditQuery: (query?: IQuery) => void;
  /** A function that calls the action to go to the Home UI. */
  toHome: () => void;
}

function QueryTaskListNavBarView(props: IQueryTaskListNavBarProps) {
  function onClickToEditQuery() {
    props.toEditQuery(query);
  }
  const { query } = props;
  const iconProps = {
    back: { iconName: "Back", name: "Back" },
    edit: { iconName: "Edit", name: "Edit" },
  };
  const iconSize = {
    icon: { fontSize: 22 },
    root: { width: "40px", height: "40px", background: "transparent" }
  };
  const imageProps = {
    width: 15,
    height: 15,
    src: "GitHub-Mark-32px.png",
    alt: "GitHub Logo",
  }

  const topBarStyles = { root: { transform: "translateY(5%)", paddingBottom: 3 } };

  const tooltipId = getId("text-tooltip");
  const calloutGapSpace = { gapSpace: 0 };

  return (
    <Stack horizontal horizontalAlign="space-around" verticalAlign="center" styles={topBarStyles} >
      <CommandBarButton iconProps={iconProps.back} styles={iconSize} onClick={props.toHome} />
      <div className={QueryTaskClassNames.queryNameContainer}>
        <TooltipHost calloutProps={calloutGapSpace} content={query.name} id={tooltipId}>
          <Link
            href={normalizedURL(query.url)}
            target="_blank"
            rel="noopener noreferrer"
            className={QueryTaskClassNames.queryTitle}
            aria-labelledby={tooltipId}
            nowrap
            block
          >
            {query.name}
          </Link>
        </TooltipHost>
        <div className={QueryTaskClassNames.githubImage}>
          <Image {...imageProps} />
        </div>
      </div>
      <CommandBarButton iconProps={iconProps.edit} styles={iconSize} onClick={onClickToEditQuery} />
    </Stack>
  );
}

const action = {
  toEditQuery,
  toHome
};

export const QueryTaskListNavBar = connect(
  undefined,
  action
)(QueryTaskListNavBarView);
