import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography } from "@mui/material";
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

const SanctionList = () => {

  const [loading, setLoading] = useState(true);

  const { loginID } = useContext(LoginContext);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sanctions, setSanctions] = useState([]);
  const COUNT_PER_PAGE = 8;

  useEffect(() => {
    axios.get('/api/report/sanctionList').then((resp) => {
      setSanctions(resp.data);
      setLoading(false);
    }).catch((e) => {
      console.log(e);
    });
  }, [sanctions]);

  const totalItems = sanctions.length;
  const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

  const onPageChange = (e, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
  const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
  const visibleSanction = sanctions.slice(startIndex, endIndex);

  const visibleFilterSanction = sanctions.filter(
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

  const handleChangeState = (trackId) => {
    axios.put(`/api/report/sanction/release/${trackId}`).then(resp => {
    })
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
        <Grid item xs={2}className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            가수
          </Typography>
        </Grid>
        <Grid item xs={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            올린 사람
          </Typography>
        </Grid>
        <Grid item xs={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            제재근거
          </Typography>
        </Grid>
        <Grid item xs={1} className={`${style.center}`}>
          <Typography fontSize={{ xs: "13px", lg: "14px" }}>
            해제
          </Typography>
        </Grid>
      </Grid>
      {search === ''
        ? visibleSanction.map((e, i) => {
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
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writer}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writeId}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.banReason}
                </Typography>
              </Grid>
              <Grid item xs={1} className={`${style.center}`}>
                <Button onClick={() => handleChangeState(e.trackId)} className={`${style.sanction}`}>해제</Button>
              </Grid>
            </Grid>
          )
        })
        : visibleFilterSanction.map((e, i) => {
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
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writer}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.writeId}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "13px", lg: "14px" }}>
                  {e.banReason}
                </Typography>
              </Grid>
              <Grid item xs={1} className={`${style.center}`}>
                <Button onClick={() => handleChangeState(e.trackId)} className={`${style.sanction}`}>해제</Button>
              </Grid>
            </Grid>
          )
        })}
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

export default SanctionList;