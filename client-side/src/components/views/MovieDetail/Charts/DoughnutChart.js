import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import analysisContext from "../../../../context/analysisContext";

const DoughnutChart = (porps) => {
  const analysisCon = useContext(analysisContext);
  const { noOfLikes, noOfDislikes } = analysisCon;

  const [chartData, setChartData] = useState({
    labels: ["NoOfComments", "Likes", "Dislikes"],
    datasets: [
      {
        id: 1,
        label: "",
        data: [porps.CommentLists.length, noOfLikes, noOfDislikes],
      },
    ],
  });

  useEffect(() => {
    setChartData({
      labels: ["NoOfComments", "Likes", "Dislikes"],
      datasets: [
        {
          id: 1,
          label: "Over all analysis for comments",
          data: [porps.CommentLists.length, noOfLikes, noOfDislikes],
          backgroundColor: ['blue','green','red']
        },
      ],
    });
  }, [noOfLikes,noOfDislikes]);

  return (
    <div style={{ display:'flex',flexDirection:'column', width: "400px", margin:'auto' }}>
      <Doughnut data={chartData} />
      <div>Analysis</div>
    </div>
  );
};

export default DoughnutChart;
