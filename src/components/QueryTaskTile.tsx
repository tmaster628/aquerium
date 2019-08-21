import React from "react";
import { ITask } from "../state/state.types";
import { QueryTaskClassNames } from "./QueryTaskList.styles";
import { Stack, Text, DefaultButton, Link } from "office-ui-fabric-react";
import { description } from "./InfoButton";

interface IQueryTaskTile {
  /** A single ITask to be rendered. */
  task: ITask;
  /** A list of labels to be listed. */
  labels: string[];
}

const gridStackStyle = {
  root: { width: "100%" }
};

export const QueryTaskTile = (props: IQueryTaskTile): JSX.Element => {
  const { task, labels } = props;
  let taskInfo = ["Type: " + task.type, "Last updated: " + task.updatedAt];
  if (labels.length > 0) taskInfo.push("Labels: [" + labels + "]");
  return (
    <Stack horizontal verticalAlign="space-between" className={QueryTaskClassNames.taskTile}>
      <Stack horizontalAlign="start" styles={gridStackStyle}>
        <Link className={QueryTaskClassNames.taskTitle}>{task.title}</Link>
        <Text className={QueryTaskClassNames.basicInfo} nowrap block>
          #{task.num} opened {task.createdAt} by {task.author}
        </Text>
      </Stack>
      <div className={QueryTaskClassNames.infoIcon}>{description(taskInfo)()}</div>
    </Stack>
  );
};
