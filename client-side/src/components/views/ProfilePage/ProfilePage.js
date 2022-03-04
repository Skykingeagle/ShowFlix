import React, { useEffect, useState } from "react";
import "./favorite.css";
import Axios from "axios";
import { Button, Typography, Popover } from "antd";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../Config";
import { useSelector } from "react-redux";
const { Title } = Typography;

function ProfilePage() {
  const { userData: user } = useSelector((state) => state.user);
  const [Favorites, setFavorites] = useState([]);
  const [Loading, setLoading] = useState(true);
  let variable = { userFrom: localStorage.getItem("userId") };

  useEffect(() => {
    fetchFavoritedMovie();
  }, []);

  // Fetch F
  const fetchFavoritedMovie = () => {
    Axios.post("/api/favorite/getFavoritedMovie", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.favorites);
        setFavorites(response.data.favorites);
        setLoading(false);
      } else {
        alert("Failed to get favorite info");
      }
    });
  };

  const onClickDelete = (movieId, userFrom) => {
    const variables = {
      movieId: movieId,
      userFrom: userFrom
    };

    Axios.post("/api/favorite/removeFromFavorite", variables).then(
      (response) => {
        if (response.data.success) {
          fetchFavoritedMovie();
        } else {
          alert("Failed to Remove From Favorite");
        }
      }
    );
  };

  const renderCards = Favorites.map((favorite, index) => {
    const content = (
      <div>
        {favorite.moviePost ? (
          <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favorite.moviePost}`} />
        ) : (
          "no image"
        )}
      </div>
    );

    console.log("USER", user);

    return (
      <tr key={index}>
        <Popover content={content} title={`${favorite.movieTitle}`}>
          <td>{favorite.movieTitle}</td>
        </Popover>

        <td>{favorite.movieRunTime} mins</td>
        <td>
          <Button
            onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}
          >
            Remove
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <div style={{ marginBottom: "4rem" }}>
        <Title level={2}>My Profile</Title>
        <div
          style={{ marginTop: "1rem", flexDirection: "row", display: "flex" }}
        >
          <img
            src={user?.image}
            alt={"profile"}
            style={{
              marginRight: "3rem",
              borderRadius: "50%",
              boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
              height: "8rem",
              width: "8rem"
            }}
          />
          <div style={{ flexDirection: "column" }}>
            <p>
              <b>Name:</b> {user?.name}
            </p>
            <p>
              <b>User ID:</b> {user?._id}
            </p>
            <p>
              <b>Email:</b> {user?.email}
            </p>
          </div>
        </div>
      </div>
      <Title level={2}> My Favorite Movies</Title>
      <hr />

      <table>
        <tbody>
          <tr>
            <th>{"Movie Title"}</th>
            <th>Movie Runtime</th>
            <td>Remove from favorite</td>
          </tr>
        </tbody>

        <tbody>{renderCards}</tbody>
      </table>
    </div>
  );
}

export default ProfilePage;
