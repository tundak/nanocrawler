import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";

import HistoryEntry from "./HistoryEntry";
import AccountLink from "../../../AccountLink";
import BlockLink from "../../../BlockLink";
import { keyToPublicAccountId, formatTimestamp } from "lib/util";
import OptionalField from "../../../OptionalField";
import { apiClient } from "lib/Client";
import config from "client-config.json";

export default class HistoryStateBlock extends React.PureComponent {
  transactionAccount() {
    const { block } = this.props;
    switch (block.subtype) {
      case "receive":
      case "open":
        return block.account;
      case "send":
        return keyToPublicAccountId(block.link);
      case "change":
        return block.representative;
    }
  }

  statusClass() {
    const { block } = this.props;
    switch (block.subtype) {
      case "receive":
      case "open":
        return "text-success";
      case "send":
        return "text-danger";
      case "change":
        return "text-info";
      default:
        return "text-dark";
    }
  }

  transactionSymbol() {
    const { block } = this.props;
    switch (block.subtype) {
      case "receive":
      case "open":
        return "+";
      case "send":
        return "-";
      default:
        return "";
    }
  }

  accountAction() {
    const { block } = this.props;
    switch (block.subtype) {
      case "open":
      case "receive":
        return <TranslatedMessage id="block.from" />;
      case "send":
        return <TranslatedMessage id="block.to" />;
      default:
        return "";
    }
  }

  render() {
    const { block } = this.props;
    return (
      <HistoryEntry
        type={
          <Fragment>
            <TranslatedMessage id="block.state" />{" "}
            <span className={this.statusClass()}>
              <TranslatedMessage id={`block.subtype.${block.subtype}`} />
            </span>
          </Fragment>
        }
        account={
          <Fragment>
            <span className="text-muted">{this.accountAction()}</span>{" "}
            <AccountLink
              account={this.transactionAccount()}
              ninja
              className="text-dark break-word"
            />
          </Fragment>
        }
        amount={
          <span className={this.statusClass()}>
            {this.transactionSymbol()}
            <FormattedNumber
              value={parseFloat(block.amount || 0, 10)}
              minimumFractionDigits={2}
              maximumFractionDigits={6}
            />{" "}
            {config.currency}
          </span>
        }
        date={<OptionalField value={formatTimestamp(block.timestamp)} />}
        block={
          <div className="text-truncate">
            <small>
              <BlockLink hash={block.hash} className="text-muted" />
            </small>
          </div>
        }
      />
    );
  }
}
