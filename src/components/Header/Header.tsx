import image from '../../assets/images/smart-home.jpg';
import './header.css';

const Header: React.FC = () => {

    return (
        <>
            <img src={image} className='home-image'/>
        </>
    )
}

export default Header;