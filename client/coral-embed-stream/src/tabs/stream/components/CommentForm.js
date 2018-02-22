import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';
import cn from 'classnames';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.
import { name } from '../containers/CommentBox';
import styles from './CommentForm.css';

import t from 'coral-framework/services/i18n';
import DraftArea from '../containers/DraftArea';

/**
 * Common UI for Creating or Editing a Comment
 */
export class CommentForm extends React.Component {
  static propTypes = {
    charCountEnable: PropTypes.bool.isRequired,
    maxCharCount: PropTypes.number,

    // DOM ID for form input that edits comment body
    bodyInputId: PropTypes.string,

    // screen reader label for input that edits comment body
    bodyLabel: PropTypes.string,

    // Placeholder for input that edits comment body
    bodyPlaceholder: PropTypes.string,

    // render at start of button container (useful for extra buttons)
    buttonContainerStart: PropTypes.node,

    // render inside submit button
    submitText: PropTypes.node,

    // cStyle for enabled submit <coral-ui/Button>
    submitButtonCStyle: PropTypes.string,

    // return whether the submit button should be enabled for the provided
    // comment ({ body }) (for reasons other than charCount)
    submitEnabled: PropTypes.func,

    // className to add to buttons
    submitButtonClassName: PropTypes.string,
    cancelButtonClassName: PropTypes.string,

    body: PropTypes.string.isRequired,
    onBodyChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    state: PropTypes.string,
    loadingState: PropTypes.oneOf(['', 'loading', 'success', 'error']),
  };
  static get defaultProps() {
    return {
      bodyLabel: t('comment_box.comment'),
      bodyPlaceholder: t('comment_box.comment'),
      submitText: t('comment_box.post'),
      submitButtonCStyle: 'darkGrey',
      submitEnabled: () => true,
    };
  }

  onClickSubmit = () => {
    this.props.onSubmit();
  };

  getButtonClassName = () => {
    switch (this.props.loadingState) {
      case 'loading':
        return cn(`${name}-button-loading`, styles.buttonLoading);
      case 'success':
        return cn(`${name}-button-success`, styles.buttonSuccess);
      case 'error':
        return cn(`${name}-button-error`, styles.buttonError);
      default:
        return '';
    }
  };

  render() {
    const {
      maxCharCount,
      submitEnabled,
      cancelButtonClassName,
      submitButtonClassName,
      charCountEnable,
      body,
      loadingState,
    } = this.props;

    const length = body.length;
    const isRespectingMaxCount = length =>
      charCountEnable && maxCharCount && length > maxCharCount;
    const disableSubmitButton =
      !length ||
      body.trim().length === 0 ||
      isRespectingMaxCount(length) ||
      !submitEnabled({ body }) ||
      loadingState === 'loading';
    const disableCancelButton = loadingState === 'loading';
    const disableTextArea = loadingState === 'loading';

    return (
      <div>
        <DraftArea
          id={this.props.bodyInputId}
          label={this.props.bodyLabel}
          value={body}
          placeholder={this.props.bodyPlaceholder}
          onChange={this.props.onBodyChange}
          disabled={disableTextArea}
          charCountEnable={this.props.charCountEnable}
          maxCharCount={this.props.maxCharCount}
          comment={this.props.comment}
        />
        <div className={cn(styles.buttonContainer, `${name}-button-container`)}>
          {this.props.buttonContainerStart}
          {typeof this.props.onCancel === 'function' && (
            <Button
              cStyle="darkGrey"
              className={cn(`${name}-cancel-button`, cancelButtonClassName)}
              onClick={this.props.onCancel}
              disabled={disableCancelButton}
            >
              {t('comment_box.cancel')}
            </Button>
          )}
          <Button
            cStyle={
              disableSubmitButton ? 'lightGrey' : this.props.submitButtonCStyle
            }
            className={cn(
              styles.button,
              `${name}-button`,
              submitButtonClassName,
              this.getButtonClassName()
            )}
            onClick={this.onClickSubmit}
            disabled={disableSubmitButton ? 'disabled' : ''}
          >
            {this.props.submitText}
          </Button>
        </div>
      </div>
    );
  }
}
