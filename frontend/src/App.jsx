import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const App = props => {
  const [moviesByYear, setMoviesByYear] = useState([]);
  const [moviesByRating, setMoviesByRating] = useState([]);
  const [loading, setLoading] = useState(true);

  // utilizzo `useState` per definire lo stato `orderByYear` e la funzione `setOrderByYear` per aggiornarlo.
  const [orderByYear, setOrderByYear] = useState('DESC');
  const [orderByRating, setOrderByRating] = useState('DESC');


  const fetchMovies = () => {
    console.log('Funziona');
    setLoading(true);
  
    // URL per API per ottenere l'elenco dei film
    let url = 'http://localhost:8000/movies';

    // verifico se è stato selezionato un ordine e aggiungo il parametro orderByYear all'URL
    if (orderByYear) {
      url += `?orderByYear=${orderByYear}`;
    }
    if (orderByRating) {
      url += `&orderByRating=${orderByRating}`;
    }
  
    return fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Data received:', data)
      setMoviesByYear(data.moviesByYear);
      setMoviesByRating(data.moviesByRating);
      setLoading(false);
    });
  };

  // funzione per ordinare i film al click
  const changeOrderByYear = () => {

    // verifica l'ordine
    const newOrderByYear = orderByYear === 'ASC' ? 'DESC' : 'ASC';

    // aggiorna lo stato di orderByYear 
    setOrderByYear(newOrderByYear);
     
  };
  const changeOrderByRating = () => {

    // verifica l'ordine
    const newOrderByRating = orderByRating === 'ASC' ? 'DESC' : 'ASC';

    // aggiorna lo stato di orderByRating 
    setOrderByRating(newOrderByRating);
     
  };
  

  useEffect(() => {
    fetchMovies();
  }, [orderByYear, orderByRating]); //ricarico i film ogni volta che orderByYear cambia

  return (
    <Layout>
      <Heading />

      {/* componente per filtrare i film in base all'anno*/}
      <FilterByYear orderByYear={orderByYear} changeOrderByYear={changeOrderByYear}  />
      <FilterByRating orderByRating={orderByRating} changeOrderByRating={changeOrderByRating} />

      <MovieList loading={loading}>
        {moviesByYear.map((movie, index) => (
          <MovieItem key={index} {...movie} />
        ))}
        {moviesByRating.map((movie, index) => (
          <MovieItem key={index} {...movie} />
        ))}
      </MovieList>
{/* 
      <MovieList loading={loading}>
        {moviesByRating.map((movie, index) => (
          <MovieItem key={index} {...movie} />
        ))}
      </MovieList> */}
    </Layout>
  );
};

// definizione del componente Filter come una funzione
const FilterByYear = ({ orderByYear, changeOrderByYear}) => {
  return (
    <div className="filter-by-year">  
      <Button color="light" size="xs" onClick={changeOrderByYear} className='mb-4'>
        Ordina {orderByYear ? (orderByYear === 'ASC' ? 'dal meno recente' : 'dal più recente' ) : ''}
      </Button>
    
    </div>
  );
};
const FilterByRating = ({orderByRating, changeOrderByRating}) => {
  return (
    <div className="filter-by-year">  
      <Button color="light" size="xs" onClick={changeOrderByRating} className='mb-4'>
        Ordina {orderByRating ? (orderByRating === 'ASC' ? 'dal meno votato' : 'dal più votato' ) : ''}
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
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
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
