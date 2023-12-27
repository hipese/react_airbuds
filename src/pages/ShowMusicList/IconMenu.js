import style from "./IconMenu.module.css"
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AppsIcon from '@mui/icons-material/Apps';

const IconMenu = ({viewState,setViewState}) => {

    console.log(viewState)


    const handleMenuItemClick = (selectedViewState) => {
        setViewState(selectedViewState);
    };

    return (
        <div>
            <MenuList>
                <MenuItem selected={viewState === 0} onClick={() => handleMenuItemClick(0)}>
                    <ListItemIcon>
                        <AppsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>All</ListItemText>
                </MenuItem>
                <MenuItem selected={viewState === 1} onClick={() => handleMenuItemClick(1)}>
                    <ListItemIcon>
                        <AudiotrackIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Tracks</ListItemText>
                </MenuItem>
                <MenuItem selected={viewState === 2} onClick={() => handleMenuItemClick(2)}>
                    <ListItemIcon>
                        <LibraryMusicIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Albums</ListItemText>
                </MenuItem>
            </MenuList>
        </div>
    );
}

export default IconMenu;