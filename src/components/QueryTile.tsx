import React from "react";
import { Stack, Text, Separator, Link } from "office-ui-fabric-react";
import { QueryTileClassNames, gridStackStyle, separatorStyles } from "./QueryTile.styles";
import { IQuery } from "../state";

interface IRenderTileProps {
  /** A single IQuery to be rendered. */
  query: IQuery;
}

export const QueryTile = (props: IRenderTileProps): JSX.Element => {
  const { query } = props;

  return (
    <div className={QueryTileClassNames.queryTile}>
      <div className={QueryTileClassNames.queryFront}>
        <Stack horizontalAlign="center" verticalAlign="space-evenly" styles={gridStackStyle}>
          <Text className={QueryTileClassNames.queryName} nowrap block>
            {query.name}
          </Text>
          <Text className={QueryTileClassNames.queryTaskCount}>
            {query.tasks.length.toString()}
          </Text>
        </Stack>
      </div>
      <button className={QueryTileClassNames.queryBack}>
        <Stack verticalAlign="space-around">
          <Link href={query.url} className={QueryTileClassNames.basicInfoQueryLink}>
            {query.name}
            <br />
          </Link>
          <Separator styles={separatorStyles}>{query.tasks.length.toString()} open tasks</Separator>
          <Text className={QueryTileClassNames.basicInfo}>
            <b>Type: </b>
            {query.type
              ? query.type === "pr"
                ? "Pull Requests"
                : "Issues"
              : "Issues and Pull Requests"}
            <br />
          </Text>
          {query.repo && (
            <Text className={QueryTileClassNames.basicInfo}>
              <b>Repo:</b> {query.repo}
              <br />
            </Text>
          )}
          {query.author && (
            <Text className={QueryTileClassNames.basicInfo}>
              <b>Author:</b> {query.author}
              <br />
            </Text>
          )}
          {query.assignee && (
            <Text className={QueryTileClassNames.basicInfo}>
              <b>Assignee:</b> {query.assignee}
              <br />
            </Text>
          )}
          {query.mentions && (
            <Text className={QueryTileClassNames.basicInfo}>
              <b>Mentions:</b> {query.mentions}
              <br />
            </Text>
          )}
          {query.reviewStatus && (
            <Text className={QueryTileClassNames.basicInfo}>
              <b>Review Status:</b> {query.reviewStatus}
              <br />
            </Text>
          )}
          {query.labels && (
            <Text className={QueryTileClassNames.basicInfo}>
              <b>Labels:</b> [{query.labels.join(", ")}]<br />
            </Text>
          )}
          {query.lastUpdated && (
            <Text className={QueryTileClassNames.basicInfo}>
              <b>Last Updated:</b> {query.lastUpdated} days ago
              <br />
            </Text>
          )}
        </Stack>
      </button>
    </div>
  );
};