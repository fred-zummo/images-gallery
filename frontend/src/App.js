import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';
import ImageCard from './components/ImageCard';
import Welcome from './components/Welcome';
import Spinner from './components/Spinner';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Row, Col } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5050';

console.log(API_URL);

const App = () => {
  const [word, setWord] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const images_uri = `${API_URL}/images`;

  const getSavedImages = async () => {
    try {
      const res = await axios.get(images_uri);
      setImages(res.data || []);
      setLoading(false);

      toast.success('Saved images downloaded', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => getSavedImages(), []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    let new_image_uri = `${API_URL}/new-image?query=${word}`;

    try {
      const res = await axios.get(new_image_uri);
      setImages([{ ...res.data, title: word }, ...images]);
      const title = word.toUpperCase();
      toast.info(`New image ${title} was found`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    setWord('');
  };

  const handleDeleteImage = async (id) => {
    let del_image_uri = `${images_uri}/${id}`;
    try {
      const res = await axios.delete(del_image_uri);
      if (res.data?.deleted_id === id) {
        const imageToBeDeleted = images.find((i) => i.id === id);
        if (imageToBeDeleted) {
          const title = imageToBeDeleted.title?.toUpperCase();
          toast.warn(`Image ${title} was deleted`, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
        setImages(images.filter((image) => image.id !== id));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleSaveImage = async (id) => {
    const imageToBeSaved = images.find((image) => image.id === id);
    imageToBeSaved.saved = true;
    const title = imageToBeSaved.title?.toUpperCase();
    try {
      const res = await axios.post(images_uri, imageToBeSaved);
      if (res.data?.inserted_id === id) {
        setImages(
          images.map((image) =>
            image.id === id ? { ...image, saved: true } : image
          )
        );
        toast.info(`Image ${title} was saved`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <div className="App">
      <Header title="Images Gallery"></Header>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Search
            word={word}
            setWord={setWord}
            handleSubmit={handleSearchSubmit}
          />
          <Container className="mt-4">
            {images.length ? (
              <Row xs={1} md={2} lg={3}>
                {images.map((image, i) => (
                  <Col key={i} className="pb-3">
                    <ImageCard
                      image={image}
                      deleteImage={handleDeleteImage}
                      saveImage={handleSaveImage}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Welcome />
            )}
          </Container>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
