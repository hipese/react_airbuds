import { Col } from "reactstrap";
import styles from "./SearchBar.module.css"
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


// 이거 왜 안되는지 재훈이한태 물어보고 걍 안되면 버리삼
const DropdownContainer = styled("div")({
    position: "absolute",
    top: "30px", // 버튼의 바닥에서 얼마나 떨어져 나타낼지
    right: "30px", // 오른쪽 끝에서 얼마나 떨어져 나타낼지
    width: "300px",
    height: "100px",
    backgroundColor: "white",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    padding: "0px 0px",
    zIndex: 10000, // 다른 요소들 위에 나타나게 하기 위함
    border: "1px solid #ddd", // 테두리 추가
    borderRadius: "8px", // 모서리 둥글기 조절
});

const SearchBar = () => {
    const [showDropdown, setShowDropdown] = React.useState(false); // 드롭다운 상태
    const dropdownRef = React.useRef(null); // 드롭다운 참조를 위한 ref

    // 드롭다운 표시를 토글하는 함수
    const handleSearchHistoryClick = (event) => {
        if (event) {
            event.stopPropagation();
        }
        setShowDropdown((prev) => !prev);
    };


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false); // 드롭다운을 닫습니다.
        }
    };

    //범위를 벗어나면 닫히도록 하는 Effect
    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    const [searchText, setSearchValue] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const navigate = useNavigate();

    const InputSearchText = (e) => {

        if (e.target.value.length > 50) {
            alert("너무 길다요");
            return;
        }

        setSearchValue(e.target.value);
    };

    const handleFocus = () => {
        setShowHistory(true);
    };

    const sanitizeSearchText = (text) => {
        return text.replace(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g, "");
    };

    const handleSearch = () => {
        setSearchHistory((prevHistory) => [searchText, ...prevHistory]);

        if(searchText==""){
            alert("검색어를 입력해주세요");
            return;
        }

        const sanitizedText = sanitizeSearchText(searchText);

        if(sanitizedText==""){
            alert("특수문자를 제외하고 검색해주세요");
            return;
        }
        navigate(`ShowMusicList/${sanitizedText}`);
    };

    return (
        <>
            <Col className={styles.search} onFocus={handleFocus} >
                <input
                    className={styles.searchbar}
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={InputSearchText}
                    onClick={handleSearchHistoryClick}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <img src={`/assets/Search.svg`} alt="" className={styles.search_icon} onClick={handleSearch} />

                {/* 아래 안되면 걍 버리삼 */}
                {/* {showDropdown && (
                    <DropdownContainer ref={dropdownRef}>
                        <div>
                           
                        </div>
                    </DropdownContainer>
                )} */}
            </Col>
           
        </>
    );
};
export default SearchBar;