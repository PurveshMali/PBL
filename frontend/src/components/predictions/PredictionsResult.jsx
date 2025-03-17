import React from "react";

const PredictionsResult = ({ result }) => {
  return (
    <div>
      <h1 className="text-3xl text-gray-100 font-serif">
        Predicted SO2 Emission:
        <span className="text-green-500 text-6xl">{result}</span><span className="text-gray-500 font-normal text-base">(mg/Nm<sup>3</sup>)</span>
      </h1>
    </div>
  );
};

export default PredictionsResult;
