
import { useState, useRef, useEffect } from "react"
import {  Row, Col, Input, Button } from "reactstrap";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import axios from "axios";
import singlestyle from "./SingleTrackUpload.module.css"
import MusicTagList from "../MuiscTagList/MuiscTagList";
import dayjs from 'dayjs';

const SingleTrackUpload = ({files,setFiles,imageview,setImageview,selectTag,setSelectTag}) => {

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const hiddenFileInput = useRef(null);

    const handleClickImage = () => {
        hiddenFileInput.current.click();
    };
    // =====================================================

    // 데이터베이스에 음원정보를 저장하고 파일을 업로드 하는 장소
    const handleSave = () => {
        const formData = new FormData();

        console.log(files)

        // files 배열에 있는 각 파일을 formData에 추가
        files.forEach((fileData) => {
            formData.append(`file`, fileData.file);
            formData.append(`name`, fileData.name);
            formData.append('duration', fileData.duration);
            formData.append('image_path', fileData.image_path);
            
            if (fileData.imageFile) {
                formData.append('imagefile', fileData.imageFile);
            }
            formData.append('writer', fileData.writer);
            formData.append('tag', selectTag);

            console.log(fileData.imageFile);
            console.log(formData);
        });
        formData.append('releaseDate', selectedDate ? selectedDate.toISOString() : '');

        if (selectTag.length === 0) {
            alert("태그를 하나라도 선택해주세요");
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
        })
    }

    const handleCancle = () => {
        const iscancle = window.confirm("업로드를 취소하시겠습니까?");
        if (!iscancle) {
            return;
        }
        setFiles([]);
    }

    const handleFileNameChange = (index, newName) => {
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
        setFiles(currentFiles => {
            const updatedFiles = [...currentFiles];
            updatedFiles[index] = { ...updatedFiles[index], writer: newWriter };
            return updatedFiles;
        });
    };

    // 태그 선택 변경 시 호출될 콜백 함수
    const handleTagSelection = (selectedTag) => {

        if (!selectTag.includes(selectedTag)) {
            setSelectTag([...selectTag, selectedTag]);
        }
        console.log(selectTag);
    };

    const handleTagDelete = (tagToDelete) => {
        setSelectTag((tags) => tags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <div className={singlestyle.uploadDetail}>
            <Row style={{ marginBottom: '10px', width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
                    {files[0].image_path === "/assets/groovy2.png" ? <div className={singlestyle.imageContainer}>
                        <img src={files[0].image_path} onClick={handleClickImage} />
                        <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div> : <div className={singlestyle.imageContainer}>
                        <img src={imageview} onClick={handleClickImage} />
                        <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>}

                </Col>
                <Col sm='12' md='8' style={{ marginBottom: '10px', padding: '0' }}>
                    <Row style={{ marginBottom: '10px', width: '100%' }}>
                        <Col sm='12' style={{ marginBottom: '10px' }}>제목</Col>
                        <Col sm='12' style={{ marginBottom: '10px' }}>
                            <Input
                                placeholder="제목을 입력하세요"
                                className={singlestyle.detail_input}
                                type="text"
                                value={files[0].name} // 파일 객체의 이름 속성 사용
                                onChange={(e) => handleFileNameChange(0, e.target.value)} // 변경 이벤트 처리
                            />
                        </Col>
                        <Col sm='12 ' style={{ marginBottom: '10px' }}>tag </Col>
                        <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
                            <MusicTagList onSelectTag={handleTagSelection}/>
                        </Col>
                        <Col sm='12' md='8' style={{ marginBottom: '10px' }}>
                            <Row className={singlestyle.chipRow}>
                                <Stack direction="row" spacing={1} style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                    {selectTag.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            onDelete={() => handleTagDelete(tag)}
                                        />
                                    ))}
                                </Stack>
                            </Row>
                        </Col>
                        <Col sm='12' style={{ marginBottom: '10px' }}>writer</Col>
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
            <Col>
                <Button color="primary" onClick={handleCancle}>취소</Button>
                <Button color="primary" onClick={handleSave}>저장하기</Button>
            </Col>
        </div>
    );

}

export default SingleTrackUpload;
