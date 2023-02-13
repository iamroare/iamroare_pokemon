
import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card';
import Navbar from './components/Navbar';
import { getAllPokemon, getPokemon } from './services/pokemon';


function App() {
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const initialURL = 'https://pokeapi.co/api/v2/pokemon'


  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL)
      console.log(response);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, [])

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon)
      return pokemonRecord
    }))
    setPokemonData(_pokemonData);
  }

  const prev = async ()=>{
    if(!prevUrl){
      return ;
    }
    setLoading(true);
    let data= await getAllPokemon(prevUrl);
    await loadPokemon(data.results);

    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const next = async () =>{
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    // setNextUrl()
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }
  // console.log(pokemonData);

  return (
    <>
    <Navbar />
    <div>
      {loading ? <h1 style={{ textAlign: 'center' }}>Loading...</h1> : (
        <>
          <div className="btn">
            <button className='btn' 
            onClick={prev}
            >Prev</button>
            <button className='btn' 
            onClick={next}
            >Next</button>
          </div>
          <div className="grid-container">
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon} />
            })}
          </div>
          <div className="btn">
            <button 
            onClick={prev}
            >Prev</button>
            <button 
            onClick={next}
            >Next</button>
          </div>
        </>
      )}
    </div>
  </>

  );
}

export default App;
 