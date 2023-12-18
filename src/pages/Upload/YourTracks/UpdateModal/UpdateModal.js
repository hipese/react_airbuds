import { useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { LoginContext } from '../../../../App';
import MusicTagList from '../../Track_Upload/MuiscTagList/MuiscTagList';
import { Button, Col, Input, Row } from 'reactstrap';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import singlestyle from "./UpdateModal.module.css"
const Modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const UpdateModal = ({ selectedTrack, setSelectedTrack,setTrack, onTrackUpdated, onClose }) => {

  const [previmagePath, setPrevImagePath] = useState({});
  const [imageview, setImageview] = useState({});

  // 선택된 태그를 가져오는 방법
  const [selectTag, setSelectTag] = useState([]);

  const hiddenFileInput = useRef(null);

  const handleClickImage = () => {
    hiddenFileInput.current.click();
  };
  // =====================================================

  useEffect(() => {
    // props로 전달된 트랙 정보를 로컬 상태에 설정
      axios.get(`/api/trackTag//selectTagById/${selectedTrack.trackId}`).then(resp => {
        const transformedData = resp.data.map(item => ({
          id: item.musicTags.tagId,
          name: item.musicTags.tagName
        }));

        setSelectTag(transformedData);
      });

      setPrevImagePath(selectedTrack.imagePath);
      setImageview("/tracks/image/" + selectedTrack.imagePath)
    
  }, []);




  // 데이터베이스에 음원정보를 저장하고 파일을 업로드 하는 장소
  const handleupdate = () => {
    const formData = new FormData();

    // editedTrack의 기본 정보를 formData에 추가
    formData.append('trackId', selectedTrack.trackId);
    formData.append('title', selectedTrack.title);
    formData.append('writer', selectedTrack.writer);
    formData.append('imagePath', selectedTrack.imagePath);
    formData.append('previmagePath', previmagePath);
    
    // 이미지 파일이 변경되었는지 확인
    if (selectedTrack.imageFile) {
      formData.append('imagefile', selectedTrack.imageFile);
    } else {

    }

    // 태그 정보를 formData에 추가
    
    selectTag.forEach(tag => {
      formData.append('tags', tag.id);
    });

    if(selectTag.length<=0){
      alert("태그를 하나라도 선택해주세요");
      return;
    }

    axios.post("/api/track/update", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(resp => {
      console.log(resp);
      onTrackUpdated(resp.data);
      onClose(); 
    })

  }

  const handleCancle = () => {
    const iscancle = window.confirm("수정을 취소하시겠습니까?");
    if (!iscancle) {
      return;
    }
    setSelectedTrack({});
    setSelectTag([]);
    onClose(); 
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];

      // 이미지 미리보기를 위한 URL 생성
      const imageUrl = URL.createObjectURL(imageFile);

      // editedTrack 상태 업데이트
      setSelectedTrack(prev => ({
        ...prev,
        imageFile: imageFile, // 새 이미지 파일 저장
        imagePath: imageUrl // 이미지 미리보기 URL 저장
      }));

      // 이미지 미리보기 상태 업데이트
      setImageview(imageUrl);
    }
  };


  const handleTitleChange = (e) => {
    setSelectedTrack(prev => ({ ...prev, title: e.target.value }));
  };

  const handleWriterChange = (e) => {
    setSelectedTrack(prev => ({ ...prev, writer: e.target.value }));
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
    <Box sx={Modalstyle}>
      <Row style={{ marginBottom: '10px', width: '100%', marginLeft: '0px', marginRight: '0px' }}>
        <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
          {selectedTrack.imagePath === "/assets/groovy2.png" ? <div className={singlestyle.imageContainer}>
            <img src={selectedTrack.imagePath} onClick={handleClickImage} />
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleImageChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <Button onClick={handleClickImage}>이미지변경</Button>
          </div> : <div className={singlestyle.imageContainer}>
            <img src={imageview} onClick={handleClickImage} />
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleImageChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <Button onClick={handleClickImage}>이미지변경</Button>
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
                value={selectedTrack.title}
                onChange={handleTitleChange} // 이벤트 핸들러 연결
              />
            </Col>
            <Col sm='12 ' style={{ marginBottom: '10px' }}>tag </Col>
            <Col sm='12' md='4' style={{ marginBottom: '10px' }}>
              <MusicTagList onSelectTag={handleTagSelection} />
            </Col>
            <Col sm='12' md='8' style={{ marginBottom: '10px' }}>
              <Row className={singlestyle.chipRow}>
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
            <Col sm='12' style={{ marginBottom: '10px' }}>writer</Col>
            <Col sm='12' style={{ marginBottom: '10px' }}>
              <Input
                className={singlestyle.detail_input}
                type="text"
                placeholder="제작자를 입력해주세요"
                value={selectedTrack.writer || ''} // 초기값 설정
                onChange={handleWriterChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col sm='12' style={{ marginBottom: '10px' }}>
          <Button color="primary" onClick={handleCancle}>취소</Button>
          <Button color="primary" onClick={handleupdate}>수정하기</Button>
        </Col>
      </Row>
    </Box>
  )
}


export default UpdateModal;