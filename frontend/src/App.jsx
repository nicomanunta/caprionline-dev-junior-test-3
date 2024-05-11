import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

// importiamo Axios
import axios from 'axios'; 



const App = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState(null);



  const fetchMovies = () => {
    setLoading(true);

    // chiamata axios per effettuare la richiesta ai film
    axios.get('http://localhost:8000/movies').then(response => {
        setMovies(response.data);
        setLoading(false);
      })
      
  }

  useEffect(() => {
    // chiamata axios per elenco dei generi disponibili
    axios.get('http://localhost:8000/genres').then(response => {
        console.log(response.data);
        setGenres(response.data);
      })

    // film in base al genere selezionato
    if (selectedGenreId !== null) {
      axios.get('http://localhost:8000/movies', {
        params: {
          genre_id: selectedGenreId
        }
      }).then(response => {
          setMovies(response.data);
        })
        
    }
  }, [selectedGenreId]);
  
  // gestore per il cambio del genere selezionato
  const chooseGenre = (event) => {
    setSelectedGenreId(event.target.value);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // funzione per ordine anno
  const changeOrderByYear = () => {
    setLoading(true);
    // richiesta GET con parametro orderByYear
    axios.get('http://localhost:8000/movies?orderByYear=DESC').then(response => {

      setMovies(response.data);
      setLoading(false);
    })
      
  }

  // funzione per ordine rating
  const changeOrderByRating = () => {
    setLoading(true);
    // richiesta GET con parametro orderByRating
    axios.get('http://localhost:8000/movies?orderByRating=DESC').then(response => {

      setMovies(response.data);
      setLoading(false);
    })
      
  }

  // funzione per ricercare i film per genere
  const submitGenre = () => {
    if (selectedGenreId !== '') {
      console.log(selectedGenreId); 
      axios.get(`http://localhost:8000/movies?genreId=${selectedGenreId}`).then(response => {

        setMovies(response.data);
      })     
    }
  };

  return (
    <Layout>
      <Heading/>

      <Filter changeOrderByYear={changeOrderByYear} changeOrderByRating={changeOrderByRating} chooseGenre={chooseGenre} submitGenre={submitGenre} genres={genres}/>

      <MovieList loading={loading}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

//aggiungo filtri
const Filter = ({ changeOrderByYear, changeOrderByRating, chooseGenre, submitGenre, genres }) => {
  return (
    <div className="flex justify-center mt-4">
      <select onChange={chooseGenre}  color="light" size="sm" style={{ width: '200px', height: '38px', fontSize: '14px',  borderRadius: '8px 0px 0px 8px', border: ' 1px solid #E5E7EB' }}>
        <option value="" >Seleziona un genere</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.id}>{genre.name}</option>
        ))}
      </select>
      <Button color="light" size="sm" onClick={submitGenre} className="mr-2 mb-8" style={{borderRadius: '0px 8px 8px 0px', border: ' 1px solid #E5E7EB'}}>
        Invia
      </Button>
      <Button color="light" size="sm" onClick={changeOrderByYear} className="mr-2 mb-8" style={{ border: ' 1px solid #E5E7EB'}}>
        Ordina dal più recente
      </Button>
      <Button color="light" size="sm" onClick={changeOrderByRating} className="ml-2 mb-8" style={{ border: ' 1px solid #E5E7EB'}}>
        Ordina per voto  
      </Button>
      
    </div>
    
  );
};


const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-8">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>
    </div>
  );
};




const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
                <span>{props.year}</span>

                {props.rating
                  ? <Rating>
                      <Rating.Star />

                      <span className="ml-0.5">
                        {props.rating}
                      </span>
                    </Rating>
                  : null
                }
              </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
              color="light"
              size="xs"
              className="w-full"
              onClick={() => window.open(props.wikipediaUrl, '_blank')}
            >
              More
            </Button>
          : null
        }
      </div>
    </div>
  );
};

export default App;