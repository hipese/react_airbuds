import { useState, useRef, useEffect } from "react"
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Input, Button } from "reactstrap";
import styles from "./Track_Upload.module.css"
import axios from "axios";
import MultiTrackUpload from "./MultiTrackUpload/MultiTrackUpload";
import SingleTrackUpload from "./SingleTrackUpload/SingleTrackUpload";

const Track_Upload = () => {

    // 업로드할 음원 파일을 저장하는 변수
    const [files, setFiles] = useState([]);

    // 데이터베이스에 음원목록을 가져오는 변수
    const [tracks, setTracks] = useState([]);

    const [imageview, setImageview] = useState({});

    // 선택된 태그를 가져오는 방법
    const [selectTag, setSelectTag] = useState([]);


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

                // 현재 날짜를 가져옵니다
                const currentDate = new Date();


                // 파일 정보와 함께 파일의 이름과 길이를 저장
                const newFile = {
                    file: file,
                    name: fileNameWithoutExtension, // 파일의 원래 이름
                    duration: duration, // 파일의 길이(초)
                    imageFile: null,
                    image_path: image_path, // 여기에 이미지 경로 추가
                    writer: "익명의 제작자",// 작사 추가
                    tag: selectTag, // 테그 필드 추가
                };
              
                setFiles(prevFiles => [...prevFiles, newFile]);
            };
        });
    };


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'audio/*' // 오디오 파일만 허용
    });

    const filesList = files.map((file, index) => {
        if (!file || !file.file) {
            return <li key={index}>파일 정보를 읽을 수 없음</li>;
        }
        return (
            <li key={index}>
                {file.file.name} - {file.file.size} bytes - 길이: {file.duration}초
            </li>
        );
    });

    return (
        <Container fluid>
            <Row className="justify-content-center align-items-center">
                {files.length === 0 ? (
                    <div className={styles.Dropzone} {...getRootProps()}>
                        <input {...getInputProps()} style={{ display: 'none' }} />
                        <div className={styles.dropFiles}>
                            음악 파일을 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.
                        </div>
                        <div>
                            <Button color="primary">파일을 선택하세요</Button>
                        </div>
                    </div>
                ) : files.length === 1 ? (
                    <SingleTrackUpload files={files} setFiles={setFiles} imageview={imageview} setImageview={setImageview} selectTag={selectTag} setSelectTag={setSelectTag} />
                ) :
                    <MultiTrackUpload files={files} setFiles={setFiles} imageview={imageview} setImageview={setImageview} selectTag={selectTag} setSelectTag={setSelectTag} />
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