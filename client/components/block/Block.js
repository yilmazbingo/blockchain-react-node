import React, { useState } from "react";
import Transaction from "../transaction/Transaction";

const Block = (props) => {
  const [displayTransaction, setDisplayTransaction] = useState(false);
  const toggle = () => setDisplayTransaction(!displayTransaction);
  const { hash, timestamp, data } = props.block;
  const stringifiedData = JSON.stringify(data);
  const dataDisplay = `${stringifiedData.substring(0, 35)}...`;

  return (
    <div>
      <h3>Hash:{hash}</h3>
      <h3> Timestamp:{timestamp}</h3>
      <h3 onClick={toggle}>
        Data: {displayTransaction ? stringifiedData : dataDisplay}
      </h3>
    </div>
  );
};

export default Block;
