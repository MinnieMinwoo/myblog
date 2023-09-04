import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import imageUpload from "logics/imageUpload";
import updateCategoryList from "logics/updateCategoryList";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef } from "react";

interface Props {
  isEdit: boolean;
  mainCategoryName: string;
  subCategoryName: string;
  thumbnailImageURL: string;
  categoryList: CategoryMainData[];
}

export default function PostCategoryCard({
  isEdit,
  mainCategoryName,
  subCategoryName,
  thumbnailImageURL,
  categoryList,
}: Props) {
  const params = useParams();
  const { nickname } = params;
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const queryClient = useQueryClient();
  const { mutate: updateCategory } = useMutation({
    mutationFn: (categoryData) => {
      if (!userData) throw new Error("no user data");
      else return updateCategoryList(userData.id, userData.nickname, categoryData);
    },
    onMutate: async (newCategoryData: CategoryMainData[]) => {
      await queryClient.cancelQueries({ queryKey: ["CategoryLists", nickname] });
      const previousCategoryData = queryClient.getQueryData(["CategoryLists", nickname]);
      queryClient.setQueryData(["CategoryLists", nickname], () => newCategoryData);
      return { previousCategoryData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["CategoryLists", nickname], context?.previousCategoryData ?? {});
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoryLists", nickname] });
    },
  });

  const imageRef = useRef<HTMLInputElement>(null);

  const getIndexNumber = () => {
    const mainIndex = categoryList.findIndex((e) => e.name === mainCategoryName);
    const subIndex = categoryList[mainIndex].subCategory.findIndex((e) => e.name === subCategoryName);
    return { mainIndex, subIndex };
  };

  const onNameChange = () => {
    if (!userData?.id || nickname !== userData?.nickname) return; // invalid access
    const newName = window.prompt("Write new category name");
    if (!newName) return; // no input
    const { mainIndex, subIndex } = getIndexNumber();
    // duplicated name in subcategory
    if (categoryList[mainIndex].subCategory.findIndex((e) => e.name === newName) !== -1) {
      window.alert("duplicated name");
      return;
    }
    const newCategoryList = structuredClone(categoryList);
    newCategoryList[mainIndex].subCategory[subIndex].name = newName;
    updateCategory(newCategoryList);
  };

  const onImageButtonClick = () => {
    if (imageRef.current) imageRef.current.click();
  };

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData?.id || nickname !== userData?.nickname) return; // invalid access
    const {
      target: { files },
    } = event;
    if (!files) throw console.log("no image files");
    try {
      const uploadURL = await imageUpload(files[0]); //todo: upload img

      const { mainIndex, subIndex } = getIndexNumber();
      const newCategoryList = structuredClone(categoryList);
      newCategoryList[mainIndex].subCategory[subIndex].thumbnailImageURL = uploadURL;
      updateCategory(newCategoryList);
    } catch (error) {
      console.log(error);
      window.alert("Image upload failed.");
    }
  };

  const onDelete = () => {
    if (!userData?.id || nickname !== userData?.nickname) return; // invalid access
    if (!window.confirm("If you really want delete this category?")) return; //confirm
    const { mainIndex, subIndex } = getIndexNumber();
    const newCategoryList = structuredClone(categoryList);
    newCategoryList[mainIndex].subCategory = newCategoryList[mainIndex].subCategory.filter(
      (_, index) => index !== subIndex
    );
    updateCategory(newCategoryList);
  };

  return (
    <div className="PostCategoryCard p-2 col col-12 col-md-6 col-xl-4">
      <div className="card">
        <Link className="ratio ratio-16x9" href={`category/${mainCategoryName}/${subCategoryName}`}>
          <Image
            className="card-img-top img-fluid object-fit-cover"
            src={!!thumbnailImageURL ? thumbnailImageURL : "/altThumbnail.jpg"}
            alt="Thumbnail"
            width={500}
            height={500}
          />
        </Link>
        <div className="card-body">
          <Link
            className="card-title fs-5 fw-semibold text-decoration-none text-111"
            href={`${mainCategoryName}/${subCategoryName}`}
          >
            {`${subCategoryName}`}
          </Link>
          <div className="hstack" hidden={!isEdit}>
            <button className="btn btn-outline-primary" onClick={onNameChange}>
              ✎
            </button>
            <button className="btn btn-outline-info ms-auto" onClick={onImageButtonClick}>
              <input hidden type="file" accept="image/*" ref={imageRef} onChange={onImageChange} />
              🖼️
            </button>
            <button className="btn btn-outline-danger ms-auto" onClick={onDelete}>
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
