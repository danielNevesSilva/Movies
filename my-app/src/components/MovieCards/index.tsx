import { Image, Pressable } from "react-native";
import { estilos } from "./styles";

interface Movie {
  id: number;
  poster_path: string;
}

interface Props {
  data: Movie;
  onPress?: () => void;
}

export function CardMovies({ data, ...rest }: Props) {
  return (
    <Pressable {...rest} style={estilos.cardMovies}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        }}
        style={estilos.cardImage}
      />
    </Pressable>
  );
}