import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import Moment from "react-moment";
class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {}
  };

  componentDidMount() {
    axios
      //this get method is getting the lyrics and then the track information
      .get(
        `https://cors-access-allow.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${
          this.props.match.params.id
        }&apikey=${process.env.REACT_APP_MM_KEY}`
      )
      .then(res => {
        // console.log("get lyrics");
        // console.log(res.data);
        // checks to see if the api call actually received the lyrics,
        // if not then it will take care of it and not error out
        if (res.data.message.header.status_code === 200) {
          this.setState({ lyrics: res.data.message.body.lyrics });
        } else {
          var no_lyrics = {
            lyrics_body: "Sorry, no lyrics found. :("
          };
          this.setState({ lyrics: no_lyrics });
        }
        // get the track information api call
        return axios.get(
          `https://cors-access-allow.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.get?track_id=${
            this.props.match.params.id
          }&apikey=${process.env.REACT_APP_MM_KEY}`
        );
      })
      .then(res => {
        // console.log("get track");
        // console.log(res.data);
        this.setState({ track: res.data.message.body.track });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { track, lyrics } = this.state;
    // console.log(track);
    // console.log(lyrics)

    // waits till there is data avaible from using the api calls
    // once data is avaiable, format it and output that lyrics and track information for the song
    if (
      track === undefined ||
      lyrics === undefined ||
      Object.keys(track).length === 0 ||
      Object.keys(lyrics).length === 0
    ) {
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <Spinner />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <div className="card">
            <h5 className="card-header">
              {track.track_name} by{" "}
              <span className="text-secondary">{track.artist_name}</span>
            </h5>
            <div className="card-body">
              {" "}
              {lyrics.lyrics_body.split("\n").map((lyric, key) => {
                // console.log(lyric);
                // format the lyrics so that each line is its own p tag
                return (
                  <p key={key} className="card-text">
                    {lyric}
                  </p>
                );
              })}
            </div>
          </div>
          <ul className="list-group mt-3">
            <li className="list-group-item">
              <strong>Album ID</strong>: {track.album_id}
            </li>
            <li className="list-group-item">
              <strong>Song Genre</strong>:{" "}
              {/* // making sure that it doesn't error when the song doesn't have a gener list */}
              {Object.keys(track.primary_genres.music_genre_list).length === 0
                ? "Unknown"
                : track.primary_genres.music_genre_list[0].music_genre
                    .music_genre_name}
            </li>
            <li className="list-group-item">
              <strong>Explicit Words</strong>:{" "}
              {track.explicit === 0 ? "No" : "Yes"}
            </li>
            <li className="list-group-item">
              <strong>Last Updated</strong>:{" "}
              <Moment format="MM/DD/YYYY">{track.updated_time}</Moment>
            </li>
          </ul>
        </React.Fragment>
      );
    }
  }
}

export default Lyrics;
