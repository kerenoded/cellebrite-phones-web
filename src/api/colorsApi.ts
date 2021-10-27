import { API_URL } from './../constants/index';

import Axios from "axios";

const colorsUrl = API_URL + 'colors';

export const getColorsCollection = async () => {
    return Axios(colorsUrl)
        .then((response) => {
          const { data } = response;
          return data;
        })
        .catch((error) => {
          console.error('getColors', error);
          return [];
        });
  };