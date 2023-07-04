import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {api} from "../services/api";

type Movie = {
    id: number;
    tittle: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
};

interface MovieContextData {
    favoriteMovies: number[];
    allFavoriteMovies: Movie[];
    addFavoriteMovies: (movieId: number) => void;
    removerFavoriteMovies: (MovieId: number) => void;
}

export const MovieContext = createContext<MovieContextData>({
    favoriteMovies: [],
    allFavoriteMovies: [],
    addFavoriteMovies: () => {},
    removerFavoriteMovies: () => {},
});

type MovieProviderProps = {
    children: ReactNode;
};

export const MovieProvider = ({ children }: MovieProviderProps) =>{
    const [favoriteMovies, setFavoriteMovies] = useState<number[]> ([]);
    const [allFavoriteMovies, setAllFavoriteMovies] = useState<Movie[]>([]);

    useEffect(() => {
        async function loadFavoriteMovies() {
            const favoriteMovies = await AsyncStorage.getItem("@FavoriteMovies");
            if(favoriteMovies) {
                setFavoriteMovies(JSON.parse(favoriteMovies));
            }
        }
        loadFavoriteMovies();
    }, []);

    const addFavoriteMovies = useCallback(
        async (movieId: number) => {
            if(!favoriteMovies.includes(movieId)) {
                const newFavotiteMovies = [...favoriteMovies, movieId];
                setFavoriteMovies(newFavotiteMovies);
                await AsyncStorage.setItem(
                    "@FavoriteMovies",
                    JSON.stringify(newFavotiteMovies)
                );
            }
        },
        [favoriteMovies]
    );

    const removerFavoriteMovies = useCallback(
        async (movieId: number) => {
          const newFavoriteMovies = favoriteMovies.filter((id) => id !== movieId);
          setFavoriteMovies(newFavoriteMovies);
          await AsyncStorage.setItem(
            "@FavoriteMovies",
            JSON.stringify(newFavoriteMovies)
          );
        },
        [favoriteMovies]
      );
    

    const parseFavoriteMovies = useMemo(() => parseFavoriteMovies, [favoriteMovies]);

    const getAllfavoriteMovies = useCallback(async () => {
        try{
            const movies = await Promise.all(
                parseFavoriteMovies.map(async (movieId: number) => {
                const response = await api.get<Movie>(`/movie/${movieId}`);
                return response.data;
                })
            );
            setAllFavoriteMovies(movies);
            } catch (error) {
                console.log(error);
            }
    }, [parseFavoriteMovies]);

    useEffect(() => {
        getAllfavoriteMovies();
    }, [parseFavoriteMovies, getAllfavoriteMovies]);

    const contexData: MovieContextData = {
        favoriteMovies: parseFavoriteMovies,
        allFavoriteMovies,
        addFavoriteMovies,
        removerFavoriteMovies,
    };

    return (
        <MovieContext.Provider value ={contexData}>
            {children}
            </MovieContext.Provider>
    );
};

export {Movie};