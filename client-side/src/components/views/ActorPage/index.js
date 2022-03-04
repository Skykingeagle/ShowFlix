import { Grid } from "@material-ui/core";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { API_KEY, API_URL, IMAGE_BASE_URL, POSTER_SIZE } from "../../Config";

const ActorPage = ({
  match: {
    params: { actorId }
  }
}) => {
  let personEndpoint = `${API_URL}person/${actorId}?api_key=${API_KEY}`;
  let personMoviesEndpoint = `${API_URL}person/${actorId}/movie_credits?api_key=${API_KEY}`;

  const [actor, setActor] = useState(null);

  useEffect(() => {
    (async () => {
      let _actor = {};
      let res = await Axios.get(personEndpoint);
      if (res.status === 200) _actor = res.data;

      res = await Axios.get(personMoviesEndpoint);
      if (res.status === 200)
        _actor = {
          ..._actor,
          movies: res.data?.cast?.slice(0, 10) || []
        };

      setActor(_actor);
    })();
  }, [personEndpoint, personMoviesEndpoint]);

  console.log(actor);
  return (
    <div style={{ marginLeft: "10vw", width: "80vw", marginTop: "5vh" }}>
      {!!actor ? (
        <>
          <Title>{actor.name}</Title>
          <div style={{ display: "flex", marginBottom: "5vh" }}>
            <img
              src={`${IMAGE_BASE_URL}w200${actor.profile_path}`}
              alt='actor'
              style={{ borderRadius: "10px", marginRight: "3vw" }}
            />
            <div style={{ flexDirection: "column" }}>
              <p>
                <b>Also known as: </b>
                {actor?.also_known_as?.join(", ")}
              </p>
              <p>
                <b>Birthday: </b>
                {actor.birthday}
              </p>
              <p>
                <b>Popularity rating: </b>
                {actor.popularity}
              </p>
              <p>
                <b>Department: </b>
                {actor.known_for_department}
              </p>
            </div>
          </div>
          {!!actor.movies.length && (
            <>
              <Title>Starred In</Title>
              <Grid container>
                {actor.movies.map(
                  (movie, index) =>
                    !!movie.poster_path && (
                      <Grid lg={2} key={index}>
                        <img
                          src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
                          alt={movie.title}
                          style={{ height: "15rem" }}
                        />
                        <p>
                          <b>
                            {movie.title.slice(0, 20)}
                            {movie.title.length > 20 ? "..." : ""}
                          </b>
                        </p>
                      </Grid>
                    )
                )}
              </Grid>
              <b style={{ fontSize: "2rem" }}>And many more...</b>
            </>
          )}
        </>
      ) : (
        <Title>Loading...</Title>
      )}
    </div>
  );
};

export default ActorPage;
