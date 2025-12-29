import React from "react";

const loaderStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "24px",
};

const Loader = () => {
  return <div style={loaderStyle}>Loading...</div>;
};

export default Loader;
