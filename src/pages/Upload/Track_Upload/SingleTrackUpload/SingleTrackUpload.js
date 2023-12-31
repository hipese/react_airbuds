
import { useState, useRef, useEffect, useContext } from "react"
import { Row, Col, Input, Button } from "reactstrap";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import axios from "axios";
import singlestyle from "./SingleTrackUpload.module.css"
import MusicTagList from "../MuiscTagList/MuiscTagList";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LoginContext } from "../../../../App";
import { Box, CircularProgress } from '@mui/material';

// 로딩바
const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="inherit" />
    </Box>
);


const SingleTrackUpload = ({ files, setFiles, imageview, setImageview, selectTag, setSelectTag }) => {

    const loginID = useContext(LoginContext);

    const [loading, setLoading] = useState(false);

    dayjs.extend(utc);
    dayjs.extend(timezone);

    dayjs.tz.setDefault("Asia/Seoul");

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const hiddenFileInput = useRef(null);

    const handleClickImage = () => {
        hiddenFileInput.current.click();
    };
    // =====================================================


    // 새로운 음원 파일을 추가하기 위한 ref
    const hiddenAudioInput = useRef(null);

    const handleAddTrackClick = () => {
        hiddenAudioInput.current.click();
    };
    // 음원 추가
    const handleAudioFileChange = (e) => {
        const newAudioFile = e.target.files[0];

        if (newAudioFile) {
            const url = URL.createObjectURL(newAudioFile);
            const audio = new Audio(url);

            audio.onloadedmetadata = () => {
                // 파일 길이(초)를 구합니다
                const duration = audio.duration;

                // 기본 이미지 경로 설정 (변경할 수 있음)
                const image_path = "/assets/groovy2.png";

                // 파일 이름에서 확장자 제거
                const fileNameWithoutExtension = newAudioFile.name.split('.').slice(0, -1).join('.');

                // 새 파일 객체 생성    
                const newFile = {
                    file: newAudioFile,
                    name: fileNameWithoutExtension, // 파일의 원래 이름
                    duration: duration, // 파일의 길이(초)
                    imageFile: null,
                    image_path: image_path, // 여기에 이미지 경로 추가
                    writer: "익명의 제작자", // 기본값, 필요에 따라 변경 가능
                    tags: [] // 기본값, 필요에 따라 변경 가능
                };

                // files 배열에 새 파일 추가
                setFiles(prevFiles => [...prevFiles, newFile]);
            };
        }
    };


    // 데이터베이스에 음원정보를 저장하고 파일을 업로드 하는 장소
    const handleSave = () => {

        setLoading(true);

        const formData = new FormData();

        // files 배열에 있는 각 파일을 formData에 추가
        files.forEach((fileData) => {

            if (fileData.imageFile == null) {
                alert("이미지를 선택해주세요.")
                setLoading(false);
                return
            }

            formData.append(`file`, fileData.file);
            formData.append(`name`, fileData.name);
            formData.append('duration', fileData.duration);
            formData.append('image_path', fileData.image_path);

            if (fileData.imageFile) {
                formData.append('imagefile', fileData.imageFile);
            }
            formData.append('writer', fileData.writer);
            selectTag.forEach(tag => {
                formData.append('tag', tag.id);
            });

        });
        formData.append('releaseDate', selectedDate ? selectedDate.toISOString() : '');
        formData.append('login', loginID.loginID);

        if (selectTag.length === 0) {
            alert("태그를 하나라도 선택해주세요");
            setLoading(false);
            return;
        }

        axios.post("/api/track", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(resp => {
            console.log("성공");
            setFiles([]);
            setSelectTag([]);

        }).catch(resp => {
            console.log("실패")
        }).finally(() => {
            // 로딩 상태 해제
            setLoading(false);
        });
    }

    const handleCancle = () => {
        const iscancle = window.confirm("업로드를 취소하시겠습니까?");
        if (!iscancle) {
            return;
        }
        setFiles([]);
        setSelectTag([]);
    }

    const handleFileNameChange = (index, newName) => {

        if (newName && newName.length > 100) {
            alert("100자 이하로 입력해주세요.");
            return;
        }


        setFiles(currentFiles => {
            // 현재 파일 목록 복사
            const updatedFiles = [...currentFiles];

            // 선택된 파일의 이름 업데이트
            updatedFiles[index] = { ...updatedFiles[index], name: newName };

            return updatedFiles;
        });
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        if (imageFile) {
            // 선택된 파일의 URL 생성 (렌더링에 사용)
            const newImagePath = URL.createObjectURL(imageFile);

            // 보여주기용 이미지 값 설정
            setImageview(newImagePath);

            // 실제 이미지 파일을 files 배열에 추가
            setFiles(currentFiles => {
                const updatedFiles = [...currentFiles];
                if (updatedFiles.length > 0) {
                    // 첫 번째 요소에 이미지 파일 추가
                    updatedFiles[0] = { ...updatedFiles[0], image_path: imageFile.name, imageFile: imageFile };
                }
                return updatedFiles;
            });
        }
    };


    const handleWriterChange = (index, newWriter) => {

        if (newWriter && newWriter.length > 20) {
            alert("20자 이하로 입력해주세요.");
            return;
        }

        setFiles(currentFiles => {
            const updatedFiles = [...currentFiles];
            updatedFiles[index] = { ...updatedFiles[index], writer: newWriter };
            return updatedFiles;
        });
    };

    // 태그 선택 변경 시 호출될 콜백 함수
    const handleTagSelection = (selectedTagObject) => {
        const newTag = {
            id: selectedTagObject.tagId,
            name: selectedTagObject.tagName
        };

        if (!selectTag.some(tag => tag.id === newTag.id)) {
            setSelectTag([...selectTag, newTag]);
        }
    };

    const handleTagDelete = (tagToDelete) => {
        setSelectTag((tags) => tags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <div className={singlestyle.uploadDetail}>
            {loading && <LoadingSpinner />}
            {!loading && (
                <div>
                    <Row style={{ marginBottom: '10px', width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                        <Col sm='12' lg='12' xl='4' style={{ marginBottom: '10px' }}>
                            {files[0].image_path === "/assets/groovy2.png" ?
                                <div className={singlestyle.imageContainer}>
                                    <img src={files[0].image_path} onClick={handleClickImage} />
                                    <input
                                        type="file"
                                        ref={hiddenFileInput}
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                    <div>
                                        <Button onClick={handleClickImage} className={singlestyle.Button} style={{ marginTop: '10px' }}>이미지변경</Button>
                                    </div>
                                </div> : <div className={singlestyle.imageContainer}>
                                    <img src={imageview} onClick={handleClickImage} />
                                    <input
                                        type="file"
                                        ref={hiddenFileInput}
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                    <div>
                                        <Button onClick={handleClickImage} className={singlestyle.Button} style={{ marginTop: '10px' }}>이미지변경</Button>
                                    </div>
                                </div>}

                        </Col>
                        <Col sm='12' lg='12' xl='8' style={{ marginBottom: '10px', padding: '0' }}>
                            <Row style={{ marginBottom: '10px', width: '100%' }}>
                                <Col sm='12' style={{ marginBottom: '10px' }} className={singlestyle.titleText}>
                                    제목
                                </Col>
                                <Col sm='12' style={{ marginBottom: '10px' }}>
                                    <Input
                                        placeholder="제목을 입력하세요"
                                        className={singlestyle.detail_input}
                                        type="text"
                                        value={files[0].name} // 파일 객체의 이름 속성 사용
                                        onChange={(e) => handleFileNameChange(0, e.target.value)} // 변경 이벤트 처리
                                    />
                                </Col>
                                <Col sm='12 ' style={{ marginBottom: '10px' }} className={singlestyle.titleText}>
                                    테그선택
                                </Col>
                                <Col sm='12' lg='12' xl='4' style={{ marginBottom: '10px' }}>
                                    <MusicTagList onSelectTag={handleTagSelection} />
                                </Col>
                                <Col sm='12' lg='12' xl='8' style={{ marginBottom: '10px' }}>
                                    <Row className={singlestyle.chipRow}>
                                        {selectTag.length > 0 ? (
                                            <Stack direction="row" spacing={1} style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                {selectTag.map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag.name}
                                                        onDelete={() => handleTagDelete(tag)}
                                                    />
                                                ))}
                                            </Stack>
                                        ) : (
                                            <div style={{ textAlign: 'center', marginTop: '10px'}} className={singlestyle.titleText}>
                                                테그를 선택해주세요
                                            </div>
                                        )}
                                    </Row>
                                </Col>
                                <Col sm='12' style={{ marginBottom: '10px' }} className={singlestyle.titleText}>
                                    작성자
                                </Col>
                                <Col sm='12' style={{ marginBottom: '10px' }}>
                                    <Input
                                        className={singlestyle.detail_input}
                                        type="text"
                                        placeholder="제작자를 입력해주세요"
                                        value={files[0].writer || ''} // 초기값 설정
                                        onChange={(e) => handleWriterChange(0, e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px', width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                        <Col sm='12' md='4' lg='4' xl='4' style={{ marginBottom: '10px' }}>
                            <input
                                type="file"
                                ref={hiddenAudioInput}
                                onChange={handleAudioFileChange}
                                style={{ display: 'none' }}
                                accept="audio/*"
                            />
                            <Button color="primary" onClick={handleAddTrackClick} className={singlestyle.Button}>파일추가</Button>
                        </Col>
                        <Col sm='12' md='7' lg='7' xl='7' style={{ marginBottom: '10px' }} className={singlestyle.endButtonBox}>

                            <Button color="primary" onClick={handleSave} className={singlestyle.Button}>저장하기</Button>
                            <Button color="primary" onClick={handleCancle} style={{ marginLeft: '10px' }} className={singlestyle.Button}>취소</Button>

                        </Col>
                    </Row>

                </div>

            )}
        </div>
    );

}

export default SingleTrackUpload;
