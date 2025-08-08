import React from 'react'
import alertify from "alertifyjs";
export const handleSimpleMessage= (message)=>{
    alertify.message(message);
}
export const handleSuccess = (message) => {
    alertify.success(message);
}
export const handleError = (message) => {
    alertify.error(message);
}
export const handleWarning = (message) => {
    alertify.warning(message);
}
export const handleAlertBoxClick = (message) => {
    alertify.alert("Alert", message, function () {
        alertify.message("OK");
    });
}
export const handleOkCancelConfirmation = (message) => {
    alertify.confirm(
        "Confirm",
        message,
        function () {
            alertify.success("Ok");
        },
        function () {
            alertify.error("Cancel");
        }
    );
}
export const handlePrompt = (message) => {
    alertify.prompt(
        "Alert",
        message,
        "Default value",
        function (evt, value) {
            alertify.success("Ok: " + value);
        },
        function () {
            alertify.error("Cancel");
        }
    );
}

class CustomAlerts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
      </React.Fragment>
    );
  }
}

export default CustomAlerts;