import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import styles from "./Overview.module.css";
import { Skeleton } from "@mui/material";

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: '아침',
    author: '@bkristastucchio',
  },
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: '아침',
    author: '@bkristastucchio',
  },
  // ... 다른 항목들
];

const Overview = () => {
  const categories = [
    "최근 재생 목록",
    "좋아요",
    "플레이리스트",
    "앨범",
    "팔로잉",
  ];

  return (
    <div className={styles.container}>
      {categories.map((category, index) => (
        <div key={index} className={styles.overview}>
          <ImageList sx={{ width: '90%', height: '100%' }} cols={7}>
            <ImageListItem key="Subheader" cols={7} sx={{ zIndex: -3 }}>
              <ListSubheader component="div">{category}</ListSubheader>
            </ImageListItem>
            {itemData.slice(0, 7).map((item, itemIndex) => (
              <ImageListItem key={itemIndex} sx={{ width: '200px', height: '200px' }}>
                <img
                  srcSet={`${item.img}`}
                  src={`${item.img}`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar title={item.title} subtitle={item.author} />
              </ImageListItem>
            ))}
            {/* itemData에 충분한 항목이 없는 경우 빈 슬롯을 표시합니다. */}
            {itemData.length < 7 && (
              Array.from({ length: 7 - itemData.length }).map((_, emptyIndex) => (
                <ImageListItem key={`empty-${emptyIndex}`} sx={{ width: '200px' }}>
                  <div className={styles.emptySlot}>
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  </div>
                </ImageListItem>
              ))
            )}
          </ImageList>
        </div>
      ))}
    </div>
  );
};

export default Overview;
