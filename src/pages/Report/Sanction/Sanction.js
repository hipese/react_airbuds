import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { Pagination, PaginationItem } from '@mui/material';
import { Button, Input } from "reactstrap";
import axios from 'axios';
import style from './Sanction.module.css';
import { LoginContext } from '../../../App';

import CircularProgress from "@mui/material/CircularProgress";

const CircularIndeterminate = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

const Sanction = () => {

  const [loading, setLoading] = useState(true);

  const { loginID } = useContext(LoginContext);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tracks, setTracks] = useState([]);
  const [sanctions, setSanctions] = useState([]);
  const [reason, setReason] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const COUNT_PER_PAGE = 8;

  useEffect(() => {
    axios.get('/api/report/trackList').then((resp) => {
      setTracks(resp.data);
      setLoading(false);
    }).catch((e) => {
      console.log(e);
    });
  }, [tracks]);

  const totalItems = tracks.length;
  const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

  const onPageChange = (e, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
  const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
  const visibleTrack = tracks.slice(startIndex, endIndex);

  const visibleFilterTrack = tracks.filter(
    (e) =>
      e.title.includes(search) ||
      e.writer.includes(search) ||
      e.writeId.includes(search)
  ).slice(startIndex, endIndex);

  const getDetailLink = (trackId) => {
    return `/detail/${trackId}`;
  };

  const inputChangeHandler = (e) => {
    setSearch(e.target.value);
  };

  const handleOpenModal = (trackId) => {
    setSelectedTrackId(trackId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTrackId(null);
    setModalOpen(false);
    setReason('');
  };

  const handleChangeState = () => {
    if (selectedTrackId && reason.trim() !== '') {
      let formData = new FormData();
      formData.append("trackId", selectedTrackId);
      formData.append("reason", reason);
      axios.put(`/api/report/sanction/state`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(resp => {
        setModalOpen(false);
        setReason('');
      }).catch(error => {
        console.error('Error:', error);
      });
    } else {
      alert("입력해라")
    }
  };

  const handleImage = (trackId) => {
    axios.put(`/api/report/sanction/image/${trackId}`).then(resp => {
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  if (loading) {
    return <CircularIndeterminate />;
  }

  return (
    <div className={`${style.container}`}>
      <div className={style.search}>
        <Input placeholder="검색" className={style.input_search} onChange={inputChangeHandler}></Input>
      </div>
      <Grid container className={`${style.borderTB} ${style.boardLine} ${style.marginT50} ${style.pad10}`}>
        <Grid item xs={1} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            No
          </Typography>
        </Grid>
        <Grid item xs={3} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            곡명
          </Typography>
        </Grid>
        <Grid item xs={3} lg={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            가수
          </Typography>
        </Grid>
        <Grid item xs={3} lg={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            올린 사람
          </Typography>
        </Grid>
        <Grid item lg={1} display={{ xs: "none", lg: "flex" }} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            제재여부
          </Typography>
        </Grid>
        <Grid item lg={1} display={{ xs: "none", lg: "flex" }} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            신고수
          </Typography>
        </Grid>
        <Grid item xs={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            제재할 대상
          </Typography>
        </Grid>
      </Grid>
      {search === ''
        ? visibleTrack.map((e, i) => {
          return (
            <Grid container key={i} className={`${style.announceLine} ${style.pad10}`}>
              <Grid item xs={1} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.trackId}
                </Typography>
              </Grid>
              <Grid item xs={3} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  <Link
                    to={getDetailLink(
                      e.trackId
                    )}
                  >
                    {e.title}
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={3} lg={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writer}
                </Typography>
              </Grid>
              <Grid item xs={3} lg={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writeId}
                </Typography>
              </Grid>
              <Box
                component={Grid}
                item
                xs={1}
                display={{ xs: "none", lg: "flex" }}
                className={`${style.center}`}
              >
                <Typography fontSize={{ xs: "12px", lg: "14px" }}>
                  {e.ban !== 0 && (
                    <CheckIcon sx={{ color: grey[900] }} />
                  )}
                </Typography>
              </Box>
              <Grid item xs={1} display={{ xs: "none", lg: "flex" }} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", lg: "14px" }}>
                  {e.count}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.spaceEvenly}`}>
                <Button onClick={() => handleOpenModal(e.trackId)} className={`${style.sanction}`}>노래</Button>
                <Button onClick={() => handleImage(e.trackId)} className={`${style.sanction}`}>사진</Button>
              </Grid>
            </Grid>
          )
        })
        : visibleFilterTrack.map((e, i) => {
          return (
            <Grid container key={i} className={`${style.announceLine} ${style.pad10}`}>
              <Grid item xs={1} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.trackId}
                </Typography>
              </Grid>
              <Grid item xs={4} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  <Link
                    to={getDetailLink(
                      e.trackId
                    )}
                  >
                    {e.title}
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={3} lg={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writer}
                </Typography>
              </Grid>
              <Grid item xs={3} lg={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writeId}
                </Typography>
              </Grid>
              <Box
                component={Grid}
                item
                xs={1}
                display={{ xs: "none", lg: "flex" }}
                className={`${style.center}`}
              >
                <Typography fontSize={{ xs: "12px", lg: "14px" }}>
                  {e.ban !== 0 && (
                    <CheckIcon sx={{ color: grey[900] }} />
                  )}
                </Typography>
              </Box>
              <Grid item xs={1} display={{ xs: "none", lg: "flex" }} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", lg: "14px" }}>
                  {e.count}
                </Typography>
              </Grid>
              <Grid item xs={1} className={`${style.center}`}>
                <Button onClick={() => handleOpenModal(e.trackId)} className={`${style.sanction}`}>노래</Button>
                <Button onClick={() => handleImage(e.trackId)} className={`${style.sanction}`}>사진</Button>
              </Grid>
            </Grid>
          )
        })}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>제재 근거를 입력해주세요</DialogTitle>
        <DialogContent>
          <Input
            type="text"
            placeholder="제재 근거"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>취소</Button>
          <Button onClick={handleChangeState}>완료</Button>
        </DialogActions>
      </Dialog>

      <hr />
      <div className={style.margin}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={onPageChange}
          size="medium"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '15px 0',
          }}
          renderItem={(item) => (
            <PaginationItem {...item} sx={{ fontSize: 15 }} />
          )}
        />
      </div>
    </div>
  );
};

export default Sanction;