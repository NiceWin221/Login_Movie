import { useParams, useNavigate, json } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMoviesDetails } from "../../services/omdbService";
import RickRoll from "../../videos/rick-roll.mp4"
import axios from "axios";
import "./moviePlay.css"

const MoviePlay = () => {
  const { movieId } = useParams()
  const [active, setActive] = useState(false)
  const [play, setPlay] = useState(false)
  const [movieDetails, setMovieDetails] = useState(null)
  const navigate = useNavigate()

  const handleMovieDownload = (movie) => {
    navigate(`/movieDownload/${movie.imdbID}`)
  }

  const handleSaveMovie = async (movie) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      if (active) {
        const response = await axios.delete(`http://localhost:3000/movies/${movie.imdbID}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
        })

        if (response.data) {
          setActive(false);
        } else {
          throw new Error("Failed to remove movie");
        }

      } else {
        const data = {
          imdbID: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          plot: movie.Plot,
          director: movie.Director,
          writer: movie.Writer
        };

        const response = await axios.post('http://localhost:3000/movies', data, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
        });

        if (response.data) {
          setActive(true);
        } else {
          throw new Error("Failed to save movie");
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const details = await fetchMoviesDetails(movieId);
      setMovieDetails(details);

      try {
        const accessToken = sessionStorage.getItem("accessToken")
        const response = await axios.get(`http://localhost:3000/movies/${movieId}`,
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }
          })

        if (response.data.saved) {
          setActive(true)
        } else {
          setActive(false)
        }
      } catch (err) {
        console.error("Failed to Check Movie", err)
      }
    };

    fetchData();
  }, [movieId]);

  return (
    <>
      {
        movieDetails ? (
          <div className="movie-play-container" >
            <div className="movie-play">
              <h1>Watch {movieDetails.Title}</h1>
              <div style={{ width: "800px", border: "5px solid #1a1e22", borderRadius: "5px" }}>
                <div className="movie-play-headers">
                  <h1>{movieDetails.Title}</h1>
                  <span>
                    <i className="fa-solid fa-server"></i>
                    <p>Server HD 1</p>
                    <i className="fa-solid fa-arrow-down"></i>
                  </span>
                </div>
                <div className="movie-play-body">
                  {play ? (
                    <video
                      src={RickRoll}
                      controls
                      autoPlay
                    >
                    </video>
                  ) : (
                    <i className="fa-solid fa-play" onClick={() => { setPlay(true) }}></i>
                  )}
                  <img src={movieDetails.Poster} alt={movieDetails.Title} />
                </div>
                <div className="movie-play-footer">
                  <p>Active: <span style={{ color: '#1890ff', display: 'inline', background: "none" }}>{movieDetails.imdbID}</span></p>
                  <span onClick={() => { handleMovieDownload(movieDetails) }}>
                    <i className="fa-solid fa-download"></i>
                    <p>Download</p>
                  </span>
                </div>
              </div>
              <div className="overview">
                <h1>Overview</h1>
                <p>{movieDetails.Plot}</p>
              </div>
              <div className="vip">
                <p>Movies atau TV Shows tidak bisa diputar? Silahkan pilih server lainnya. <span style={{ color: '#ffcf00', display: 'inline' }}>Gunakan Server HD1 dan pilih Server Vip 3 untuk subtitle lengkap,</span> Jika anda mempunyai file subtitle sendiri <span style={{ color: '#0be881', display: 'inline' }}>silahkan gunakan server Vip 1</span>, atau <span style={{ color: '#ffcf00', display: 'inline' }}>Gunakan Server HD 4</span> / <span style={{ color: '#0be881', display: 'inline' }}>Hydrax atau Doodstream</span> utk film lokal terbaru dan serial mandarin, terimakasih.</p>
              </div>
            </div>
            <div className="movie-play-poster">
              <div className="movie-poster">
                <img src={movieDetails.Poster} alt={movieDetails.Title} />
                <span>
                  <h1>Video Quality: </h1>
                  <p>HD</p>
                </span>
              </div>
              <div className={`bookmark-movie ${active ? "active" : ""}`} onClick={() => { handleSaveMovie(movieDetails) }}>
                <i className="fa-regular fa-bookmark"></i>
                <p>Bookmark</p>
              </div>
              <div className="details-movie">
                <p>IMDB Rate: <span>{movieDetails.imdbRating}</span></p>
                <p>Genres: <span>{movieDetails.Genre}</span></p>
                <p>Year: <span>{movieDetails.Year}</span></p>
                <p>Language: <span>{movieDetails.Language}</span></p>
                <p>Run Time: <span>{movieDetails.Runtime}</span></p>
              </div>
            </div>
          </div >
        ) : (
          <p className="loading">Loading...</p>
        )
      }
    </>
  )
}

export default MoviePlay 