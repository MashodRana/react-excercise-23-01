import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";

const HomePage = () => {
  const sectorsUrl = `http://127.0.0.1:5000/sectors`;
  const [sectors, setSectors] = useState([]);
  const [elements, setElements] = useState([]);

  const handleOnChange = (sectorObj) => {
    const index = elements.indexOf(sectorObj.parent);
    console.log(elements);
    const data = elements.slice(0, index + 1);
    data.push(sectorObj.value);
    console.log("after filter: ", JSON.stringify(data));

    // const newElements = [...data, sectorObj.value];
    setElements(data);
    console.log("after filter elements: ", JSON.stringify(elements));
    const elm = document.getElementById(`select-${elements[elements.length]}`)
    console.log(elm)
  };

  const handleOnChange2 = (sectorObj) => {};

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
      <div class="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
        <div class="w-full sm:max-w-md p-5 mx-auto">
          <h2 class="text-center mb-5 text-5xl font-extrabold">Welcome.</h2>
          <p className="mb-12 text-center">
            Please enter your name and pick the Sectors you are currently
            involved in.
          </p>
          <form>
            <div class="mb-4">
              <label class="block mb-1" for="email">
                Name
              </label>
              <input
                id="email"
                type="text"
                name="text"
                class="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
              />
            </div>
            <div id="sector" class="mb-4">
              <label class="block mb-1" for="password">
                Sectors
              </label>
              {elements.length
                ? elements.map((element) =>
                    sectors.find(s=>s.parent===element) ? (
                      <Select id={`select-${element}`}
                        options={sectors.filter(
                          (sector) => sector.parent === element
                        )}
                        onChange={handleOnChange}
                        defaultValue={`Select`}
                      />
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>
            <div class="mt-6 flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  class="border border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
                <label
                  for="remember_me"
                  class="ml-2 block text-sm leading-5 text-gray-900"
                >
                  {" "}
                  Agree to terms{" "}
                </label>
              </div>
            </div>
            <div class="mt-6">
              <button class="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-red-700 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition">
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
