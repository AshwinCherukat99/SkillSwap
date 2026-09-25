import React from "react";

function CourseBasicInfo({
    formData,
    categories,
    onChange,
    onThumbnailChange
}){
    return (
        <div className="card border-0 shadow-sm edit-course-card mb-4">

            <div className="card-body p-4">

                <div className="mb-4">
                    <h5 className="fw-bold mb-1">
                        Course Information
                    </h5>

                    <p className="text-muted small mb-0">
                        Update the basic information about your course.
                    </p>
                </div>

                <div className="row g-4">

                    {/* Title */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">
                            Course Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formData.title}
                            onChange={onChange}
                            placeholder="Enter course title"
                        />
                    </div>

                    {/* Slug */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Course Slug
                        </label>

                        <input
                            type="text"
                            name="slug"
                            className="form-control"
                            value={formData.slug}
                            onChange={onChange}
                            placeholder="course-slug"
                        />

                        <div className="form-text">
                            Used in the course URL.
                        </div>
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Category
                        </label>

                        <select
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={onChange}
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Level */}
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Difficulty Level
                        </label>

                        <select
                            name="level"
                            className="form-select"
                            value={formData.level}
                            onChange={onChange}
                        >
                            <option value="BEGINNER">
                                Beginner
                            </option>

                            <option value="INTERMEDIATE">
                                Intermediate
                            </option>

                            <option value="ADVANCED">
                                Advanced
                            </option>
                        </select>
                    </div>

                    {/* Price */}
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Course Fee
                        </label>

                        <div className="input-group">
                            <span className="input-group-text">
                                ₹
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="price"
                                className="form-control"
                                value={formData.price}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Estimated Duration
                        </label>

                        <div className="input-group">
                            <input
                                type="number"
                                min="1"
                                name="estimated_duration"
                                className="form-control"
                                value={formData.estimated_duration}
                                onChange={onChange}
                            />

                            <span className="input-group-text">
                                min
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">
                            Description
                        </label>

                        <textarea
                            name="description"
                            className="form-control"
                            rows="6"
                            value={formData.description}
                            onChange={onChange}
                            placeholder="Describe what students will learn..."
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">
                            Course Thumbnail
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={onThumbnailChange}
                        />

                        {formData.thumbnailPreview && (
                            <div className="mt-3">
                                <img
                                    src={formData.thumbnailPreview}
                                    alt="Course thumbnail"
                                    className="edit-course-thumbnail"
                                />
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default CourseBasicInfo