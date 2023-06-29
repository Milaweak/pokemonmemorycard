import React, { useEffect, useState } from "react";
import "./styles.css";

const apiBaseUrl = "https://pokeapi.co/api/v2";
const imageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export default function App() {
  const [openedCard, setOpenedCard] = useState([]);
  const [matched, setMatched] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    fetchPokemons();
  }, []);
  

  const fetchPokemons = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/pokemon?limit=6`);
      const data = await response.json();
      const fetchedPokemons = data.results.map((pokemon, index) => ({
        id: index + 1,
        name: pokemon.name
      }));
      setPokemons([...fetchedPokemons, ...fetchedPokemons]);
    } catch (error) {
      console.log("Error fetching pokemons:", error);
    }
  };

  function flipCard(index) {
    setOpenedCard((opened) => [...opened, index]);
  }

  //reset button
  function resetGame() {
    setOpenedCard([]);
    setMatched([]);
    setIsGameWon(false);
  }

  useEffect(() => {
    if (openedCard.length < 2) return;

    //matching cards
    const firstMatched = pokemons[openedCard[0]];
    const secondMatched = pokemons[openedCard[1]];

    if (secondMatched && firstMatched.id === secondMatched.id) {
      setMatched([...matched, firstMatched.id]);
    }

    if (openedCard.length === 2) setTimeout(() => setOpenedCard([]), 1000);

    if (matched.length === pokemons.length / 2) {
      setIsGameWon(true);
    }
  }, [openedCard, pokemons, matched]);


  
  return (
    <div className="App">
      {isGameWon && (
        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>
      )}
      <div className="cards">
        {pokemons.map((pokemon, index) => {
          let isFlipped = false;

          if (openedCard.includes(index)) isFlipped = true;
          if (matched.includes(pokemon.id)) isFlipped = true;
          return (
            <div
              className={`pokemon-card ${isFlipped ? "flipped" : ""} `}
              key={index}
              onClick={() => flipCard(index)}
            >
              <div className="inner">
                <div className="front">
                  <img
                    src={`${imageUrl}/${pokemon.id}.png`}
                    alt={pokemon.name}
                    width="100"
                  />
                </div>
                <div className="back"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
