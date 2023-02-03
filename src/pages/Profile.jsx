import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import editIcon from "../icons/icons8-edit-48.png"


const Profile = () => {
    const domain = `https://react-practice-23-1-server-20j6usd85-mashodrana.vercel.app`;
    // const sectorsUrl = `http://127.0.0.1:5000/sectors`;
    // const usersProfileUrl = `http://127.0.0.1:5000/users`;
    // const userProfileUrl = `http://127.0.0.1:5000/user-profile`;

    const sectorsUrl = `${domain}/sectors`
    const userProfileUrl = `${domain}/user-profile`
    const usersProfileUrl = `${domain}/users`;

    const { profileId } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});


    const handleOnClick = () => {
        navigate(`/update/${profileId}`)
    }

    useEffect(() => {
        fetch(`${usersProfileUrl}/${profileId}`)
            .then(res => res.json())
            .then(data => setUserInfo(data))
    }, [profileId])
    return (<>
        <div className="mx-auto w-11/12 mt-12 px-6">
            <div className="flex items-center">
                <h1 className="text-xl my-6 font-bold">User Information</h1>
                <button
                    className="ml-6 w-6 h-6"
                    onClick={handleOnClick}
                >
                    <img src={editIcon} alt="" />
                </button>
            </div>

            <div class="shadow-md sm:rounded-lg px-6 pt-6 pb-16">
                <div className="flex py-2">
                    <label className="mr-4 text-md font-medium" htmlFor="">Name: </label>
                    <span>{userInfo?.name}</span>
                </div>
                <div className="flex py-2">
                    <label className="mr-4 text-md font-medium" htmlFor="">Sector: </label>
                    <span>{userInfo?.sector?.label}</span>
                </div>
                <div>
                    <label className="mr-4 text-md font-medium" htmlFor="">Is Agree: </label>
                    <span>{userInfo?.isAgree ? 'Yes' : 'No'}</span>
                </div>

            </div>
        </div>

    </>);
};

export default Profile;