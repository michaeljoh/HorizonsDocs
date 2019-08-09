import React, { useState } from "react";
import "../styles/document.css";
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertFromRaw,
  convertToRaw
} from "draft-js";
import { BrowserRouter as Router, Redirect, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUnderline,
  faBold,
  faItalic,
  faListUl,
  faListOl
} from "@fortawesome/free-solid-svg-icons";

library.add(faUnderline, faBold, faItalic, faListUl, faListOl);

const INLINE_STYLES = [
  { label: <FontAwesomeIcon icon="bold" />, style: "Bold" },
  { label: <FontAwesomeIcon icon="italic" />, style: "Italic" },
  { label: <FontAwesomeIcon icon="underline" />, style: "Underline" }
];
const BLOCK_TYPES = [
  { label: <FontAwesomeIcon icon="list-ul" />, style: "unordered-list-item" },
  { label: <FontAwesomeIcon icon="list-ol" />, style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" },
  { label: "Blockquote", style: "blockquote" }
];
const COLOURS = [
  { label: "RED", style: "Red" },
  { label: "ORANGE", style: "Orange" },
  { label: "YELLOW", style: "Yellow" },
  { label: "GREEN", style: "Green" },
  { label: "BLUE", style: "Blue" },
  { label: "PURPLE", style: "Purple" }
];

// Stylemap
const styleMap = {
  RED: {
    color: "red"
  },
  ORANGE: {
    color: "orange"
  },
  YELLOW: {
    color: "yellow"
  },
  GREEN: {
    color: "green"
  },
  BLUE: {
    color: "blue"
  },
  PURPLE: {
    color: "purple"
  }
};

const StyleButton = props => {
  const onToggle = e => {
    e.preventDefault();
    props.onToggle(props.style);
  };

  let className = "styleButton";
  if (props.active) {
    className += " activeStyleButton";
  }

  return (
    <button
      style={{ color: props.style, borderRadius: 5 }}
      className={className}
      onMouseDown={onToggle}
    >
      {props.label}
    </button>
  );
};

const InlineButtons = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="editor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style.toUpperCase())}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style.toUpperCase()}
        />
      ))}
    </div>
  );
};

const BlockButtons = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const ColorButtons = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div>
      {COLOURS.map(type => (
        <StyleButton
          active={currentStyle.has(type.style.toUpperCase())}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style.toUpperCase()}
        />
      ))}
    </div>
  );
};

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      authenticated: true,
      redirect: false,
      redirectTo: null
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => {
      console.log(editorState);
      this.setState({ editorState });
    };
  }

  // Fetch document
  async componentDidMount() {
    //TEST document
    const data = await fetch(
      process.env.REACT_APP_CONNECTION_URL +
        "/document/" +
        this.props.match.params.id,
      {
        method: "GET",
        credentials: "include"
      }
    );

    const responseJSON = await data.json();

    if (responseJSON.notAuthenticated) {
      this.setState({ authenticated: false });
    } else if (responseJSON.redirect) {
      this.setState({
        redirect: true,
        redirectTo: responseJSON.redirect
      });
    } else {
      if (responseJSON.content)
        this.setState({
          editorState: EditorState.createWithContent(
            convertFromRaw(JSON.parse(responseJSON.content))
          )
        });
      else this.setState({ editorState: EditorState.createEmpty() });
    }
  }

  // Style click handler
  changeStyleClick(style) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style));
  }

  // Block click handler
  changeBlockClick(block) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, block));
  }

  changeColorClick(color) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();

    const nextContentState = Object.keys(styleMap).reduce(
      (contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color);
      },
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(color)) {
      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, color);
    }

    this.onChange(nextEditorState);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  async saveDoc() {
    const contentState = this.state.editorState.getCurrentContent();
    const toSave = JSON.stringify(convertToRaw(contentState));
    const response = await fetch(
      process.env.REACT_APP_CONNECTION_URL + "/document",
      {
        method: "POST",
        credentials: "include",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: this.props.match.params.id,
          content: toSave
        })
      }
    );

    console.log("DOC SAVED? ", await response.json());
  }

  render() {
    if (!this.state.authenticated) {
      return <Redirect to="/login" />;
    } else if (this.state.redirect)
      return <Redirect to={this.state.redirectTo} />;
    return (
      <div className="documentContainer">
        <h1 className="heading">Document Name</h1>
        <div className="documentBox">
          <div className="documentEditor">
            <div className="buttons">
              <InlineButtons
                editorState={this.state.editorState}
                onToggle={this.changeStyleClick.bind(this)}
              />
            </div>
            <div className="buttons">
              <BlockButtons
                editorState={this.state.editorState}
                onToggle={this.changeBlockClick.bind(this)}
              />
            </div>
            <div className="buttons">
              <ColorButtons
                editorState={this.state.editorState}
                onToggle={this.changeColorClick.bind(this)}
              />
            </div>
          </div>
          <div className="editor">
            <Editor
              editorState={this.state.editorState}
              customStyleMap={styleMap}
              handleKeyCommand={this.handleKeyCommand.bind(this)}
              onChange={this.onChange}
            />
          </div>
          <button onClick={this.saveDoc.bind(this)}>
            Save
          </button>
          <Link to="/portal">Back</Link>
        </div>
      </div>
    );
  }
}

export default Document;