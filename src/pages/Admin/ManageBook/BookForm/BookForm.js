import { Box, Modal } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import usePublisher from "~/hooks/usePublisher";
import useBook from "~/hooks/useBook";
import UseCategory from "~/hooks/useCategory";
import { useRef } from "react";
import useAuthour from "~/hooks/useAuthour";

function BookForm({ open, onClose, mode }) {
  const [fileSizeError, setFileSizeError] = useState(null);
  const [thumbnailSrc, setThumbnailSrc] = useState("");
  //   const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const { createBook } = useBook();
  const { category } = UseCategory();
  const { getPublishers } = usePublisher();
  const { getAllAuthours } = useAuthour();
  const [categories, setCategories] = useState();
  const [publisher, setPublisher] = useState();
  const [authours, setAuthours] = useState();
  const [file, setFile] = useState(null);

  const publisherRef = useRef();
  useEffect(() => {
    fetchCategories();
    fetchPublisher();
    fetchAuthours();
  }, []);
  const fetchCategories = async () => {
    try {
      const result = await category();
      console.log(result);
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchAuthours = async () => {
    try {
      const result = await getAllAuthours();
      console.log(result);
      setAuthours(result);
    } catch (error) {
      console.error("Error fetching authours:", error);
    }
  };

  const fetchPublisher = async () => {
    try {
      const result = await getPublishers();
      console.log(result);
      setPublisher(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const [bookData, setBookData] = useState({
    name: "",
    description: "",
    price: 0, // Đảm bảo giá trị số, không phải chuỗi
    pages: 0, // Đảm bảo giá trị số, không phải chuỗi
    isbn_10: "",
    isbn_13: "",
    dimensions: "",
    weight: 0, // Đảm bảo giá trị số, không phải chuỗi
    inventory: 0, // Đảm bảo giá trị số, không phải chuỗi
    authour: {
      id: "",
    },
    category: {
      id: "",
    },
    publisher: {
      id: "",
    },
    issue: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    setBookData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const selectedPublisher = publisher.find((pub) => pub.name === value);
    if (selectedPublisher) {
      setBookData((prevState) => ({
        ...prevState,
        publisher: { id: selectedPublisher.id },
      }));
    }
    const selectedCategory = categories.find((cat) => cat.name === value);
    if (selectedCategory) {
      setBookData((prevState) => ({
        ...prevState,
        category: { id: selectedCategory.id },
      }));
    }

    const selectedAuthour = authours.find((authour) => authour.name === value);
    if (selectedAuthour) {
      setBookData((prevState) => ({
        ...prevState,
        authour: { id: selectedAuthour.id },
      }));
    }

    // Kiểm tra nếu trường dữ liệu đang thay đổi là trường input hình ảnh
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileSize = selectedFile.size;
      if (fileSize > 1048576) {
        setFileSizeError("You must choose an image less than 1MB!");
        setFile(null);
        // setThumbnailSrc(null);
      } else {
        setFileSizeError(null);
        setFile(selectedFile);
        showImageThumbnail(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataRequest = {
      ...bookData,
    };
    if (mode === "add") {
      console.log(dataRequest, file);
      await createBook(dataRequest, file);
      
    } else {
      //
    }
  };

  const handleFileDetailImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      const fileSize = file.size;
      if (fileSize > 1048576) {
        setFileSizeError("You must choose images less than 1MB each!");
      } else {
        setFileSizeError(null);
        setImages((prevImages) => [...prevImages, file]);
        // showImageThumbnail(file);
      }
    });
  };

  const showImageThumbnail = (file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Do something with the image data, e.g., display it
      const thumbnailSrc = e.target.result;
      // You can use thumbnailSrc to display the image in your UI
      setThumbnailSrc(thumbnailSrc);
    };

    reader.readAsDataURL(file);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Thêm sách
              </h2>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div class="grid gap-6 sm:grid-cols-2 sm:gap-6">
                  <div class="sm:col-span-2">
                    <label
                      for="name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên sách
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nhập tên sách"
                      required=""
                      onChange={handleChange}
                    />
                  </div>

                  <div class="w-full">
                    <label
                      for="price"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="120.000đ"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      for="category"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Danh mục
                    </label>
                    <select
                      id="category"
                      name="category"
                      onChange={handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option selected="">Chọn danh mục</option>
                      {categories?.map((category) => (
                        <option name="category" value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      for="authour"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tác giả
                    </label>
                    <select
                      id="authour"
                      name="authour"
                      onChange={handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option selected="">Chọn danh mục</option>
                      {authours?.map((authour) => (
                        <option value={authour.name}>{authour.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      for="publisher"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nhà xuất bản
                    </label>
                    <select
                      id="publisher"
                      name="publisher"
                      ref={publisherRef}
                      onChange={handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option selected="">Chọn danh mục</option>
                      {publisher?.map((pub) => (
                        <option key={pub.id} value={pub.name}>
                          {pub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      for="weight"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Trọng lượng (gr)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="12"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="pages"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Số trang
                    </label>
                    <input
                      type="text"
                      name="pages"
                      id="pages"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="256"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="issue"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Năm xuất bản
                    </label>
                    <input
                      type="text"
                      name="issue"
                      id=""
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="2024"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="isbn_10"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ISBN 10
                    </label>
                    <input
                      type="text"
                      name="isbn_10"
                      id=""
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nhập ISBN"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="isbn_13"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ISBN 13
                    </label>
                    <input
                      type="text"
                      name="isbn_13"
                      id=""
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nhập ISBN"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="dimensions"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Kích thước
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      id=""
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="20 x 14.5 cm"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="inventory"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tồn kho
                    </label>
                    <input
                      type="text"
                      name="inventory"
                      id=""
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="12"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="cover"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Hình thức
                    </label>
                    <input
                      type="text"
                      name="cover"
                      id=""
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Bìa mềm"
                      required=""
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="w-full text-left">
                  <label
                    for="cover"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Hình ảnh
                  </label>
                  <div className="flex items-center justify-center border border-gray-300 border-dashed rounded-lg p-4">
                    <input
                      type="file"
                      name="image"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
                    {fileSizeError && (
                      <p style={{ color: "red" }}>{fileSizeError}</p>
                    )}
                    {thumbnailSrc && (
                      <img
                        src={thumbnailSrc}
                        alt="Thumbnail"
                        className="max-w-100"
                      />
                    )}
                  </div>
                </div>
                {/* <div className="w-full">
                  <label
                    for="cover"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Hình ảnh chi tiết
                  </label>
                  <div className="flex items-center justify-center border border-gray-300 border-dashed rounded-lg p-4">
                    <input
                      type="file"
                      name="images"
                      id="images"
                      accept="image/png, image/jpeg"
                      multiple
                      onChange={handleFileDetailImageChange}
                    />
                    {fileSizeError && (
                      <p style={{ color: "red" }}>{fileSizeError}</p>
                    )}
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index + 1}`}
                        className="max-w-32 object-cover"
                      />
                    ))}
                  </div>
                </div> */}

                <div class="sm:col-span-2 ">
                  <label
                    for="description"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="8"
                    onChange={handleChange}
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Your description here"
                  ></textarea>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    class="inline-flex w-48 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-[#FFD16B] rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                  >
                    Thêm
                  </button>
                  <button
                    onClick={onClose}
                    class="inline-flex ml-4 w-48 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-[#FFD16B] rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default BookForm;
