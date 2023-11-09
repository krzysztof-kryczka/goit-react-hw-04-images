import React, { Component } from 'react';
import { fetchPhoto } from '../services/pixabay-api';
import Searchbar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Notiflix from 'notiflix';

class App extends Component {
  state = {
    search: '',
    currentPage: 0,
    totalHits: 0,
    images: [],
    error: null,
    isLoading: false,
    isModalOpen: false,
    largeImageURL: '',
    webformatURL: '',
  };

  handleSubmit = search => {
    if (search !== this.state.search) {
      this.setState({ images: [], currentPage: 1, search }, () => {
        this.fetchSearch(search);
      });
    }
  };

  handleButton = () => {
    this.setState({ currentPage: this.state.currentPage + 1 }, () => {
      this.fetchSearch(this.state.search);
    });
  };

  fetchSearch = async valueSearch => {
    this.setState({ isLoading: true, error: null });
    try {
      const response = await fetchPhoto(valueSearch, this.state.currentPage);

      if (response.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        this.setState({ currentPage: 0 });
        return;
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...response.hits],
        totalHits: response.totalHits,
      }));
    } catch (error) {
      this.setState({ error: error });
    } finally {
      setTimeout(() => this.setState({ isLoading: false }), 600);
    }
  };

  handleModalClose = () => {
    this.setState({ isModalOpen: false, largeImageURL: '' });
  };

  handleModalOpen = url => {
    this.setState({ isModalOpen: true, largeImageURL: url });
  };

  render() {
    const { images, largeImageURL, totalHits, isLoading, isModalOpen } =
      this.state;
    return (
      <div>
        <Searchbar onSubmit={this.handleSubmit} />
        <ImageGallery cards={images} onShow={this.handleModalOpen} />
        {isLoading && <Loader />}
        {images.length !== 0 && images.length !== totalHits && (
          <Button onClick={this.handleButton} />
        )}

        {isModalOpen && (
          <Modal onClose={this.handleModalClose} image={largeImageURL} />
        )}
      </div>
    );
  }
}

export default App;