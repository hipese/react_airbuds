import { Alert, Avatar, Button, Grid, Snackbar, Typography } from '@mui/material';
import style from './Report.module.css'
import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../../App';

const ReportDetail = () => {

  const { seq } = useParams();
  const [isChanged, setChanged] = useState(0);

  const [selectedReport, setSelectedReport] = useState({});
  const [reply, setReply] = useState({ reportSeq: seq, reportAnswerWriter: "", reportAnswerContents: "", reportAnswerWriteDate: "" });
  const [replyList, setReplyList] = useState([]);
  const { loginID } = useContext(LoginContext);
  const contentEditableRef = useRef(null);

  //관리자 빼고 모두 못들어오도록 하기
  const navi = useNavigate();
  const handleMoveToList = () => {
    navi(-1);
  }

  const handleReplyChange = (e) => {
    const value = e.target.textContent;
    setReply(prev => ({ ...prev, reportAnswerContents: value, reportAnswerWriter: loginID }));
  }

  const handlePostReply = () => {
    axios.post(`/api/report/answer`, reply).then(resp => {
      setReplyList(prev => ([...prev, reply]));
      setOpen(true);
      contentEditableRef.current.innerHTML = "";
      let formData = new FormData();
      formData.append("id", selectedReport.reportWriter);
      formData.append("contents", reply.reportAnswerContents);
      axios.post(`/api/report/notice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(resp => {
        if (resp.data === "success") {
        }
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    });
  }

  useEffect(() => {

    axios.get(`/api/report/contents/${seq}`).then(resp => {
      setSelectedReport(resp.data);
      axios.get(`/api/report/answerlist/${seq}`).then(resp => {
        setReplyList(resp.data);
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/report/answerlist/${seq}`).then(resp => {
      setReplyList(resp.data);
    }).catch((e) => {
      console.log(e);
    });
  }, [isChanged]);

  const handleDelete = () => {
    axios.delete(`/api/report/delete/${seq}`).then(resp => {
      navi("/report");
    }).catch((e) => {
      console.log(e);
    });
  }

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleChangeState = () => {
    axios.put(`/api/report/state/${selectedReport.reportSeq}`).then(resp => {
      navi("/report");
    })
  }

  return (
    <div className={`${style.wrap}`}>
      <div className={`${style.reportContents} ${style.ma}`}>
        <div className={`${style.marginT70}`}>
          <Grid container className={`${style.pl10} ${style.center}`}>
            <Grid item xs={12}>
              <Typography fontSize={24}>
                {selectedReport.reportTitle}
              </Typography>
            </Grid>
          </Grid>
          <hr />
          <Grid container className={`${style.pl10} ${style.center}`}>
            <Grid item xs={12} sm={4}>
              <Typography fontSize={{ xs: "14px", sm: "15px" }} className={`${style.rightAlign}`}>
                분야 : {
                  selectedReport.reportCategory === "CoverImage" ? "커버 이미지" :
                    selectedReport.reportCategory === "Track" ? "트랙" : ""
                }
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography fontSize={{ xs: "14px", sm: "15px" }} className={`${style.rightAlign}`}>
                신고자 : {selectedReport.reportWriter}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography fontSize={{ xs: "14px", sm: "15px" }} className={`${style.rightAlign}`}>
                신고대상 : {selectedReport.reportSubject}
              </Typography>
            </Grid>
          </Grid>
          <hr />
          <div className={`${style.reportDetail} ${style.border} ${style.borderRad} ${style.ma}`} dangerouslySetInnerHTML={{ __html: selectedReport.reportContents }}>

          </div>
          <hr />
          <Grid container className={`${style.pl10} ${style.center}`}>
            <Grid item xs={12} sm={4} className={`${style.rightAlign}`}>

              <div className={`${style.btnEven}`}>
                <Button onClick={handleDelete}>삭제하기</Button>
                <Button onClick={handleMoveToList}>목록으로</Button>
                <Button onClick={handleChangeState}>답변완료</Button>
              </div>
            </Grid>
          </Grid>
          <hr />
        </div>

        {/* Answer */}
        <div className={`${style.marginB100}`}>
          <Grid container className={`${style.reportAnswer} ${style.center} ${style.border} ${style.pad10} ${style.ma}`}>
            <Grid item xs={12} sm={3}>
              <Grid container>
                <Grid item xs={12} className={`${style.center}`}>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 56, height: 56 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className={`${style.center}`}>
                    {loginID}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={9}>
              <div className={`${style.border} ${style.replyContents} ${style.pad10}`} onInput={handleReplyChange} contentEditable={true} suppressContentEditableWarning ref={contentEditableRef}>

              </div>
              <div className={`${style.replyBtnEven} ${style.padingT10}`}>
                <Button variant="outlined" size="small" onClick={handlePostReply}>
                  댓글 달기
                </Button>
              </div>
            </Grid>
          </Grid>
          {replyList.map((e, i) => (
            <Grid container key={i} className={`${style.reportAnswer} ${style.center} ${style.border} ${style.pad10} ${style.ma}`}>
              <Grid item xs={12} sm={3}>
                <Grid container>
                  <Grid item xs={12} className={`${style.center}`}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 56, height: 56 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className={`${style.center}`}>
                      {e.reportAnswerWriter}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={9}>
                <div className={`${style.border} ${style.replyContents} ${style.pad10}`} name="reportAnswerContents" suppressContentEditableWarning>
                  {e.reportAnswerContents}
                </div>
              </Grid>
            </Grid>
          )
          )};
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }} className={`${style.snackpos}`}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          댓글 작성 완료.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReportDetail;