import React, { useState, useEffect, useContext } from 'react';
import { IconButton, Drawer, Box, Typography } from '@mui/material';
import { ApiContext } from '../context/ApiContext.js';

const CafeDrawer = ({ cafeId, cafe_url, cafe_name, cafe_rating }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const [data, setData, reviews, setReviews] = useContext(ApiContext);
  console.log("Drawer Reviews: ", reviews)


  useEffect(() => {
    if (cafeId) {
      setSelectedCafeId(cafeId);
      setIsDrawerOpen(true);
    }
  }, [cafeId]);
  
  useEffect(() => {
    // Accessing the text from each review
    if (reviews && Array.isArray(reviews.reviews)) {
      reviews.reviews.forEach((review) => {
        console.log("Review text:", review.text);
      });
    }
  }, [reviews]);
  
  return (
    <>
      <Drawer 
        anchor='right' 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        // BackdropProps={{ invisible: true }}  
        PaperProps={{
          sx: {
            width: 360,
            height: "90vh",
            marginTop: "13vh"
          }
        }}
      >
        <Box>
        {/* <Typography>{selectedCafeId}</Typography> */}
        {/* Render the review texts as an unordered list */}
        <Typography><h1>{cafe_name} ({cafe_rating})</h1></Typography>
        {reviews && Array.isArray(reviews.reviews) && (
          <ul>
            {reviews.reviews.map((review, index) => (
              <li key={index}>
                <Typography>{review.text}</Typography>
              </li>
            ))}
          </ul>
        )}
        <Typography><img src = {cafe_url} style={{width: 360, height: 360}} /> </Typography>

      </Box>

      </Drawer>
    </>
  );
};

export default CafeDrawer;
