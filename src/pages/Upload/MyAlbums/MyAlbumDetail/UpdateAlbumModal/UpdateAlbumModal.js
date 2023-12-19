import { Button, Col, Input, Row } from "reactstrap";
import styles from "./UpdateAlbumModal.module.css"
import Box from '@mui/material/Box';
import React, { Fragment, useEffect, useRef, useState } from "react";
import AlbumTagList from "../../../Track_Upload/AlbumTagList/AlbumTagList";
import MusicTagList from "../../../Track_Upload/MuiscTagList/MuiscTagList";
import { Chip } from "@mui/material";
import Stack from '@mui/material/Stack';
import axios from "axios";

const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const UpdateAlbumModal = React.forwardRef(({ albumUpdate, setAlbumUpdate, onClose }, ref) => {


    console.log(albumUpdate);

    // 선택된 태그를 가져오는 방법
    const [trackTags, setTrackTags] = useState([]);
    const [backUpAlbum, setBackUpAlbum] = useState(albumUpdate);


    const [imageView, setImageView] = useState("/tracks/image/" + albumUpdate.coverImagePath);
    const [prevImage, setPrevImage] = useState(albumUpdate.coverImagePath);
    const [files, setFiles] = useState([]);

    const [albumTag, setAlbumTag] = useState([]);
    const [insertFile, setInsertFile] = useState([]);

    const [deleteTrack, setDeleteTrack] = useState([]);

    const handleCancle = () => {
        onClose();
    }

    useEffect(() => {
        const loadTrackTags = async () => {
            // Temporary array to hold new tags
            let newTags = [];

            let i = 0;
            for (const track of albumUpdate.tracks) {
                console.log(i + "회차");
                const response = await axios.get(`/api/trackTag/selectTagById/${track.trackId}`);
                newTags.push({ trackId: track.trackId, tags: response.data });
                i++;
            }

            // Concatenate new tags with existing tags
            setTrackTags(prevTags => [...prevTags, ...newTags]);
        };
        loadTrackTags();
    }, []);

    console.log(trackTags)
    // 새로운 음원 파일을 추가하기 위한 ref
    const hiddenAudioInput = useRef(null);

    const handleAddTrackClick = () => {
        hiddenAudioInput.current.click();
    };


    const handleUpdate = () => {
        const formData = new FormData();

    }


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

    // 이미지 변경을 위한 input
    const hiddenFileInput = useRef(null);

    const handleClickImage = () => {
        hiddenFileInput.current.click();
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        if (imageFile) {
            const newImagePath = URL.createObjectURL(imageFile) // URL에 타임스탬프 추가

            setImageView(newImagePath); // 보여주기용 이미지 값 설정


            // files 배열의 모든 요소에 새 이미지 파일과 이미지 경로 업데이트
            setFiles(currentFiles => currentFiles.map(file => ({
                ...file,
                imageFile: imageFile, // 모든 트랙에 동일한 이미지 파일 설정
                image_path: imageFile.name // 모든 트랙에 새 이미지 파일 이름으로 image_path 설정
            })));
        }
    };

    const handleAlbumTitleChange = (e) => {
        const newTitle = e.target.value;
        setAlbumUpdate((prevAlbum) => {
            return {
                ...prevAlbum,
                title: newTitle
            };
        });
    };

    const handleTitleNameChange = (index, newTitle) => {
        setAlbumUpdate((prevAlbumUpdate) => {

            const updatedTracks = prevAlbumUpdate.tracks.map((track, idx) => {
                if (idx === index) {

                    return { ...track, title: newTitle };
                }
                return track;
            });

            return {
                ...prevAlbumUpdate,
                tracks: updatedTracks
            };
        });
    };

    const handleWriterChange = (index, newWriter) => {
        setAlbumUpdate((prevAlbumUpdate) => {

            const updatedTracks = prevAlbumUpdate.tracks.map((track, idx) => {
                if (idx === index) {

                    return { ...track, writer: newWriter };
                }
                return track;
            });

            return {
                ...prevAlbumUpdate,
                tracks: updatedTracks
            };
        });
    };


    const handleTrackTagChange = (trackId, newTags) => {
        setTrackTags((prevTags) => ({
            ...prevTags,
            [trackId]: newTags
        }));
    };

    const handleTagDelete = (tagToDelete) => {
        setAlbumUpdate((prevAlbumUpdate) => {
            const updatedAlbumTags = prevAlbumUpdate.albumTag.filter(
                (tag) => tag.albumTagList.tagId !== tagToDelete.albumTagList.tagId
            );

            return {
                ...prevAlbumUpdate,
                albumTag: updatedAlbumTags,
            };
        });
    };

    const handleFileDelete = (fileIndex) => {
        // files 배열에서 선택된 인덱스의 파일을 제거
        setFiles(currentFiles => currentFiles.filter((_, idx) => idx !== fileIndex));

        // trackSelectTag 배열에서도 해당 인덱스의 태그 목록을 제거

    };


    const handleTagSelection = (selectedTagObject) => {
        setAlbumUpdate((prevAlbumUpdate) => {
            // Check if the tag is already in the albumTag list
            const isTagPresent = prevAlbumUpdate.albumTag.some(
                (tag) => tag.albumTagList.tagId === selectedTagObject.tagId
            );

            // If not present, add it to the albumTag list
            if (!isTagPresent) {
                const newTag = {
                    id: null,
                    album: null,
                    albumTagList: {
                        tagId: selectedTagObject.tagId,
                        tagName: selectedTagObject.tagName,
                    },
                };

                return {
                    ...prevAlbumUpdate,
                    albumTag: [...prevAlbumUpdate.albumTag, newTag],
                };
            }


            return prevAlbumUpdate;
        });
    };


    const handleTrackTagDelete = (fileIndex, tagToDelete) => {


        // files 배열 업데이트
        setFiles(currentFiles => currentFiles.map((file, idx) => {
            if (idx === fileIndex) {
                const updatedTags = file.tags.filter(tag => tag.tagId !== tagToDelete.tagId); // tagId가 일치하지 않는 태그만 필터링
                return { ...file, tags: updatedTags };
            }
            return file;
        }));
    };


    return (
        <Box sx={ModalStyle} ref={ref}>
            <Row>
                <Col sx='12' md='4'>
                    <img
                        src={albumUpdate.coverImagePath ? imageView : "/assets/groovy2.png"}
                        alt={albumUpdate.title}
                        onClick={handleClickImage}
                        className={styles.albumImage}
                    />
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <Button onClick={handleClickImage}>이미지변경</Button>
                </Col>
                <Col sx='12' md='8'>
                    <Row>
                        <Col sx='12' md='12'>앨범제목</Col>
                        <Col sx='12' md='12'>
                            <Input type="text"
                                placeholder="제목을 입력하세요"
                                value={albumUpdate.title}
                                onChange={handleAlbumTitleChange}
                            ></Input>
                        </Col>
                        <Col sm='12' style={{ marginBottom: '10px' }}>AlbumTag</Col>
                        <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
                            <AlbumTagList onSelectTag={handleTagSelection} />
                        </Col>
                        <Col sm='12' md='8' style={{ marginBottom: '10px' }}>
                            <Row className={styles.chipRow}>
                                <Stack direction="row" spacing={1} style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                    {albumUpdate.albumTag.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag.albumTagList.tagName}
                                            onDelete={() => handleTagDelete(tag)}
                                        />
                                    ))}
                                </Stack>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col sm="2" style={{ marginBottom: '10px' }}>
                    트랙순서
                </Col>
                <Col sm="10" style={{ marginBottom: '10px' }}>
                    트랙제목
                </Col>
                {albumUpdate.tracks.map((file, index) => (
                    <Fragment key={index}>
                        <Col sm="2" style={{ marginBottom: '10px' }}>
                            <Input
                                className={styles.detail_input_filename}
                                type="text"
                                placeholder="순서를 입력하세요"
                                value={[index] || index + 1}
                                readOnly="true"
                            />
                        </Col>
                        <Col sm="5" style={{ marginBottom: '10px' }}>
                            <Input
                                className={styles.detail_input_filename}
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={file.title || ''} // 각 파일의 이름 사용
                                onChange={(e) => handleTitleNameChange(index, e.target.value)}
                            />
                        </Col>
                        <Col sm="12" md="3" style={{ marginBottom: '10px' }}>
                            <MusicTagList onSelectTag={(tag) => handleTrackTagChange(index, tag)} />
                        </Col>
                        <Col sm="12" md="2" style={{ marginBottom: '10px' }}>
                            <Button onClick={() => handleFileDelete(index)}>삭제</Button>
                        </Col>
                        <Col sm="12" md="12" style={{ marginBottom: '10px' }}>
                            {albumUpdate.tracks.map((track, index) => (
                                <Row key={index} className={styles.chipRow}>
                                    <Stack direction="row" spacing={1} style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                        {trackTags[track.trackId]?.map((tagObj, tagIndex) => (
                                            <Chip key={tagIndex} label={tagObj.musicTags.tagName} />
                                        ))}
                                    </Stack>
                                </Row>
                            ))}
                        </Col>
                        <Col sm="12" md="12" style={{ marginBottom: '10px' }}>
                            <Input
                                className={styles.detail_input}
                                type="text"
                                placeholder="제작자를 입력하세요"
                                value={file.writer}
                                onChange={(e) => handleWriterChange(index, e.target.value)}
                            />
                            <hr />
                        </Col>
                    </Fragment>
                ))}
            </Row>
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
                <Button onClick={handleCancle}>Close</Button>
                <Button color="primary">수정하기</Button>
            </Col>
        </Box>
    );
});

export default UpdateAlbumModal;