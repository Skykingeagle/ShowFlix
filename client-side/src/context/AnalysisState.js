import React, { useEffect, useState } from "react";
import AnalysisContext from "./analysisContext";

const AnalysisState = (props) => {
  const [noOfLikes, setNoOfLikes] = useState(0);
  const [noOfDislikes, setNoOfDislikes] = useState(0);

  useEffect(() => {
    console.log(noOfLikes);
    console.log(noOfDislikes);
  }, [noOfDislikes])
  
  return (
    <AnalysisContext.Provider
      value={{ noOfDislikes, noOfLikes, setNoOfDislikes, setNoOfLikes }}
    >
      {props.children}
    </AnalysisContext.Provider>
  );
};

export default AnalysisState;