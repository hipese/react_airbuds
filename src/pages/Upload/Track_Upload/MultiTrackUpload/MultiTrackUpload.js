import { useState, useRef, useEffect, Fragment, useContext } from "react"
import { Row, Col, Input, Button } from "reactstrap";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";
import MusicTagList from "../MuiscTagList/MuiscTagList";
import style from "./MultiTrackUpload.module.css"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LoginContext } from "../../../../App";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const MultiTrackUpload = ({ files, setFiles, imageview, setImageview, selectTag, setSelectTag }) => {

    const loginID = useContext(LoginContext);

    const [trackSelectTag, setTrackSelectTag] = useState([]);

    useEffect(() => {
        // files 배열의 각 파일에 대해 tags 속성만 추출하여 새로운 배열 생성
        const newTrackSelectTags = files.map(file => file.tags || []);
        setTrackSelectTag(newTrackSelectTags);

    }, [files]);

    // console.log(trackSelectTag);
    // console.log(files);



    // 선택된 트랙의 인덱스를 저장하는 상태 변수 추가
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [playListType, setPlayListType] = useState(null);
    const [order, setOrder] = useState([]);
    const [albumTitle, setAlbumTitle] = useState("익명의 앨범");
    const [writer,setWriter] =useState("익명의 제작자");    
    const [titleImage,setTitleImage]=useState();

    const currentDatePicker = dayjs();

    const handleChange = (event) => {
        setPlayListType(event.target.value);
    };

    // 이미지 변경을 위한 input
    const hiddenFileInput = useRef(null);

    const handleClickImage = () => {
        hiddenFileInput.current.click();
    };



    // 새로운 음원 파일을 추가하기 위한 ref
    const hiddenAudioInput = useRef(null);

    const handleAddTrackClick = () => {
        hiddenAudioInput.current.click();
    };

    // 음원 변경
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

    // =====================================================

    // 데이터베이스에 음원정보를 저장하고 파일을 업로드 하는 장소
    const handleSave = () => {
        const formData = new FormData();

        console.log(files)


        // files 배열에 있는 각 파일을 formData에 추가
        files.forEach((fileData, index) => {
            formData.append(`file`, fileData.file);
            formData.append(`name`, fileData.name);
            formData.append('duration', fileData.duration);
            formData.append('image_path', fileData.image_path);
            if (fileData.imageFile) {
                formData.append('imagefile', fileData.imageFile);
            }
            // 각 파일에 대한 태그 ID 배열 추출 및 추가
            if (trackSelectTag[index]) {
                const tagIds = trackSelectTag[index].map(tag => tag.tagId);
                tagIds.forEach(tagId => {
                    formData.append(`tags[${index}]`, tagId);
                });
            }


        });
        formData.append("titleImage",titleImage);
        formData.append('writer', writer);
        formData.append('releaseDate', selectedDate ? selectedDate.toISOString() : '');
        formData.append('albumTitle', albumTitle);
        formData.append('login', loginID.loginID);


        if (playListType === "앨범") {
            axios.post("/api/album", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(resp => {
                console.log("성공");
                setFiles([]);
                setSelectTag([]);
                setTrackSelectTag([])

            }).catch(resp => {
                console.log("실패")
            })
        }
        else {
            axios.post("/api/track/multiUpload", formData, {
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

    }

    const handleCancle = () => {
        const iscancle = window.confirm("업로드를 취소하시겠습니까?");
        if (!iscancle) {
            return;
        }
        setFiles([]);
    }


    const handleAlbumTitleChange = (e) => {
        setAlbumTitle(e.target.value);
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
            const newImagePath = URL.createObjectURL(imageFile) // URL에 타임스탬프 추가
    
            setImageview(newImagePath); // 보여주기용 이미지 값 설정
    
            setTitleImage(imageFile); // titleImage 상태 업데이트
    
            // files 배열의 모든 요소에 새 이미지 파일과 이미지 경로 업데이트
            setFiles(currentFiles => currentFiles.map(file => ({
                ...file,
                imageFile: imageFile, // 모든 트랙에 동일한 이미지 파일 설정
                image_path: imageFile.name // 모든 트랙에 새 이미지 파일 이름으로 image_path 설정
            })));
        }
        console.log(files);
    };
   
    const handleWriterChange = (index, newWriter) => {
        setFiles(currentFiles => {
            const updatedFiles = [...currentFiles];
            updatedFiles[index] = { ...updatedFiles[index], writer: newWriter };
            return updatedFiles;
        });

        setWriter(newWriter);
    };


    // 날짜 변경을 처리하는 함수
    const handleReleaseDateChange = (newDate) => {
        // newDate가 유효한 Date 객체인지 확인
        if (newDate && newDate.isValid()) {
            setSelectedDate(newDate);
        }
    };

    const handleTrackOrderChange = (index, newOrder) => {
        setOrder(currentOrder => {
            const updatedOrder = [...currentOrder];
            updatedOrder[index] = parseInt(newOrder, 10); // Convert string to number
            return updatedOrder;
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



    // 각각의 태그요소를 선택해서 file.tags에 넣어주는 함수
    const handleTrackTagSelection = (fileIndex, selectedTag) => {
        // trackSelectTag 업데이트
        setTrackSelectTag(currentTags => {
            const updatedTags = [...currentTags];
            if (!updatedTags[fileIndex].some(tag => tag.id === selectedTag.id)) {
                updatedTags[fileIndex] = [...updatedTags[fileIndex], selectedTag];
            }
            return updatedTags;
        });

        // files 배열 내의 해당 파일의 tags 업데이트
        setFiles(currentFiles => currentFiles.map((file, idx) => {
            if (idx === fileIndex) {
                // 기존 태그 목록 복사 후 새 태그 추가
                const updatedTags = file.tags ? [...file.tags, selectedTag] : [selectedTag];
                return { ...file, tags: updatedTags };
            }
            return file;
        }));
    };

    // 각각의 태그요소를 선택해서 그 요소의 id값이 같을 경우에만 삭제해주는 함수
    const handleTrackTagDelete = (fileIndex, tagToDelete) => {
        // trackSelectTag 배열 업데이트
        setTrackSelectTag(currentTags => currentTags.map((tags, idx) => {
            if (idx === fileIndex) {
                return tags.filter(tag => tag.tagId !== tagToDelete.tagId); // tagId가 일치하지 않는 태그만 필터링
            }
            return tags;
        }));

        // files 배열 업데이트
        setFiles(currentFiles => currentFiles.map((file, idx) => {
            if (idx === fileIndex) {
                const updatedTags = file.tags.filter(tag => tag.tagId !== tagToDelete.tagId); // tagId가 일치하지 않는 태그만 필터링
                return { ...file, tags: updatedTags };
            }
            return file;
        }));
    };

    const handleFileDelete = (fileIndex) => {
        // files 배열에서 선택된 인덱스의 파일을 제거
        setFiles(currentFiles => currentFiles.filter((_, idx) => idx !== fileIndex));

        // trackSelectTag 배열에서도 해당 인덱스의 태그 목록을 제거
        setTrackSelectTag(currentTags => currentTags.filter((_, idx) => idx !== fileIndex));
    };



    return (
        <div className={style.uploadDetail}>
            <Row style={{ marginBottom: '20px', width: '100%', marginLeft: '0px', marginRight: '0px' }}>
                <Col sm='12' md='4' style={{ marginBottom: '20px' }}>
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
                <Col sm='12' md='8' style={{ marginBottom: '20px', padding: '0' }}>
                    <Row style={{ marginBottom: '20px', width: '100%' }}>
                        <Col sm='12' style={{ marginBottom: '20px' }}>제목</Col>
                        <Col sm='12' style={{ marginBottom: '20px' }}>
                            <Input
                                placeholder="앨범 제목을 입력하세요"
                                className={style.detail_input}
                                type="text"
                                value={albumTitle}
                                onChange={handleAlbumTitleChange}
                            />
                        </Col>
                        <Col sm='12' md='6' style={{ marginBottom: '10px' }}>
                            <Row style={{ marginBottom: '10px' }}>
                                <Col sm='12' style={{ marginBottom: '10px' }}> 플레이리스트</Col>
                                <Col sm='12' style={{ marginBottom: '10px' }}>
                                    <Box sx={{ minWidth: 120 }}>
                                        <FormControl fullWidth sx={{
                                            top: '8px', // 상단 위치 조절
                                        }}>
                                            <InputLabel id="demo-simple-select-label" >재생목록유형</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={playListType}
                                                label="재생목록유형"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={"앨범"}>앨범</MenuItem>
                                                <MenuItem value={"싱글"}>싱글</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Col>
                            </Row>
                        </Col>

                        <Col sm='12' md='6' style={{ marginBottom: '10px' }}>
                            <Row>
                                <Col sm='12' style={{ marginBottom: '10px' }}>출시일자</Col>
                                <Col sm='12' style={{ marginBottom: '10px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="출시일자선택"
                                                defaultValue={dayjs(currentDatePicker)}
                                                value={selectedDate}
                                                onChange={handleReleaseDateChange}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Col>
                            </Row>
                        </Col>
                        {
                            playListType === "앨범" && (
                                <Fragment>
                                    <Col sm='12' style={{ marginBottom: '10px' }}>AlbumTag</Col>
                                    <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
                                        <MusicTagList onSelectTag={handleTagSelection} />
                                    </Col>
                                    <Col sm='12' md='8' style={{ marginBottom: '10px' }}>
                                        <Row className={style.chipRow}>
                                            <Stack direction="row" spacing={1} style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                {selectTag.map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag.name}
                                                        onDelete={() => handleTagDelete(tag)}
                                                    />
                                                ))}
                                            </Stack>
                                        </Row>
                                    </Col>
                                </Fragment>
                            )
                        }
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
            <hr />
            <Row style={{ marginBottom: '10px' }}>
                <Col sm="2" style={{ marginBottom: '10px' }}>
                    트랙순서
                </Col>
                <Col sm="10" style={{ marginBottom: '10px' }}>
                    트랙제목
                </Col>
                {files.map((file, index) => (
                    <Fragment key={index}>
                        <Col sm="2" style={{ marginBottom: '10px' }}>
                            <Input
                                className={style.detail_input_filename}
                                type="text"
                                placeholder="순서를 입력하세요"
                                value={order[index] || index + 1}
                                onChange={(e) => handleTrackOrderChange(index, e.target.value)}
                            />
                        </Col>
                        <Col sm="5" style={{ marginBottom: '10px' }}>
                            <Input
                                className={style.detail_input_filename}
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={file.name || ''} // 각 파일의 이름 사용
                                onChange={(e) => handleFileNameChange(index, e.target.value)}
                            />
                        </Col>
                        <Col sm="12" md="3" style={{ marginBottom: '10px' }}>
                            <MusicTagList onSelectTag={(tag) => handleTrackTagSelection(index, tag)} />
                        </Col>
                        <Col sm="12" md="2" style={{ marginBottom: '10px' }}>
                            <Button onClick={() => handleFileDelete(index)}>삭제</Button>
                        </Col>
                        <Col sm="12" md="12" style={{ marginBottom: '10px' }}>
                            {trackSelectTag[index] && trackSelectTag[index].length > 0 && (
                                <Row className={style.chipRow}>
                                    <Stack direction="row" spacing={1} style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                        {trackSelectTag[index].map((tag, tagIndex) => (
                                            <Chip
                                                key={tagIndex}
                                                label={tag.tagName}
                                                onDelete={() => handleTrackTagDelete(index, tag)}
                                            />
                                        ))}
                                    </Stack>
                                </Row>
                            )}
                        </Col>
                    </Fragment>
                ))}
            </Row>

            <hr />
            <Col sm="12">
                <input
                    type="file"
                    ref={hiddenAudioInput}
                    onChange={handleAudioFileChange}
                    style={{ display: 'none' }}
                    accept="audio/*"
                />
                <Button onClick={handleAddTrackClick}>다른 트렉 추가하기</Button></Col>
            <hr />
            <Col>
                <Button color="primary" onClick={handleCancle}>취소</Button>
                <Button color="primary" onClick={handleSave}>저장하기</Button>
            </Col>
        </div>
    );

}

export default MultiTrackUpload;
