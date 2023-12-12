import { Avatar, Box, Button, Divider, Grid, Typography } from '@mui/material';
import style from './qna.module.css'
import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { QnaContext } from './qnaList';
import { Link } from 'react-router-dom';
const QnaContents = () => {
    const {seq} = useParams();
    
    const loginID = "kwon"; //임시

    const [selectedQna,setSelectedQna] = useState({});
    const [files,setFiles] = useState([]);
    const [reply,setReply] = useState({qnaSeq:seq, answerWriter:loginID,answerContents:"",answerWriteDate:new Date().toISOString()});
    const [replyList,setReplyList] = useState([]);
    const [updateReply,setUpdateReply] = useState({qnaSeq:seq, answerWriter:loginID,answerContents:"",answerWriteDate:new Date().toISOString()});
    const [tempReply,setTempReply] = useState("");
    const [isUpdate,setUpdate] = useState({state:false,seq:0});
    
    //관리자 및 글 작성자 외에는 못들어오도록 하기
    const navi = useNavigate();
    const handleMoveToList = () => {
        navi(-1);
    }

    const handleUpdateChange = (e) => {
        const value = e.target.textContent;
        console.log(value);
        setUpdateReply(prev=>({...prev,answerContents:value}));
    }

    const handleUpdate = (i) => {
        setUpdate({state:true,seq:i});
        setTempReply(); 
        //나중에 댓글 불러오고 map으로 출력, 수정할때 수정전 결과 임시 저장
    }

    const handleUpdateSubmit = (i) => {
        console.log(updateReply);
        setUpdate({state:false,seq:i});
        //setTempReply("");        
    }

    const handleReplyChange = (e) => {
        const value = e.target.textContent;
        setReply(prev=>({...prev,answerContents:value}));
    }

    const handlePostReply = () => {
        axios.post(`/api/qna/reply`,reply).then(res=>{
            console.log(res.data);
            setReplyList(prev=>([...prev,reply]))
        }).catch((e)=>{
            console.log(e);
        });
    }

    useEffect(()=>{
        axios.get(`/api/qna/contents/${seq}`).then(res=>{
            setSelectedQna(res.data);
            setFiles(res.data.files);
        }).catch((e)=>{
            console.log(e);
        });

        axios.get(`/api/qna/replylist/${seq}`).then(res=>{
            setReplyList(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    },[]);

    const handleDelete = () => {
        axios.delete(`/api/qna/delete/${seq}`).then(res=>{
            navi("/qna");
        }).catch((e)=>{
            console.log(e);
        });
    }

    return(
        <div className={`${style.wrap}`}>
            <div className={`${style.qnaContents} ${style.ma} ${style.border}`}>
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
                                {selectedQna.qnaCategory}
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
                <div>
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
                                        name : kwon
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <div className={`${style.border} ${style.replyContents} ${style.pad10}`} onInput={handleReplyChange} contentEditable={true} suppressContentEditableWarning>

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
                                    <div className={`${style.border} ${style.replyContents} ${style.pad10}`} contentEditable={isUpdate.state} name="answerContents" onInput={handleUpdateChange} suppressContentEditableWarning>
                                        {e.answerContents}
                                    </div>
                                    <div className={`${style.replyBtnEven} ${style.padingT10}`}>
                                        <Button variant="outlined" size="small">
                                            Delete
                                        </Button>
                                        {isUpdate.state ? isUpdate.seq == i ? <Button variant="outlined" size="small" onClick={()=>{handleUpdateSubmit(e.answerSeq,i)}}>
                                            Submit
                                        </Button> : <Button variant="outlined" size="small" onClick={()=>{handleUpdate(i)}}>
                                            Update
                                        </Button> : <Button variant="outlined" size="small" onClick={()=>{handleUpdate(i)}}>
                                            Update
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
        </div>

        
    )
}
export default QnaContents;