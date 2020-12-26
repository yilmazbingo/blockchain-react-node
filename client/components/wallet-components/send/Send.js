import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { createStructuredSelector } from "reselect";
import {
  selectTransactionsData,
  selectSuccessTransaction,
} from "../../../redux/transactions/transactions.selector";
import { postTransactionStart } from "../../../redux/transactions/transactions.actions";
import FormInput from "../../form-input/FormInput";
import Button from "../../button/Button";
import validateForm from "../../../util/validateForm";
import "./send.scss";

const Send = (props) => {
  // handleSubmit is passed by redux-form
  const { handleSubmit, postTransactionStart, success } = props;

  const onSubmit = (formValues) => {
    // we do not need to call this e.preventDefault();
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&", formValues);
    try {
      postTransactionStart(formValue);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <React.Fragment>
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <span>Pay To:</span>
            <Field name="recipient" component={FormInput} />
          </div>
          <div>
            <span>Label:</span>
            <Field name="label" component={FormInput} type="text" />
          </div>
          <div>
            <span>Amount:</span>{" "}
            <Field name="amount" component={FormInput} type="number" />
          </div>
          <Button>SEND</Button>
        </form>
        <div>{success ? "Transaction Succeeded" : ""}</div>
      </section>
    </React.Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  transactions: selectTransactionsData,
  success: selectSuccessTransaction,
});

//Field is component, it does not know what to display. it just connects the redux-form to our app
//reduxForm is a function like  "connect", calls actions
export default connect(mapStateToProps, { postTransactionStart })(
  reduxForm({ form: "wallet", validate: validateForm })(Send)
);
