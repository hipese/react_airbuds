// import { Button } from "reactstrap";
// import styles from "./MyAlbums.module.css"
// import axios from "axios";
// import { useState } from "react";

// const MyAlbums = () => {

//     const [albums, setAlbums] = useState([]);

//     // 앨범 불러오는 기능
//     const handleAlbum = () => {
//         axios.get("/api/album/findByLogin").then(resp => {
//             console.log(resp.data);
//             setAlbums(resp.data);
//         })
//     }

//     return (
//         <div className={styles.container}>
//             <div className={styles.contentContainer}>
//                 <div className={styles.leftSide}>
                    
//                     <div className={styles.carouselTitle}>최근 유행하는 노래</div>
//                     <div className={styles.carousel}>
//                         <OwlCarousel />
//                     </div>
//                     {Array.isArray(selectTitle) && selectTitle.filter(tag => [5, 6, 8, 9, 10, 12, 13, 14].includes(tag.tagId)).map((filterTag, index) => (
//                         <div key={index}>
//                             <div className={styles.carouselTitle}>{filterTag.tagName}</div>
//                             <div className={styles.carousel}>
//                                 <OwlCarousel trackInfo={trackInfoByTag[filterTag.tagName]} trackLike={trackLike} setLike={setLike} setFavorite={setFavorite} isFavorite={isFavorite} trackInfoAll={trackInfoAll}/>
//                             </div>
//                         </div>
//                     ))}

//                     <div className={styles.leftBottom}></div>
//                 </div>
//                 <div className={styles.rightSide}>
//                     <RightSide trackLike={trackLike} trackInfoByTag={trackInfoByTag}/>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MyAlbums;
