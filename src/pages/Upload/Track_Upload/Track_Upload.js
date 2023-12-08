import { useState, useRef, useEffect } from "react"
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Input, Button } from "reactstrap";
import style from "./Track_Upload.module.css"
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import axios from "axios";
import MusicTagList from "./MuiscTagList/MuiscTagList";

const Track_Upload = () => {

    // 업로드할 음원 파일을 저장하는 변수
    const [files, setFiles] = useState([]);

    // 데이터베이스에 음원목록을 가져오는 변수
    const [tracks, setTracks] = useState([]);

    const [imageview, setImageview] = useState({});

    // 선택된 태그를 가져오는 방법
    const [selectTag, setSelectTag] = useState([]);


    // 이미지를 바꾸기 위한 것들
    // =====================================================
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

    // 데이터베이스에 존재하는 모든 음원 정보를 가져오는 기능
    const handlelist = () => {
        axios.get("/api/track").then(resp => {
            console.log(resp.data);
            setTracks(resp.data)
        })
    }

    // 선택한 id값의 음원 정보를 삭제하는 기능
    const handleDelete = (trackId) => {
        console.log("뭐임" + trackId);
        axios.delete(`/api/track/${trackId}`).then(resp => {
            console.log("삭제 성공..")
        }).catch(resp => {
            console.log("삭제 실패...")
        })
    }




    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);

            audio.onloadedmetadata = () => {
                // 파일 길이(초)를 구합니다
                const duration = audio.duration;

                // 예시: 기본 이미지 경로 설정
                const image_path = "/assets/groovy2.png";

                // 파일 이름에서 확장자 제거
                const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');

                // 파일 정보와 함께 파일의 이름과 길이를 저장
                const newFile = {
                    file: file,
                    name: fileNameWithoutExtension, // 파일의 원래 이름
                    duration: duration, // 파일의 길이(초)
                    imageFile: null,
                    image_path: image_path, // 여기에 이미지 경로 추가
                    writer: "익명의 제작자",// 작사 추가
                    tag: selectTag // 테그 필드 추가
                };

                setFiles(prevFiles => [...prevFiles, newFile]);
            };
        });
    };

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


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'audio/*' // 오디오 파일만 허용
    });

    const filesList = files.map((file, index) => (
        <li key={index}>{file.file.name} - {file.file.size} bytes - 길이: {file.duration}초</li>
    ));


    return (
        <Container fluid>
            <Row className="justify-content-center align-items-center">
                {files.length === 0 ? (
                    <div className={style.Dropzone} {...getRootProps()}>
                        <input {...getInputProps()} style={{ display: 'none' }} />
                        <div>
                            음악 파일을 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.
                        </div>
                        <div>
                            <Button color="primary">파일을 선택하세요</Button>
                        </div>
                    </div>
                ) : files.length === 1 ? (
                    <div className={style.uploadDetail}>
                        <Row style={{ marginBottom: '10px', width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                            <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
                                {files[0].image_path === "/assets/groovy2.png" ? <div className={style.imageContainer}>
                                    <img src={files[0].image_path} onClick={handleClickImage} />
                                    <input
                                        type="file"
                                        ref={hiddenFileInput}
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                </div> : <div className={style.imageContainer}>
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
                                            className={style.detail_input}
                                            type="text"
                                            value={files[0].name} // 파일 객체의 이름 속성 사용
                                            onChange={(e) => handleFileNameChange(0, e.target.value)} // 변경 이벤트 처리
                                        />
                                    </Col>
                                    <Col sm='12 ' style={{ marginBottom: '10px' }}>tag </Col>
                                    <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
                                        <MusicTagList onSelectTag={handleTagSelection} />
                                    </Col>
                                    <Col sm='12' md='8' style={{ marginBottom: '10px' }}>
                                        <Row className={style.chipRow}>
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
                                            className={style.detail_input}
                                            type="text"
                                            placeholder="제작자를 입력해주세요"
                                            value={files[0].writer || ''} // 초기값 설정
                                            onChange={(e) => handleWriterChange(0, e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col><Button color="primary" onClick={handleCancle}>취소</Button></Col>
                            <Col><Button color="primary" onClick={handleSave}>저장하기</Button></Col>
                        </Row>
                    </div>
                ) :
                    <div className={style.uploadDetail}>
                        {"파일이 2개 이상이면 ㄱㄱㄱㄱ"}
                    </div>
                }
            </Row>

            <Row>
                {files.length > 0 && (
                    <div>
                        <h3>업로드된 파일:</h3>
                        <ul>{filesList}</ul>
                    </div>
                )}
            </Row>

            <button onClick={handlelist}>목록 보여주기</button>


            <div>
                {tracks.map((track, index) => (
                    <div key={index} >
                        {track.title} <button onClick={() => handleDelete(track.trackId)}>삭제하기</button>
                    </div>
                ))}
            </div>

        </Container>

    );
}

export default Track_Upload;