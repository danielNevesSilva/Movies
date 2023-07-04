import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlass } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";

import { styles } from "./styles";
import { api } from "../../services/api";
import { CardMovies } from "../../components/MovieCards";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
}

export function Home() {
    const [discoveryMovies, setdiscoveryMovies] = useState<Movie[]>([]);
    const [searchResultMovie, setSearchResultMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setloading] = useState(false);
    const [noResults, setnoResult] = useState(false);
    const [search, setsearch] = useState("");


    const navigation = useNavigation();

    useEffect(() => {
        loadMoreData();
    }, []);


    const loadMoreData = async () => {
        const response = await api.get("/movie/popular", {
            params: {
                page,
            },
        });
        setdiscoveryMovies([...discoveryMovies, ...response.data.results]);
        setPage(page + 1);
        setloading(false);

        
    };

const searchMovies = async (query: string) => {
    setloading(true);
    const response = await api.get("/search/movie", {
        params: {
            query,
        },
    });


    if(response.data.results.length ===0){
        setnoResult(true);

    }else{
        setSearchResultMovies(response.data.results);
    }
    setloading(true);
};


    const handleSearch = (text: string) => {
        setsearch(text)
        if(text.length > 2){
            searchMovies(text);
        }else{
            setSearchResultMovies([]);
        }
    };

    const renderMovieItem = ({ item }: { item: Movie }) => (
        <CardMovies
          data={item}
          onPress={() => {
            navigation.navigate("Details", { movieId: item.id });
          }}
        />
      );

    const movieData = search.length > 1 ? searchResultMovie : discoveryMovies;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Oque você quer assistir hoje?</Text>
                <View style={styles.containerInput}>
                    <TextInput
                        placeholderTextColor="#FFF"
                        placeholder="Buscar"
                        style={styles.Input}
                        value={search}
                        onChangeText={handleSearch}
                    />
                    <MagnifyingGlass color="#FFf" size={25} weight="light" />
                </View>
            </View>
            <View>
                <FlatList
                    data={movieData}
                    numColumns={3}
                    renderItem={renderMovieItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: 35,
                        paddingBottom: 100,
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => loadMoreData()}
                    onEndReachedThreshold={0.5}
                />
                 {noResults && (
          <Text style={styles.noResultsText}>
            Nenhum filme encontrado para "{search}"
          </Text>
        )}
                {loading && <ActivityIndicator  size={50} color="#0296e5"/>}
            </View>
        </View>
    );
}
