import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params:{
        api_key: "7fb4e866ff570b8f542f7d6ac3a88a21",
        language: "pt-BR",
        incluide_adult: false,
    },
});
