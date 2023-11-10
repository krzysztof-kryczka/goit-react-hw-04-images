import React, { useEffect, useState } from 'react';
import { fetchPhoto } from '../services/pixabay-api';
import Searchbar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Notiflix from 'notiflix';

const App = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);

  const handleSubmit = search => {
    setCurrentPage(1);
    setImages([]);
    setQuery(search);
  };

  const handleButton = () => {
    setCurrentPage(prev => prev + 1);
  };

  useEffect(() => {
    if (!query) return;

    fetchSearch(query, currentPage);
  }, [query, currentPage]);

  const fetchSearch = async (valueSearch, valueCurrentPage) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchPhoto(valueSearch, valueCurrentPage);

      if (response.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      setTotalHits(response.totalHits);
      setImages(prevState => [...prevState, ...response.hits]);
    } catch (error) {
      setError(error);
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setLargeImageURL('');
  };

  const handleModalOpen = url => {
    setIsModalOpen(true);
    setLargeImageURL(url);
  };

  return (
    <div>
      {error && <p>Something went wrong: {error.message}</p>}
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery cards={images} onShow={handleModalOpen} />
      {isLoading && <Loader />}
      {images.length !== 0 && images.length !== totalHits && (
        <Button onClick={handleButton} />
      )}
      {isModalOpen && (
        <Modal onClose={handleModalClose} image={largeImageURL} />
      )}
    </div>
  );
};

export default App;
