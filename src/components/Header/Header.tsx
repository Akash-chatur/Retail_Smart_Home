import image from '../../assets/images/smart-home.jpg'

const Header: React.FC = () => {

    return (
        <>

            <div style={{textAlign: 'center'}}>Hello Header</div>
            <img src={image}/>
        </>
    )
}

export default Header;