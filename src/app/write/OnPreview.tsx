import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "./OnPreview.css";
import imageUpload from "logics/imageUpload";
import { useQuery } from "@tanstack/react-query";
import getUserCategoryData from "logics/getUserCategoryData";

interface Props {
  isEdit: boolean;
  nickname: string;
  isPreview: boolean;
  postContent: PostDetail;
  setPostContent: React.Dispatch<React.SetStateAction<PostDetail>>;
  onPreview: () => void;
  isSubmit: boolean;
  onSubmit: () => void;
}

const OnPreview = ({
  isEdit,
  nickname,
  isPreview,
  postContent,
  setPostContent,
  onPreview,
  isSubmit,
  onSubmit,
}: Props) => {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryMainData[]>([]);
  const [categoryIndex, setCategoryIndex] = useState("");
  const [firstOpen, setFirstOpen] = useState(false);

  const { status: categoryStatus, data: categoryList } = useQuery({
    queryKey: ["CategoryLists", nickname],
    queryFn: () => getUserCategoryData(nickname),
    enabled: !!nickname,
  });

  useEffect(() => {
    if (categoryStatus === "success") {
      setCategoryData(categoryList);
      if (!postContent.categoryMain || !postContent.categorySub) return;
      const mainIndex = categoryList.findIndex((e) => e.name === postContent.categoryMain);
      const subIndex = categoryList[mainIndex].subCategory.findIndex((e) => e.name === postContent.categorySub);
      setCategoryIndex(String([mainIndex, subIndex]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryList, categoryStatus]);

  useEffect(() => {
    isPreview && setFirstOpen(true);
  }, [isPreview]);

  const onImgUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) throw console.log("no image files");
    try {
      const uploadURL = await imageUpload(files[0]);
      console.log(uploadURL);
      setPostContent((prev) => ({
        ...prev,
        thumbnailImageURL: uploadURL,
      }));
    } catch (error) {
      console.log(error);
      window.alert("Image upload failed.");
    }
  };

  const onUpload = () => {
    imgRef.current?.click();
  };

  const onDelete = () => {
    setPostContent((prev) => ({
      ...prev,
      thumbnailImageURL: "",
    }));
    if (imgRef.current?.value) imgRef.current.value = "";
  };

  const onEditDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event;
    setPostContent((prev) => ({
      ...prev,
      thumbnailData: value,
    }));
  };

  const onCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setCategoryIndex(value);
    if (value === "") {
      setPostContent((prev) => ({
        ...prev,
        categoryMain: "",
        categorySub: "",
      }));
      return;
    }
    const [mainCategoryIndex, subCategoryIndex] = value.split(",").map(Number);
    setPostContent((prev) => ({
      ...prev,
      categoryMain: categoryData[mainCategoryIndex].name,
      categorySub: categoryData[mainCategoryIndex].subCategory[subCategoryIndex].name,
    }));
  };

  const [tagText, setTagText] = useState("");
  const onTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    if (value.includes(",")) {
      const inputSplit = value.split(",");
      const tagArray = [...postContent.tag, ...inputSplit.slice(0, inputSplit.length - 1)];
      const tagArrayFilter = tagArray.filter((e, i) => !tagArray.slice(0, i).includes(e));
      setTagText(inputSplit[inputSplit.length - 1]);
      setPostContent((prev) => ({ ...prev, tag: tagArrayFilter }));
    } else {
      setTagText(value);
    }
  };

  const onTagDelete = (event: React.MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof HTMLElement)) return;
    const { innerText } = event.target as HTMLElement;
    const currentTag = [...postContent.tag];
    setPostContent((prev) => ({
      ...prev,
      tag: [
        ...currentTag.slice(0, currentTag.indexOf(innerText)),
        ...currentTag.slice(currentTag.indexOf(innerText) + 1),
      ],
    }));
  };

  return (
    <div
      className={`Preview preview-layout bg-fff z-index-1 ${
        isPreview ? "scrollOpen" : firstOpen ? "scrollClose" : "hidden"
      }${isPreview ? "" : " preview-overflow"}`}
    >
      <div className="col-10 offset-1 col-md-5 offset-md-1 col-xxl-4 offset-xxl-2 px-4 align-self-center be-light">
        <div className="vstack gap-3">
          <h3>Preview</h3>
          <div className="ratio ratio-16x9">
            <Image
              className="img-thumbnail object-fit-cover bg-eee"
              src={postContent.thumbnailImageURL ? postContent.thumbnailImageURL : "/altThumbnail.jpg"}
              width={500}
              height={500}
              alt="Thumbnail"
            />
          </div>
          <input
            hidden
            type="file"
            accept="image/*"
            ref={imgRef}
            src={postContent.thumbnailImageURL}
            onChange={onImgUpload}
          />
          <div className="hstack gap-2">
            <button className="btn btn-primary" onClick={onUpload}>
              Upload Image
            </button>
            <button className="btn btn-outline-primary" onClick={onDelete} hidden={!postContent.thumbnailImageURL}>
              Delete Image
            </button>
          </div>
          <h3>{postContent.title}</h3>
          <div className="input-group input-group-lg h-200px">
            <textarea
              className="form-control"
              value={postContent.thumbnailData}
              maxLength={150}
              onChange={onEditDescription}
            />
          </div>
          <p>{postContent.thumbnailData.length}/150</p>
        </div>
      </div>
      <div className="col-10 col-md-5 col-xxl-4 px-4 align-self-center">
        <div className="vstack gap-1 mb-3">
          <h4>Tag</h4>
          <div className="col">
            <div className="mb-3">
              {postContent.tag.map((tag) => (
                <button key={tag} className="btn btn-outline-primary me-2" onClick={onTagDelete}>
                  {tag}
                </button>
              ))}
            </div>
            <input
              className="form-control b-0-i"
              placeholder="Separate tags with spots."
              value={tagText}
              onChange={onTagChange}
              maxLength={50}
              hidden={postContent.tag.length >= 5}
            />
          </div>
        </div>
        <div className="vstack gap-1 mb-3">
          <h4>Category Setting</h4>
          <select className="form-select" value={categoryIndex} onChange={onCategoryChange}>
            <option value={""}>None</option>
            {categoryData &&
              categoryData.map((mainCategory, id) => {
                return mainCategory.subCategory.map((subCategory, index) => (
                  <option key={index} value={String([[id, index]])}>
                    {`${mainCategory.name} - ${subCategory.name}`}
                  </option>
                ));
              })}
          </select>
        </div>
        <div className="hstack gap-3 float-end">
          <button
            className="btn btn-outline-primary w-80px h-40px"
            type="button"
            disabled={isSubmit}
            onClick={onPreview}
          >
            {isSubmit ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              "Cancel"
            )}
          </button>
          <button className="btn btn-primary w-80px h-40px" type="button" disabled={isSubmit} onClick={onSubmit}>
            {isSubmit ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : isEdit ? (
              "Edit"
            ) : (
              "Write"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnPreview;
