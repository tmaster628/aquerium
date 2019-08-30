import React from "react";
import update from "immutability-helper";
import {
  Stack,
  TextField,
  ActionButton,
  Slider,
  MessageBar,
  MessageBarType,
  MessageBarButton,
  Dropdown,
  IDropdownOption
} from "office-ui-fabric-react";
import { description } from "../components/InfoButton";
import { IQuery, toHome, removeQuery, IState, addOrEditQuery } from "../state";
import { MultiSelect } from "../components/MultiSelect";
import {
  EditQueryUIClassNames,
  rootTokenGap,
  actionIcons,
  typeOptions,
  reviewStatusOptions
} from "./EditQuery.styles";
import { connect } from "react-redux";

enum InputStatuses {
  /** Value indicating that the input has been validated. */
  successfulEdit = 0,
  /** Value indicating that the current user input is not valid. */
  invalidEdit
}

interface IEditQueryUIState {
  /** Tracks the state of changes the user is making to a query's settings. */
  inputStatus: InputStatuses;
  /**
   * Tracks the the type of message that should be rendered,
   * given the action the user wants to take and the status of the query's settings.
   */
  messageType: MessageBarType;
  /** Tracks the message that should be rendered by the message bar, if needed. */
  message: string;
  /** MessageBarButton items, if any, that are the options a user can take given a message. */
  actions?: JSX.Element;
  /** Whether or not a message bar should be rendered, given the action the user wants to take. */
  renderMessageBar: boolean;
  /** Whether the review status field is enabled or not, depending on if PR's are in the query. */
  enableReviewStatusField: boolean;
  /**
   * The current selections the user is making to a query, which will be used to either construct
   * a new query or edit an existing one.
   */
  selections: IQuery;
}

interface IEditQueryUIProps {
  /** Current query whose properties are being edited. */
  currQuery?: IQuery;
  /** Action that sends the user back to the HomeUI. */
  toHome: () => void;
  /** Action that tells redux and the Gist to modify the current query. */
  addOrEditQuery: (query: IQuery) => void;
  /** Action that tells redux and the Gist to remove the current query. */
  removeQuery: (id: string) => void;
}

const mapStateToProps = (state: IState) => {
  return {
    currQuery: state.changeUI.currQuery
  };
};

class EditQueryUI extends React.Component<IEditQueryUIProps, IEditQueryUIState> {
  public state: IEditQueryUIState = {
    inputStatus: InputStatuses.successfulEdit,
    messageType: MessageBarType.success,
    message: "",
    renderMessageBar: false,
    enableReviewStatusField: true,
    selections: this.props.currQuery
      ? this.props.currQuery
      : {
          id: "",
          name: "",
          lastUpdated: 0,
          reasonableCount: "0",
          tasks: [],
          url: ""
        }
  };

  private _nameRegex = /^[a-z0-9-_.\\/~+&#@:]+( *[a-z0-9-_.\\/+&#@:]+ *)*$/i;
  private _numberRegex = /^[0-9]*$/i;

  public render = (): JSX.Element => {
    return (
      <>
        <Stack verticalAlign="space-evenly">
          {this.state.renderMessageBar ? (
            this._renderMessageBar()
          ) : (
            <Stack
              horizontal
              verticalAlign="center"
              horizontalAlign="space-evenly"
              className={EditQueryUIClassNames.topBar}
            >
              <ActionButton
                iconProps={actionIcons.back.name}
                styles={actionIcons.back.styles}
                text="Back"
                onClick={this.props.toHome}
              />
              {this.state.selections.id === "" ? (
                <ActionButton
                  iconProps={actionIcons.add.name}
                  styles={actionIcons.add.styles}
                  text="Add"
                  onClick={this._setMessageBarAddOrEdit}
                />
              ) : (
                <ActionButton
                  iconProps={actionIcons.update.name}
                  styles={actionIcons.update.styles}
                  text="Update"
                  onClick={this._setMessageBarAddOrEdit}
                />
              )}
              <ActionButton
                iconProps={actionIcons.remove.name}
                styles={actionIcons.remove.styles}
                text="Remove"
                onClick={this._setMessageBarRemove}
              />
            </Stack>
          )}

          <Stack
            horizontalAlign="start"
            className={EditQueryUIClassNames.fieldsRoot}
            tokens={rootTokenGap}
          >
            <TextField
              label="Your query title"
              placeholder="Please enter a title"
              defaultValue={this.state.selections.name}
              validateOnFocusIn
              validateOnFocusOut
              onGetErrorMessage={this._checkNameSelection}
              required
            />
            <Stack horizontal horizontalAlign="center">
              <Dropdown
                required
                onChange={this._setTypeSelection}
                label="Type of tasks"
                selectedKey={this.state.selections.type || "issues and pr"}
                options={typeOptions}
              />
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <TextField
                label="Repo"
                defaultValue={this.state.selections.repo}
                validateOnFocusIn
                validateOnFocusOut
                onGetErrorMessage={this._checkRepoSelection}
              />
              {description([
                "List a repository from which to track Issues and/or Pull Requests."
              ])()}
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <TextField
                label="Assignee"
                defaultValue={this.state.selections.assignee}
                validateOnFocusIn
                validateOnFocusOut
                onGetErrorMessage={this._checkAssigneeSelection}
              />
              {description(["Track Issues and/or Pull Requests assigned to a specific user."])()}
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <TextField
                label="Author"
                defaultValue={this.state.selections.author}
                validateOnFocusIn
                validateOnFocusOut
                onGetErrorMessage={this._checkAuthorSelection}
              />
              {description(["Track Issues and/or Pull Requests opened by a specific user."])()}
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <TextField
                label="Mention"
                defaultValue={this.state.selections.mentions}
                validateOnFocusIn
                validateOnFocusOut
                onGetErrorMessage={this._checkMentionSelection}
              />
              {description(["Track Issues and/or Pull Requests that mention a specific user."])()}
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <Dropdown
                disabled={!this.state.enableReviewStatusField}
                onChange={this._setReviewStatusSelection}
                label="Review Status"
                selectedKey={
                  this.state.selections.reviewStatus && this.state.enableReviewStatusField
                    ? this.state.selections.reviewStatus
                    : ""
                }
                options={reviewStatusOptions}
              />
              {description(["Track Pull Requests with the single selected review requirement."])()}
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <MultiSelect
                label="Repo Labels"
                onChange={this._setLabelsSelection}
                items={this.state.selections.labels || []}
              />
              {description(["The GitHub labels assigned to particular tasks."])()}
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <Slider
                label="Last Updated"
                onChange={this._setLastUpdatedSelection}
                min={0}
                defaultValue={this.state.selections.lastUpdated}
                max={31}
              />
              {description([
                "Track Issues and/or Pull Requests that have not been updated for more than a specific number of days."
              ])()}
            </Stack>
            <Stack horizontal horizontalAlign="center">
              <TextField
                label="Reasonable Count"
                defaultValue={this.state.selections.reasonableCount}
                validateOnFocusIn
                validateOnFocusOut
                onGetErrorMessage={this._checkReasonableCountSelection}
              />
              {description([
                "The number of tasks in this query that if exceeded, would be considered unreasonable."
              ])()}
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  };

  private _renderMessageBar = (): JSX.Element => {
    return (
      <Stack
        horizontalAlign="center"
        verticalAlign="space-around"
        className={EditQueryUIClassNames.messageBar}
      >
        <MessageBar
          isMultiline={false}
          messageBarType={this.state.messageType}
          onDismiss={this._onDismissMessageBar}
          actions={this.state.actions}
        >
          {this.state.message}
        </MessageBar>
      </Stack>
    );
  };

  private _setMessageBarAddOrEdit = (): void => {
    if (this.state.inputStatus === InputStatuses.successfulEdit && this.state.selections.name) {
      this.setState({
        messageType: MessageBarType.warning,
        message:
          "Are you sure you want to " +
          (this.state.selections.id === "" ? "add" : "update") +
          " this query?",
        actions: (
          <div>
            <MessageBarButton text="Yes" onClick={this._addOrEditQuery} />
            {/* Else discard changes and go back to home screen. */}
            <MessageBarButton text="No" onClick={this._onDismissMessageBar} />
          </div>
        ),
        renderMessageBar: true
      });
    } else {
      this.setState({
        messageType: MessageBarType.severeWarning,
        message: "Ensure query edits are valid!",
        actions: undefined,
        renderMessageBar: true
      });
    }
  };

  private _addOrEditQuery = (): void => {
    this.props.addOrEditQuery(this.state.selections);
    this.props.toHome();
  };

  private _setMessageBarRemove = (): void => {
    this.setState({
      messageType: MessageBarType.error,
      message: "Are you sure you wish to delete this query?",
      actions: (
        <div>
          {/* Insert query delete Redux and go back to home screen. */}
          <MessageBarButton text="Remove" onClick={this._onRemove} />
          {/* Cancel and continue editing. */}
          <MessageBarButton text="Cancel" onClick={this._onDismissMessageBar} />
        </div>
      ),
      renderMessageBar: true
    });
  };

  private _onRemove = (): void => {
    const queryID: string = this.state.selections.id;
    if (queryID !== "") {
      // If the ID exists, this is a real query we should remove.
      this.props.removeQuery(queryID);
    }
    this.props.toHome();
  };

  private _onDismissMessageBar = (): void => {
    this.setState({ renderMessageBar: false });
  };

  private _checkNameSelection = (
    value: string
  ): string | JSX.Element | PromiseLike<string | JSX.Element> | undefined => {
    if (value && !this._nameRegex.test(value)) {
      this.setState({ inputStatus: InputStatuses.invalidEdit });
      return "Invalid query name.";
    } else {
      let newStatus = InputStatuses.successfulEdit;
      if (!value) newStatus = InputStatuses.invalidEdit;
      value = value.trim();
      const updatedSelections = update(this.state.selections, { name: { $set: value } });
      this.setState({ selections: updatedSelections, inputStatus: newStatus });
    }
  };

  private _setTypeSelection = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption,
    index?: number
  ): void => {
    if (!item) {
      return;
    }
    const newKey = item.key === "issues and pr" ? undefined : item.key;
    const enableReviewField = newKey !== "issues";
    const updatedSelections = update(this.state.selections, {
      type: {
        $set: newKey as IQuery["type"]
      },
      reviewStatus: {
        $set: enableReviewField
          ? this.state.selections.reviewStatus
          : (undefined as IQuery["reviewStatus"])
      }
    });
    this.setState({ selections: updatedSelections, enableReviewStatusField: enableReviewField });
  };

  private _checkRepoSelection = (
    value: string
  ): string | JSX.Element | PromiseLike<string | JSX.Element> | undefined => {
    if (value && !this._nameRegex.test(value)) {
      this.setState({ inputStatus: InputStatuses.invalidEdit });
      return "Invalid repo name.";
    }
    value = value.trim();
    const updatedSelections = update(this.state.selections, { repo: { $set: value } });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };

  private _checkAssigneeSelection = (
    value: string
  ): string | JSX.Element | PromiseLike<string | JSX.Element> | undefined => {
    if (value && !this._nameRegex.test(value)) {
      this.setState({ inputStatus: InputStatuses.invalidEdit });
      return "Invalid assignee name.";
    }
    value = value.trim();
    const updatedSelections = update(this.state.selections, { assignee: { $set: value } });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };

  private _checkAuthorSelection = (
    value: string
  ): string | JSX.Element | PromiseLike<string | JSX.Element> | undefined => {
    if (value && !this._nameRegex.test(value)) {
      this.setState({ inputStatus: InputStatuses.invalidEdit });
      return "Invalid author name.";
    }
    value = value.trim();
    const updatedSelections = update(this.state.selections, { author: { $set: value } });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };

  private _checkMentionSelection = (
    value: string
  ): string | JSX.Element | PromiseLike<string | JSX.Element> | undefined => {
    if (value && !this._nameRegex.test(value)) {
      this.setState({ inputStatus: InputStatuses.invalidEdit });
      return "Invalid mention name.";
    }
    value = value.trim();
    const updatedSelections = update(this.state.selections, { mentions: { $set: value } });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };

  private _setReviewStatusSelection = (
    event: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption,
    index?: number
  ): void => {
    if (!item) {
      return;
    }
    const newKey = item.key === "N/A" ? undefined : item.key;
    const updatedSelections = update(this.state.selections, {
      reviewStatus: { $set: newKey as IQuery["reviewStatus"] }
    });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };

  private _setLastUpdatedSelection = (input?: number | undefined): void => {
    if (!input) {
      return;
    }
    const updatedSelections = update(this.state.selections, { lastUpdated: { $set: input } });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };

  private _setLabelsSelection = (items: string[]): void => {
    const updatedSelections = update(this.state.selections, { labels: { $set: items } });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };

  private _checkReasonableCountSelection = (
    value: string
  ): string | JSX.Element | PromiseLike<string | JSX.Element> | undefined => {
    if (value && !this._numberRegex.test(value)) {
      this.setState({ inputStatus: InputStatuses.invalidEdit });
      return "Invalid input for reasonable count.";
    }
    value = value.trim();
    const updatedSelections = update(this.state.selections, { reasonableCount: { $set: value } });
    this.setState({ selections: updatedSelections, inputStatus: InputStatuses.successfulEdit });
  };
}

const action = {
  toHome,
  addOrEditQuery,
  removeQuery
};

export const EditQuery = connect(
  mapStateToProps,
  action
)(EditQueryUI);
