import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import styles from "./Overview.module.css";

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
  },
  // {
  //   img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  //   title: 'Burger',
  //   author: '@rollelflex_graphy726',
  // },
  // {
  //   img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  //   title: 'Burger',
  //   author: '@rollelflex_graphy726',
  // },
  // {
  //   img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  //   title: 'Burger',
  //   author: '@rollelflex_graphy726',
  // },
  // {
  //   img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  //   title: 'Burger',
  //   author: '@rollelflex_graphy726',
  // },
  // {
  //   img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
  //   title: 'Breakfast',
  //   author: '@bkristastucchio',
  // },
  // {
  //   img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
  //   title: 'Breakfast',
  //   author: '@bkristastucchio',
  // },
];

const Overview = () => {
  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <ImageList sx={{ width: '90%', height: '100%' }} cols={7} > {/* 적절한 cols 값으로 조절 */}
          <ImageListItem key="Subheader" cols={7} sx={{ zIndex: -3 }}>
            <ListSubheader component="div">Recently played</ListSubheader>
          </ImageListItem>
          {itemData.map((item) => (
            <ImageListItem key={item.img} sx={{ width: '200px', height: '200px' }}>
              <img
                srcSet={`${item.img}`}
                src={`${item.img}`}
                alt={item.title}
                loading="lazy" />
              <ImageListItemBar
                title={item.title}
                subtitle={item.author} />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      <div className={styles.overview}>
        <ImageList sx={{ width: '90%', height: '100%' }} cols={7}> {/* 적절한 cols 값으로 조절 */}
          <ImageListItem key="Subheader" cols={7} sx={{ zIndex: -3 }}>
            <ListSubheader component="div">Likes</ListSubheader>
          </ImageListItem>
          {itemData.map((item) => (
            <ImageListItem key={item.img} sx={{ width: '200px', height: '200px' }}>
              <img
                srcSet={`${item.img}`}
                src={`${item.img}`}
                alt={item.title}
                loading="lazy" />
              <ImageListItemBar
                title={item.title}
                subtitle={item.author} />
            </ImageListItem>
          ))}
        </ImageList>
      </div >
      <div className={styles.overview}>
        <ImageList sx={{ width: '90%', height: '100%' }} cols={7}> {/* 적절한 cols 값으로 조절 */}
          <ImageListItem key="Subheader" cols={7} sx={{ zIndex: -3 }}>
            <ListSubheader component="div">Playlists</ListSubheader>
          </ImageListItem>
          {itemData.map((item) => (
            <ImageListItem key={item.img} sx={{ width: '200px', height: '200px' }}>
              <img
                srcSet={`${item.img}`}
                src={`${item.img}`}
                alt={item.title}
                loading="lazy" />
              <ImageListItemBar
                title={item.title}
                subtitle={item.author} />
            </ImageListItem>
          ))}
        </ImageList>
      </div >
      <div className={styles.overview}>
        <ImageList sx={{ width: '90%', height: '100%' }} cols={7}> {/* 적절한 cols 값으로 조절 */}
          <ImageListItem key="Subheader" cols={7} sx={{ zIndex: -3 }}>
            <ListSubheader component="div">Albums</ListSubheader>
          </ImageListItem>
          {itemData.map((item) => (
            <ImageListItem key={item.img} sx={{ width: '200px', height: '200px' }}>
              <img
                srcSet={`${item.img}`}
                src={`${item.img}`}
                alt={item.title}
                loading="lazy" />
              <ImageListItemBar
                title={item.title}
                subtitle={item.author} />
            </ImageListItem>
          ))}
        </ImageList>
      </div >
      <div className={styles.overview}>
        <ImageList sx={{ width: '90%', height: '100%' }} cols={7}> {/* 적절한 cols 값으로 조절 */}
          <ImageListItem key="Subheader" cols={7} sx={{ zIndex: -3 }}>
            <ListSubheader component="div">Following</ListSubheader>
          </ImageListItem>
          {itemData.map((item) => (
            <ImageListItem key={item.img} sx={{ width: '200px', height: '200px' }}>
              <img
                srcSet={`${item.img}`}
                src={`${item.img}`}
                alt={item.title}
                loading="lazy" />
              <ImageListItemBar
                title={item.title}
                subtitle={item.author} />
            </ImageListItem>
          ))}
        </ImageList>
      </div >
    </div>
  );
}

export default Overview;
