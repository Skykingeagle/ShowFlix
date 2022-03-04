import React from "react";
import { Typography } from "antd";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, InstapaperIcon, InstapaperShareButton, RedditIcon, RedditShareButton, TwitterIcon, TwitterShareButton } from "react-share";

const { Title } = Typography;

function MainImage(props) {
  return (
    <div
      style={{
        background: `linear-gradient(to bottom, rgba(0,0,0,0)
            39%,rgba(0,0,0,0)
            46%,rgba(0,0,0,0.65)
            100%),
            url('${props.image}') center top, #1c1c1c`,
        height: "500px",
        backgroundSize: "100px",
        backgroundPosition: "center, center",
        width: "100%",
        position: "relative",
      }}
      // style={{
      //   background: "linear-gradient(to bottom, rgba(0,0,0,0) 39%, rgba(0,0,0,0) 41%, rgba(0,0,0,0.65) 100%), url(" + props.image + ") center center no-repeat #1c1c1c",
      //   backgroundSize: "cover",
      //   height: "600px",
      // }}
    >
      <div>
        <div
          style={{
            position: "absolute",
            maxWidth: "500px",
            bottom: "2rem",
            marginLeft: "2rem",
          }}
        >
          <Title style={{ color: "white" }} level={2}>
            {" "}
            {props.title}{" "}
          </Title>
          <p style={{ color: "white", fontSize: "1rem" }}>{props.text}</p>
          <p style={{ color: "white", fontSize: "1rem" }}>
            <b>Share On</b> <br />
            <FacebookShareButton url={"https://www.google.com/"}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href}>
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <InstapaperShareButton url={window.location.href}>
              <InstapaperIcon size={32} round={true} />
            </InstapaperShareButton>
            <EmailShareButton url={window.location.href}>
              <EmailIcon size={32} round={true} />
            </EmailShareButton>
            <RedditShareButton url={window.location.href}>
              <RedditIcon size={32} round={true} />
            </RedditShareButton>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainImage;
