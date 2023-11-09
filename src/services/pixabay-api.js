import axios from 'axios';
import {
  API_BASE_URL,
  API_KEY,
  pageLimit,
} from '../consts/pixabay-api-consts';

export const fetchPhoto = async (search, numberPage) => {
  const { data } = await axios.get(API_BASE_URL, {
    method: 'get',
    params: {
      key: API_KEY,
      q: search,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: pageLimit,
      page: numberPage,
    },
  });
  return data;
};
