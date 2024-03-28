import { faAngleRight, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import config from "~/config";
import { useCategory } from "~/hooks";

function CategoryNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const category = async () => {
      // const token = JSON.parse(localStorage.getItem("user")).access_token;
      // console.log(token);
      try {
        const response = await axios.get("http://localhost:8080/categories");
        const { data } = response;
        setCategories(data);
        console.log(data);
        return data;
      } catch (error) {
        console.error("Lấy danh mục thất bại:", error.message);
      }
    };

    category();
  }, []);

  const getParentCategories = () => {
    return categories.filter((category) => category.parent === null);
  };

  // const getSubcategories = (parent) => {
  //   return categories.filter((category) => category.parent === parent);
  // };

  const getSubcategories = (parent) => {
    const subcategories = categories.filter(
      (category) => category.parent?.id === parent.id
    );
    console.log(
      "Subcategories of parent category with name",
      parent.name,
      ":",
      subcategories
    );
    return subcategories;
  };
  const handleMouseEnter = (categoryId) => {
    setHoveredCategory(categoryId);
    console.log(categoryId);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };
  return (
    <div className=" w-full h-auto bg-white border-b-[1px] pb-2 z-10 ">
      <div className="relative h-full max-w-screen-xl mx-auto px-4 xl:px-0 flex items-center  gap-2">
        <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          className=" w-60 h-9 mt-1 text-left bg-[#FFD16B] outline-inherit rounded-md"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FontAwesomeIcon icon={faBars} className="mr-2 pl-4 text-white" />
          <span className="font-medium text-sm text-white underline-offset-4 decoration-[1px]  md:border-r-[2px] border-r-gray-400 duration-200 last:border-r-0">
            DANH MỤC
          </span>
        </button>

        {isOpen && (
          <div
            id="dropdown"
            className="z-50 w-60 absolute top-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
          >
            <ul
              className=" text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              {getParentCategories().map((category) => (
                <li>
                  <NavLink
                    key={category.id}
                    // to={item.link}
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative block text-left px-4 font-medium py-2 text-black hover:bg-[#FFD16B] dark:hover:bg-gray-600 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faAngleRight} className="mr-2" />
                    {category.name}
                  </NavLink>
                  {hoveredCategory === category.id && (
                    <ul>
                      {getSubcategories(category).map((subcategory) => (
                        <li key={subcategory.id}>
                          <div className=" w-48 h-auto bg-white absolute top-0 left-64 border-solid border border-[#FFD16B]">
                            <NavLink
                              to="#" // Thay đổi thành đường dẫn phù hợp với ứng dụng của bạn
                              className="  block text-left px-4 font-medium py-2 text-black hover:bg-[#FFD16B] dark:hover:bg-gray-600 hover:text-white"
                            >
                              <FontAwesomeIcon
                                icon={faAngleRight}
                                className="mr-2"
                              />
                              {subcategory.name}
                            </NavLink>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to={config.routes.books}>
          <div className="flex font-medium text-sm text-black w-32 h-6 justify-center items-center pl-3 pr-6 text-gray-600  underline-offset-4 decoration-[1px] hover:text-[#FFD16B] md:border-r-[2px] border-r-[#FFD16B] duration-200 last:border-r-0">
            TẤT CẢ SÁCH
          </div>
        </Link>
        <div className="flex font-medium text-sm text-black w-32 h-6 justify-center items-center pl-3 pr-6 text-gray-600  underline-offset-4 decoration-[1px] hover:text-[#FFD16B] md:border-r-[2px] border-r-[#FFD16B] duration-200 last:border-r-0">
          SÁCH MỚI
        </div>
        <div className="flex font-medium text-sm text-black w-32 h-6 justify-center items-center pl-3 pr-6 text-gray-600  underline-offset-4 decoration-[1px] hover:text-[#FFD16B] md:border-r-[2px] border-r-[#FFD16B] duration-200 last:border-r-0">
          LIÊN HỆ
        </div>
      </div>
    </div>
  );
}

export default CategoryNav;
