import React, { useContext, useEffect, useState } from "react";
import MainImage from "../Commons/MainImage";
import MovieInfo from "./Sections/MovieInfo";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../Config";
import GridCards from "../Commons/GridCards";
import { Row } from "antd";
import Favorite from "./Sections/Favorite";
import Comment from "./Sections/Comments";
import Axios from "axios";
import { Button } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import Title from "antd/lib/typography/Title";
import { Grid } from "@material-ui/core";
import DoughnutChart from "./Charts/DoughnutChart";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper,
    marginLeft: "10vw",
    width: "80vw",
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
}));

function MovieDetail(props) {
  // Get movie id
  let movieId = props.match.params.movieId;

  const [Movie, setMovie] = useState([]);
  const [Casts, setCasts] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);

  const movieVariable = {
    movieId: movieId,
  };
  const classes = useStyles();

  useEffect(() => {
    // Information of Crew
    let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
    let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;

    fetch(endpointInfo)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        setMovie(response);
      });

    fetch(endpointCrew)
      .then((response) => response.json())
      .then((response) => {
        // console.log("responseForCrew", response);
        setCasts(response.cast);
      });

    Axios.post("/api/comment/getComments", movieVariable).then((response) => {
      // console.log(response);
      if (response.data.success) {
        // console.log("response.data.comments", response.data.comments);
        setCommentLists(response.data.comments);
      } else {
        alert("Failed to get comments Info");
      }
    });
  }, []);

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };

  return (
    <div>
      {/* Header */}
      <MainImage
        image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
        title={Movie.original_title}
        text={Movie.overview}
      />

      <div style={{ witdh: "85%", margin: "1rem auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "1rem",
          }}
        >
          <Favorite
            movieinfo={Movie}
            movieId={movieId}
            userFrom={localStorage.getItem("userId")}
          />
        </div>
      </div>

      <br />
      {/* Actor Grid */}
      <Title style={{ marginLeft: "10vw" }}>Cast</Title>
      <div className={classes.root}>
        <Grid container>
          {Casts &&
            Casts.map(
              (cast, index) =>
                !!cast.profile_path && (
                  <Grid
                    key={index}
                    lg={2}
                    style={{ cursor: "pointer" }}
                    onClick={() => props.history.push(`/actor/${cast.id}`)}
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${POSTER_SIZE}${cast.profile_path}`}
                      alt={"actor"}
                    />
                    <p>
                      <b>{cast.name}</b>
                    </p>
                  </Grid>
                )
            )}
        </Grid>
      </div>

      <DoughnutChart CommentLists={CommentLists} />

      <div style={{ marginLeft: "5vw", width: "90vw" }}>
        {/* Comments */}
        <Comment
          title={Movie.original_title}
          CommentLists={CommentLists}
          movieVariable={movieVariable}
          setCommentLists={setCommentLists}
          postId={movieId}
          refreshFunction={updateComment}
        />
      </div>
    </div>
  );
}

export default MovieDetail;
