import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";


const AddProfile = () => {
  const sectorsUrl = `http://127.0.0.1:5000/sectors`;
  // const sectorsUrl = `https://react-practice-23-1-server-j63gxvyxf-mashodrana.vercel.app/sectors`
  const userProfileUrl = `https://react-practice-23-1-server-j63gxvyxf-mashodrana.vercel.app/user-profile`
  const usersProfileUrl = `https://react-practice-23-1-server-j63gxvyxf-mashodrana.vercel.app/users`;

  // const userProfileUrl = `http://127.0.0.1:5000/user-profile`;
  const [sectors, setSectors] = useState([]);
  const [elements, setElements] = useState([]);
  const [seletedSector, setSelectedSector] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const isAgreeRef = useRef(null);
  const nameRef = useRef("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { profileId } = useParams();

  const handleOnChange = (sectorObj) => {
    const index = elements.indexOf(sectorObj.parent);
    console.log(elements);
    const data = elements.slice(0, index + 1);

    data.push(sectorObj.value);
    console.log("after filter: ", JSON.stringify(data));
    setElements(data);
    setSelectedSector(sectorObj);
    console.log("after filter elements: ", JSON.stringify(elements));
  };

  const handleOnClick = (evnt) => {
    evnt.preventDefault();

    const msg = `Please fill up the following field: Name, sector, agreement checkbox`;
    const name = nameRef.current.value;
    const sector = seletedSector;
    const isAgree = isAgreeRef.current.checked;

    if (!name || !sector || !isAgree) {
      setError(msg);
      return;
    }
    else {
      setError("")
    }

    const data = {
      name,
      isAgree,
      sector,
    };
    console.log("data is : ", JSON.stringify(data));
    fetch(userProfileUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => navigate(`update-profile/${data.insertedId}`))

  };

  useEffect(() => {
    fetch(sectorsUrl)
      .then((res) => res.json())
      .then((data) => {
        setSectors(data);
        if (!profileId) setElements([0]);
      });

    if (profileId) {
      const url = `http://127.0.0.1:5000/users/${profileId}`;
      console.log('url', url);
      fetch(`${usersProfileUrl}/${profileId}`)
        .then(res => res.json())
        .then(data => {
          setUserInfo(data)
          const sectorValue = data.sector.value;
          let parentId = data.sector.parent;
          let array = [sectorValue];
          if (parentId === 0) array.push(parentId);
          while (parentId) {
            const sect = sectors.find(s => s.value === parentId);
            parentId = sect.parent;
            array.push(parentId);
          }

          array.reverse();

          setElements(array);

        })
    }
  }, [sectorsUrl, profileId]);

  return (
    <>
      <div className="flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
        <div className="w-full sm:max-w-md p-5 mx-auto">
          <h2 className="text-center mb-5 text-5xl font-extrabold">Welcome.</h2>
          <p className="mb-12 text-center">
            Please enter your name and pick the Sectors you are currently
            involved in.
          </p>
          <form>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="email">
                Name
              </label>
              <input
                required
                id="name"
                type="text"
                name="name"
                ref={nameRef}
                value={userInfo.name}
                className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
              />
            </div>
            <div id="sector" className="mb-4">
              <label className="block mb-1" htmlFor="sector">
                Sector
              </label>
              {console.log('elements array: ', JSON.stringify(elements))}
              {elements.length
                ? elements.map((element) =>
                  sectors.find((s) => s.parent === element) ? (
                    <Select
                      name="foo"
                      required
                      key={element}
                      id={`select-${element}`}
                      options={sectors.filter(
                        (sector) => sector.parent === element
                      )}
                      onChange={handleOnChange}
                      // defaultValue={`Select`}
                      defaultValue={`mashod`}
                      className="my-2"
                    />
                  ) : (
                    ""
                  )
                )
                : ""}


            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  required
                  id="isAgree"
                  name="isAgree"
                  ref={isAgreeRef}
                  type="checkbox"
                  className="border border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm leading-5 text-amber-600"
                >
                  {" "}
                  Agree to terms{" "}
                </label>
              </div>
            </div>

            {/* Error alerts */}
            {error ? (
              <div
                class="bg-red-100 my-6 border border-red-400 text-red-700 px-4 py-2 rounded relative"
                role="alert"
              >
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">{error}</span>
              </div>
            ) : (
              ""
            )}
            <div className="mt-6">
              <button
                type="submit"
                onClick={handleOnClick}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-green-700 active:bg-green-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProfile;
