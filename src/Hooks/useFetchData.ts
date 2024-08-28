import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchData = (url: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(url).then(response => setData(response.data));
  }, [url]);

  return data;
};
