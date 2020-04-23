import React from "react";

function TopBar() {
  return (
    <div className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <img src="/tari-logo-white.svg" alt="logo" className="tari-logo" />
        <span className="mdl-layout-title">Tari Config Generator</span>
        <div className="mdl-layout-spacer" />
      </div>
    </div>
  );
}

export default TopBar;
