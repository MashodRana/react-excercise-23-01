import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router";

const Profile = () => {
    const userProfileUrl = `https://react-practice-23-1-server-j63gxvyxf-mashodrana.vercel.app/users`;
    const { profileId } = useParams();
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        // const userProfileUrl = `http://127.0.0.1:5000/users/${profileId}`;
        fetch(`${userProfileUrl}/${profileId}`)
            .then(res => res.json())
            .then(data => setUserInfo(data))
    }, [profileId])
    return (<>
        <div className="mx-auto w-11/12 mt-12 px-6">
            <h1 className="text-xl my-6 font-bold">User Information</h1>

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