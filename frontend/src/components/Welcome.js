import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

const Welcome = () => (
  <Jumbotron>
    <h1>Image Gallery</h1>
    <p>
      This is a React web app that retrieves photos using Unsplash API. To get
      started, enter a search term and click Search.
    </p>
    <p>
      <Button variant="primary" href="https://unsplash.com" target="_blank">
        Learn More
      </Button>
    </p>
  </Jumbotron>
);

export default Welcome;
