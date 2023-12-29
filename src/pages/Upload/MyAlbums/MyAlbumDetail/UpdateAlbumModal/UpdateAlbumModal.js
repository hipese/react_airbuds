import { Button, Col, Input, Row } from "reactstrap";
import styles from "./UpdateAlbumModal.module.css"
import Box from '@mui/material/Box';
import React, { Fragment, useEffect, useRef, useState } from "react";
import AlbumTagList from "../../../Track_Upload/AlbumTagList/AlbumTagList";
import MusicTagList from "../../../Track_Upload/MuiscTagList/MuiscTagList";
import { Chip } from "@mui/material";
import Stack from '@mui/material/Stack';
import axios from "axios";
import AddTrackSelect from "./AddTrackSelect/AddTrackSelect";
import Dialog from '@mui/material/Dialog';

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

// 안에서 모달 또 띄우기
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {

        const iscancle=window.confirm("창을 닫으시겠습니까?")

        if(!iscancle){
            return;
        }

        setOpen(false);
    };


    console.log(albumUpdate);

    // 선택된 태그를 가져오는 방법
    const [trackTags, setTrackTags] = useState([]);
    const [titleImage, setTitleImage] = useState();

    const [imageView, setImageView] = useState(albumUpdate.coverImagePath);
    const [prevImage, setPrevImage] = useState(albumUpdate.coverImagePath);
    const [files, setFiles] = useState([]);


    const [deleteTrack, setDeleteTrack] = useState([]);


    // 그냥 닫을때는 다시 원래 데이터로 설정
    const handleCancle = () => {
        onClose();
    }

    const handleUpdateComplet = () => {
        onClose();
    }


    // 새로운 음원 파일을 추가하기 위한 ref
    const hiddenAudioInput = useRef(null);

    const handleAddTrackClick = () => {
        hiddenAudioInput.current.click();
    };

    const handleUpdate = () => {
        const formData = new FormData();

        if (files && files.length > 0) {
            files.forEach((fileData, index) => {
                formData.append(`file`, fileData.file);
                formData.append(`name`, fileData.name);
                formData.append('duration', fileData.duration);
                formData.append(`image_path`, fileData.image_path);
                formData.append(`writer`, fileData.writer);
                // 각 파일에 대한 태그 ID 배열 추출 및 추가
            });
        }

        // 이미지 보내기
        console.log("Title Image: ", titleImage);
        if (titleImage) {
            formData.append("titleImage", titleImage);
        }

        // 예전 이미지 값
        formData.append(`prevImage`, prevImage);
        formData.append('albumTitle', albumUpdate.title);
        // 앨범의 테그 보내기 
        albumUpdate.albumTag.forEach(tag => {
            formData.append('albumselectTag', tag.albumTagList.tagId);
        });

        // 변한 트랙에 작성자 전송
        albumUpdate.tracks.forEach(track => {
            formData.append('albumsWriters', track.writer);
        });

        // 변한 트랙에 작성자 전송
        albumUpdate.tracks.forEach(track => {
            formData.append('Tracktitles', track.title);
        });


        if (deleteTrack) {
            deleteTrack.forEach(track => {
                formData.append('deleteTrack', track.trackId);
            });
        }
        // 트랙의 테그 보내기 
        trackTags.forEach(tag => {
            formData.append('trackTags', tag.id);
        });
        formData.append("albumId", albumUpdate.albumId);

        axios.post("/api/album/updateAlbum", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(resp => {
            console.log("성공!");
            console.log(resp.data);
            setAlbumUpdate(resp.data);
            setFiles([]);
            setTitleImage();
            setImageView();
            setDeleteTrack();
            handleUpdateComplet();

        }).catch(resp => {
            console.log("실패")
        })

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

    const handleFileNameChange = (index, newName) => {
        setFiles(currentFiles => {
            // 현재 파일 목록 복사
            const updatedFiles = [...currentFiles];

            // 선택된 파일의 이름 업데이트
            updatedFiles[index] = { ...updatedFiles[index], name: newName };

            return updatedFiles;
        });
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
            setTitleImage(imageFile);

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

        console.log("몇개 남아있냐?" + (files.length + albumUpdate.tracks.length));
        console.log("몇개 재거함?" + (deleteTrack.length));
        console.log("몇개 추가함?" + (files.length));
        if ((albumUpdate.tracks.length + files.length) <= 1) {
            alert("앨범에 파일이 하나라도 존재해야 합니다.");
            return;
        }

        setAlbumUpdate(currentAlbum => {
            const newTracks = [...currentAlbum.tracks];
            const removedTrack = newTracks.splice(fileIndex, 1)[0];

            setDeleteTrack(currentDeleteTrack => [...currentDeleteTrack, removedTrack]);

            return {
                ...currentAlbum,
                tracks: newTracks
            };
        });
    };

    const handleAddFileDelete = (fileIndex) => {
        console.log("몇개 남아있냐?" + (files.length + albumUpdate.tracks.length))
        console.log("몇개 재거함?" + (deleteTrack.length))

        if ((albumUpdate.tracks.length + files.length) <= 1) {
            alert("앨범에 파일이 하나라도 존재해야 합니다.");
            return;
        }

        setFiles(currentFiles => currentFiles.filter((_, idx) => idx !== fileIndex));
    };

    const handleAddWriterChange = (fileIndex, newWriter) => {
        setFiles(currentFiles => {
            // Create a new array by copying the current files array
            const updatedFiles = [...currentFiles];

            // Update the writer for the file at the given index
            if (updatedFiles[fileIndex]) {
                updatedFiles[fileIndex] = { ...updatedFiles[fileIndex], writer: newWriter };
            }

            return updatedFiles;
        });
    };

    // 각각의 태그요소를 선택해서 file.tags에 넣어주는 함수
    const handleTrackTagSelection = (fileIndex, selectedTag) => {
        // Update trackTags for the specific track
        setTrackTags(currentTags => {
            const updatedTags = [...currentTags];
            if (!updatedTags[fileIndex]) {
                updatedTags[fileIndex] = [];
            }
            // Add the new tag if it's not already present
            if (!updatedTags[fileIndex].some(tag => tag.tagId === selectedTag.tagId)) {
                updatedTags[fileIndex].push(selectedTag);
            }
            return updatedTags;
        });
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
            <Row className={styles.container}>
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
                        <Col sm="12" md="5" style={{ marginBottom: '10px' }}>
                            <Button onClick={() => handleFileDelete(index)}>삭제</Button>
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
                {files.map((file, index) => (
                    <Fragment key={index}>
                        <Col sm="12" md="2" style={{ marginBottom: '10px' }}>
                            <Input
                                className={styles.detail_input_filename}
                                type="text"
                                placeholder="순서를 입력하세요"
                                value={index + albumUpdate.tracks.length}
                                readOnly={true}
                            />
                        </Col>
                        <Col sm="15" md="5" style={{ marginBottom: '10px' }}>
                            <Input
                                className={styles.detail_input_filename}
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={file.name || ''}
                                onChange={(e) => handleFileNameChange(index, e.target.value)}
                            />
                        </Col>
                        <Col sm="12" md="2" style={{ marginBottom: '10px' }}>
                            <Button onClick={() => handleAddFileDelete(index)}>삭제</Button>
                        </Col>
                        <Col sm="12" md="3" style={{ marginBottom: '10px' }}>
                            <MusicTagList onSelectTag={(tag) => handleTrackTagSelection(index, tag)} />
                        </Col>

                        <Col sm="12" md="12" style={{ marginBottom: '10px' }}>
                            <Col sm="12" md="12" style={{ marginBottom: '10px' }}>
                                {trackTags[index] && trackTags[index].length > 0 && (
                                    <Row className={styles.chipRow}>
                                        <Stack direction="row" spacing={1} style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                            {trackTags[index].map((tag, tagIndex) => (
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
                        </Col>
                        <Col sm="12" md="12" style={{ marginBottom: '10px' }}>
                            <Input
                                className={styles.detail_input}
                                type="text"
                                placeholder="제작자를 입력하세요"
                                value={file.writer}
                                onChange={(e) => handleAddWriterChange(index, e.target.value)}
                            />
                            <hr />
                        </Col>

                    </Fragment>
                ))}
            </Row>
            <Row>
                <Col sm="6">
                    <input
                        type="file"
                        ref={hiddenAudioInput}
                        onChange={handleAudioFileChange}
                        style={{ display: 'none' }}
                        accept="audio/*"
                    />
                    <Button onClick={handleAddTrackClick}>다른 트렉 추가하기</Button>
                </Col>
                <Col sm="6">
                    <Button onClick={handleClickOpen}>기존 트랙에서 선택</Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <AddTrackSelect  handleClose={handleClose} setAlbumUpdate={setAlbumUpdate} albumId={albumUpdate.albumId} />
                    </Dialog>
                </Col>
            </Row>

            <Col>
                <hr />
                <Button onClick={handleCancle}>Close</Button>
                <Button color="primary" onClick={handleUpdate}>수정하기</Button>
            </Col>
        </Box>
    );
});

export default UpdateAlbumModal;