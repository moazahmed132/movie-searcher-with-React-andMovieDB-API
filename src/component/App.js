import React, { Component } from 'react';
import Nav from './Nav'
import SearchArea from './SearchArea'
import MovieList from './MovieList';
import Pagination from './Pagination'
import MovieInfo from './MovieInfo'

class App extends Component {
  constructor() {
    super()
    this.state = {
      movies: [],
      searchTerm: '',
      totalResults: 0,
      currentPage: 1,
      currentMovie: null

    }
    this.apiKey = '3726e95be783a26ad885909fe3eb6947'
  }


  handleSubmit = (e) => {

    e.preventDefault()
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.state.searchTerm}
      `)
      .then(data => data.json())
      .then(data => {
        console.log("App -> handleSubmit -> data", data)
        
          this.setState({
            movies: [...data.results], totalResults: data.total_results
          })
        
      })
  }

  handleChange = (e) => {
    this.setState({
      searchTerm: e.target.value
    })
  }

  nextPage = (pageNumber) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.state.searchTerm}&&language=en-US&page=${pageNumber}`)

      .then(data => data.json())
      .then(data => {
        console.log("App -> handleSubmit -> data", data)
        this.setState({
          movies: [...data.results], currentPage: pageNumber
        })
      })

  }
  viewMovieInfo = (id) => {
    const filterMovie = this.state.movies.filter(movie => movie.id == id)
    const newCurrentMovie = filterMovie.length > 0 ? filterMovie[0] : null
    this.setState({
      currentMovie: newCurrentMovie
    })
  }

  closeMovieInfo = () => {
    this.setState({
      currentMovie: null
    })
  }
  render() {
    const numberPages = Math.floor(this.state.totalResults / 20)
    return (
      <div className="App">
        <Nav />
        {this.state.currentMovie == null ?
          <div>
            <SearchArea
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange} />
            <MovieList
              movies={this.state.movies}
              viewMovieInfo={this.viewMovieInfo} />
          </div>
          : <MovieInfo
            closeMovieInfo={this.closeMovieInfo}
            currentMovie={this.state.currentMovie} />
        }
        {this.state.totalResults > 20 && this.state.currentMovie == null
          ? <Pagination
            pages={numberPages}
            nextPage={this.nextPage}
            currentPage={this.state.currentPage}
          />
          : ''}
      </div>
    );
  }
}

export default App;
