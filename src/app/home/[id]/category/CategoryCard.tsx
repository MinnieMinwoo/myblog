interface Props {
  isEdit: boolean;
  mainCategoryName: string;
  subCategoryName: string;
  thumbnailImageURL: string;
}

export default function PostCategoryCard({ isEdit, mainCategoryName, subCategoryName, thumbnailImageURL }: Props) {
  // React ref for receive modal form data
  return (
    <div className="PostCategoryCard p-2 col col-12 col-md-6 col-xl-4">
      <div className="card">
        <a className="ratio ratio-16x9" href={`${mainCategoryName}/${subCategoryName}`}>
          <img className="card-img-top img-fluid object-fit-cover" src={thumbnailImageURL} alt="Thumbnail" />
        </a>
        <div className="card-body">
          <a
            className="card-title fs-5 fw-semibold text-decoration-none text-111"
            href={`${mainCategoryName}/${subCategoryName}`}
          >
            {`${subCategoryName}`}
          </a>
          <div className="hstack" hidden={!isEdit}>
            <button className="btn btn-outline-secondary" name="editSubCategory">
              ✎
            </button>
            <button className="btn btn-outline-info ms-auto" name="editCategoryImage">
              🖼️
            </button>
            <button className="btn btn-outline-danger ms-auto" name="deleteSubCategory">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
