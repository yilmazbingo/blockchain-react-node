import React, { useState, useRef } from "react";
import "./receive.scss";

const Receive = (props) => {
  const { wallet } = props;
  const [clicked, setClicked] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const publicKeyRef = useRef(null);

  function copyToClipboard(e) {
    publicKeyRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setCopySuccess("Copied!");
  }
  const handleClick = () => setClicked(true);
  return (
    <div>
      <button onClick={handleClick}>Get Your Public Key</button>
      {copySuccess && <h5 className="copied">{copySuccess}</h5>}
      {clicked && (
        <div>
          <textarea
            readOnly
            ref={publicKeyRef}
            className="publicKey"
            value={clicked ? wallet.address : ""}
          ></textarea>
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      )}
    </div>
  );
};

export default Receive;
