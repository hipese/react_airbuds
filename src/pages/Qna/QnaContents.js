import { Alert, Avatar, Box, Button, Divider, Grid, Snackbar, Typography } from '@mui/material';
import style from './qna.module.css'
import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { QnaContext } from './qnaList';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../App';
const QnaContents = () => {
    const {seq} = useParams();
    const [isChanged,setChanged] = useState(0);

    const [selectedQna,setSelectedQna] = useState({});
    const [files,setFiles] = useState([]);
    const [reply,setReply] = useState({qnaSeq:seq, answerWriter:"",answerContents:"",answerWriteDate:""});
    const [replyList,setReplyList] = useState([]);
    const [updateReply,setUpdateReply] = useState({qnaSeq:seq, answerWriter:"", answerSeq:null, answerContents:"",answerWriteDate:""});
    const [tempReply,setTempReply] = useState("");
    const [isUpdateState,setUpdateState] = useState(false);
    const [isUpdateSeq,setUpdateSeq] = useState(0);
    const {loginID} = useContext(LoginContext);
    const contentEditableRef = useRef(null);
    
    //관리자 및 글 작성자 외에는 못들어오도록 하기
    const navi = useNavigate();
    const handleMoveToList = () => {
        navi(-1);
    }

    const handleUpdateChange = (e,i) => {
        const value = e.target.textContent;
        setUpdateReply(prev=>({...prev,answerContents:value,answerSeq:i,answerWriter:loginID}));
    }

    const handleUpdate = (i) => {
        setUpdateSeq(i);
        setUpdateState(true);            
        setTempReply(); 
        
        //나중에 댓글 불러오고 map으로 출력, 수정할때 수정전 결과 임시 저장
    }

    const handleUpdateSubmit = (e,seq,i) => {
        setUpdateState(false);
        setUpdateSeq(0);
        axios.put(`/api/qna/${updateReply.answerSeq}`,updateReply).then(res=>{

        }).catch((e)=>{
            console.log(e);
        });
    }

    const handleReplyChange = (e) => {
        const value = e.target.textContent;
        setReply(prev=>({...prev,answerContents:value,answerWriter:loginID}));
    }

    const handlePostReply = () => {
        axios.post(`/api/qna/reply`,reply).then(res=>{
            console.log(res.data);
            setReplyList(prev=>([...prev,reply]));
            setOpen(true);
            contentEditableRef.current.innerHTML = "";
            const formData = new FormData();
            formData.append("qnaSeq",seq);
            formData.append("qnaAnswerState",1);
            axios.put(`/api/qna/qnaState`,formData).then(res=>{
                
            }).catch((e)=>{
                console.log(e);
            })
        }).catch((e)=>{
            console.log(e);
        });
    }

    useEffect(()=>{
        


        axios.get(`/api/qna/contents/${seq}`).then(res=>{
            if(res.data.qnaPublic == 0){
                if(loginID == res.data.qnaWriter || loginID == "devel"){
                    setSelectedQna(res.data);
                    setFiles(res.data.files);
                    axios.get(`/api/qna/replylist/${seq}`).then(res=>{
                        setReplyList(res.data);
                    }).catch((e)=>{
                        console.log(e);
                    });
                }else{
                    alert("관리자 및 작성자만 열람가능합니다.");
                    navi("/qna");
                    return;
                }
            }else{
                setSelectedQna(res.data);
                setFiles(res.data.files);
                axios.get(`/api/qna/replylist/${seq}`).then(res=>{
                    setReplyList(res.data);
                }).catch((e)=>{
                    console.log(e);
                });
            }
        }).catch((e)=>{
            console.log(e);
        });

        
    },[]);

    useEffect(()=>{
        axios.get(`/api/qna/replylist/${seq}`).then(res=>{
            setReplyList(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    },[isChanged]);

    const handleDelete = () => {
        axios.delete(`/api/qna/delete/${seq}`).then(res=>{
            navi("/qna");
        }).catch((e)=>{
            console.log(e);
        });
    }

    const handleAnswerDelete = (reply_seq) => {
        axios.delete(`/api/qna/reply/delete/${reply_seq}`).then(res=>{
            setChanged(isChanged+1);
        }).catch((e)=>{
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

    return(
        <div className={`${style.wrap}`}>
            <div className={`${style.qnaContents} ${style.ma}`}>
                <div className={`${style.marginT70}`}>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12}>
                            <Typography fontSize={24}>
                                {selectedQna.qnaTitle}
                            </Typography>
                        </Grid>
                    </Grid>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={12}>
                                카테고리 : {
                                    selectedQna.qnaCategory == "usurpation" ? "권리 침해" : 
                                    selectedQna.qnaCategory == "service" ? "서비스 문의" :
                                    selectedQna.qnaCategory == "event" ? "이벤트" :
                                    selectedQna.qnaCategory == "error" ? "기타 오류" : ""
                                }
                            </Typography>
                        </Grid>                        
                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}} className={`${style.rightAlign}`}>
                                작성자 : {selectedQna.qnaWriter}
                            </Typography>
                        </Grid>
                    </Grid>
                    <hr/>
                    <div className={`${style.qnaDetail} ${style.border} ${style.borderRad} ${style.ma}`} dangerouslySetInnerHTML={{ __html: selectedQna.qnaContents }}>
                        
                    </div>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12} sm={8}>
                            <Typography fontSize={12}>
                                {files != null || files != undefined || files.length <= 0 
                                ? files.map((e,i)=>{
                                    return(
                                        <div key={i}>
                                            <a href={``}>{e.oriName}</a> 
                                            <br/>
                                        </div>
                                    )
                                }) : "첨부파일 없음" }
                            </Typography>
                        </Grid>                        
                        <Grid item xs={12} sm={4} className={`${style.rightAlign}`}>
                            
                            { selectedQna.qnaWriter == loginID ? <div className={`${style.btnEven}`}><button onClick={handleDelete}>삭제하기</button>
                                                                <button onClick={handleMoveToList}>목록으로</button></div>
                                                                :<button onClick={handleMoveToList}>목록으로</button>    }
                        </Grid>
                    </Grid>
                    <hr/>
                </div>

                {/* Reply */}
                <div className={`${style.marginB100}`}>
                    <Grid container className={`${style.qnaReply} ${style.center} ${style.border} ${style.pad10} ${style.ma}`}>
                        <Grid item xs={12} sm={3}>
                            <Grid container>
                                <Grid item xs={12} className={`${style.center}`}>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src="/static/images/avatar/1.jpg"
                                        sx={{ width: 56, height: 56}}
                                        />
                                </Grid>
                                <Grid item xs={12}>
                                    <div className={`${style.center}`}>
                                        name : {loginID}
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
                    {replyList.map((e,i)=>{
                        return e.answerWriter == loginID ? (
                            <Grid container key={i} className={`${style.qnaReply} ${style.center} ${style.border} ${style.pad10} ${style.ma}`}>
                                <Grid item xs={12} sm={3}>
                                    <Grid container>
                                        <Grid item xs={12} className={`${style.center}`}>
                                            <Avatar
                                                alt="Remy Sharp"
                                                src="/static/images/avatar/1.jpg"
                                                sx={{ width: 56, height: 56}}
                                                />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div className={`${style.center}`}>
                                                {e.answerWriter}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <div className={`${style.border} ${style.replyContents} ${style.pad10}`} contentEditable={isUpdateState} name="answerContents" onInput={(event)=>{handleUpdateChange(event,e.answerSeq)}} suppressContentEditableWarning>
                                        {e.answerContents}
                                    </div>
                                    <div className={`${style.replyBtnEven} ${style.padingT10}`}>
                                        <Button variant="outlined" size="small" onClick={()=>{handleAnswerDelete(e.answerSeq)}}>
                                            삭제하기
                                        </Button>
                                        {isUpdateState ? isUpdateSeq == i ? <Button variant="outlined" size="small" onClick={handleUpdateSubmit}>
                                            수정완료
                                        </Button> : <Button variant="outlined" size="small" onClick={()=>{handleUpdate(i)}}>
                                            수정하기
                                        </Button> : <Button variant="outlined" size="small" onClick={()=>{handleUpdate(i)}}>
                                            수정하기
                                        </Button> }                                        
                                    </div>
                                </Grid>
                            </Grid>
                            
                        ) : (
                            <Grid key={i} container className={`${style.qnaReply} ${style.center} ${style.border} ${style.ma} ${style.pad10}`}>
                                <Grid item xs={12} sm={3}>
                                        <Grid container>
                                            <Grid item xs={12} className={`${style.center}`}>
                                                <Avatar
                                                    alt="Remy Sharp"
                                                    src="/static/images/avatar/1.jpg"
                                                    sx={{ width: 56, height: 56}}
                                                    />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={`${style.center}`}>
                                                    {e.answerWriter}
                                                </div>
                                            </Grid>
                                        </Grid>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <div className={`${style.border} ${style.replyContents} ${style.pad10}`}>
                                        {e.answerContents}
                                    </div>
                                </Grid>
                            </Grid>
                        )
                    })}
                </div>
            </div>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical:"top",horizontal:"right"}} className={`${style.snackpos}`}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%'}}>
                    댓글 작성 완료.
                </Alert>
            </Snackbar>
        </div>

        
    )
}
export default QnaContents;