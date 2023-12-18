import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Grid, Typography } from "@mui/material";
import { Pagination, PaginationItem } from '@mui/material';
import { Input } from "reactstrap";
import { format } from "date-fns";
import axios from 'axios';
import style from './Report.module.css';
import { LoginContext } from '../../App';

const ReportList = () => {

  const { loginID } = useContext(LoginContext);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const COUNT_PER_PAGE = 8;

  useEffect(() => {
    axios.get('/api/report').then((resp) => {
      setReports(resp.data);
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  const totalItems = reports.length;
  const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

  const onPageChange = (e, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
  const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
  const visibleReport = reports.slice(startIndex, endIndex);

  const getDetailLink = (seq) => {
    return `/report/detail/${seq}`;
  };

  const inputChangeHandler = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className={`${style.container}`}>
      <div className={style.search}>
        <Input placeholder="검색" className={style.input_search} onChange={inputChangeHandler}></Input>
      </div>
      <Grid container className={`${style.borderTB} ${style.boardLine} ${style.marginT50}`}>
        <Grid item xs={1} className={`${style.center}`}>
          <Typography fontSize={{ xs: "12px", sm: "14px" }}>
            No
          </Typography>
        </Grid>
        <Grid item xs={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "12px", sm: "14px" }}>
            제목
          </Typography>
        </Grid>
        <Grid item xs={2} display={{ xs: "none", sm: "flex" }} className={`${style.center}`}>
          <Typography fontSize={{ xs: "12px", sm: "14px" }}>
            신고자
          </Typography>
        </Grid>
        <Grid item xs={2} display={{ xs: "none", sm: "flex" }} className={`${style.center}`}>
          <Typography fontSize={{ xs: "12px", sm: "14px" }}>
            신고대상
          </Typography>
        </Grid>
        <Grid item xs={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "12px", sm: "14px" }}>
            분야
          </Typography>
        </Grid>
        <Grid item xs={2} className={`${style.center}`}>
          <Typography fontSize={{ xs: "12px", sm: "14px" }}>
            작성일
          </Typography>
        </Grid>
        <Grid item xs={1} className={`${style.center}`}>
          <Typography fontSize={{ xs: "12px", sm: "14px" }}>
            답변여부
          </Typography>
        </Grid>
      </Grid>
      {search === ''
        ? visibleReport.map((e, i) => {
          return (
            <Grid container key={i} className={`${style.announceLine} ${style.pad10}`}>
              <Grid item xs={1} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {e.reportSeq}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  <Link
                    to={getDetailLink(
                      e.reportSeq
                    )}
                  >
                    {e.reportTitle}
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {e.reportWriter}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {e.reportSubject}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {e.reportCategory}
                </Typography>
              </Grid>
              <Grid item xs={2} className={`${style.center}`}>
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {e.reportWriteDate ? format(new Date(e.reportWriteDate), 'yyyy-MM-dd') : ""}
                </Typography>
              </Grid>
              <Box
                component={Grid}
                item
                xs={1}
                display={{ xs: "none", sm: "flex" }}
                className={`${style.center}`}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {e.reportAnswerState !== 0 && (
                    <CheckIcon sx={{ color: grey[900] }} />
                  )}
                </Typography>
              </Box>
            </Grid>
          )
        })
        : reports
          .filter(
            (e) =>
              e.reportTitle.includes(search) ||
              e.reportContents.includes(search) ||
              e.reportWriter.includes(search) ||
              e.reportSubject.includes(search) ||
              e.reportCategory.includes(search)
          )
          .map((e, i) => {
            return (
              <Grid container key={i} className={`${style.announceLine} ${style.pad10}`}>
                <Grid item xs={1} className={`${style.center}`}>
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                    {e.reportSeq}
                  </Typography>
                </Grid>
                <Grid item xs={2} className={`${style.center}`}>
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  <Link
                    to={getDetailLink(
                      e.reportSeq
                    )}
                  >
                    {e.reportTitle}
                  </Link>
                  </Typography>
                </Grid>
                <Grid item xs={2} className={`${style.center}`}>
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                    {e.reportWriter}
                  </Typography>
                </Grid>
                <Grid item xs={2} className={`${style.center}`}>
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                    {e.reportSubject}
                  </Typography>
                </Grid>
                <Grid item xs={2} className={`${style.center}`}>
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                    {e.reportCategory}
                  </Typography>
                </Grid>
                <Grid item xs={2} className={`${style.center}`}>
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                    {e.reportWriteDate ? format(new Date(e.reportWriteDate), 'yyyy-MM-dd') : ""}
                  </Typography>
                </Grid>
                <Box
                  component={Grid}
                  item
                  xs={1}
                  display={{ xs: "none", sm: "flex" }}
                  className={`${style.center}`}
                >
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                    {e.reportAnswerState !== 0 && (
                      <CheckIcon sx={{ color: grey[900] }} />
                    )}
                  </Typography>
                </Box>
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

export default ReportList;