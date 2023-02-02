import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Select from "react-select";

const HomePage = () => {
  const sectorsUrl = `http://127.0.0.1:5000/sectors`;
  const userProfileUrl = `http://127.0.0.1:5000/user-profile`;
  const [sectors, setSectors] = useState([]);
  const [elements, setElements] = useState([]);
  const [seletedSector, setSelectedSector] = useState({});
  const isAgreeRef = useRef(null);
  const nameRef = useRef("");
  const [error, setError] = useState("");

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

  const handleOnClick = async(evnt) => {
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
  const response = await fetch(userProfileUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (response.status===200){
    console.log(await response.json())
  }

};

useEffect(() => {
  fetch(sectorsUrl)
    .then((res) => res.json())
    .then((data) => {
      setSectors(data);
      setElements([0]);
    });
}, [sectorsUrl]);

return (
  <>
    {/* <!-- component --> */}
    {console.log("elements: ", JSON.stringify(elements))}
    <div className="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
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
              className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div id="sector" className="mb-4">
            <label className="block mb-1" htmlFor="sector">
              Sectors
            </label>
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
                    defaultValue={`Select`}
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
                className="ml-2 block text-sm leading-5 text-gray-900"
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
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-red-700 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
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

export default HomePage;
